import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentNav } from "../slices/navigateSlice";
import api from "../services/Axios";
import Logo from "../components/LogoApp";
import { menuItems } from "../components/MenuItem";
import { addRoom } from "../slices/chatSlice";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import ScrollTop, { ButtonScrollTopDown } from "../components/ButtonScroll";
import ButtonUpdateAccountUserToPro from "../components/ButtonPro";
import { ENDPOINTS, fetchRooms } from "../utils";
import ButtonsNavigateThemecolorPayDropdownaccount from "./DropDownAccount";


// ─── Icônes SVG inline ────────────────────────────────────────────────────────

const IconMessages = ({ filled }) => filled ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M4 3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h1v2a1 1 0 0 0 1.707.707L9.414 13H15a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H4Z" clipRule="evenodd" />
        <path fillRule="evenodd" d="M8.023 17.215c.033-.03.066-.062.098-.094L10.243 15H15a3 3 0 0 0 3-3V8h2a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-1v2a1 1 0 0 1-1.707.707L14.586 18H9a1 1 0 0 1-.977-.785Z" clipRule="evenodd" />
    </svg>
) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 17h6l3 3v-3h2V9h-2M4 4h11v8H9l-3 3v-3H4V4Z" />
    </svg>
);

const IconAdd = ({ filled }) => filled ? (
    <svg width="18" height="18" viewBox="0 0 20 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4.243a1 1 0 1 0-2 0V11H7.757a1 1 0 1 0 0 2H11v3.243a1 1 0 1 0 2 0V13h3.243a1 1 0 1 0 0-2H13V7.757Z" clipRule="evenodd" />
    </svg>
) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 7.757v8.486M7.757 12h8.486M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);

const IconBlog = ({ filled }) => filled ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M14 4.182A4.136 4.136 0 0 1 16.9 3c1.087 0 2.13.425 2.899 1.182A4.01 4.01 0 0 1 21 7.037c0 1.068-.43 2.092-1.194 2.849L18.5 11.214l-5.8-5.71 1.287-1.31.012-.012Zm-2.717 2.763L6.186 12.13l2.175 2.141 5.063-5.218-2.141-2.108Zm-6.25 6.886-1.98 5.849a.992.992 0 0 0 .245 1.026 1.03 1.03 0 0 0 1.043.242L10.282 19l-5.25-5.168Zm6.954 4.01 5.096-5.186-2.218-2.183-5.063 5.218 2.185 2.15Z" clipRule="evenodd" />
    </svg>
) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.779 17.779 4.36 19.918 6.5 13.5m4.279 4.279 8.364-8.643a3.027 3.027 0 0 0-2.14-5.165 3.03 3.03 0 0 0-2.14.886L6.5 13.5m4.279 4.279L6.499 13.5m2.14 2.14 6.213-6.504M12.75 7.04 17 11.28" />
    </svg>
);

const IconDashboard = ({ filled }) => filled ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.045 3.007 12.31 3a1.965 1.965 0 0 0-1.4.585l-7.33 7.394a2 2 0 0 0 0 2.805l6.573 6.631a1.957 1.957 0 0 0 1.4.585 1.965 1.965 0 0 0 1.4-.585l7.409-7.477A2 2 0 0 0 21 11.479v-5.5a2.972 2.972 0 0 0-2.955-2.972Zm-2.452 6.438a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
    </svg>
) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.583 8.445h.01M10.86 19.71l-6.573-6.63a.993.993 0 0 1 0-1.4l7.329-7.394A.98.98 0 0 1 12.31 4l5.734.007A1.968 1.968 0 0 1 20 5.983v5.5a.992.992 0 0 1-.316.727l-7.44 7.5a.974.974 0 0 1-1.384.001Z" />
    </svg>
);

const IconSubscription = ({ filled }) => filled ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 7c0-1.10457.89543-2 2-2h16c1.1046 0 2 .89543 2 2v4c0 .5523-.4477 1-1 1s-1-.4477-1-1v-1H4v7h10c.5523 0 1 .4477 1 1s-.4477 1-1 1H4c-1.10457 0-2-.8954-2-2V7Z" />
        <path d="M5 14c0-.5523.44772-1 1-1h2c.55228 0 1 .4477 1 1s-.44772 1-1 1H6c-.55228 0-1-.4477-1-1Zm5 0c0-.5523.4477-1 1-1h4c.5523 0 1 .4477 1 1s-.4477 1-1 1h-4c-.5523 0-1-.4477-1-1Zm9-1c.5523 0 1 .4477 1 1v1h1c.5523 0 1 .4477 1 1s-.4477 1-1 1h-1v1c0 .5523-.4477 1-1 1s-1-.4477-1-1v-1h-1c-.5523 0-1-.4477-1-1s.4477-1 1-1h1v-1c0-.5523.4477-1 1-1Z" />
    </svg>
) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 14h2m3 0h4m2 2h2m0 0h2m-2 0v2m0-2v-2m-5 4H4c-.55228 0-1-.4477-1-1V7c0-.55228.44772-1 1-1h16c.5523 0 1 .44772 1 1v4M3 10h18" />
    </svg>
);

const IconHelp = ({ filled }) => filled ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M4.857 3A1.857 1.857 0 0 0 3 4.857v4.286C3 10.169 3.831 11 4.857 11h4.286A1.857 1.857 0 0 0 11 9.143V4.857A1.857 1.857 0 0 0 9.143 3H4.857Zm10 0A1.857 1.857 0 0 0 13 4.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 21 9.143V4.857A1.857 1.857 0 0 0 19.143 3h-4.286Zm-10 10A1.857 1.857 0 0 0 3 14.857v4.286C3 20.169 3.831 21 4.857 21h4.286A1.857 1.857 0 0 0 11 19.143v-4.286A1.857 1.857 0 0 0 9.143 13H4.857ZM18 14a1 1 0 1 0-2 0v2h-2a1 1 0 1 0 0 2h2v2a1 1 0 1 0 2 0v-2h2a1 1 0 1 0 0-2h-2v-2Z" clipRule="evenodd" />
    </svg>
) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.857 4h4.286c.473 0 .857.384.857.857v4.286a.857.857 0 0 1-.857.857H4.857A.857.857 0 0 1 4 9.143V4.857C4 4.384 4.384 4 4.857 4Zm10 0h4.286c.473 0 .857.384.857.857v4.286a.857.857 0 0 1-.857.857h-4.286A.857.857 0 0 1 14 9.143V4.857c0-.473.384-.857.857-.857Zm-10 10h4.286c.473 0 .857.384.857.857v4.286a.857.857 0 0 1-.857.857H4.857A.857.857 0 0 1 4 19.143v-4.286c0-.473.384-.857.857-.857Z" />
    </svg>
);

const IconUser = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0a8.949 8.949 0 0 0 4.951-1.488A3.987 3.987 0 0 0 13 16h-2a3.987 3.987 0 0 0-3.951 3.512A8.948 8.948 0 0 0 12 21Zm3-11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
);

const IconMenu = () => (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
        <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z" />
    </svg>
);

// ─── Élément de navigation principal ─────────────────────────────────────────
const NavItem = ({ icon, label, isActive, onClick, badge }) => (
    <button
        type="button"
        className={`vnav-item ${isActive ? "active" : ""}`}
        onClick={onClick}
    >
        <span className="vnav-icon">{icon}</span>
        <span style={{ flex: 1 }}>{label}</span>
        {badge != null && <span className="vnav-badge">{badge}</span>}
    </button>
);

// ─── Composant principal ──────────────────────────────────────────────────────
const VerticalNavbar = ({ children }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const sidebarRef = useRef(null);

    const currentNav = useSelector((state) => state.navigate.currentNav);
    const allRooms = useSelector((state) => state.chat.currentChats);
    const currentUser = useSelector((state) => state.auth.user);

    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const isActive = (endpoint) => currentNav === endpoint;

    const go = (endpoint) => {
        navigate(`/${endpoint}`);
        dispatch(setCurrentNav(endpoint));
        setSidebarOpen(false);
    };

    const currentUserImage = currentUser?.image || currentUser?.photo_url;

    // ── Fetch rooms ──
    useEffect(() => {
        if (!currentUser) { navigate("/login", { replace: true }); return; }

        const loadRooms = async () => {
            try {
                const { data } = await api.get("/allRoomes/");
                const rooms = (data || []).filter(
                    (room) =>
                        (room?.current_receiver === currentUser?.id && room?.messages?.length > 0) ||
                        room?.current_owner === currentUser?.id
                );
                rooms.forEach((room) => dispatch(addRoom(room)));
            } catch (err) {
                console.error("Erreur rooms :", err.response?.data || err);
            }
        };

        loadRooms();
        fetchRooms(currentUser, dispatch, addRoom);
    }, [currentUser, dispatch, navigate]);

    // ── Fermeture sidebar au clic dehors ──
    useEffect(() => {
        if (!isSidebarOpen) return;
        const handler = (e) => {
            if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
                setSidebarOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [isSidebarOpen]);

    // ── Rendu ──
    return (
        <>
            <div className="vnav">

                {/* Bouton toggle mobile */}
                <button
                    type="button"
                    className="vnav-toggle"
                    aria-label="Ouvrir le menu"
                    onClick={() => setSidebarOpen((prev) => !prev)}
                >
                    <IconMenu />
                </button>

                {/* Overlay mobile */}
                {isSidebarOpen && (
                    <div className="vnav-overlay" onClick={() => setSidebarOpen(false)} />
                )}

                {/* ── Sidebar ── */}
                <aside
                    ref={sidebarRef}
                    className={`vnav-sidebar ${isSidebarOpen ? "" : "closed"}`}
                    aria-label="Navigation principale"
                >
                    {/* Logo */}
                    <div className="vnav-logo-zone">
                        <Logo />
                    </div>

                    {/* Corps scrollable */}
                    <div className="vnav-body scrollbor_hidden">

                        {/* Bouton utilisateur */}
                        <button
                            type="button"
                            className={`vnav-user-btn ${isActive(ENDPOINTS.ACCOUNT_HOME) ? "active" : ""}`}
                            onClick={() => go(ENDPOINTS.ACCOUNT_HOME)}
                        >
                            <div style={{ position: "relative", flexShrink: 0 }}>
                                {currentUserImage ? (
                                    <img src={currentUserImage} alt="avatar" title={currentUser?.email} className="vnav-avatar" />
                                ) : (
                                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>
                                        <IconUser />
                                    </div>
                                )}
                                {currentUser?.is_connected && <span className="vnav-online-dot" />}
                            </div>
                            <div style={{ minWidth: 0, flex: 1 }}>
                                <p className="vnav-user-name" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {currentUser?.nom || "Utilisateur"}
                                </p>
                                <p className="vnav-user-email" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {currentUser?.email}
                                </p>
                            </div>
                            {currentUser?.is_pro && <span className="vnav-pro-badge">Pro</span>}
                        </button>

                        {/* Navigation principale */}
                        <div className="vnav-section-label">Navigation</div>

                        <NavItem
                            icon={<IconMessages filled={isActive(ENDPOINTS.MESSAGE_INBOX)} />}
                            label={t("AccountPage.messages")}
                            isActive={isActive(ENDPOINTS.MESSAGE_INBOX)}
                            onClick={() => go(ENDPOINTS.MESSAGE_INBOX)}
                            badge={allRooms?.length || null}
                        />
                        <NavItem
                            icon={<IconAdd filled={isActive(ENDPOINTS.ADD_PRODUCT)} />}
                            label={t("AccountPage.create")}
                            isActive={isActive(ENDPOINTS.ADD_PRODUCT)}
                            onClick={() => go(ENDPOINTS.ADD_PRODUCT)}
                        />
                        <NavItem
                            icon={<IconBlog filled={isActive(ENDPOINTS.USER_BLOGS)} />}
                            label={t("blogs")}
                            isActive={isActive(ENDPOINTS.USER_BLOGS)}
                            onClick={() => go(ENDPOINTS.USER_BLOGS)}
                        />
                        <NavItem
                            icon={<IconDashboard filled={isActive(ENDPOINTS.DASHBOARD)} />}
                            label={t("activity")}
                            isActive={isActive(ENDPOINTS.DASHBOARD)}
                            onClick={() => go(ENDPOINTS.DASHBOARD)}
                        />

                        <div className="vnav-divider" />

                        {/* Bouton Pro */}
                        <ButtonUpdateAccountUserToPro />

                        {/* Catégories */}
                        <div className="vnav-section-label">Catégories</div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 3 , padding:2}}>
                            {menuItems(t).map(({ name, to, photo, id }, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    role="tab"
                                    aria-selected={currentNav === id}
                                    className={`vnav-cat-item ${currentNav === id ? "active" : ""}`}
                                    onClick={() => to && go(id)}
                                >
                                    {photo && <span className="vnav-cat-icon">{photo}</span>}
                                    <span>{name}</span>
                                </button>
                            ))}
                        </div>

                        <div className="vnav-divider" />

                        {/* Abonnement & Aide */}
                        <NavItem
                            icon={<IconSubscription filled={isActive(ENDPOINTS.SUBSCRIPTION)} />}
                            label={t("Subscriptionb2b")}
                            isActive={isActive(ENDPOINTS.SUBSCRIPTION)}
                            onClick={() => go(ENDPOINTS.SUBSCRIPTION)}
                        />
                        <NavItem
                            icon={<IconHelp filled={isActive(ENDPOINTS.HELP)} />}
                            label={`${t("AccountPage.help")} – Support`}
                            isActive={isActive(ENDPOINTS.HELP)}
                            onClick={() => go(ENDPOINTS.HELP)}
                        />
                    </div>
                </aside>

                {/* ── Zone de contenu ── */}
                <div className="bg-gray-900 overflow-y-hidden">

                    <div className="w-full flex start-end">
                        <ButtonsNavigateThemecolorPayDropdownaccount />
                    </div>

                    <main className="vnav-content">

                        <section
                            id={`${currentNav}-tab`}
                            role="tabpanel"
                            aria-labelledby={`${currentNav}-tab-button`}
                            style={{ padding: "0px 0 40px" }}
                        >
                            <ScrollTop />
                            <ButtonScrollTopDown>
                                <div style={{ padding: "0px 0" }}>
                                    {children}
                                </div>
                            </ButtonScrollTopDown>
                        </section>

                    </main>

                </div>

            </div>
        </>
    );
};

export default VerticalNavbar;