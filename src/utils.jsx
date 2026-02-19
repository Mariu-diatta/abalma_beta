import { showMessage } from "./components/AlertMessage";
import api from "./services/Axios";
import { login, updateCompteUser} from "./slices/authSlice";
import { setCurrentNav, updateTheme } from "./slices/navigateSlice";
import { store } from "./store/Store";
import { Client } from "@gradio/client";

export const updateStatusTransaction = (url, data, func, dispatch) => {

    try {

        func(true)

        const response = api.post(`${url}/`, data).then(

            resp => console.log(resp)

        ).catch(

            err => console.log(err)
        )

        console.log(response?.message)

        const messSuccess = response?.message?.message || "Message success"

        showMessage(dispatch, { Type: "Success", Message: messSuccess || "Error not found: user not login" });

    } catch (e) {

        console.log("Erreur de la mise à jour", e)

        const errorMessage = e?.message || e?.response?.data?.detail || "Erreur de la mise à jour"

        func(false)

        showMessage(dispatch, { Type: "Erreur", Message: errorMessage || "Error not found: user not login" });

    } finally {

        func(false)
    }
}

export const getDataChat = async (data) => {

  try {

    const client = await Client.connect("MariusSitoye/abalma");

      const result = await client.predict("/analyze", {

          conversation: data

    });

    console.log("Data :::: ", result.data)

    return result.data;

  } catch (err) {

      console.error("Erreur analyse chat :::", err);

      return
  }
}

// 🕒 Constantes globales
export const maintenant = new Date();

// 📸 Obtenir la photo d’un utilisateur
export const getPhotoUser = (obj) => obj?.sender?.image || obj?.sender?.photo_url;

// 💬 Messages d’aide (support)
export const messages = (t) => [
    {
        text: t("helpPage.currentMessages.connectAccount"),
        advice: t("helpPage.advices.text1", "Vérifiez votre connexion Internet et réessayez. Si le problème persiste, réinitialisez votre mot de passe.")
    },
    {
        text: t("helpPage.currentMessages.forgetPwd"),
        advice: t("helpPage.advices.text2", "Utilisez la fonction 'Mot de passe oublié' pour réinitialiser votre mot de passe.")
    },
    {
        text: t("helpPage.currentMessages.slowConnect"),
        advice: t("helpPage.advices.text3", "Essayez de vider le cache de votre navigateur ou d’utiliser un autre navigateur.")
    },
    {
        text: t("helpPage.currentMessages.errorPay"),
        advice: t("helpPage.advices.text4", "Vérifiez vos informations bancaires et assurez-vous que votre carte est valide.")
    },
    {
        text: t("helpPage.currentMessages.printMobile"),
        advice: t("helpPage.advices.text5", "Essayez de faire un zoom arrière ou de changer d’orientation de l’écran.")
    },
    {
        text: t("helpPage.currentMessages.unexceptMessage"),
        advice: t("helpPage.advices.text6", "Prenez une capture d’écran et contactez le support technique.")
    },
];

// 🗓️ Fonctions de date et formatage
export const convertDate = (dat) => {
    const date = new Date(dat);
    return date.toLocaleString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
};

export function formatDateRelative(dateString, lang = 'fr') {
    if (!dateString) return;
    const parts = dateString.split(/[- :]/);
    const parsedDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}T${parts[3]}:${parts[4]}:${parts[5]}`);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const targetDate = new Date(parsedDate); targetDate.setHours(0, 0, 0, 0);
    const diffDays = (targetDate - today) / (1000 * 60 * 60 * 24);
    const labels = {
        fr: { today: "Aujourd'hui", yesterday: "Hier", format: (d) => `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}` },
        en: { today: "Today", yesterday: "Yesterday", format: (d) => `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${d.getFullYear()}` }
    };
    const locale = labels[lang] || labels['fr'];
    if (diffDays === 0) return locale.today;
    if (diffDays === -1) return locale.yesterday;
    return locale.format(parsedDate);
}

// 🧮 Fonctions utilitaires
export function removeAccents(str) {
    if (!str) return "Tous";
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export const numberStarsViews = (n) => n >= 40 ? 4 : n >= 30 ? 4 : n >= 10 ? 3 : n >= 5 ? 2 : n >= 1 ? 1 : 0;

export const applyTheme = (newTheme, dispatch) => {
    document.body.classList.remove('dark', 'light');
    document.body.classList.add(newTheme);
    dispatch(updateTheme(newTheme));
    const meta = document.querySelector("meta[name=theme-color]");
    if (meta) meta.setAttribute('content', newTheme === 'dark' ? '#000000' : '#ffffff');
};

// 🧠 Données du store
const storeSates = store.getState();
const currentLang = storeSates?.navigate?.lang;
const isLang = (currentLang === "ang");

// 📨 Requêtes & interactions backend
export const fetchRooms = async (currentUser, dispatch, addRoom) => {

    if (!currentUser) return;

    try {

        const response = await api.get("allRoomes");

        if (response?.data?.length > 0) {

            response.data.forEach(room => {
                const isCurrentUserInThisChat = room?.current_receiver === currentUser?.id || room?.current_owner === currentUser?.id;
                const numberMessagesRoom = room?.messages.length;
                if (isCurrentUserInThisChat && (numberMessagesRoom > 0)) dispatch(addRoom(room));
            });
        }

    } catch {

    }
};

export const isAlreadyFollowed = async (clientId, setIsFollow, setIsLoading, currentUser) => {

    if (!clientId || !currentUser || clientId===currentUser?.id ) return 
    try {
        const response = await api.get(`/clients/${clientId}/alreadyFollow/`, {
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' },
        });
        setIsFollow(response.data);
    } finally { setIsLoading(false); }
};

export const recordFollowUser = async (clientId) => {
    try { await api.post(`/clients/${clientId}/follow/`, { withCredentials: true }); } catch { }
};

export const recordUnfollowUser = async (clientId) => {
    try { await api.post(`/clients/${clientId}/unfollow/`, { withCredentials: true }); } catch { }
};

export const productViews = async (dataProduct, setProductNbViews) => {
    // ✅ Vérification sécurisée des paramètres
    if (!dataProduct?.id || typeof setProductNbViews !== "function") return 0;

    try {

        const response = await api.get(`/products_details/${dataProduct.id}/`);

        const totalViews = response?.data?.total_views ?? 0;

        // ✅ Mise à jour de l’état si possible
        setProductNbViews(totalViews);

        return 1; // succès
    } catch (error) {
        console.error("❌ Erreur lors du chargement du produit :", error.message || error);
        return 0; // échec
    }
};

// 🛒 Catégories et filtres produits
// ============================
// 🔹 Base des catégories
// ============================

export const CATEGORIES = {
    DIVERS: { fr: "Divers", en: "Other / Misc", idx: "divers" },
    JOUETS: { fr: "Jouets", en: "Toys", idx: "jouets" },
    HABITS: { fr: "Habits", en: "Clothes", idx: "habits" },
    MATERIELS_INFORMATIQUES: { fr: "Matériels informatiques", en: "Computer Equipment", idx: "materiels-informatiques" },
    CAHIERS: { fr: "Cahiers", en: "Notebooks", idx: "cahiers" },
    SACS: { fr: "Sacs", en: "Bags", idx: "sacs" },
    LIVRES: { fr: "Livres", en: "Books", idx: "livres" },
    ELECTROMENAGER: { fr: "Électroménager", en: "Home Appliances", idx: "electromenager" },
    TELEPHONIE: { fr: "Téléphonie", en: "Telephony", idx: "telephonie" },
    ACCESSOIRES: { fr: "Accessoires", en: "Accessories", idx: "accessoires" },
    SPORT: { fr: "Sport", en: "Sports Equipment", idx: "sport" },
    JEUX_VIDEO: { fr: "Jeux vidéo", en: "Video Games", idx: "jeux-video" },
    MEUBLES: { fr: "Meubles", en: "Furniture", idx: "meubles" },
    VEHICULES: { fr: "Véhicules", en: "Vehicles", idx: "vehicules" },
    FOURNITURES_SCOLAIRES: { fr: "Fournitures scolaires", en: "School Supplies", idx: "fournitures-scolaires" },
    BIJOUX: { fr: "Bijoux", en: "Jewelry", idx: "bijoux" },
    COSMETIQUES: { fr: "Cosmétiques", en: "Cosmetics", idx: "cosmetiques" },
    ALIMENTATION: { fr: "Alimentation", en: "Food", idx: "alimentation" },
    MUSIQUE: { fr: "Musique", en: "Music", idx: "musique" },
    SANTE_BEAUTE: { fr: "Santé & Beauté", en: "Health & Beauty", idx: "sante-beaute" },
    MAISON_DECORATION: { fr: "Maison & Décoration", en: "Home & Decoration", idx: "maison-decoration" },
    BEBES: { fr: "Bébés & Puériculture", en: "Baby & Toddler", idx: "bebes" },
    JARDINAGE: { fr: "Jardinage", en: "Gardening", idx: "jardinage" },
    BRICOLAGE: { fr: "Bricolage", en: "DIY & Tools", idx: "bricolage" },
    ANIMAUX: { fr: "Animaux", en: "Pet Supplies", idx: "animaux" },
    CHAUSSURES: { fr: "Chaussures", en: "Shoes", idx: "chaussures" },
    ELECTRONIQUE: { fr: "Électronique", en: "Electronics", idx: "electronique" },
    FILMS_SERIES: { fr: "Films & Séries", en: "Movies & Series", idx: "films-series" },
    SERVICES: { fr: "Services", en: "Services", idx: "services" },
    ART: { fr: "Art & Artisanat", en: "Art & Craft", idx: "art" },
    JEWELRY: { fr: "Montres & Bijoux", en: "Watches & Jewelry", idx: "jewelry" },
    VOYAGE: { fr: "Voyage & Loisirs", en: "Travel & Leisure", idx: "voyage" },
    MEDICAL: { fr: "Matériel médical", en: "Medical Equipment", idx: "medical" },
    HIGH_TECH: { fr: "High-Tech", en: "Gadgets & Innovation", idx: "high-tech" },
    AUTOMOTO: { fr: "Auto-moto", en: "Automotive", idx: "automoto" },
    Tous: { fr: "Tous", en: "All" }
};

// ============================
// 🔹 Génération dynamique
// ============================

// ✅ Liste simple (pour les selects)
export const LIST_CATEGORIES = [...Object.keys(CATEGORIES)];

// ✅ Liste utilisée pour les filtres produits
export const ListItemsFilterProduct = {
    ...CATEGORIES,
    noProduct: { fr: "Aucun produit disponible", en: "No product available" }
};

// ✅ Liste dynamique pour le front (idx + filter)
export const LIST_CATEGORY = Object.entries(CATEGORIES).map(([key, { idx }]) => ({
    idx,
    filter: isLang ? key.toUpperCase() : key
}));

// ============================
// 🔹 Fonction de traduction inverse
// ============================

export function translateCategory(value) {

    const entries = Object.entries(CATEGORIES);

    for (const [key, { fr, en }] of entries) {

        if (value.toLowerCase() === fr.toLowerCase() || value.toLowerCase() === en.toLowerCase()) {
            return key;
        }
    }

    return null; // clé non trouvée
}

// 💰 Gestion des monnaies
export const symbolesMonnaies = { EUR: '€', USD: '$', XOF: 'XOF', CHF: 'CHF' };

export const configurationMonnaies = {
    EUR: { symbole: '€', position: 'apres', code: 'EUR' },
    USD: { symbole: '$', position: 'avant', code: 'USD' },
    XOF: { symbole: 'XOF', position: 'apres', code: 'XOF' },
    CHF: { symbole: 'CHF', position: 'apres', code: 'CHF' },
};

export const formaterPrix = (prix, monnaie, t, locale = 'fr-FR') => {

    if (monnaie === "EURO") monnaie = '€';
    else if (monnaie === "FRANC") monnaie = "XOF";
    else monnaie = '$';

    if (!prix || !monnaie || !symbolesMonnaies[monnaie] || !configurationMonnaies[monnaie])
        return t('monnaie.inconnue', 'Prix non disponible');

    const config = configurationMonnaies[monnaie];

    try {
        const formatter = new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const price_format = formatter.format(prix);
        return config.position === 'avant' ? `${config.symbole}${price_format}` : `${price_format} ${config.symbole}`;
    } catch {
        return `${prix} ${symbolesMonnaies[monnaie] || monnaie}`;
    }
};

// 👥 Authentification & création de compte
export const loginClient = async (data, dispatch, setIsLoading, navigate) => {

    try {
        const response = await api.post('login/', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            withCredentials: true // <-- CORRECT
        });

        if (response?.data) {
            dispatch(login(response?.data?.user));
            dispatch(updateCompteUser(response?.data?.compte));
            dispatch(setCurrentNav("account-home"));
            navigate("/account-home", { replace: true });
        }

    } catch (error) {
        const errorMessage = error?.response?.data?.detail || error?.message || error?.request?.message || error;
        showMessage(dispatch, { Type: "Erreur", Message: errorMessage });
        dispatch(setCurrentNav(ENDPOINTS.LOGIN))
        throw error;

    } finally {
        setIsLoading(false);
    }
};

export const CreateClient = async (data, setLoading, showMessage, dispatch, t) => {
    try {
        const response = await api.post('inscription/', data, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            timeout: 10000,

            withCredentials: false
        });

        showMessage(dispatch, { Type: 'Message', Message: t('creatAccountSucces') });

        return response;

    } catch (error) {

        const errorMessage =
            error?.response?.data?.non_field_errors?.[0] ||
            error?.response?.data?.[0] ||
            error?.response?.data?.telephone?.[0] ||
            error?.response?.data?.email?.[0] ||
            error?.response?.data?.detail ||
            "Une erreur inconnue est survenue. Veuillez réessayer.";

        showMessage(dispatch, { Type: "Erreur", Message: errorMessage });

        dispatch(setCurrentNav(ENDPOINTS.REGISTER))

        return null;

    } finally {

        setLoading(false);
    }
};

export const isCurrentUser = (currentUser, SelectedUser) => currentUser.id === SelectedUser.id && currentUser?.email === SelectedUser?.email;

// 🧭 Navigation
export const getTabsNavigationsItems = (currentNav, t) => {

    return (

        [
            {
                id: 'home',
                label: t('home'),
                endPoint: '/',
                logo: !(currentNav === "home") ? (
                    <svg
                        className="w-6 h-6 text-gray-800 dark:text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1"
                            d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5"
                        />
                    </svg>
                ) : (
                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M11.293 3.293a1 1 0 0 1 1.414 0l6 6 2 2a1 1 0 0 1-1.414 1.414L19 12.414V19a2 2 0 0 1-2 2h-3a1 1 0 0 1-1-1v-3h-2v3a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2v-6.586l-.293.293a1 1 0 0 1-1.414-1.414l2-2 6-6Z" clipRule="evenodd" />
                    </svg>

                ),
            },
            {
                id: 'about',
                label: t('about'),
                endPoint: '/about',
                logo:
                    ((currentNav === "about") && !(currentNav === "login") && !(currentNav === "register")) ?
                        (
                            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm9.408-5.5a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2h-.01ZM10 10a1 1 0 1 0 0 2h1v3h-1a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2h-1v-4a1 1 0 0 0-1-1h-2Z" clipRule="evenodd" />
                            </svg>

                        )
                        :
                        (
                            <svg
                                className="w-6 h-6 text-gray-800 dark:text-white"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1"
                                    d="M10 11h2v5m-2 0h4m-2.592-8.5h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                />
                            </svg>
                        ),
            },
            {
                id: 'blogs',
                label: 'Blog',
                endPoint: '/blogs',
                logo:
                    (!(currentNav === "blogs") && !(currentNav === "login") && !(currentNav === "/register")) ?
                        (
                            <svg
                                className="w-6 h-6 text-gray-800 dark:text-white"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeWidth="1"
                                    d="M16 19h4a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-2m-2.236-4a3 3 0 1 0 0-4M3 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                />
                            </svg>
                        )
                        :
                        (
                            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M8 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4H6Zm7.25-2.095c.478-.86.75-1.85.75-2.905a5.973 5.973 0 0 0-.75-2.906 4 4 0 1 1 0 5.811ZM15.466 20c.34-.588.535-1.271.535-2v-1a5.978 5.978 0 0 0-1.528-4H18a4 4 0 0 1 4 4v1a2 2 0 0 1-2 2h-4.535Z" clipRule="evenodd" />
                            </svg>
                        )
                ,
            },
        ]
    )
};

export const ItemsNav = ["home", "blogs", "account-home", "all-products"];

//Formatage de date
export function formatISODate(isoDateStr) {
    const date = new Date(isoDateStr);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

//Endpoints
export const ENDPOINTS = {
    FORGETPSWD:"forgetPassword",
    REGISTER: "register",
    LOGIN: "login",
    MESSAGE_INBOX: "message-inbox",
    HOME: "home",
    ACCOUNT_HOME: "account-home",
    USER_PROFIL: "user-profil",
    PAYMENT: "payment",
    HELP: "help",
    SETTINGS: "settings",
    ADD_PRODUCT: "add-product",
    USER_BLOGS: "user-blogs",
    DASHBOARD: "dashboard",
    BLOG: "blogs",
    SUBSCRIPTION: "subscription",
    ABOUT:"about"
}

export const API_URL_BACKEND = {
    STATUS_SUB_TRANSACTION: "update-subTransaction-status",
    STATUS_TRANSACTION: 'update-transaction-status',
    STATUS_TRANSACTION_PRODUCT:"update-productTransaction-status"
}

export const CONSTANTS = {
    ABOUT: "About",
    BLOGS: "Blog",
    ERRREUR: "Erreur",
    ALL: "Tous",
    DARK: 'dark',
    LIGHT: 'light',
    THEME: 'theme',
    CHAT_MESSAGE: "chat_message",
    DECIMALS_DIGITS: 2,
    ZERO_DECIMALS_DIGITS: 0.00,
    XOF: "XOF",
    EUR: "EUR",
    USD: "USD",
    FRANC: "FRANC",
    FR: "fr",
    UPDATE: 'update',
    CONFIRMED: 'confirmed',
    ACTION:'actions'
}
  
//put fist letter in upCase
export function capitalizeFirstLetter(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase

}

//Paiment mode 
export const payNow = async (
    { email, amount },
    setLoading,
    currentcyRate,
    dispatch,
    showMessage,
    t,
    setShowPaymentForm
)=> {

    const currency = currentcyRate

    try {

        setLoading(true)

        const dataStringify = {
            amount,
            email,
            currency 

        }

        const res = await api.post("/create-checkout-session/", dataStringify);

        showMessage(dispatch, { Type: "Success", Message: res?.data || "sucess " || t("Requete bonne sur la donnée") });

        console.log("Success réponse stripe transaction", res?.data)

        window.location.href = res?.data?.url;

    } catch (err) {

        console.log("Erreur de la donnée", err)
        setShowPaymentForm(false)
        showMessage(dispatch, { Type: "Erreur", Message: err?.response?.data?.error || t("Erreur sur la donnée") });

    } finally {

        setLoading(false)
    }

};
function convertir(de, vers) {
    const taux = {
        EUR_USD: 1.10,
        USD_EUR: 0.91,

        EUR_XOF: 655,
        XOF_EUR: 1 / 655,

        USD_XOF: 600,
        XOF_USD: 1 / 600
    };

    const key = `${de}_${vers}`;

    if (taux[key] !== undefined) {

        return  taux[key];
    }

    return null; // conversion impossible
}

export const convertRates = async (setConvertValue, rateToConvert, referenceRate) => {
      const value = convertir(referenceRate, rateToConvert)
      setConvertValue(value)
}

export const OPERATIONS_STATUS = {
    ACHETER: 'achetés',
    VENDRE: 'vendus',
    PRETER: 'prêtés',
    EN_COURS: 'en cours',
    PENDING: 'En attente',
    CONFIRMED: 'Confirmée',
    SHIPPED: 'Expédiée',
    DELIVERED: 'Livrée',
}

export const STATUS={
    "pending": "En attente",
    "recorded": "Enregistrée",
    "in_progress": "Paiement en cours",
    "failed": "Paiement échoué",
    "canceled": "Annulée",
    "validated": "Paiement validé",
    "confirmed": "Confirmée",
    "shipped": "Expédiée",
    "delivered": "Livrée",
    "refunded": "Remboursée",
    "paid":"Payé"
}

export const NAMES_TABLES= [
    'name', 'categories', 'status', 'price', 'created',
    'operationDate', 'endDate', 'operation', 'view', 'actions','update'
]

export const STATUS_FLOW = {

    pending: "recorded",
    recorded: "in_progress",
    in_progress: "validated",
    validated: "paid",
    paid: "confirmed",
    confirmed: "shipped",
    shipped: "delivered",
};

export const STATUS_FLOW_TRANSACTION = {
    forward: "pending",
    pending: "recorded",
    recorded: "in_progress",
    in_progress: "validated",
    validated: "confirmed",
    confirmed: "shipped",
    shipped: "delivered",
    delivered: "refunded",
    canceled: null,
    failed: null,
};

export const STATUS_FLOW_SUBTRANSACTION = {
    forward: "in_progress",
    pending: "in_progress",
    in_progress: "confirmed",
    confirmed: "shipped",
    shipped: "delivered",
    delivered:null,
    canceled:null
};

export const STATUS_FLOW_STYLE = {
    pending: {
        label: "Pending",
        color: "#f59e0b", // amber
        next: "recorded",
    },

    recorded: {
        label: "Recorded",
        color: "#6366f1", // indigo
        next: "in_progress",
    },

    in_progress: {
        label: "In progress",
        color: "#3b82f6", // blue
        next: "validated",
    },

    validated: {
        label: "Validated",
        color: "#22c55e", // green
        next: "confirmed",
    },

    confirmed: {
        label: "Confirmed",
        color: "#16a34a", // dark green
        next: "shipped",
    },

    shipped: {
        label: "Shipped",
        color: "#0ea5e9", // sky blue
        next: "delivered",
    },

    delivered: {
        label: "Delivered",
        color: "#10b981", // emerald
        next: "refunded",
    },

    refunded: {
        label: "Refunded",
        color: "#a855f7", // purple
        next: null,
    },

    failed: {
        label: "Failed",
        color: "#ef4444", // red
        next: null,
    },

    canceled: {
        label: "Canceled",
        color: "#6b7280", // gray
        next: null,
    },
};

export const STATUS_FLOW_ITEM_COMPLET = {
    pending: "recorded",
    recorded: "in_progress",
    in_progress: "validated",
    validated: "confirmed",
    confirmed: "shipped",
    shipped: "delivered",

    // états terminaux
    delivered: "refunded",
    refunded: null,
    failed: null,
    canceled: null,
};



export const STATUS_FLOW_ITEM = {
    forward: "in_progress",
    pending: "in_progress",
    in_progress: "delivered",

    // états terminaux
    delivered: null,
    canceled: null,
    failed: null,
};

export const MODE={
    BUY: "buy",
    SELL:"sell"
}

export const canUpdateDelete = [
    "forward"
]

export const AGENT_AI = {
    "total_followers": 0,
    "total_followings": 0,
    "last_login": "2025-12-22T01:52:31.604908Z",
    "is_superuser": false,
    "email": "ai@abalama.fr",
    "prenom": "AI",
    "nom": "my_help",
    "image": null,
    "image_cover": null,
    "photo_url": null,
    "doc_proof": null,
    "telephone": "3399999999",
    "profession": "New_user",
    "description": "",
    "adresse": "",
    "is_connected": false,
    "created": "2025-12-22T01:52:20.578381Z",
    "is_active": true,
    "is_staff": false,
    "is_pro": false,
    "is_fournisseur": false,
    "is_verified": false,
    "groups": [],
    "user_permissions": []
}

export const totalPrice = (product, setConvertRate, reference, convertRate) => {

    const price = Number(product.price_product);

    var convertValue = product?.currency_price

    const convertRateSupOne = (convertRate > 1)

    const oneDividedConvertRate = (1 / convertRate)

    if (product?.currency_price === CONSTANTS?.FRANC) {

        convertValue = CONSTANTS?.XOF
    }

    convertRates(setConvertRate, convertValue, reference)

    const quantity = Number(product.quanttity_product_sold);

    var convertRefRate = convertRateSupOne ? oneDividedConvertRate : convertRate

    var pricePlusQuantityPlusConvert = price * quantity * convertRefRate

    return (!isNaN(price) && !isNaN(quantity)) ? pricePlusQuantityPlusConvert : 0;
};


export const IMPORTANTS_URLS = {
    LOGINS: "https://www.abalma.fr/login/",
    LOGIN:"http://localhost:3000/login",
    REGISTER: "http://localhost:3000/register",
    REGISTERS: "https://www.abalma.fr/register/",
    MESSAGE_APP: "https://www.abalma.fr/message-inbox",
    MESSAGE_APPS: "https://www.abalma.fr/message-inbox/"
}


