import axios from "axios"

// Création d'une instance Axios
const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/', // URL de base de votre API Django
    headers: {
        'Content-Type': 'application/json',
         Accept: 'application/json',
    },
    timeout: 10000, // facultatif : délai d'attente en ms
})

// Intercepteur de requête pour ajouter le token si présent
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token') // ou depuis un state manager (Redux, Zustand...)
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

// Intercepteur de réponse pour gérer les erreurs globales
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            console.error('Erreur Axios:', error.response.data)
            // gestion personnalisée, par exemple :
            if (error.response.status === 401) {
                // rediriger vers login, ou déconnecter
            }
        }
        return Promise.reject(error)
    }
)

const refreshAccessToken = async (refreshToken) => {
    try {
        const response = await api.post("refresh/", {
            refresh: refreshToken,
        });

        // Stocker le nouveau access token
        const newAccessToken = response.data.access;
        localStorage.setItem("accessToken", newAccessToken);

        return newAccessToken;
    } catch (error) {
        console.error("Erreur lors du rafraîchissement du token :", error);
        // Tu peux rediriger vers login ici si le refresh échoue
    }
};

api.interceptors.response.use(

    (response) => response,

    async (error) => {

        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {

            originalRequest._retry = true;

            const refreshToken = localStorage.getItem("refresh");

            if (refreshToken) {

                const newAccessToken = await refreshAccessToken(refreshToken);

                axios.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;

                originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

                return axios(originalRequest);
            }
        }

        return Promise.reject(error);
    }
);

export default api





