﻿import api from "./services/Axios";
import { updateTheme } from "./slices/navigateSlice";

//covertion de la date de la transaction
export const convertDate = (dat) => {

    const date = new Date(dat);

    const formatted = date.toLocaleString("fr-FR", {

        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });

    return formatted
}

export const  LIST_CATEGORY=[

    { idx: "jouets", filter: "JOUET" }, { idx: "sacs", filter: "SACS" }, { idx: "habits" , filter:"HABITS"},

    { idx: "livres", filter: "LIVRES" }, { idx: "Jeux_video", filter: "JEUX_VIDEO" }, { idx: "Meubles", filter: "MEUBLES" }, { idx: "Vehicules" , filter:"VEHICULES"},

    { idx: "Fournitures_scolaires", filter: "FOURNISSEURS_SCOLAIRES" }, { idx: "divers", filter: "DIVERS" }, { idx: "telephones", filter: "TELEPHONIE" }
]

export const numberStarsViews = (numberStars_) => {

    const numberStars = parseInt(numberStars_, 10);

    if (numberStars >= 40) return 4;

    if (numberStars >= 30) return 4;

    if (numberStars >= 10) return 3;

    if (numberStars >= 5) return 2;

    if (numberStars === 1) return 1;

    return 0;
};



export const applyTheme = (newTheme, dispatch) => {

    document.body.classList.remove('dark', 'light');

    document.body.classList.add(newTheme);

    localStorage.setItem('theme', newTheme);

    dispatch(updateTheme(newTheme));

    const metaThemeColor = document.querySelector("meta[name=theme-color]");

    if (metaThemeColor) {

        metaThemeColor.setAttribute('content', newTheme === 'dark' ? '#000000' : '#ffffff');
    }
}


export const isAlreadyFollowed = async (clientId, setIsFollow, setIsLoading) => {


    try {

        const response = await api.get(`/clients/${clientId}/alreadyFollow/`, {

            withCredentials: true, // pour envoyer les cookies de session

            headers: {

                'Content-Type': 'application/json',
            },
        });

        setIsFollow(response.data)

        console.log('Already followed :', response.data || response.data?.message || 'Succès');

    } catch (error) {

        const message =

            error.response?.data?.error ||

            error.message ||

            'Erreur inconnue';

        console.error('Erreur lors de l’enregistrement de la vue :', message);

    } finally {

        setIsLoading(false)
    }
};

export const recordView = async (clientId) => {

    try {

        const response = await api.post(`/clients/${clientId}/follow/`, {

            withCredentials: true, // pour envoyer les cookies de session

            headers: {

                'Content-Type': 'application/json',
            },
        });

        console.log('Vue enregistrée :', response.data || response.data?.message || 'Succès');

    } catch (error) {

        const message =

            error.response?.data?.error ||

            error.message ||

            'Erreur inconnue';

        console.error('Erreur lors de l’enregistrement de la vue :', message);
    }
};

export const productViews = (dataProduct, setProductNbViews) => {


    // Appelle l'API => déclenche record_view automatiquement côté backend
    if (dataProduct?.id !== undefined) {

        try {

            api.get(`/products_details/${dataProduct?.id}/`)

                .then(response => {

                    setProductNbViews(response.data?.total_views);
                })

                .catch(error => {

                    console.error('Erreur de chargement du produit:', error);
                });

        } catch {

        }
    }

}

export function removeAccents(str) {

    if (!str) return "Tous"

    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

const ListItemsFilterProduct = {
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