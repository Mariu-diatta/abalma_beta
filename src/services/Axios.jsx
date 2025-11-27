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

// 🟧 3. Gérer les erreurs 401 SANS localStorage ni refresh manuel

api.interceptors.response.use(

    (response) => response,

    async (error) => {

        const originalRequest = error.config;

        // ⚠️ Pas de boucle infinie ni tentative de refresh manuelle
        if (
            error.response?.status === 401 &&
            !originalRequest?._retry &&
            !originalRequest?.url?.includes('/refresh/')
        ) {
            originalRequest._retry = true;  
            await api.post("refresh/");
            if ((error?.response?.data?.detail === "Informations d'authentification non fournies.") ) {

                if (window.confirm("Votre session a expiré, veuillez vous reconnecter. / Your session has expired.Please log in again.")) {

                    try {

                        //await api.post("refresh/");

                        return window.location.href = "/login";

                    } catch (error) {

                        //showMessage(dispatch, { Type: "Erreur", Message: error?.message || error?.request?.response });

                    } finally {

                        //setLoading(false)
                    }
                }
            }

            try {

                // On laisse le serveur décider si le refresh cookie est valide
                const response = await api.post('/refresh/');

                console.log("Les données lors du refresh: ", response?.data)

                // ✅ Nouvelle tentative
                return api(originalRequest);

            } catch (refreshError) {

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
