import React from 'react'
import {
    MessageCircle,
    UserPlus,
    Store,
    BadgeCheck,
    MapPin,
} from "lucide-react";

const UserCard = ({ user, onProfile, onMessage, onFollow }) => {

    return (

        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-white/20 hover:shadow-lg transition-all duration-300">

            {/* COVER */}

            <div
                className="h-36 bg-cover bg-center relative"
                style={{
                    backgroundImage: `url(${user.image_cover || "/cover.jpg"})`
                }}
            >

                {user.is_connected && (
                    <div className="absolute right-3 top-3 flex items-center gap-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs">
                        <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                        En ligne
                    </div>
                )}

            </div>

            {/* PROFILE */}

            <div className="px-5 pb-5">

                <div className="-mt-12 flex items-end gap-4">

                    <img
                        src={user.image || user.photo_url}
                        alt=""
                        className="w-24 h-24 rounded-full border-4 border-white object-cover shadow"
                    />

                    <div className="pb-2">

                        <div className="flex items-center gap-2">

                            <h2 className="font-bold text-lg">
                                {user.prenom} {user.nom}
                            </h2>

                            {user.is_pro && (
                                <BadgeCheck
                                    className="text-indigo-600"
                                    size={20}
                                />
                            )}

                        </div>

                        <p className="text-sm text-gray-500">
                            {user.profession}
                        </p>

                    </div>

                </div>

                {/* Country */}

                <div className="mt-4 flex items-center gap-2 text-gray-500 text-sm">

                    <MapPin size={16} />

                    {user.country}

                </div>

                {/* Description */}

                <p className="mt-4 text-sm text-gray-600 line-clamp-3">

                    {user.description ||
                        "Aucune description disponible."}

                </p>

                {/* BADGES */}

                <div className="flex flex-wrap gap-2 mt-4">

                    {user.is_fournisseur && (

                        <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-xs">
                            Fournisseur
                        </span>

                    )}

                    {user.is_subscribed && (

                        <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-600 text-xs">
                            Premium
                        </span>

                    )}

                    {user.is_verified && (

                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-600 text-xs">
                            Vérifié
                        </span>

                    )}

                </div>

                {/* BUTTONS */}

                <div className="grid grid-cols-2 gap-3 mt-5 hidden">

                    <button
                        onClick={() => onProfile(user)}
                        className="rounded-xl border border-gray-50 py-2 hover:bg-gray-100"
                    >
                        Voir profil
                    </button>

                    <button
                        onClick={() => onMessage(user)}
                        className="rounded-xl bg-indigo-200 text-white py-2 flex items-center justify-center gap-2"
                    >
                        <MessageCircle size={18} />
                        Message
                    </button>

                    <button
                        onClick={() => onFollow(user)}
                        className="rounded-xl border  border-gray-100 py-2 flex items-center justify-center gap-2"
                    >
                        <UserPlus size={18} />
                        Suivre
                    </button>

                    {user.is_fournisseur && (

                        <button
                            className="rounded-xl bg-orange-200 text-white py-2 flex items-center justify-center gap-2"
                        >
                            <Store size={18} />
                            Boutique
                        </button>

                    )}

                </div>

            </div>

        </div>

    );

};

export default UserCard;