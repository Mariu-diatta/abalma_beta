import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { User } from "lucide-react";

import api from "../services/Axios";
import { API_ENDPOINTS } from "../services/apiEndpoints";
import { getMediaUrl } from "../utils";
import { addUser } from "../slices/chatSlice";
import { setCurrentNav } from "../slices/navigateSlice";
import LogIn from "../pages/Login";
import RegisterForm from "../pages/Register";

const isTrustedSeller = (owner) =>
    !!(owner?.is_pro || owner?.is_fournisseur || owner?.fournisseur || owner?.is_verified);

// ─────────────────────────────────────────────────────────────────────────
// Barre "stories" façon Instagram sur la page d'accueil : met en avant les
// vendeurs actifs (anneau dégradé pour les comptes pro / vérifiés), et ouvre
// leur profil au clic — pas de fausse donnée, uniquement des vendeurs ayant
// réellement au moins une annonce en ligne.
// ─────────────────────────────────────────────────────────────────────────
const SellerStoriesBar = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const currentUser = useSelector((state) => state.auth.user);

    const [sellers, setSellers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [authMode, setAuthMode] = useState(null);
    const fetchedRef = useRef(false);

    useEffect(() => {
        if (fetchedRef.current) return;
        fetchedRef.current = true;

        const loadSellers = async () => {
            try {
                const { data: products } = await api.get(API_ENDPOINTS.PRODUCTS.DEFAULT_LIST);

                const activeProducts = (products || []).filter(
                    (p) => parseInt(p?.quantity_product) !== 0
                );

                const uniqueOwnerIds = [
                    ...new Set(activeProducts.map((p) => p?.fournisseur?.id)),
                ].filter((id) => id != null);

                const responses = await Promise.all(
                    uniqueOwnerIds.map((id) =>
                        api
                            .get(API_ENDPOINTS.CLIENTS.DETAIL(id))
                            .then((res) => res.data)
                            .catch(() => null)
                    )
                );

                const owners = responses.filter(Boolean);

                // Vendeurs "de confiance" (pro / fournisseur validé) en tête,
                // puis ceux actuellement en ligne.
                owners.sort((a, b) => {
                    const trustedDiff = Number(isTrustedSeller(b)) - Number(isTrustedSeller(a));
                    if (trustedDiff !== 0) return trustedDiff;
                    return Number(!!b?.is_connected) - Number(!!a?.is_connected);
                });

                setSellers(owners.slice(0, 20));

            } catch (e) {
                // silencieux : la barre stories ne doit jamais casser la home
            } finally {
                setLoading(false);
            }
        };

        loadSellers();
    }, []);

    const handleSellerClick = (owner) => {
        if (!currentUser) {
            setAuthMode("login");
            return;
        }

        dispatch(addUser(owner));
        dispatch(setCurrentNav("user-profil-contact"));
        navigate("/user-profil-contact");
    };

    if (!loading && sellers.length === 0) return <></>;

    return (
        <section
            aria-label={t("featured_sellers") || "Vendeurs à la une"}
            className="px-2 pt-2 pb-1 border-b border-[#dbdbdb] bg-white"
        >
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#8e8e8e] px-1 mb-2">
                {t("featured_sellers") || "Vendeurs à la une"}
            </p>

            <div className="flex gap-4 overflow-x-auto pb-1 px-1 [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200">

                {loading
                    ? Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="flex flex-shrink-0 flex-col items-center gap-1 w-16 animate-pulse">
                            <div className="w-16 h-16 rounded-full bg-gray-100" />
                            <div className="w-10 h-2 rounded bg-gray-100" />
                        </div>
                    ))
                    : sellers.map((owner) => {
                        const trusted = isTrustedSeller(owner);
                        const avatarSrc = owner?.image || owner?.photo_url;
                        const name = owner?.nom || owner?.prenom || t("seller") || "Vendeur";

                        return (
                            <button
                                key={owner.id}
                                onClick={() => handleSellerClick(owner)}
                                className="flex flex-shrink-0 flex-col items-center gap-1 w-16"
                                title={name}
                            >
                                <div className="relative">
                                    {avatarSrc ? (
                                        <img
                                            src={getMediaUrl(avatarSrc)}
                                            alt={name}
                                            className={`w-16 h-16 rounded-full object-cover${trusted ? " oa-img--trusted" : ""}`}
                                            style={!trusted ? { border: "2px solid #dbdbdb" } : undefined}
                                        />
                                    ) : (
                                        <div
                                            className={`w-16 h-16 rounded-full flex items-center justify-center bg-[#f1f5f9] text-[#94a3b8]${trusted ? " oa-svg--trusted" : ""}`}
                                            style={!trusted ? { border: "2px solid #dbdbdb" } : undefined}
                                        >
                                            <User size={26} />
                                        </div>
                                    )}
                                    {owner?.is_connected && (
                                        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-[#2ecc71] border-2 border-white" />
                                    )}
                                </div>

                                <span className="text-[11px] text-[#262626] truncate w-full text-center">
                                    {name}
                                </span>
                            </button>
                        );
                    })}
            </div>

            {authMode === "login" && (
                <LogIn onClose={() => setAuthMode(null)} callbackState={() => setAuthMode("register")} />
            )}
            {authMode === "register" && (
                <RegisterForm onClose={() => setAuthMode(null)} callbackState={() => setAuthMode("login")} />
            )}
        </section>
    );
};

export default SellerStoriesBar;
