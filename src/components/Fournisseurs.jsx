import React from "react";
import {
    MessageCircle,
    Store,
    BadgeCheck,
    MapPin,
} from "lucide-react";
import FollowProfilUser from "./ViewsProfilUser";
import { addUser } from "../slices/chatSlice";
import { setCurrentNav } from "../slices/navigateSlice";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router";
import { alertMessage } from "../utils";
import { useTranslation } from 'react-i18next';

/**
 * UserCard
 *
 * Displays a user's public profile summary: cover photo, avatar,
 * identity, location, description, status badges and quick actions.
 */
const UserCard = ({ selectedUserToSeeProfil, onMessage }) => {
    const { t } = useTranslation()
    const dispatch = useDispatch()
    let navigate = useNavigate();
    const currentUser = useSelector(state => state.auth.user)

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

            {/* COVER */}
            <div
                className="h-25 bg-gray-100 bg-cover bg-center relative z-[0]"
                style={{
                    backgroundImage: `url(${selectedUserToSeeProfil.image_cover || "/cover.jpg"})`,
                }}
            >
                {selectedUserToSeeProfil.is_connected && (
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-green-500 text-white px-1 py-1 rounded-full text-xs font-medium shadow-sm">
                        <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    </div>
                )}
            </div>

            {/* PROFILE */}
            <div className="relative px-5  pb-5 z-[999]">
                <div className="-mt-12 flex items-end gap-4 z-[999]">
                    <img
                        src={selectedUserToSeeProfil.image || selectedUserToSeeProfil.photo_url || "/avatar-placeholder.png"}
                        alt={fullName}
                        className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-md bg-gray-100"
                    />

                    <div className="pb-2 min-w-0 bg-white p-2 rounded-lg">
                        <div className="flex items-center gap-1.5">
                            <h2 className="font-bold text-lg text-gray-900 truncate">
                                {fullName}
                            </h2>

                            {selectedUserToSeeProfil.is_pro && (
                                <BadgeCheck
                                    className="text-indigo-600 shrink-0"
                                    size={20}
                                    aria-label="Compte professionnel vérifié"
                                />
                            )}
                        </div>

                        {selectedUserToSeeProfil.profession && (
                            <p className="text-sm text-gray-500 truncate">
                                {selectedUserToSeeProfil.profession}
                            </p>
                        )}
                    </div>
                </div>

                {/* Country */}
                {selectedUserToSeeProfil.country && (
                    <div className="mt-4 flex items-center gap-1.5 text-gray-500 text-sm">
                        <MapPin size={16} className="shrink-0" />
                        <span className="truncate">{selectedUserToSeeProfil.country}</span>
                    </div>
                )}

                {/* Description */}
                <p className="mt-4 text-sm text-gray-600 leading-relaxed line-clamp-3">
                    {selectedUserToSeeProfil.description || "Aucune description disponible."}
                </p>

                {/* BADGES */}
                {(selectedUserToSeeProfil.is_fournisseur || selectedUserToSeeProfil.is_subscribed || selectedUserToSeeProfil.is_verified) && (
                    <div className="flex flex-wrap gap-2 mt-4">
                        {selectedUserToSeeProfil.is_fournisseur && (
                            <span className="px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-medium">
                                Fournisseur
                            </span>
                        )}

                        {selectedUserToSeeProfil.is_subscribed && (
                            <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-600 text-xs font-medium">
                                Premium
                            </span>
                        )}

                        {selectedUserToSeeProfil.is_verified && (
                            <span className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-medium">
                                Vérifié
                            </span>
                        )}
                    </div>
                )}

                {/* ACTIONS */}
                <div className="grid grid-cols-3 gap-3 mt-5">
                    <button
                        type="button"
                        onClick = {getUserProfil }

                        className="rounded-full border border-gray-200 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 transition-colors"
                    >
                        {t("your_profil")}
                    </button>

                    <button
                        type="button"
                        onClick={() => onMessage?.(selectedUserToSeeProfil)}
                        className="rounded-full bg-indigo-300 text-white p-2 flex items-center justify-center gap-1 text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 transition-colors"
                    >
                        <MessageCircle size={16} />
                        {t("ProfilText.messageBtn.envoyer") }
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