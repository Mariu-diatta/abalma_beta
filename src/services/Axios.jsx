import axios from "axios";

// Cr�ation de l'instance Axios
const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/',
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
    timeout: 10000,
});

// Intercepteur de requ�te : ajout du token � la main
api.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("token"); // r�cup�ration directe
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Rafra�chissement du token
const refreshAccessToken = async (refreshToken) => {
    try {
        const response = await axios.post("http://127.0.0.1:8000/refresh/", {
            refresh: refreshToken,
        });

        const newAccessToken = response.data.access;
        localStorage.setItem("token", newAccessToken);

        return newAccessToken;
    } catch (error) {
        console.error("Erreur lors du rafra�chissement du token :", error);
        // Vous pouvez rediriger ici vers la page de connexion
        return null;
    }
};

// Intercepteur de r�ponse pour g�rer les erreurs 401
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
                    return axios(originalRequest); // relance la requ�te
                }
            }
        }

        return Promise.reject(error);
    }
);

export default api;
