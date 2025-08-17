import axios from "axios";
import Cookies from "js-cookie"; // npm install js-cookie

// URL de ton backend Render
const BASE_URL = 'https://backend-mpb0.onrender.com/';

// Création de l'instance Axios
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
    timeout: 30000,
    withCredentials: true, // pour inclure les cookies CSRF
});

// Fonction pour récupérer le CSRF token depuis le backend
export const fetchCsrfToken = async () => {

    try {

        await api.get('set-csrf/'); // endpoint Django qui set le cookie CSRF

        const csrftoken = Cookies.get('csrftoken');

        if (csrftoken) {
            api.defaults.headers.common['X-CSRFToken'] = csrftoken;
            api.defaults.xsrfHeaderName = "X-CSRFToken";
            api.defaults.xsrfCookieName = "csrftoken";
        }

    } catch (error) {

        console.error("Erreur lors de la récupération du CSRF token :", error);
    }
};

// Intercepteur de requête : ajout du token JWT
api.interceptors.request.use(

    (config) => {

        const accessToken = localStorage.getItem("token");

        if (accessToken) {

            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;

    },

    (error) => Promise.reject(error)
);

// Rafraîchissement du token
const refreshAccessToken = async (refreshToken) => {

    try {

        const response = await api.post('/refresh/', { refresh: refreshToken });

        const newAccessToken = response.data.access;

        localStorage.setItem("token", newAccessToken);

        return newAccessToken;

    } catch (error) {

        console.error("Erreur lors du rafraîchissement du token :", error);

        return null;
    }
};

// Intercepteur de réponse pour gérer les erreurs 401
api.interceptors.response.use(

    (response) => response,

    async (error) => {

        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {

            originalRequest._retry = true;

            const refreshToken = localStorage.getItem("refresh");

            if (refreshToken) {

                const newAccessToken = await refreshAccessToken(refreshToken);

                if (newAccessToken) {

                    originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

                    return axios(originalRequest); // relance la requête
                }
            }
        }

        return Promise.reject(error);
    }
);

export default api;
