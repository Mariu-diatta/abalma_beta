import { showMessage } from "./components/AlertMessage";
import api from "./services/Axios";
import { login, updateCompteUser} from "./slices/authSlice";
import { setCurrentNav, updateTheme } from "./slices/navigateSlice";

export const maintenant = new Date();

export const getPhotoUser = (obj) => obj?.sender?.image || obj?.sender?.photo_url


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


//fetch all rooms

export const fetchRooms = async (currentUser, dispatch, addRoom) => {

    if(!currentUser) return

    try {

        const response = await api.get("allRoomes");

        // Définir automatiquement un chat si aucun sélectionné
        if (response?.data?.length > 0) {

            response.data.forEach(room => {

                const isCurrentUserInThisChat = room?.current_receiver === currentUser?.id || room?.current_owner === currentUser?.id

                const numberMessagesRoom = room?.messages.length

                if (isCurrentUserInThisChat && (numberMessagesRoom > 0)) dispatch(addRoom(room));

            });
        }

        ///console.log("LES ROOMS", userRooms);

    } catch (err) {

        //console.error("Erreur lors du chargement des rooms:", err);
    }
};

export const backendBase = process.env.NODE_ENV === 'production'
    ? 'wss://backend-mpb0.onrender.com'
    : 'ws://localhost:8000';


//covertion de la date de la transaction
export const convertDate = (dat) => {

    const date = new Date(dat);

    const formatted = date.toLocaleString("fr-FR", {

        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });

    return formatted
}

export function formatDateRelative(dateString, lang = 'fr') {

    // Parse la date: '24-09-2025 15:15:52' → en objet Date
    if (!dateString) return 

    const parts = dateString.split(/[- :]/);
    const parsedDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}T${parts[3]}:${parts[4]}:${parts[5]}`);

    // Réinitialiser les heures pour comparer juste les jours
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const targetDate = new Date(parsedDate);
    targetDate.setHours(0, 0, 0, 0);

    // Calcul de la différence en jours
    const diffTime = targetDate - today;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    // Traductions
    const labels = {
        fr: {
            today: "Aujourd'hui",
            yesterday: "Hier",
            format: (d) => `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
        },
        en: {
            today: "Today",
            yesterday: "Yesterday",
            format: (d) => `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${d.getFullYear()}`
        }
    };

    const locale = labels[lang] || labels['fr'];

    if (diffDays === 0) {
        return locale.today;
    } else if (diffDays === -1) {
        return locale.yesterday;
    } else {
        return locale.format(parsedDate);
    }
}

//Enregistrement de la liste des catefories
export const  LIST_CATEGORY=[

    { idx: "jouets", filter: "JOUETS" }, { idx: "sacs", filter: "SACS" }, { idx: "habits" , filter:"HABITS"},

    { idx: "livres", filter: "LIVRES" }, { idx: "jeux-video", filter: "JEUX_VIDEO" }, { idx: "meubles", filter: "MEUBLES" }, { idx: "vehicules" , filter:"VEHICULES"},

    { idx: "fournitures-scolaires", filter: "FOURNISSEURS_SCOLAIRES" }, { idx: "divers", filter: "DIVERS" }, { idx: "telephones", filter: "TELEPHONIE" }
]

//nombre d'étoiles en fonctions des vues
export const numberStarsViews = (numberStars_) => {

    const numberStars = parseInt(numberStars_, 10);

    if (numberStars >= 40) return 4;

    else if (numberStars >= 30) return 4;

    else if (numberStars >= 10) return 3;

    else if (numberStars >= 5) return 2;

    else if (numberStars >= 1) return 1;

    else return 0;
};

//appliqué le thème 
export const applyTheme = (newTheme, dispatch) => {

    document.body.classList.remove('dark', 'light');

    document.body.classList.add(newTheme);


    dispatch(updateTheme(newTheme));

    const metaThemeColor = document.querySelector("meta[name=theme-color]");

    if (metaThemeColor) {

        metaThemeColor.setAttribute('content', newTheme === 'dark' ? '#000000' : '#ffffff');
    }
}

//vérifier sile user est déjà un follower
export const isAlreadyFollowed = async (clientId, setIsFollow, setIsLoading) => {

    try {

        const response = await api.get(`/clients/${clientId}/alreadyFollow/`, {

            withCredentials: true, // pour envoyer les cookies de session

            headers: {

                'Content-Type': 'application/json',
            },
        });

        setIsFollow(response.data)

        //console.log('Already followed :', response.data || response.data?.message || 'Succès');

    } catch (error) {

        //const message =

        //    error.response?.data?.error ||

        //    error.message ||

        //    'Erreur inconnue';

        //console.error('Erreur lors de l’enregistrement de la vue :', message);

    } finally {

        setIsLoading(false)
    }
};

//Incrémenter ou enregistrer les user qui  viens de follow
export const recordFollowUser = async (clientId) => {

    try {

        await api.post(`/clients/${clientId}/follow/`, {

            withCredentials: true, // pour envoyer les cookies de session

            headers: {

                'Content-Type': 'application/json',
            },
        });

        //console.log('Vue enregistrée :', response.data || response.data?.message || 'Succès');

    } catch (error) {

        //const message =

        //    error.response?.data?.error ||

        //    error.message ||

        //    'Erreur inconnue';

    //    console.error('Erreur lors de l’enregistrement de la vue :', message);
    }
};

//Incrémenter ou enregistrer les user qui  viens de follow
export const recordUnfollowUser = async (clientId) => {

    try {

        await api.post(`/clients/${clientId}/unfollow/`, {

            withCredentials: true, // pour envoyer les cookies de session

            headers: {

                'Content-Type': 'application/json',
            },
        });

        //console.log('Vue enregistrée :', response.data || response.data?.message || 'Succès');

    } catch (error) {

        //const message =

        //    error.response?.data?.error ||

        //    error.message ||

        //    'Erreur inconnue';

        //console.error('Erreur lors de l’enregistrement de la vue :', message);
    }
}

//enregistrer la vue sur le produit
export const productViews = async (dataProduct, setProductNbViews) => {

    if (!dataProduct?.id) return; // Pas d'appel si pas d'ID

    try {

        const { data } = await api.get(`/products_details/${dataProduct?.id}/`);

        setProductNbViews(data?.total_views);

    } catch (error) {

        console.error("Erreur lors du chargement du produit :", error);
    }
};

export function removeAccents(str) {

    if (!str) return "Tous"

    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

//liste des filter catégories pour les produits
export const ListItemsFilterProduct = {
    Tous: { fr: "Tous", en: "All" },
    JOUETS: { fr: "Jouets", en: "Toys" },
    HABITS: { fr: "Habits", en: "Clothes" },
    MATERIELS_INFORMATIQUES: { fr: "Matériels informatiques", en: "Computer_Equipment" },
    CAHIERS: { fr: "Cahiers", en: "Notebooks" },
    SACS: { fr: "Sacs", en: "Bags" },
    LIVRES: { fr: "Livres", en: "Books" },
    ELECTROMENAGER: { fr: "Électroménager", en: "Home_Appliances" },
    TELEPHONIE: { fr: "Téléphonie", en: "Telephony" },
    ACCESSOIRES: { fr: "Accessoires", en: "Accessories" },
    SPORT: { fr: "Sport", en: "Sport" },
    JEUX_VIDEO: { fr: "Jeux vidéo", en: "Video_Games" },
    MEUBLES: { fr: "Meubles", en: "Furniture" },
    VEHICULES: { fr: "Véhicules", en: "Vehicles" },
    FOURNITURES_SCOLAIRES: { fr: "Fournitures scolaires", en: "School_Supplies" },
    DIVERS: { fr: "Divers", en: "Miscellaneous" },
    BIJOUX: { fr: "Bijoux", en: "Jewelry" },
    COSMETIQUES: { fr: "Cosmétiques", en: "Cosmetics" },
    ALIMENTATION: { fr: "Alimentation", en: "Food" },
    MUSIQUE: { fr: "Musique", en: "Music" },
    noProduct: { fr: "Aucun produit disponible", en: "No product available" }
};

// Fonction utilitaire
export function translateCategory(value) {
    const entries = Object.entries(ListItemsFilterProduct);

    for (const [key, translations] of entries) {
        if (
            translations.fr.toLowerCase() === value.toLowerCase() ||
            translations.en.toLowerCase() === value.toLowerCase()
        ) {
            return key;
        }
    }

    return null; // clé non trouvée
}

// Mapping des symboles monétaires
export const symbolesMonnaies = {
    EUR: '€',
    USD: '$',
    XOF: 'CFA', // Franc CFA (Afrique de l'Ouest)
    // XAF: 'CFA', // Franc CFA (Afrique centrale), si nécessaire
    CHF: 'CHF', // Franc suisse, si c'est ce que vous voulez
};

// Configuration des monnaies avec symboles et ordre
export const configurationMonnaies = {
    EUR: { symbole: '€', position: 'apres', code: 'EUR' }, // Après en fr-FR
    USD: { symbole: '$', position: 'avant', code: 'USD' }, // Avant en en-US, après en fr-CA
    XOF: { symbole: 'CFA', position: 'apres', code: 'XOF' }, // Après pour franc CFA
    CHF: { symbole: 'CHF', position: 'apres', code: 'CHF' }, // Après en fr-CH
};

// Fonction pour formater le prix avec la monnaie
export const formaterPrix = (prix, monnaie, t, locale = 'fr-FR') => {

    if (monnaie === "EURO") {
        monnaie = "EUR"
    } else if (monnaie === "FRANC") {
        monnaie = "XOF"
    } else {
        monnaie = "USD"
    }

    if (!prix || !monnaie || !symbolesMonnaies[monnaie] || !configurationMonnaies[monnaie]) {
        return t('monnaie.inconnue', 'Prix non disponible');
    }
    const config = configurationMonnaies[monnaie]

    try {

        const formatter = new Intl.NumberFormat(locale, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

        const price_format = formatter.format(prix);

        return config.position === 'avant'
            ? `${config.symbole}${price_format}`
            : `${price_format} ${config.symbole}`;

    } catch (error) {

        return `${prix} ${symbolesMonnaies[monnaie] || monnaie}`;
    }
};

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

// Fonction de login avec l'API
export const loginClient = async (data, dispatch, setIsLoading, navigate) => {

    try {

        const response = await api.post('login/', data, {

            headers: {

                'Content-Type': 'multipart/form-data',
            },

            withcredentials:true  
        });


        if (response?.data) {

            ///console.log("les données", response?.data)

            dispatch(login(response?.data?.user));

            dispatch(updateCompteUser(response?.data?.compte))

            dispatch(setCurrentNav("account-home"))

            navigate("/account-home", {replace:true})
        }

    } catch (error) {

        //console.log("Erreur lors du loign", error)

        const errorMessage = error?.response?.data?.detail || error?.message || error?.request?.message || error

        showMessage(dispatch, { Type: "Erreur", Message: errorMessage  });

        throw error;

    } finally {

        setIsLoading(false)
    }
};

export const isCurrentUser = (currentUser, SelectedUser) => {

    return (currentUser.id === SelectedUser.id && currentUser?.email === SelectedUser?.email)
}

export const LIST_CATEGORIES = [
    "All",
    "JOUET",
    "HABITS",
    "MATERIELS_INFORMATIQUES",
    "CAHIERS",
    "SACS",
    "LIVRES",
    "ELECTROMENAGER",
    "TELEPHONIE",
    "ACCESSOIRES",
    "SPORT",
    "JEUX_VIDEO",
    "MEUBLES",
    "VEHICULES",
    "FOURNITURES_SCOLAIRES",
    "DIVERS",
]

// 📦 Composants réutilisables internes :
export const FloatingInput = ({ id, name, label, type = 'text', value, onChange, maxLength, wrapperClass = '', disabled }) => (

    <div className={`relative ${wrapperClass}`}>

        <input
            type={type}
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            placeholder=" "
            maxLength={maxLength}
            disabled={disabled || false}
            className="peer block w-full px-2.5 pt-5 pb-2.5 text-sm text-gray-900 bg-gray-50 dark:bg-gray-700 border-0 border-b-2 border-gray-300 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-0 focus:border-blue-600"
        />

        <label htmlFor={id} className="absolute text-sm text-gray-500 dark:text-gray-400 top-4 left-2.5 transition-all scale-75 -translate-y-4 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:scale-75 peer-focus:-translate-y-4">
            {label}
        </label>

    </div>
);

//ajout des thème
export const ThemeSelector = ({ value, onChange, t }) => (

    <div className="flex flex-col sm:flex-row sm:items-center gap-4">

        <label className="ms-2 font-extrabold text-gray-500 dark:text-gray-400">{t('settingsText.theme')}</label>

        <select
            name="theme"
            value={value}
            onChange={onChange}
            className="style-bg border-0 bg-gray-50 border-0 border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 p-2.5"
        >
            <option value="light">{t('settingsText.themeLight')}</option>

            <option value="dark">{t('settingsText.themeDark')}</option>

        </select>

    </div>
);

//création d'un client
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

        console.error("Erreur de création de client :", error);

        const errorMessage =
            error?.response?.data?.non_field_errors?.[0] ||
            error?.response?.data?.[0] ||
            error?.response?.data?.telephone?.[0] ||
            error?.response?.data?.email?.[0] ||
            error?.response?.data?.detail ||
            "Une erreur inconnue est survenue. Veuillez réessayer.";

        showMessage(dispatch, { Type: "Erreur", Message: errorMessage });
        return null;
    } finally {
        setLoading(false);
    }
};

//notification des message
export const NotificationToggle = ({ checked, onChange, t }) => (

    <div className="flex items-center">

        <input
            id="notifications"
            type="checkbox"
            name="notifications"
            checked={checked}
            onChange={onChange}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
        />

        <label htmlFor="notifications" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('settingsText.notifications')}
        </label>

    </div>
);

export const getTabsNavigationsItems = (currentNav,t) => {

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
                label: 'Blogs',
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






