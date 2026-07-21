import { showMessage } from "./components/AlertMessage";
import {
    Truck,
    CreditCard,
    PackageCheck,
    Tag,
    Headphones,
    MessageSquareHeart,
    Info,
    Home,
    BookOpen
} from "lucide-react";
import api, { BASE_URL } from "./services/Axios";
import { API_ENDPOINTS } from "./services/apiEndpoints";
import { login, updateCompteUser} from "./slices/authSlice";
import { setCurrentNav, updateTheme } from "./slices/navigateSlice";
import { store } from "./store/Store";

export const formatRelativeDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();

    const diff = now - date;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    // Moins d'une minute
    if (seconds < 60) {
        return "À l'instant";
    }

    // Minutes
    if (minutes < 60) {
        return `Il y a ${minutes} minute${minutes > 1 ? "s" : ""}`;
    }

    // Heures
    if (hours < 24) {
        return `Il y a ${hours} heure${hours > 1 ? "s" : ""}`;
    }

    // Hier
    if (days === 1) {
        return "Hier";
    }

    // Jours
    if (days < 7) {
        return `Il y a ${days} jours`;
    }

    // Semaines
    if (days < 30) {
        const weeks = Math.floor(days / 7);
        return `Il y a ${weeks} semaine${weeks > 1 ? "s" : ""}`;
    }

    // Mois
    if (days < 365) {
        const months = Math.floor(days / 30);
        return `Il y a ${months} mois`;
    }

    // Années
    const years = Math.floor(days / 365);
    return `Il y a ${years} an${years > 1 ? "s" : ""}`;
};

export const getProducts = async (category) => {

    const isDefaultCategory =
        !category ||
        category === CONSTANTS?.ALL?.toLowerCase();

    const url = isDefaultCategory
        ? "produits/"
        : "products/filter/";

    const { data } = await api.get(url, {
        params: {
            product_categorie: category?.toUpperCase(),
        },
    });
    const filters = data.filter(
        p => Number(p?.quantity_product) > 0
    )
    return {
        products: filters
    };
};

export const getMediaUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${BASE_URL}${path}`;
};

export const updateStatusTransaction = async (url, data, func, dispatch) => {

    try {

        func(true)

        const response = await api.post(`${url}/`, data)

        showMessage(dispatch, {
            Type: "Success",
            Message: response?.data?.message || "Success"
        })

        return response.data   // ✅ IMPORTANT

    } catch (e) {
        showMessage(dispatch, {
            Type: "Erreur",
            Message:
                e?.response?.data?.detail ||
                e?.message ||
                "Erreur de la mise à jour"
        })

        throw e
    } finally {
        func(false)
    }
}

export const getDataChat = async (data) => {

  try {

    // Import différé : @gradio/client est une dépendance assez lourde qui
    // ne sert qu'à cette fonctionnalité d'analyse IA — pas besoin de
    // l'embarquer dans le bundle principal chargé par tout le monde.
    const { Client } = await import("@gradio/client");

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
// Récupère TOUTES les rooms où l'utilisateur est impliqué, qu'il soit
// "owner" (a démarré la conversation) ou "receiver" (l'a reçue). Filtrer
// uniquement par receiver_id (comme le faisaient certains écrans) ignore
// la moitié des conversations de l'utilisateur — d'où des discussions qui
// "disparaissaient" de la liste après rechargement de la page.
export const fetchRooms = async (currentUser, dispatch, addRoom) => {

    if (!currentUser) return [];

    try {

        const { data } = await api.get(API_ENDPOINTS.CHAT.ALL_ROOMS);

        const rooms = (data || []).filter((room) => {
            const isOwner = room?.current_owner === currentUser?.id;
            const isReceiverWithMessages =
                room?.current_receiver === currentUser?.id && (room?.messages?.length || 0) > 0;
            return isOwner || isReceiverWithMessages;
        });

        rooms.forEach((room) => dispatch(addRoom(room)));

        return rooms;

    } catch (err) {
        console.error("Erreur lors du chargement des rooms :", err?.response?.data || err?.message);
        return [];
    }
};

// Récupère (ou crée) la room entre l'utilisateur courant et un autre
// utilisateur — utilisé pour ouvrir/reprendre une conversation depuis une
// fiche produit ou un profil.
export const getOrCreateRoom = async ({ currentUser, otherUser, roomName }) => {

    if (!currentUser?.id || !otherUser?.id) return null;

    // 1) On cherche d'abord si une conversation existe déjà entre les deux.
    try {
        const { data } = await api.get(API_ENDPOINTS.CHAT.ALL_ROOMS);
        const existing = (data || []).find(
            (room) =>
                (room?.current_owner === currentUser.id && room?.current_receiver === otherUser.id) ||
                (room?.current_owner === otherUser.id && room?.current_receiver === currentUser.id)
        );
        if (existing) return existing;
    } catch (err) {
        console.error("Erreur recherche room existante :", err?.response?.data || err?.message);
    }

    // 2) Sinon on en crée une nouvelle.
    try {
        const { data } = await api.post(API_ENDPOINTS.CHAT.CREATE_ROOM, {
            name: roomName || `room_${currentUser.id}_${otherUser.id}_${Date.now()}`,
            current_owner: currentUser.id,
            current_receiver: otherUser.id,
        });
        return data;
    } catch (err) {
        console.error("Erreur création room :", err?.response?.data || err?.message);
        return null;
    }
};

export const isAlreadyFollowed = async (clientId, setIsFollow, setIsLoading, currentUser) => {

    if (!clientId || !currentUser || clientId===currentUser?.id ) return 
    try {
        const response = await api.get(API_ENDPOINTS.CLIENTS.ALREADY_FOLLOW(clientId), {
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' },
        });
        setIsFollow(response.data);
    } finally { setIsLoading(false); }
};

export const recordFollowUser = async (clientId) => {
    try { await api.post(API_ENDPOINTS.CLIENTS.FOLLOW(clientId), { withCredentials: true }); } catch { }
};

export const recordUnfollowUser = async (clientId) => {
    try { await api.post(API_ENDPOINTS.CLIENTS.UNFOLLOW(clientId), { withCredentials: true }); } catch { }
};

export const productViews = async (dataProduct, setProductNbViews) => {
    // ✅ Vérification sécurisée des paramètres
    if (!dataProduct?.id || typeof setProductNbViews !== "function") return 0;

    try {

        const response = await api.get(API_ENDPOINTS.PRODUCTS.DETAILS_SLASH(dataProduct.id));

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

export const CATEGORY_FIELDS = {

    cosmetiques: {
        fields: [
            { name: "contenance", required: true },
            { name: "type", required: false },
            { name: "composition", required: false },
        ],
        rules: {
            size: false,
            color: false
        }
    },

    habits: {
        fields: [
            { name: "matiere", required: false },
        ],
        rules: {
            size: true,
            color: true
        }
    },

    materiels_informatiques: {
        fields: [
            { name: "marque", required: true },
            { name: "modele", required: true },
            { name: "ram", required: false },
            { name: "stockage", required: false },
            { name: "processeur", required: false },
            { name: "etat", required: true },
        ],
        rules: {
            size: false,
            color: false
        }
    },

    telephonie: {
        fields: [
            { name: "marque", required: true },
            { name: "modele", required: true },
            { name: "stockage", required: true },
            { name: "etat", required: true },
        ],
        rules: {
            size: false,
            color: false
        }
    },

    electronique: {
        fields: [
            { name: "marque", required: true },
            { name: "modele", required: false },
            { name: "etat", required: true },
            { name: "garantie", required: false },
        ],
        rules: {
            size: false,
            color: false
        }
    },

    vehicules: {
        fields: [
            { name: "marque", required: true },
            { name: "modele", required: true },
            { name: "annee", required: true },
            { name: "kilometrage", required: true },
            { name: "carburant", required: false },
        ],
        rules: {
            size: false,
            color: true // ex: couleur carrosserie
        }
    },

    electromenager: {
        fields: [
            { name: "marque", required: true },
            { name: "puissance", required: false },
            { name: "etat", required: true },
        ],
        rules: {
            size: false,
            color: false
        }
    },

    livres: {
        fields: [
            { name: "auteur", required: true },
            { name: "langue", required: false },
            { name: "etat", required: false },
        ],
        rules: {
            size: false,
            color: false
        }
    },

    sacs: {
        fields: [
            { name: "marque", required: false },
            { name: "matiere", required: false },
        ],
        rules: {
            size: false,
            color: true
        }
    },

    chaussures: {
        fields: [
            { name: "marque", required: false },
            { name: "etat", required: false },
        ],
        rules: { size: true, color: true }
    },

    divers: {
        fields: [],
        rules: { size: false, color: false }
    },

    jouets: {
        fields: [
            { name: "type", required: true },
            { name: "age", required: false },
            { name: "etat", required: false },
        ],
        rules: { size: false, color: false }
    },

    cahiers: {
        fields: [
            { name: "nombre_pages", required: false },
            { name: "format", required: false },
            { name: "etat", required: false },
        ],
        rules: { size: false, color: false }
    },

    sport: {
        fields: [
            { name: "type", required: true },
            { name: "marque", required: false },
            { name: "etat", required: false },
        ],
        rules: { size: false, color: false }
    },

    jeux_video: {
        fields: [
            { name: "plateforme", required: true },
            { name: "titre", required: true },
            { name: "etat", required: false },
        ],
        rules: { size: false, color: false }
    },

    meubles: {
        fields: [
            { name: "type", required: true },
            { name: "matiere", required: false },
            { name: "etat", required: true },
        ],
        rules: { size: true, color: false }
    },

    fournitures_scolaires: {
        fields: [
            { name: "type", required: true },
            { name: "quantite", required: false },
        ],
        rules: { size: false, color: false }
    },

    bijoux: {
        fields: [
            { name: "matiere", required: true },
            { name: "etat", required: false },
        ],
        rules: { size: false, color: true }
    },

    alimentation: {
        fields: [
            { name: "type", required: true },
            { name: "date_expiration", required: false },
            { name: "poids", required: false },
        ],
        rules: { size: false, color: false }
    },

    musique: {
        fields: [
            { name: "type", required: true },
            { name: "artiste", required: false },
            { name: "etat", required: false },
        ],
        rules: { size: false, color: false }
    },

    sante_beaute: {
        fields: [
            { name: "type", required: true },
            { name: "marque", required: false },
        ],
        rules: { size: false, color: false }
    },

    maison_decoration: {
        fields: [
            { name: "type", required: true },
            { name: "matiere", required: false },
        ],
        rules: { size: true, color: true }
    },

    bebes: {
        fields: [
            { name: "type", required: true },
            { name: "age", required: false },
            { name: "etat", required: false },
        ],
        rules: { size: true, color: false }
    },

    jardinage: {
        fields: [
            { name: "type", required: true },
            { name: "marque", required: false },
        ],
        rules: { size: false, color: false }
    },

    bricolage: {
        fields: [
            { name: "type", required: true },
            { name: "marque", required: false },
            { name: "etat", required: false },
        ],
        rules: { size: false, color: false }
    },

    animaux: {
        fields: [
            { name: "type", required: true },
        ],
        rules: { size: true, color: false }
    },

    films_series: {
        fields: [
            { name: "titre", required: true },
            { name: "format", required: false },
        ],
        rules: { size: false, color: false }
    },

    services: {
        fields: [
            { name: "type", required: true },
            { name: "duree", required: false },
        ],
        rules: { size: false, color: false }
    },

    art: {
        fields: [
            { name: "type", required: true },
            { name: "matiere", required: false },
        ],
        rules: { size: true, color: true }
    },

    voyage: {
        fields: [
            { name: "destination", required: false },
            { name: "type", required: true },
        ],
        rules: { size: false, color: false }
    },

    medical: {
        fields: [
            { name: "type", required: true },
            { name: "etat", required: true },
        ],
        rules: { size: false, color: false }
    },

    high_tech: {
        fields: [
            { name: "marque", required: true },
            { name: "modele", required: false },
            { name: "etat", required: true },
        ],
        rules: { size: false, color: false }
    },

    automoto: {
        fields: [
            { name: "marque", required: true },
            { name: "modele", required: false },
            { name: "etat", required: true },
        ],
        rules: { size: false, color: true }
    }

}

// CATEGORIES
export const CATEGORIES = {
    DIVERS: { fr: "Divers", en: "Other / Misc", es: "Varios", idx: "divers" },
    JOUETS: { fr: "Jouets", en: "Toys", es: "Juguetes", idx: "toy_car" },
    HABITS: { fr: "Habits", en: "Clothes", es: "Ropa", idx: "clothers" },
    MATERIELS_INFORMATIQUES: {
        fr: "Matériels informatiques",
        en: "Computer Equipment",
        es: "Equipos informáticos",
        idx: "materiel_info"
    },
    CAHIERS: { fr: "Cahiers", en: "Notebooks", es: "Cuadernos", idx: "notbooks" },
    SACS: { fr: "Sacs", en: "Bags", es: "Bolsos", idx: "bags" },
    LIVRES: { fr: "Livres", en: "Books", es: "Libros", idx: "books" },
    ELECTROMENAGER: {
        fr: "Électroménager",
        en: "Home Appliances",
        es: "Electrodomésticos",
        idx: "home_appliance"
    },
    TELEPHONIE: { fr: "Téléphonie", en: "Telephony", es: "Telefonía", idx: "phone" },
    SPORT: { fr: "Sport", en: "Sports Equipment", es: "Deportes", idx: "sport" },
    JEUX_VIDEO: { fr: "Jeux vidéo", en: "Video Games", es: "Videojuegos", idx: "gaming" },
    MEUBLES: { fr: "Meubles", en: "Furniture", es: "Muebles", idx: "meubles" },
    VEHICULES: { fr: "Véhicules", en: "Vehicles", es: "Vehículos", idx: "car" },
    FOURNITURES_SCOLAIRES: {
        fr: "Fournitures scolaires",
        en: "School Supplies",
        es: "Material escolar",
        idx: "fourniture"
    },
    BIJOUX: { fr: "Bijoux", en: "Jewelry", es: "Joyería", idx: "jewelry" },
    COSMETIQUES: { fr: "Cosmétiques", en: "Cosmetics", es: "Cosméticos", idx: "cosmetics" },
    ALIMENTATION: { fr: "Alimentation", en: "Food", es: "Alimentación", idx: "alimentation" },
    MUSIQUE: { fr: "Musique", en: "Music", es: "Música", idx: "music" },
    SANTE_BEAUTE: {
        fr: "Santé & Beauté",
        en: "Health & Beauty",
        es: "Salud y Belleza",
        idx: "health_beauty"
    },
    MAISON_DECORATION: {
        fr: "Maison & Décoration",
        en: "Home & Decoration",
        es: "Hogar y Decoración",
        idx: "home_deco"
    },
    BEBES: {
        fr: "Bébés & Puériculture",
        en: "Baby & Toddler",
        es: "Bebés y Puericultura",
        idx: "baby"
    },
    JARDINAGE: { fr: "Jardinage", en: "Gardening", es: "Jardinería", idx: "gardening" },
    BRICOLAGE: {
        fr: "Bricolage",
        en: "DIY & Tools",
        es: "Bricolaje y Herramientas",
        idx: "tools"
    },
    ANIMAUX: { fr: "Animaux", en: "Pet Supplies", es: "Mascotas", idx: "pets" },
    CHAUSSURES: { fr: "Chaussures", en: "Shoes", es: "Zapatos", idx: "shoes" },
    ELECTRONIQUE: {
        fr: "Électronique",
        en: "Electronics",
        es: "Electrónica",
        idx: "electronique"
    },
    FILMS_SERIES: {
        fr: "Films & Séries",
        en: "Movies & Series",
        es: "Películas y Series",
        idx: "movies"
    },
    SERVICES: { fr: "Services", en: "Services", es: "Servicios", idx: "services" },
    ART: {
        fr: "Art & Artisanat",
        en: "Art & Craft",
        es: "Arte y Artesanía",
        idx: "art"
    },
    JEWELRY: {
        fr: "Montres & Bijoux",
        en: "Watches & Jewelry",
        es: "Relojes y Joyería",
        idx: "jewelry"
    },
    VOYAGE: {
        fr: "Voyage & Loisirs",
        en: "Travel & Leisure",
        es: "Viajes y Ocio",
        idx: "travel"
    },
    MEDICAL: {
        fr: "Matériel médical",
        en: "Medical Equipment",
        es: "Equipamiento médico",
        idx: "medical"
    },
    HIGH_TECH: {
        fr: "High-Tech",
        en: "Gadgets & Innovation",
        es: "Alta tecnología",
        idx: "hightech"
    },
    AUTOMOTO: {
        fr: "Auto-moto",
        en: "Automotive",
        es: "Automóviles y Motocicletas",
        idx: "automoto"
    },
    Tous: {
        fr: "Tous",
        en: "All",
        es: "Todos",
        idx: "all_products"
    }
};

// ============================
// 🔹 Génération dynamique
// ============================

// ✅ Liste simple (pour les selects)
export const LIST_CATEGORIES_KEYS = [...Object.keys(CATEGORIES)];

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

export const categoriesConfig = Object.entries(CATEGORIES).map(
    ([key, value]) => ({
        key,                    // "JOUETS"
        name: key,              // on garde la clé stable
        idx: value.idx,         // "jouets"
        to:
            key === "Tous"
                ? "/produits/"
                : `/products/filter/?categorie_product=${key}`,
        id: value.idx || key.toLowerCase()
    })
);
// ============================
// 🔹 Fonction de traduction inverse
// ============================

export function translateCategory(value) {

    const entries = Object.entries(CATEGORIES);

    for (const [key, { fr, en, es }] of entries) {

        if (value?.toLowerCase() === fr.toLowerCase() || value?.toLowerCase() === en.toLowerCase() || value?.toLowerCase() === es.toLowerCase()) {
            return key;
        }
    }

    return null; // clé non trouvée
}

// 💰 Gestion des monnaies
export const symbolesMonnaies = { EUR: '€', USD: '$', XOF: 'XOF', CHF: 'CHF' };

export const configurationMonnaies = {
    EUR: { symbole: '€', position: 'apres', code: 'EUR', decimals: 2 },
    USD: { symbole: '$', position: 'avant', code: 'USD', decimals: 2 },
    XOF: { symbole: 'XOF', position: 'apres', code: 'XOF', decimals: 0 },
    CHF: { symbole: 'CHF', position: 'apres', code: 'CHF', decimals: 2 },
    FRANC: { symbole: "CFA XOF", position: "apres", code: 'XOF', decimals: 2 }
};

/**
 * Formate un prix selon la devise et la locale
 * @param {number} prix - montant à formater
 * @param {string} monnaie - code ISO de la devise, ex: 'EUR', 'USD', 'XOF'
 * @param {function} t - fonction de traduction
 * @param {string} locale - locale pour le formatage, ex: 'fr-FR'
 * @returns {string} - prix formaté
 */
export const formaterPrix = (prix, monnaie, t, locale) => {
    const codeMonnaie = monnaie?.toUpperCase();
    const config = configurationMonnaies[codeMonnaie];

    if (!prix || !config) {
        return t('monnaie.inconnue', 'Prix non disponible');
    }

    // Définir la locale selon la monnaie
    let localeMonnaie = locale || 'fr-FR';
    if (codeMonnaie === 'USD') localeMonnaie = 'en-US';
    if (codeMonnaie === 'CHF') localeMonnaie = 'de-CH'; // exemple pour Franc Suisse
    if (codeMonnaie === 'XOF') localeMonnaie = 'fr-FR';

    try {
        const formatter = new Intl.NumberFormat(localeMonnaie, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
        const prixFormat = formatter.format(prix);
        return config.position === 'avant'
            ? `${config.symbole}${prixFormat}`
            : `${prixFormat} ${config.symbole}`;
    } catch {
        return `${prix} ${symbolesMonnaies[codeMonnaie] || monnaie}`;
    }
};

// 👥 Authentification & création de compte
export const loginClient = async (data, dispatch, setIsLoading, navigate) => {

    setIsLoading(true);

    try {

        const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, data, {
            withCredentials: true
        });

        const { user, compte, message } = response.data || {};

        if (!user) {
            throw new Error(message || "Login invalide");
        }

        dispatch(login(user));

        if (compte) {
            dispatch(updateCompteUser(compte));
        }

        dispatch(setCurrentNav("account-home"));

        navigate("/account-home", { replace: true });

        return true;

    } catch (error) {

        console.log("LOGIN ERROR:", error);

        const message =
            error?.response?.data?.detail ||
            error?.response?.data?.errors ||
            error?.message ||
            "Erreur lors de la connexion";

        showMessage(dispatch, {
            Type: "Erreur",
            Message: message
        });

        return false;

    } finally {
        setIsLoading(false);
    }
};

export const CreateClient = async (data, setLoading, showMessage, dispatch, t) => {
    try {
        const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, data, {
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
        console.log("Erreur du client", error)

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

export const isCurrentUser = (currentUser, SelectedUser) => currentUser.id === SelectedUser.id && currentUser?.email === SelectedUser?.email;

// 🧭 Navigation
export const getTabsNavigationsItems = (currentNav, t) => {

    return [
        {
            id: '',
            label: t('home'),
            endPoint: '/',
            logo: (
                <Home
                    className="w-6 h-6 text-gray-800 "
                    strokeWidth={1}
                    fill={currentNav ? "none" : "currentColor"}
                />
            ),
        },
        {
            id: CONSTANTS?.ABOUT,
            label: t('about'),
            endPoint: '/about',
            logo: (
                <Info
                    className="w-6 h-6 text-gray-800"
                    strokeWidth={1}
                    fill={currentNav === CONSTANTS?.ABOUT ? "currentColor" : "none"}
                />
            ),
        },
        {
            id: "blogs",
            label: 'Blog',
            endPoint: '/blogs',
            logo: (
                <BookOpen
                    className="w-6 h-6 text-gray-800 "
                    strokeWidth={1}
                    fill={currentNav === "blogs" ? "currentColor" : "none"}
                />
            ),
        },
    ];
};

export const ItemsNav = ["blogs", "account-home", "all-products"];

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
    ABOUT:"about",
    TRACKING: "tracking"
}

export const API_URL_BACKEND = {
    STATUS_SUB_TRANSACTION: "update-subTransaction-status",
    STATUS_TRANSACTION: 'update-transaction-status',
    STATUS_TRANSACTION_PRODUCT:"update-productTransaction-status"
}

export const CONSTANTS = {
    ABOUT: "about",
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
    FRANC: "XOF",
    FR: "fr",
    UPDATE: 'update',
    CONFIRMED: 'confirmed',
    ACTION: 'actions',
    PROFILE: 'profile',
    PREFERENCES: 'preferences',
    PAYMENT: 'payment',
    SUBSCRIPTION: 'subscription',
    DANGER: 'danger',
    HOME : "home"
}

export const COUNTRIES = {
    FR: { name: "France", code: "FR" },
    BE: { name: "Belgique", code: "BE" },
    ES: { name: "Espagne", code: "ES" },
    IT: { name: "Italie", code: "IT" },
    DE: { name: "Allemagne", code: "DE" },
    PT: { name: "Portugal", code: "PT" },
    US: { name: "États-Unis", code: "US" },
    GB: { name: "Royaume-Uni", code: "GB" },
    CI: { name: "Côte d’Ivoire", code: "CI" },
    MA: { name: "Maroc", code: "MA" },
    SN: { name: "Sénégal", code: "SN" },
    CA: { name: "Canada", code: "CA" },
    CH: { name: "Suisse", code: "CH" },
    TN: { name: "Tunisie", code: "TN" },
    DZ: { name: "Algérie", code: "DZ" },
};

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

        const res = await api.post(API_ENDPOINTS.PAYMENTS.CREATE_CHECKOUT_SESSION, dataStringify);

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


export const getItemTotal = (prod, reference) => {
    if (!prod) return 0;

    let currency = prod.currency_price;

    if (currency === CONSTANTS.FRANC) {
        currency = CONSTANTS.XOF;
    }

    const unitPrice = convertir(
        currency,
        reference,
        prod?.price_product
    );

    const price = toNumber(unitPrice);
    const qty = toNumber(prod.quantity_sold);


    return price * qty;
};

export const toNumber = (value) => {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
};

export function convertir(de, vers, value) {
 
    const amount = toNumber(value);

    const taux = {
        EUR_USD: 1.10,
        USD_EUR: 0.91,

        EUR_XOF: 655,
        EUR_FRANC: 655,

        XOF_EUR: (1 / 655),
        FRANC_EUR: (1 / 655),

        USD_XOF: 600,
        USD_FRANC: 600,

        XOF_USD: (1 / 600),
        FRANC_USD: (1 / 600),

        EUR_EUR: 1,
        USD_USD: 1,
        XOF_XOF: 1,
        FRANC_FRANC: 1,
    };

    const key = `${de}_${vers}`;
    const rate = taux[key];

    if (!Number.isFinite(rate)) {
        return amount; // ou null selon ton besoin
    }

    return amount * rate;
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
    'name', 'categories', 'actif', 'price', 'created','available', 'operation',
    'operationDate', 'endDate',  'Date_fin_stock','status', 'view', 'actions'
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
        forward: "pending",
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

export const totalPrice = (product, referenceCurrency) => {
  const price = Number(product.price_product);
  const quantity = Number(product.quanttity_product_sold);

  if (isNaN(price) || isNaN(quantity)) return 0;

  // Déterminer le taux de conversion
  const rate = convertir(product.currency_price, referenceCurrency) || 1;

  return price * quantity * rate;
};

export const IMPORTANTS_URLS = {
    MESSAGE_APP: "https://www.abalma.fr/message-inbox",
    MESSAGE_APPS: "https://www.abalma.fr/message-inbox/"
}

export const STYLE = {

    STYLE_BTN_CATEGORIES: "rounded-lg bg-gray-50 bg-none h-12 w-10 border-0"
}

export const services = [
    {
        key: "services_text_content.livraison",
        icon: <Truck size={64} strokeWidth={1} />
    },
    {
        key: "services_text_content.paiment",
        icon: <CreditCard size={64} strokeWidth={1} />
    },
    {
        key: "services_text_content.delivero",
        icon: <PackageCheck size={64} strokeWidth={1} />
    },
    {
        key: "services_text_content.promoCode",
        icon: <Tag size={64} strokeWidth={1} />
    },
    {
        key: "services_text_content.support",
        icon: <Headphones size={64} strokeWidth={1} />
    },
    {
        key: "services_text_content.feadback",
        icon: <MessageSquareHeart size={64} strokeWidth={1} />
    },
];


export const availableColors = [
    "#000000", // noir
    "#ffffff", // blanc

    "#ff0000", // rouge
    "#00ff00", // vert
    "#0000ff", // bleu

    "#ffff00", // jaune
    "#ff00ff", // magenta
    "#00ffff", // cyan

    "#ff7f00", // orange
    "#8b00ff", // violet
    "#ff1493", // rose vif
    "#ffd700", // or

    "#808080", // gris
    "#a52a2a", // marron
    "#2f4f4f", // gris foncé

    "#1e90ff", // bleu dodger
    "#32cd32", // vert lime
    "#ff4500", // orange rouge
    "#dc143c", // crimson

    "#7cfc00", // vert gazon
    "#00fa9a", // vert menthe
    "#4169e1", // bleu royal
    "#ff69b4", // rose chaud

    "#4b0082", // indigo
    "#20b2aa", // turquoise
    "#b22222", // rouge brique
    "#f4a460", // sable

    "#000080", // bleu marine
    "#556b2f", // vert olive foncé
    "#deb887", // beige bois
    "#fa8072", // saumon
];

export const availableSizes = ["S", "M", "L", "XL"];

export const socialLinks = ["facebook", "instagram", "tiktok", "twitter"];

export const PAYEMENTMODE = ["CASH", "CARD", "MOBILE"]


/* ─────────────────────────────────────────────
   Tiny inline SVG icon components
───────────────────────────────────────────── */
function ProfileIcon({ active }) {
    const s = active ? '#7F77DD' : 'currentColor';
    return (
        <svg width="18" height="18" fill="none" stroke={s} strokeWidth="1.7" viewBox="0 0 24 24">
            <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
        </svg>
    );
}
function PrefsIcon({ active }) {
    const s = active ? '#7F77DD' : 'currentColor';
    return (
        <svg width="18" height="18" fill="none" stroke={s} strokeWidth="1.7" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
    );
}
function CardIcon({ active }) {
    const s = active ? '#7F77DD' : 'currentColor';
    return (
        <svg width="18" height="18" fill="none" stroke={s} strokeWidth="1.7" viewBox="0 0 24 24">
            <rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
        </svg>
    );
}
function StarIcon({ active }) {
    const s = active ? '#7F77DD' : 'currentColor';
    return (
        <svg width="18" height="18" fill="none" stroke={s} strokeWidth="1.7" viewBox="0 0 24 24">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    );
}
function TrashIcon({ active }) {
    const s = active ? '#E24B4A' : 'currentColor';
    return (
        <svg width="18" height="18" fill="none" stroke={s} strokeWidth="1.7" viewBox="0 0 24 24">
            <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
        </svg>
    );
}

 /* ─────────────────────────────────────────────
   Nav items for the left sidebar
───────────────────────────────────────────── */

export const NAV_ITEMS = [
        { key: 'profile', icon: ProfileIcon, labelKey: 'settingsText.profile' },
        { key: 'preferences', icon: PrefsIcon, labelKey: 'settingsText.preferences' },
        { key: 'payment', icon: CardIcon, labelKey: 'settingsText.paymentMethod' },
        { key: 'subscription', icon: StarIcon, labelKey: 'settingsText.subscription' },
        { key: 'danger', icon: TrashIcon, labelKey: 'settingsText.dangerZone' },
    ];