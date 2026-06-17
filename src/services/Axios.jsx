
import axios from "axios";
import Cookies from "js-cookie";
export const BASE_URL = process.env.NODE_ENV === 'production' ?
    'https://api.abalma.fr/'
    :
    'http://127.0.0.1:8000/';

// 🌐 URL du backend WebSocket
export const backendBase = process.env.NODE_ENV === 'production'
    ? 'api.abalma.fr'
    : 'localhost:8000';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
    timeout: 30000,
    withCredentials: true, // 🔑 obligatoire pour cookies cross-site
});

// Récupération CSRF si nécessaire
export const fetchCsrfToken = async () => {
    try {
        await api.get('set-csrf/'); // endpoint pour initialiser le cookie CSRF
        const csrftoken = Cookies.get('csrftoken');
        if (csrftoken) {
            api.defaults.headers.common['X-CSRFToken'] = csrftoken;
        }
    } catch (error) {
        console.error("Erreur CSRF :", error);
    }
};

// Interceptor pour refresh token
api.interceptors.response.use(
    response => response,
    async (error) => {

        const originalRequest = error.config;

        // ❌ éviter boucle refresh
        //if (originalRequest.url?.includes("/refresh/")) {
        //    return Promise.reject(error);
        //}

        // ❌ pas de retry multiple
        if (originalRequest._retry) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401) {

            originalRequest._retry = true;

            try {

                await api.post("/refresh/", {}, {
                    withCredentials: true
                });

                return api(originalRequest);

            } catch (refreshError) {

                console.warn("Session expirée");

                window.location.href = "/";

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;

