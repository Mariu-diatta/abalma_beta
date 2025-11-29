import axios from "axios";
import Cookies from "js-cookie";

//// Dev
//export const BASE_URL = 'http://127.0.0.1:8000/';

// Prod
export const BASE_URL = 'https://backend-mpb0.onrender.com/';


const api = axios.create({

    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
    timeout: 30000,
    withCredentials: true, // ⬅️ Permet l'envoi des cookies
});

// 🔐 1. CSRF support (si Django CSRF activé)
export const fetchCsrfToken = async () => {

    try {

        await api.get('set-csrf/'); // ton endpoint pour initialiser le cookie CSRF

        const csrftoken = Cookies.get('csrftoken');

        if (csrftoken) {

            api.defaults.headers.common['X-CSRFToken'] = csrftoken;
        }

    } catch (error) {

        console.error("Erreur CSRF :", error);
    }
};

// 🟨 2. SUPPRIMÉ : Interceptor `request` pour Authorization
// ⛔️ Ne pas injecter de `Bearer token` depuis localStorage ou JS : les cookies le font automatiquement

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

api.interceptors.response.use(
    response => response,

    async (error) => {
        const originalRequest = error.config;

        // Si 401 (access token expiré)
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Appel au endpoint /refresh/ pour générer un nouvel access token
                await api.post("/refresh/");

                // Nouvelle tentative avec le token fraîchement créé
                return api(originalRequest);

            } catch (refreshError) {
                console.warn("Session expirée, redirection vers login");
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);


export default api;
