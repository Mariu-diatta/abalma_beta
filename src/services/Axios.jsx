import axios from "axios";

import Cookies from "js-cookie"; // npm install js-cookie

const csrftoken = Cookies.get('csrftoken');

axios.defaults.headers.common['X-CSRFToken'] = csrftoken;

axios.defaults.withCredentials = true;

const BASE_URL = 'https://backend-mpb0.onrender.com/'

// Création de l'instance Axios
const api = axios.create({

    baseURL: BASE_URL,

    headers: {

        'Content-Type': 'application/json',

        Accept: 'application/json',
    },

    timeout: 30000,
});

// Intercepteur de requête : ajout du token à la main
api.interceptors.request.use(

    (config) => {

        const accessToken = localStorage.getItem("token"); // récupération directe

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

        const response = await axios.post(`${BASE_URL}refresh/`, {
            refresh: refreshToken,
        });

        const newAccessToken = response.data.access;

        localStorage.setItem("token", newAccessToken);

        return newAccessToken;

    } catch (error) {

        console.error("Erreur lors du rafraîchissement du token :", error);

        // Vous pouvez rediriger ici vers la page de connexion
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
