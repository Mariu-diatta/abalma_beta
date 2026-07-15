/**
 * apiEndpoints.js
 * -----------------------------------------------------------------------
 * Point d'entrée UNIQUE pour toutes les routes de l'API backend Abalma.
 *
 * ⚠️ Objectif : centraliser les chemins d'appel (aucune valeur d'URL n'a
 * été modifiée pendant ce refactor — chaque chemin ci-dessous est copié
 * strictement à l'identique depuis l'endroit où il était utilisé avant).
 *
 * Utilisation :
 *   import { API_ENDPOINTS } from "services/apiEndpoints";
 *   api.get(API_ENDPOINTS.PRODUCTS.LIST)
 *   api.get(API_ENDPOINTS.CLIENTS.DETAIL(id))
 *
 * Regroupement par domaine métier pour s'y retrouver facilement :
 * AUTH, CLIENTS (profil / social), PRODUCTS, ADVERTISEMENTS, BLOG,
 * CHAT (rooms), TESTIMONIALS, TRANSACTIONS & PAYMENTS, DELIVERY,
 * SUPPLIER (fournisseur / pro), HELP, MISC.
 * -----------------------------------------------------------------------
 */

export const API_ENDPOINTS = {

    // ---------------------------------------------------------------
    // AUTH
    // ---------------------------------------------------------------
    AUTH: {
        SET_CSRF: 'set-csrf/',
        ME: '/me/',
        LOGIN: 'login/',
        REGISTER: 'inscription/',
        LOGOUT: `logout/`,
        GOOGLE_LOGIN: 'auth/google-login/',
        // Endpoint historique, laissé commenté / inutilisé dans le code source d'origine :
        FACEBOOK_LOGIN: 'https://ton-backend.com/auth/facebook-login/',
        FORGET_PASSWORD_REQUEST: '/forget_password/request/',
        FORGET_PASSWORD_RESET: (uidb64, token) => `/forget_password/reset/${uidb64}/${token}/`,
    },

    // ---------------------------------------------------------------
    // CLIENTS / PROFIL / SOCIAL (follow, profil public, etc.)
    // ---------------------------------------------------------------
    CLIENTS: {
        // ⚠️ Deux variantes existaient déjà dans le code (avec / sans slash initial),
        // conservées telles quelles pour ne rien changer au comportement réseau.
        DETAIL_SLASH: (userId) => `/clients/${userId}/`,
        DETAIL: (id) => `clients/${id}/`,
        UPDATE: (id) => `clients/${id}/`,
        OTHERS: 'clients/othersClients/',
        BECOME_PRO: 'clients/become_pro/',
        DELETE_ACCOUNT: 'clients/delete-account/',
        UPDATE_COUNTRY: '/clients/update-country/',
        ALREADY_FOLLOW: (clientId) => `/clients/${clientId}/alreadyFollow/`,
        FOLLOW: (clientId) => `/clients/${clientId}/follow/`,
        UNFOLLOW: (clientId) => `/clients/${clientId}/unfollow/`,
    },

    // ---------------------------------------------------------------
    // PRODUITS (marketplace)
    // ---------------------------------------------------------------
    PRODUCTS: {
        CREATE: '/produits/',
        DEFAULT_LIST: 'produits/',
        DELETE: (id) => `produits/${id}/`,
        FILTER: 'products/filter/',
        FILTER_SEARCH: (query) => `products/filter/?search=${query}`,
        // ⚠️ Typo présente dans le code d'origine ("fimter" au lieu de "filter"),
        // conservée à l'identique pour ne pas changer le comportement.
        HEADER_SEARCH: (query) => `product/fimter?search=${query}`,
        LIST: 'product/list/',
        DETAILS: (id) => `products_details/${id}/`,
        DETAILS_SLASH: (id) => `/products_details/${id}/`,
        CATEGORIES_CREATE: '/categories/',
        OWNER_LIST: 'owner/product',
        OWNER_DETAIL: (id) => `owner/product/${id}/`,
        SUPPLIER_TRANSACTIONS: 'product/fournisseur/transaction/',
    },

    // ---------------------------------------------------------------
    // ANNONCES / PUBLICITÉS
    // ---------------------------------------------------------------
    ADVERTISEMENTS: {
        LIST: '/advertisements/',
        CREATE: '/advertisements/',
        OWNER_LIST: '/advertisemenOwnerUser/',
        DETAIL: (id) => `/advertisements/${id}/`,
    },

    // ---------------------------------------------------------------
    // BLOG (contenu / réseau social)
    // ---------------------------------------------------------------
    BLOG: {
        LIST: 'blogs/',
        CREATE: 'blogs/',
        SEARCH: (query) => `blogs/?search=${query}`,
        OWNER_LIST: 'byOwnerUser/',
        DELETE: (id) => `/blogs/${id}/`,
    },

    // ---------------------------------------------------------------
    // CHAT / MESSAGERIE (rooms)
    // ---------------------------------------------------------------
    CHAT: {
        ALL_ROOMS: '/allRooms/',
        CREATE_ROOM: 'rooms/',
        DELETE_ROOM: (pk) => `/rooms/${pk}/`,
        AI_ANALYSE_LIST: 'ai-analyse-chat/',
        AI_ANALYSE_DETAIL: (id) => `ai-analyse-chat/${id}/`,
        AI_ANALYSE_DELETE: (id) => `ai-analyse-chat/${id}/`,
    },

    // ---------------------------------------------------------------
    // TÉMOIGNAGES / AVIS
    // ---------------------------------------------------------------
    TESTIMONIALS: {
        PUBLIC_LIST: '/content/testmony/',
        HELP_LIST: 'content/testmony/',
        CREATE: '/content/testmony/',
        OWNER_LIST: 'user-owner/testmony/',
        DELETE: (id) => `user-owner/testmony/${id}/`,
    },

    // ---------------------------------------------------------------
    // TRANSACTIONS / PAIEMENTS / ABONNEMENTS
    // ---------------------------------------------------------------
    TRANSACTIONS: {
        PRODUCTS_TRANSACTIONS: 'transactions/products/',
        SUB_TRANSACTION: 'sub/transaction/',
        ITEM_PRODUCTS_TRANSACTION: 'item/products/transaction/',
        CASH_TRANSACTION_LIST: '/cashtransaction',
        CASH_TRANSACTION_SEARCH: (query) => `/cashtransaction/${encodeURIComponent(query)}/`,
        CREATE_PRODUCT_TRANSACTION: 'creat/transactions/products/',
        GENERIC_DELETE: (baseUrl, pk) => `${baseUrl}/${pk}/`,
    },

    PAYMENTS: {
        CASH: 'payments/cash/',
        CREATE_PAYMENT: 'create-payment/',
        CREATE_CHECKOUT_SESSION: '/create-checkout-session/',
        CREATE_CHECKOUT_SESSION_SUBSCRIPTION: '/create-checkout-session-subscription/',
        PAYMENT_STATUS: (sessionId) => `/payment-status?session_id=${sessionId}`,
        PAYPAL_VALIDATE: '/api/paypal/validate/',
        CANCEL_SUBSCRIPTION: 'cancel-subscription/',
        CARD_PAID: '/cardPaid/',
    },

    // ---------------------------------------------------------------
    // LIVRAISON
    // ---------------------------------------------------------------
    DELIVERY: {
        ADDRESS: 'delivery-address/',
        TRACKING: (commandeId) => `commande/${commandeId}/tracking/`,
        COMMANDES: 'commandes/',
    },

    // ---------------------------------------------------------------
    // FOURNISSEUR / COMPTE PRO
    // ---------------------------------------------------------------
    SUPPLIER: {
        CREATE: 'fournisseurs/',
        VALIDATION: 'fournisseurs/validation-fournisseur/',
        VALIDATION_CODE: (code) => `codes_validation/${code}/validation-fournisseur/`,
        CREATE_PROMO: '/seller/create-promo/',
    },

    // ---------------------------------------------------------------
    // COMPTE / PARAMÈTRES
    // ---------------------------------------------------------------
    ACCOUNT: {
        UPDATE_THEME: (compteId) => `/comptes/${compteId}/update_theme/`,
    },

    // ---------------------------------------------------------------
    // AIDE / SUPPORT
    // ---------------------------------------------------------------
    HELP: {
        SEND_MESSAGE: 'help/messages/',
    },
};

export default API_ENDPOINTS;
