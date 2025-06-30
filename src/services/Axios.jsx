import axios from "axios";

// Création de l'instance Axios
const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/',
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
    timeout: 10000,
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
        const response = await axios.post("http://127.0.0.1:8000/refresh/", {
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
