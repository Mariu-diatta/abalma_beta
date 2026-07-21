import React, { useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Home, Search, PlusSquare, MessageCircle, User, LogOut } from "lucide-react";
import { setCurrentNav } from "../slices/navigateSlice";
import { logout } from "../slices/authSlice";
import { clearCart } from "../slices/cartSlice";
import { cleanAllMessageNotif, clearRooms } from "../slices/chatSlice";
import { ENDPOINTS, getMediaUrl, getTabsNavigationsItems } from "../utils";
import api from "../services/Axios";
import { API_ENDPOINTS } from "../services/apiEndpoints";
import { showMessage } from "../components/AlertMessage";

import ThemeToggle from "./Theme";
import LanguageDropdown from "./Langages";
import PayBack from "../components/BacketButtonPay";
import LogIn from "../pages/Login";
import RegisterForm from "../pages/Register";
import { ButtonNavigate } from "../components/Button";

// ─────────────────────────────────────────────────────────────────────────
// Bottom nav mobile façon Instagram : 5 icônes fixes, toujours visibles.
// Remplace l'ancien menu déroulant login/register qui se trouvait ici.
// ─────────────────────────────────────────────────────────────────────────

const isTrustedUser = (user) =>
    !!(user?.is_pro || user?.is_fournisseur || user?.fournisseur || user?.is_verified);

const NavButton = ({ onClick, active, label, children, badge }) => (
    <button
        type="button"
        onClick={onClick}
        aria-label={label}
        aria-current={active ? "page" : undefined}
        className="ig-bottom-nav__item"
        style={{ color: active ? "var(--color-primary, #0095F6)" : "var(--color-text, #262626)" }}
    >
        <span className="relative inline-flex items-center justify-center">
            {children}
            {badge > 0 && (
                <span className="ig-bottom-nav__badge">
                    {badge > 9 ? "9+" : badge}
                </span>
            )}
        </span>
    </button>
);

const BottomNavMobile = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const currentNav = useSelector((state) => state.navigate.currentNav);
    const currentUser = useSelector((state) => state.auth.user);
    const unreadCount = useSelector((state) => state.chat.messageNotif?.length || 0);

    const [authMode, setAuthMode] = useState(null); // null | 'login' | 'register'

    const go = (endpoint) => {
        dispatch(setCurrentNav(endpoint));
        navigate(`/${endpoint}`);
    };

    // Les onglets Recherche / Créer / Messages / Profil mènent tous à des
    // routes protégées côté routeur : pour un visiteur non connecté, on
    // ouvre la fenêtre de connexion plutôt que de le laisser être renvoyé
    // silencieusement vers l'accueil.
    const goProtected = (endpoint) => {
        if (!currentUser) {
            setAuthMode("login");
            return;
        }
        go(endpoint);
    };

    const isHome = !currentNav;
    const isSearch = currentNav === ENDPOINTS.ACCOUNT_HOME || currentNav === "all-products";
    const isAdd = currentNav === ENDPOINTS.ADD_PRODUCT;
    const isChat = currentNav === ENDPOINTS.MESSAGE_INBOX;
    const isProfile = currentNav === ENDPOINTS.USER_PROFIL;

    const avatarSrc = currentUser?.image || currentUser?.photo_url;
    const trusted = isTrustedUser(currentUser);


    return (
        <>

            <nav
                className="flex ig-bottom-nav md:hidden"
                role="navigation"
                aria-label={t("bottom_nav_label") || "Navigation principale"}
            >
                <NavButton onClick={() => go("")} active={isHome} label={t("home")}>
                    <Home size={24} strokeWidth={isHome ? 1.5 : 1} fill={isHome ? "currentColor" : "none"} />
                </NavButton>

                <NavButton onClick={() => goProtected(ENDPOINTS.ACCOUNT_HOME)} active={isSearch} label={t("search") || "Rechercher"}>
                    <Search size={24} strokeWidth={isSearch ? 1.5 : 1} />
                </NavButton>

                {/* Bouton central "créer une annonce", mis en avant */}
                <button
                    type="button"
                    onClick={() => goProtected(ENDPOINTS.ADD_PRODUCT)}
                    aria-label={t("AccountPage.create") || "Créer une annonce"}
                    className="ig-bottom-nav__add"
                >
                    <PlusSquare size={22} strokeWidth={isAdd ? 2.4 : 2} />
                </button>

                <NavButton
                    onClick={() => goProtected(ENDPOINTS.MESSAGE_INBOX)}
                    active={isChat}
                    label={t("AccountPage.messages") || "Messages"}
                    badge={unreadCount}
                >
                    <MessageCircle size={24} strokeWidth={isChat ? 2.25 : 1.6} fill={isChat ? "currentColor" : "none"} />
                </NavButton>

                <button
                    type="button"
                    onClick={() => (currentUser ? go(ENDPOINTS.USER_PROFIL) : setAuthMode("login"))}
                    aria-label={t("profil") || "Profil"}
                    className="ig-bottom-nav__item"
                >
                    {currentUser && avatarSrc ? (
                        <img
                            src={getMediaUrl(avatarSrc)}
                            alt=""
                            className={`w-[26px] h-[26px] rounded-full object-cover${trusted ? " story-ring--trusted" : ""}`}
                            style={{
                                outline: isProfile ? "2px solid var(--color-primary, #0095F6)" : "none",
                                outlineOffset: 1,
                            }}
                        />
                    ) : (
                        <User
                            size={24}
                            strokeWidth={isProfile ? 2.25 : 1.6}
                            style={{ color: isProfile ? "var(--color-primary, #0095F6)" : "var(--color-text, #262626)" }}
                        />
                    )}
                </button>
            </nav>

            {/* Fenêtre de connexion / inscription, ouverte à la demande depuis n'importe quel onglet protégé */}
            {authMode === "login" && (
                <LogIn
                    onClose={() => setAuthMode(null)}
                    callbackState={() => setAuthMode("register")}
                />
            )}
            {authMode === "register" && (
                <RegisterForm
                    onClose={() => setAuthMode(null)}
                    callbackState={() => setAuthMode("login")}
                />
            )}
        </>
    );
};

export default BottomNavMobile;

// ─────────────────────────────────────────────────────────────────────────
// Panneau "Plus" (☰) : accessible depuis le header mobile, regroupe ce qui
// ne rentre pas dans les 5 icônes de la bottom nav (thème, langue, panier,
// connexion / inscription pour les visiteurs).
// ─────────────────────────────────────────────────────────────────────────
const MoreSheetMobile = ({ open, onClose }) => {

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currentUser = useSelector((state) => state.auth.user);

    if (!open) return null;

    const handleLogout = async () => {
        if (!window.confirm(t("logout"))) return;

        dispatch(clearCart());
        dispatch(clearRooms());
        dispatch(cleanAllMessageNotif());
        dispatch(logout());
        dispatch(setCurrentNav(ENDPOINTS?.HOME));

        onClose();
        navigate('/', { replace: true });

        try {
            await api.get(API_ENDPOINTS.AUTH.LOGOUT);
        } catch (error) {
            showMessage(dispatch, {
                Type: "Erreur",
                Message: error?.message || error?.request?.response,
            });
        }
    };

    return (
        <div
            className="sm:hidden fixed inset-0 z-[9990] flex items-end justify-center bg-black/30 pb-[6dvh]"
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="w-full  rounded-t-2xl p-4 pb-6 shadow-2xl"
                style={{ backgroundColor: "var(--color-surface, #fff)" }}
            >
                <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-gray-300" />

                {currentUser ? (
                    /* Utilisateur connecté : se déconnecter, jamais connexion/inscription. */
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="mb-3 flex w-full items-center justify-center gap-1.5 rounded-full border py-2 text-sm font-medium text-red-600"
                        style={{ borderColor: "var(--color-border, #dbdbdb)" }}
                    >
                        <LogOut size={15} strokeWidth={2} />
                        {t("logOut")}
                    </button>
                ) : (
                    <MoreSheetLoginRegister onClose={onClose} />
                )}

                <div className="flex items-center justify-between gap-3 py-2">
                    <span className="text-sm" style={{ color: "var(--color-text, #262626)" }}>
                        {t("your_basket")}
                    </span>
                    <PayBack />
                </div>

                <div className="flex items-center justify-between gap-3 py-2">
                    <span className="text-sm" style={{ color: "var(--color-text, #262626)" }}>
                        {t("choose_language")}
                    </span>
                    <LanguageDropdown />
                </div>

                <div className="hidden flex items-center justify-between gap-3 py-2">
                    <span className="text-sm" style={{ color: "var(--color-text, #262626)" }}>
                        {t("theme") || "Thème"}
                    </span>
                    <ThemeToggle />
                </div>
            </div>
        </div>
    );
};

const MoreSheetLoginRegister = ({ onClose }) => {
    const { t } = useTranslation();
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const currentNav = useSelector(state => state.navigate.currentNav);

    return (
        <div className="flex flex-col items-center gap-2 pb-3 mb-2 border-b" style={{ borderColor: "var(--color-border, #dbdbdb)" }}>

            <div className="flex items-center gap-2 pb-3 mb-2 border-b w-full">
                <button
                    type="button"
                    onClick={() => { setShowLogin(true); setShowRegister(false); }}
                    className="flex-1 rounded-full border py-2 text-sm font-medium"
                    style={{ borderColor: "var(--color-border, #dbdbdb)", color: "var(--color-text, #262626)" }}
                >
                    {t(ENDPOINTS.LOGIN)}
                </button>
                <button
                    type="button"
                    onClick={() => { setShowRegister(true); setShowLogin(false); }}
                    className="flex-1 rounded-full py-2 text-sm font-medium text-white"
                    style={{ backgroundColor: "var(--color-primary, #0095F6)" }}
                >
                    {t(ENDPOINTS.REGISTER)}
                </button>
            </div>

            <ButtonNavigate tabs={getTabsNavigationsItems(currentNav, t)} />

            {showLogin && (
                <LogIn
                    onClose={() => { setShowLogin(false); onClose(); }}
                    callbackState={() => { setShowLogin(false); setShowRegister(true); }}
                />
            )}
            {showRegister && (
                <RegisterForm
                    onClose={() => { setShowRegister(false); onClose(); }}
                    callbackState={() => { setShowRegister(false); setShowLogin(true); }}
                />
            )}
        </div>
    );
};

export { MoreSheetMobile };

//button navigate for Mobile: connected dashbord (conservé pour compatibilité, non affiché par défaut)
export const NavigateLoginButtons = () => {

    const currentNav = useSelector(state => state.navigate.currentNav);

    if (ENDPOINTS?.MESSAGE_INBOX === currentNav) return null;

    return (

        <div
            style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text)" }}
            className=" md:hidden flex items-center justify-between gap-3 w-full bg-white absolute bottom-0 py-2 px-2"
        >
            <ThemeToggle/>

            <PayBack/>

        </div>
    );
};
