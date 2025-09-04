import axios from "axios";
import Cookies from "js-cookie";

//local
export const BASE_URL_ = 'http://127.0.0.1:8000/'; 
export const BASE_URL = 'http://127.0.0.1:8000/';

//Production
//export const BASE_URL_ = 'https://backend-mpb0.onrender.com/'; 
//export const BASE_URL = 'https://backend-mpb0.onrender.com/';


const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
    timeout: 30000,
    withCredentials: true,
});

export const fetchCsrfToken = async () => {
    try {
        await api.get('set-csrf/');
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

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Empêche les boucles infinies
        if (!originalRequest || originalRequest._retry || error.config?.url.includes('/refresh/')) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401) {

            const refreshToken = localStorage.getItem("refresh");

            if (!refreshToken) {
                return Promise.reject(error);
            }

            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                }).then((token) => {
                    originalRequest.headers["Authorization"] = "Bearer " + token;
                    return api(originalRequest);
                }).catch(err => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            return new Promise(async (resolve, reject) => {

                const newAccessToken = await refreshAccessToken(refreshToken);

                if (newAccessToken) {
                    api.defaults.headers.common["Authorization"] = "Bearer " + newAccessToken;
                    originalRequest.headers["Authorization"] = "Bearer " + newAccessToken;
                    processQueue(null, newAccessToken);
                    resolve(api(originalRequest));
                } else {
                    processQueue(error, null);
                    reject(error);
                }

                isRefreshing = false;
            });
        }

        return Promise.reject(error);
    }
);

export default api;
