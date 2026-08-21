import React from "react";
import {
    MessageCircle,
    Store,
    BadgeCheck,
    MapPin,
    Sparkles,
    Star,
} from "lucide-react";
import FollowProfilUser from "./ViewsProfilUser";
import { addUser } from "../slices/chatSlice";
import { setCurrentNav } from "../slices/navigateSlice";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router";
import { alertMessage, isNewMember, formatJoinDate } from "../utils";
import { useTranslation } from 'react-i18next';

/**
 * UserCard
 *
 * Displays a user's public profile summary: cover photo, avatar,
 * identity, location, description, status badges and quick actions.
 */
const UserCard = ({ selectedUserToSeeProfil, onMessage }) => {
    const { t, i18n } = useTranslation()
    const dispatch = useDispatch()
    let navigate = useNavigate();
    const currentUser = useSelector(state => state.auth.user)

    // Nouveau membre : inscrit(e) depuis moins de 30 jours (cf. utils.js),
    // à partir de la date d'inscription renvoyée par le backend
    // (`created` sur le modèle User/Client).
    const registrationDate =
        selectedUserToSeeProfil?.created ||
        selectedUserToSeeProfil?.date_joined;
    const isNew = isNewMember(registrationDate);
    const joinDateLabel = formatJoinDate(registrationDate, i18n.language);

    const getUserProfil = () => {

        if (!currentUser) {
            alertMessage("requireConnexion", t)
            return
        }

        dispatch(addUser(selectedUserToSeeProfil));

        dispatch(setCurrentNav("user-profil-contact"));

        navigate("/user-profil-contact")


    }

    if (!selectedUserToSeeProfil) return null;

    const fullName = [selectedUserToSeeProfil.prenom, selectedUserToSeeProfil.nom].filter(Boolean).join(" ") || "Utilisateur";

    return (
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300">

            {/* PHOTO HERO */}
            <div
                className="relative h-56 bg-gray-100 bg-cover bg-center"
                style={{
                    backgroundImage: `url(${selectedUserToSeeProfil?.image_cover || selectedUserToSeeProfil?.image || selectedUserToSeeProfil?.photo_url || "/avatar-placeholder.png"})`,
                }}
            >
                {/* connection indicator */}
                {selectedUserToSeeProfil.is_connected && (
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-green-500 text-white px-1 py-1 rounded-full text-xs font-medium shadow-sm">
                        <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    </div>
                )}

                {/* gradient + name/location overlay, like a portrait profile card */}
                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 text-white">
                    <div className="flex items-center gap-1.5">
                        <h2 className="font-bold text-lg truncate drop-shadow-md text-white">
                            {fullName}
                        </h2>

                        {selectedUserToSeeProfil.is_pro && (
                            <BadgeCheck
                                className="text-indigo-300 shrink-0"
                                size={18}
                                aria-label="Compte professionnel vérifié"
                            />
                        )}
                    </div>

                    {selectedUserToSeeProfil.profession && (
                        <p className="text-sm text-white/85 truncate hidden">
                            {selectedUserToSeeProfil.profession}
                        </p>
                    )}

                    {selectedUserToSeeProfil.country && (
                        <div className="mt-1 flex items-center gap-1.5 text-white/85 text-sm">
                            <MapPin size={14} className="shrink-0" />
                            <span className="truncate">{selectedUserToSeeProfil.country}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* BODY */}
            <div className="px-5 pb-5 pt-4">

                {/* BADGES */}
                {(selectedUserToSeeProfil.is_fournisseur || selectedUserToSeeProfil.is_subscribed || selectedUserToSeeProfil.is_verified || isNew) && (
                    <div className="flex flex-wrap gap-2 mb-3">
                        {isNew && (
                            <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-pink-50 text-pink-600 text-xs font-medium">
                                <Star size={12} />
                                {t("new_member_badge")}
                            </span>
                        )}

                        {selectedUserToSeeProfil.is_subscribed && (
                            <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-medium">
                                <Sparkles size={12} />
                                Premium
                            </span>
                        )}

                        {selectedUserToSeeProfil.is_fournisseur && (
                            <span className="px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-medium">
                                Fournisseur
                            </span>
                        )}

                        {selectedUserToSeeProfil.is_verified && (
                            <span className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-medium">
                                Vérifié
                            </span>
                        )}
                    </div>
                )}

                {/* Description */}
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                    {selectedUserToSeeProfil.description || "Aucune description disponible."}
                </p>

                {/* Date d'inscription */}
                {joinDateLabel && (
                    <p className="mt-2 text-xs text-gray-400">
                        {t("member_since", { date: joinDateLabel })}
                    </p>
                )}

                {/* ACTIONS */}
                <div className="grid grid-cols-3 gap-3 mt-5">
                    <button
                        type="button"
                        onClick={getUserProfil}

                        className="rounded-full border border-gray-200 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 transition-colors"
                    >
                        {t("your_profil")}
                    </button>

                    <button
                        type="button"
                        onClick={() => onMessage?.(selectedUserToSeeProfil)}
                        className="rounded-full bg-indigo-600 text-white p-2 flex items-center justify-center gap-1 text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 transition-colors"
                    >
                        <MessageCircle size={16} />
                        {t("ProfilText.messageBtn.envoyer")}
                    </button>


                    <FollowProfilUser FollowProfilUser={selectedUserToSeeProfil?.id} />


                    {selectedUserToSeeProfil.is_fournisseur && (
                        <button
                            type="button"
                            className="hidden rounded-xl bg-orange-300 text-white py-2 flex items-center justify-center gap-2 text-sm font-medium hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1 transition-colors"
                        >
                            <Store size={16} />
                            Boutique
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserCard;