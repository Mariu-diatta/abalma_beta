import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

import { setCurrentNav } from "../slices/navigateSlice";
import { addRoom } from "../slices/chatSlice";
import Logo from "../components/LogoApp";
import { menuItems } from "../components/MenuItem";
import ScrollTop, { ButtonScrollTopDown } from "../components/ButtonScroll";
import ButtonUpdateAccountUserToPro from "../components/ButtonPro";
import AttentionAlertMessage from "../components/AlertMessage";
import ButtonsNavigateThemecolorPayDropdownaccount from "./DropDownAccount";
import { ENDPOINTS, fetchRooms, getMediaUrl } from "../utils";

/* ─── Constantes ─────────────────────────────────────────────────────── */
const COLLAPSE_STORAGE_KEY = "vnav_collapsed";
const COLLAPSED_WIDTH = 72;
const BG = "#f8fafc";

/* ─── Icônes (inchangées) ────────────────────────────────────────────── */
const svgProps = { width: 30, height: 30, viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg" };
const strokeProps = { stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5 };

const IconMessages = ({ filled }) => filled ? (
    <svg {...svgProps} fill="currentColor"><path fillRule="evenodd" d="M4 3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h1v2a1 1 0 0 0 1.707.707L9.414 13H15a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H4Z" clipRule="evenodd" /><path fillRule="evenodd" d="M8.023 17.215c.033-.03.066-.062.098-.094L10.243 15H15a3 3 0 0 0 3-3V8h2a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-1v2a1 1 0 0 1-1.707.707L14.586 18H9a1 1 0 0 1-.977-.785Z" clipRule="evenodd" /></svg>
) : (
    <svg {...svgProps} fill="none"><path {...strokeProps} d="M9 17h6l3 3v-3h2V9h-2M4 4h11v8H9l-3 3v-3H4V4Z" /></svg>
);
const IconAdd = ({ filled }) => filled ? (
    <svg {...svgProps} fill="currentColor"><path fillRule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4.243a1 1 0 1 0-2 0V11H7.757a1 1 0 1 0 0 2H11v3.243a1 1 0 1 0 2 0V13h3.243a1 1 0 1 0 0-2H13V7.757Z" clipRule="evenodd" /></svg>
) : (
    <svg {...svgProps} fill="none"><path {...strokeProps} d="M12 7.757v8.486M7.757 12h8.486M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
);
const IconBlog = ({ filled }) => filled ? (
    <svg {...svgProps} fill="currentColor"><path fillRule="evenodd" d="M14 4.182A4.136 4.136 0 0 1 16.9 3c1.087 0 2.13.425 2.899 1.182A4.01 4.01 0 0 1 21 7.037c0 1.068-.43 2.092-1.194 2.849L18.5 11.214l-5.8-5.71 1.287-1.31.012-.012Zm-2.717 2.763L6.186 12.13l2.175 2.141 5.063-5.218-2.141-2.108Zm-6.25 6.886-1.98 5.849a.992.992 0 0 0 .245 1.026 1.03 1.03 0 0 0 1.043.242L10.282 19l-5.25-5.168Zm6.954 4.01 5.096-5.186-2.218-2.183-5.063 5.218 2.185 2.15Z" clipRule="evenodd" /></svg>
) : (
    <svg {...svgProps} fill="none"><path {...strokeProps} d="M10.779 17.779 4.36 19.918 6.5 13.5m4.279 4.279 8.364-8.643a3.027 3.027 0 0 0-2.14-5.165 3.03 3.03 0 0 0-2.14.886L6.5 13.5m4.279 4.279L6.499 13.5m2.14 2.14 6.213-6.504M12.75 7.04 17 11.28" /></svg>
);
const IconDashboard = ({ filled }) => filled ? (
    <svg {...svgProps} fill="currentColor"><path d="M18.045 3.007 12.31 3a1.965 1.965 0 0 0-1.4.585l-7.33 7.394a2 2 0 0 0 0 2.805l6.573 6.631a1.957 1.957 0 0 0 1.4.585 1.965 1.965 0 0 0 1.4-.585l7.409-7.477A2 2 0 0 0 21 11.479v-5.5a2.972 2.972 0 0 0-2.955-2.972Zm-2.452 6.438a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" /></svg>
) : (
    <svg {...svgProps} fill="none"><path {...strokeProps} d="M15.583 8.445h.01M10.86 19.71l-6.573-6.63a.993.993 0 0 1 0-1.4l7.329-7.394A.98.98 0 0 1 12.31 4l5.734.007A1.968 1.968 0 0 1 20 5.983v5.5a.992.992 0 0 1-.316.727l-7.44 7.5a.974.974 0 0 1-1.384.001Z" /></svg>
);
const IconTruck = () => (
    <svg {...svgProps} fill="none"><path {...strokeProps} d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8zM5.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM18.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" /></svg>
);
const IconSubscription = ({ filled }) => filled ? (
    <svg {...svgProps} fill="currentColor"><path d="M2 7c0-1.10457.89543-2 2-2h16c1.1046 0 2 .89543 2 2v4c0 .5523-.4477 1-1 1s-1-.4477-1-1v-1H4v7h10c.5523 0 1 .4477 1 1s-.4477 1-1 1H4c-1.10457 0-2-.8954-2-2V7Z" /><path d="M5 14c0-.5523.44772-1 1-1h2c.55228 0 1 .4477 1 1s-.44772 1-1 1H6c-.55228 0-1-.4477-1-1Zm5 0c0-.5523.4477-1 1-1h4c.5523 0 1 .4477 1 1s-.4477 1-1 1h-4c-.5523 0-1-.4477-1-1Zm9-1c.5523 0 1 .4477 1 1v1h1c.5523 0 1 .4477 1 1s-.4477 1-1 1h-1v1c0 .5523-.4477 1-1 1s-1-.4477-1-1v-1h-1c-.5523 0-1-.4477-1-1s.4477-1 1-1h1v-1c0-.5523.4477-1 1-1Z" /></svg>
) : (
    <svg {...svgProps} fill="none"><path {...strokeProps} d="M6 14h2m3 0h4m2 2h2m0 0h2m-2 0v2m0-2v-2m-5 4H4c-.55228 0-1-.4477-1-1V7c0-.55228.44772-1 1-1h16c.5523 0 1 .44772 1 1v4M3 10h18" /></svg>
);
const IconHelp = ({ filled }) => filled ? (
    <svg {...svgProps} fill="currentColor"><path fillRule="evenodd" d="M4.857 3A1.857 1.857 0 0 0 3 4.857v4.286C3 10.169 3.831 11 4.857 11h4.286A1.857 1.857 0 0 0 11 9.143V4.857A1.857 1.857 0 0 0 9.143 3H4.857Zm10 0A1.857 1.857 0 0 0 13 4.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 21 9.143V4.857A1.857 1.857 0 0 0 19.143 3h-4.286Zm-10 10A1.857 1.857 0 0 0 3 14.857v4.286C3 20.169 3.831 21 4.857 21h4.286A1.857 1.857 0 0 0 11 19.143v-4.286A1.857 1.857 0 0 0 9.143 13H4.857ZM18 14a1 1 0 1 0-2 0v2h-2a1 1 0 1 0 0 2h2v2a1 1 0 1 0 2 0v-2h2a1 1 0 1 0 0-2h-2v-2Z" clipRule="evenodd" /></svg>
) : (
    <svg {...svgProps} fill="none"><path {...strokeProps} d="M4.857 4h4.286c.473 0 .857.384.857.857v4.286a.857.857 0 0 1-.857.857H4.857A.857.857 0 0 1 4 9.143V4.857C4 4.384 4.384 4 4.857 4Zm10 0h4.286c.473 0 .857.384.857.857v4.286a.857.857 0 0 1-.857.857h-4.286A.857.857 0 0 1 14 9.143V4.857c0-.473.384-.857.857-.857Zm-10 10h4.286c.473 0 .857.384.857.857v4.286a.857.857 0 0 1-.857.857H4.857A.857.857 0 0 1 4 19.143v-4.286c0-.473.384-.857.857-.857Z" /></svg>
);
const IconUser = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0a8.949 8.949 0 0 0 4.951-1.488A3.987 3.987 0 0 0 13 16h-2a3.987 3.987 0 0 0-3.951 3.512A8.948 8.948 0 0 0 12 21Zm3-11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
);
const IconMenu = () => (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor"><path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z" /></svg>
);
const IconChevron = ({ collapsed }) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        style={{ transform: collapsed ? "rotate(180deg)" : "rotate(0deg)", transition: "transform .2s" }}>
        <path {...strokeProps} d="M15 6l-6 6 6 6" />
    </svg>
);

/* ─── Hooks utilitaires ──────────────────────────────────────────────── */
const usePersistedBool = (key, initial = false) => {
    const [value, setValue] = useState(() => {
        try { return localStorage.getItem(key) === "1"; } catch { return initial; }
    });
    const toggle = useCallback(() => {
        setValue((prev) => {
            const next = !prev;
            try { localStorage.setItem(key, next ? "1" : "0"); } catch { }
            return next;
        });
    }, [key]);
    return [value, toggle];
};

const useClickOutside = (ref, active, onOutside) => {
    useEffect(() => {
        if (!active) return;
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) onOutside();
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [ref, active, onOutside]);
};

const useEscape = (active, onEscape) => {
    useEffect(() => {
        if (!active) return;
        const onKey = (e) => e.key === "Escape" && onEscape();
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [active, onEscape]);
};

/* ─── Sous-composants ────────────────────────────────────────────────── */
const Badge = ({ value, floating }) => (
    <span
        className="vnav-badge"
        style={floating ? { position: "absolute", top: -4, right: -8 } : undefined}
    >
        {value > 99 ? "99+" : value}
    </span>
);

const NavItem = ({ icon, label, isActive, onClick, badge, collapsed }) => (
    <button
        type="button"
        className={`vnav-item ${isActive ? "active" : ""}`}
        onClick={onClick}
        aria-current={isActive ? "page" : undefined}
        title={collapsed ? label : undefined}
    >
        {/* indicateur latéral façon réseau social */}
        {isActive && (
            <span
                aria-hidden="true"
                style={{
                    position: "absolute", left: 0, top: 8, bottom: 8, width: 3,
                    borderRadius: 2, background: "currentColor", opacity: 0.9,
                }}
            />
        )}
        <span className="vnav-icon" style={collapsed ? { position: "relative" } : undefined}>
            {icon}
            {collapsed && badge != null && <Badge value={badge} floating />}
        </span>
        {!collapsed && <span style={{ flex: 1, textAlign: "left" }}>{label}</span>}
        {!collapsed && badge != null && <Badge value={badge} />}
    </button>
);

const UserCard = ({ user, displayName, isActive, collapsed, onClick }) => {
    const image = user?.image || user?.photo_url;
    return (
        <button
            type="button"
            className={`vnav-user-btn ${isActive ? "active" : ""}`}
            onClick={onClick}
            aria-label={`Profil de ${displayName || "utilisateur"}`}
            title={collapsed ? displayName : undefined}
        >
            <div style={{ position: "relative", flexShrink: 0, color: "gray", backgroundColor: BG }}>
                {image ? (
                    <img
                        src={getMediaUrl(image)}
                        alt={displayName ? `Avatar de ${displayName}` : "avatar"}
                        title={user?.email}
                        className="vnav-avatar"
                    />
                ) : (
                    <div
                        style={{
                            width: 32, height: 32, borderRadius: "50%",
                            background: "#f1f5f9", display: "flex",
                            alignItems: "center", justifyContent: "center",
                            color: "#94a3b8",
                        }}
                        aria-hidden="true"
                    >
                        <IconUser />
                    </div>
                )}
                {user?.is_connected && <span className="vnav-online-dot" aria-label="En ligne" />}
            </div>
            {!collapsed && (
                <div style={{ minWidth: 0, flex: 1 }}>
                    <p className="vnav-user-name"
                        style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "gray" }}>
                        {displayName}
                    </p>
                    <p className="vnav-user-email"
                        style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {user?.email}
                    </p>
                </div>
            )}
            {!collapsed && user?.is_pro && <span className="vnav-pro-badge">Pro</span>}
        </button>
    );
};

/* ─── Composant principal ────────────────────────────────────────────── */
const VerticalNavbar = ({ children }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const sidebarRef = useRef(null);

    const currentNav = useSelector((s) => s.navigate.currentNav);
    const allRooms = useSelector((s) => s.chat.currentChats);
    const currentUser = useSelector((s) => s.auth.user);

    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isCollapsed, toggleCollapsed] = usePersistedBool(COLLAPSE_STORAGE_KEY);

    const closeSidebar = useCallback(() => setSidebarOpen(false), []);
    useClickOutside(sidebarRef, isSidebarOpen, closeSidebar);
    useEscape(isSidebarOpen, closeSidebar);

    const isActive = useCallback((endpoint) => currentNav === endpoint, [currentNav]);
    const go = useCallback((endpoint) => {
        navigate(`/${endpoint}`);
        dispatch(setCurrentNav(endpoint));
        setSidebarOpen(false);
    }, [navigate, dispatch]);

    // Auth guard + fetch rooms
    useEffect(() => {
        if (!currentUser) {
            navigate("/", { replace: true });
            return;
        }
        fetchRooms(currentUser, dispatch, addRoom);
    }, [currentUser, dispatch, navigate]);

    const primaryNav = useMemo(() => [
        { endpoint: ENDPOINTS.MESSAGE_INBOX, label: t("AccountPage.messages"), Icon: IconMessages, badge: allRooms?.length || null },
        { endpoint: ENDPOINTS.ADD_PRODUCT, label: t("AccountPage.create"), Icon: IconAdd },
        { endpoint: ENDPOINTS.USER_BLOGS, label: t("blogs"), Icon: IconBlog },
        { endpoint: ENDPOINTS.DASHBOARD, label: t("activity"), Icon: IconDashboard },
        { endpoint: ENDPOINTS.TRACKING, label: "Suivi colis", Icon: IconTruck, staticIcon: true },
    ], [t, allRooms]);

    const secondaryNav = useMemo(() => [
        { endpoint: ENDPOINTS.SUBSCRIPTION, label: t("Subscriptionb2b"), Icon: IconSubscription },
        { endpoint: ENDPOINTS.HELP, label: `${t("AccountPage.help")} – Support`, Icon: IconHelp },
    ], [t]);

    const categories = useMemo(() => menuItems(t), [t]);
    const displayName = currentUser?.nom || currentUser?.prenom;

    const renderNavItem = ({ endpoint, label, Icon, badge, staticIcon }) => (
        <NavItem
            key={endpoint}
            icon={staticIcon ? <Icon /> : <Icon filled={isActive(endpoint)} />}
            label={label}
            isActive={isActive(endpoint)}
            onClick={() => go(endpoint)}
            badge={badge}
            collapsed={isCollapsed}
        />
    );

    return (
        <>
            <AttentionAlertMessage />
            <div className="vnav" style={{ backgroundColor: BG }}>
                {/* Toggle mobile */}
                <button
                    type="button"
                    className="vnav-toggle"
                    aria-label={isSidebarOpen ? "Fermer le menu" : "Ouvrir le menu"}
                    aria-expanded={isSidebarOpen}
                    aria-controls="vnav-sidebar"
                    onClick={() => setSidebarOpen((p) => !p)}
                >
                    <IconMenu />
                </button>

                {isSidebarOpen && (
                    <div className="vnav-overlay" onClick={closeSidebar} aria-hidden="true" />
                )}

                <div style={{ display: "flex", width: "100%", minHeight: 0, backgroundColor: BG }}>
                    <aside
                        id="vnav-sidebar"
                        ref={sidebarRef}
                        className={`vnav-sidebar ${isSidebarOpen ? "" : "closed"} ${isCollapsed ? "collapsed" : ""}`}
                        aria-label="Navigation principale"
                        style={{
                            width: isCollapsed ? COLLAPSED_WIDTH : undefined,
                            flexShrink: 0,
                            transition: "width .2s ease",
                            backgroundColor: BG,
                        }}
                    >
                        <div
                            className="vnav-logo-zone"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: isCollapsed ? "center" : "space-between",
                                backgroundColor: BG,
                            }}
                        >
                            {!isCollapsed && <Logo />}
                            <button
                                type="button"
                                className="vnav-collapse-btn"
                                onClick={toggleCollapsed}
                                aria-label={isCollapsed ? "Développer le menu" : "Réduire le menu"}
                                aria-pressed={isCollapsed}
                                title={isCollapsed ? "Développer le menu" : "Réduire le menu"}
                            >
                                <IconChevron collapsed={isCollapsed} />
                            </button>
                        </div>

                        <div className="vnav-body scrollbor_hidden" style={{ backgroundColor: BG }}>
                            <UserCard
                                user={currentUser}
                                displayName={displayName}
                                isActive={isActive(ENDPOINTS.ACCOUNT_HOME)}
                                collapsed={isCollapsed}
                                onClick={() => go(ENDPOINTS.ACCOUNT_HOME)}
                            />

                            {primaryNav.map(renderNavItem)}

                            <div className="vnav-divider" />
                            {!isCollapsed && <ButtonUpdateAccountUserToPro />}
                            {!isCollapsed && <div className="vnav-section-label">{t("categorie")}</div>}

                            <div style={{ display: "flex", flexDirection: "column", gap: 3, padding: 2 }}>
                                {categories.map(({ name, to, photo, id }) => {
                                    const active = currentNav === id;
                                    return (
                                        <button
                                            key={id ?? name}
                                            type="button"
                                            role="tab"
                                            aria-selected={active}
                                            className={`vnav-cat-item ${active ? "active" : ""}`}
                                            onClick={() => to && go(id)}
                                            title={isCollapsed ? name : undefined}
                                        >
                                            {photo && <span className="vnav-cat-icon">{photo}</span>}
                                            {!isCollapsed && <span>{name}</span>}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="vnav-divider" />

                            {secondaryNav.map(renderNavItem)}
                        </div>
                    </aside>

                    <div
                        className="bg-white/50 overflow-y-hidden"
                        style={{ flex: 1, minWidth: 0, transition: "margin .2s ease" }}
                    >
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
                                    <div style={{ padding: "0px 0" }}>{children}</div>
                                </ButtonScrollTopDown>
                            </section>
                        </main>
                    </div>
                </div>
            </div>
        </>
    );
};

export default VerticalNavbar;
