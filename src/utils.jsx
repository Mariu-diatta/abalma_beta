import { showMessage } from "./components/AlertMessage";
import api from "./services/Axios";
import { login, updateCompteUser} from "./slices/authSlice";
import { setCurrentNav, updateTheme } from "./slices/navigateSlice";

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

//Enregistrement de la liste des catefories
export const  LIST_CATEGORY=[

    { idx: "jouets", filter: "JOUETS" }, { idx: "sacs", filter: "SACS" }, { idx: "habits" , filter:"HABITS"},

    { idx: "livres", filter: "LIVRES" }, { idx: "Jeux_video", filter: "JEUX_VIDEO" }, { idx: "Meubles", filter: "MEUBLES" }, { idx: "Vehicules" , filter:"VEHICULES"},

    { idx: "Fournitures_scolaires", filter: "FOURNISSEURS_SCOLAIRES" }, { idx: "divers", filter: "DIVERS" }, { idx: "telephones", filter: "TELEPHONIE" }
]

//nombre d'étoiles en fonctions des vues
export const numberStarsViews = (numberStars_) => {

    const numberStars = parseInt(numberStars_, 10);

    if (numberStars >= 40) return 4;

    else if (numberStars >= 30) return 4;

    else if (numberStars >= 10) return 3;

    else if (numberStars >= 5) return 2;

    else if (numberStars === 1) return 1;

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

        const message =

            error.response?.data?.error ||

            error.message ||

            'Erreur inconnue';

        console.error('Erreur lors de l’enregistrement de la vue :', message);
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

            withcredentials:false   
        });


        if (response?.data) {

            //console.log("les données", response?.data)

            dispatch(login(response?.data?.user));

            dispatch(updateCompteUser(response?.data?.compte))

            dispatch(setCurrentNav("account_home"))

            navigate("/account_home", {replace:true})
        }

    } catch (error) {

        //console.log("Erreur lors du loign", error)

        showMessage(dispatch, { Type: "Erreur", Message: error?.response?.data?.detail || error?.message || error?.request?.message || error });

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