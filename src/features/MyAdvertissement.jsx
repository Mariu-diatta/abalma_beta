import React, { useEffect, useState } from "react";
import api from "../services/Axios";
import { TitleCompGenLitle } from "../components/TitleComponentGen";

const MesPublicites = ({ onEdit }) => {

    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAdvertisements = async () => {
        try {
            const res = await api.get("/advertisemenOwnerUser/");
            setAds(res.data);
        } catch (err) {
            console.log(err.response?.data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdvertisements();
    }, []);

    const handleDelete = async (id) => {

        if (!window.confirm("Supprimer cette publicité ?")) {
            return;
        }

        try {
            await api.delete(`/advertisements/${id}/`);

            setAds(prev =>
                prev.filter(ad => ad.id !== id)
            );

        } catch (err) {
            console.log(err.response?.data);
        }
    };

    const handleToggleActive = async (ad) => {

        try {

            const res = await api.patch(
                `/advertisements/${ad.id}/`,
                {
                    is_active: !ad.is_active
                }
            );

            setAds(prev =>
                prev.map(item =>
                    item.id === ad.id
                        ? res.data
                        : item
                )
            );

        } catch (err) {
            console.log(err.response?.data);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-10">
                Chargement...
            </div>
        );
    }

    return (
        <div className="w-full p-6 my-3">

            <div className="flex items-center justify-between mb-6">

                <TitleCompGenLitle title={"Mes publicités"}/>

                <span className="text-sm text-gray-500">
                    {ads.length} publicité(s)
                </span>
            </div>

            {ads.length === 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
                    <i className="ti ti-speakerphone text-4xl text-gray-300" />
                    <p className="mt-2 text-gray-500">
                        Aucune publicité créée.
                    </p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                {ads.map((ad) => (

                    <div
                        key={ad.id}
                        className="
                            bg-white
                            rounded-3xl
                            overflow-hidden
                            border
                            border-gray-100
                            shadow-sm
                            hover:shadow-xl
                            transition-all
                        "
                    >

                        {/* IMAGE */}
                        {ad.image ? (
                            <img
                                src={ad.image}
                                alt={ad.title}
                                className="w-full h-52 object-cover"
                            />
                        ) : (
                            <div className="h-52 bg-gray-50 flex items-center justify-center">
                                <i className="ti ti-photo text-4xl text-gray-300" />
                            </div>
                        )}

                        {/* CONTENU */}
                        <div className="p-5">

                            <div className="flex items-center justify-between mb-3">

                                <span
                                    className={`
                                        px-3 py-1 rounded-full text-xs font-medium
                                        ${ad.is_active
                                            ? "bg-green-50 text-green-700"
                                            : "bg-red-50 text-red-700"
                                        }
                                    `}
                                >
                                    {ad.is_active ? "Active" : "Désactivée"}
                                </span>

                                <span className="text-xs text-gray-400">
                                    #{ad.id}
                                </span>

                            </div>

                            <h3 className="font-semibold text-gray-900 mb-2">
                                {ad.title}
                            </h3>

                            <p className="text-sm text-gray-500 line-clamp-3">
                                {ad.description}
                            </p>

                            <div className="mt-4 text-xs text-gray-400">
                                Fin :
                                {" "}
                                {new Date(
                                    ad.end_date
                                ).toLocaleDateString()}
                            </div>

                            {/* ACTIONS */}
                            <div className="grid grid-cols-4 gap-2 mt-5">

                                <button
                                    onClick={() => onEdit?.(ad)}
                                    className="
                                        py-2 rounded-lg
                                        bg-blue-50
                                        text-blue-700
                                        hover:bg-blue-100
                                        transition
                                    "
                                >
                                    <i className="ti ti-edit" />
                                </button>

                                <button
                                    onClick={() => handleToggleActive(ad)}
                                    className={`
                                        py-2 rounded-lg
                                        transition
                                        ${ad.is_active
                                            ? "bg-orange-50 text-orange-700 hover:bg-orange-100"
                                            : "bg-green-50 text-green-700 hover:bg-green-100"
                                        }
                                    `}
                                >
                                    <i
                                        className={
                                            ad.is_active
                                                ? "ti ti-player-pause"
                                                : "ti ti-player-play"
                                        }
                                    />
                                </button>

                                <button
                                    className="
                                        py-2 rounded-lg
                                        bg-purple-50
                                        text-purple-700
                                        hover:bg-purple-100
                                        transition
                                    "
                                >
                                    <i className="ti ti-eye" />
                                </button>

                                <button
                                    onClick={() => handleDelete(ad.id)}
                                    className="
                                        py-2 rounded-lg
                                        bg-red-50
                                        text-red-700
                                        hover:bg-red-100
                                        transition
                                    "
                                >
                                    <i className="ti ti-trash" />
                                </button>

                            </div>

                        </div>

                    </div>

                ))}

            </div>

        </div>
    );
};

export default MesPublicites;