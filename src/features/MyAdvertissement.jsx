import React, { useEffect, useState } from "react";
import api from "../services/Axios";
import { TitleCompGenLitle } from "../components/TitleComponentGen";
import { useTranslation } from "react-i18next";
import { getMediaUrl } from "../utils";

const MesPublicites = ({ onEdit }) => {

    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation();

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
                {t("loading")}
            </div>
        );
    }

    return (
        <div className="w-full p-6 my-3">

            <div className="flex items-center justify-between mb-6">

                <TitleCompGenLitle title={"Mes publicités"}/>

                <span className="text-sm text-gray-500 whitespace-nowrap">
                    {ads.length} {t("advertisement")}(s)
                </span>

            </div>

            {ads.length === 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
                    <i className="ti ti-speakerphone text-4xl text-gray-300" />
                    <p className="mt-2 text-gray-500">
                        {t("delete_pub")}
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
                                src={getMediaUrl(ad.image)}
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
                                        bg-indigo-50
                                        text-indigo-700
                                        hover:bg-indigo-100
                                        transition flex
                                        justify-center
                                    "
                                >
                                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.5" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z" />
                                    </svg>

                                </button>

                                <button
                                    onClick={() => handleToggleActive(ad)}
                                    className={`
                                        py-2 rounded-lg
                                        transition flex justify-center
                                        ${ad.is_active
                                            ? "bg-orange-50 text-orange-700 hover:bg-orange-100"
                                            : "bg-green-50 text-green-700 hover:bg-green-100"
                                        }
                                    `}
                                >

                                    {
                                        ad?.is_active ?
                                            (<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                <path stroke="currentColor" stroke-width="0.5" d="M11.083 5.104c.35-.8 1.485-.8 1.834 0l1.752 4.022a1 1 0 0 0 .84.597l4.463.342c.9.069 1.255 1.2.556 1.771l-3.33 2.723a1 1 0 0 0-.337 1.016l1.03 4.119c.214.858-.71 1.552-1.474 1.106l-3.913-2.281a1 1 0 0 0-1.008 0L7.583 20.8c-.764.446-1.688-.248-1.474-1.106l1.03-4.119A1 1 0 0 0 6.8 14.56l-3.33-2.723c-.698-.571-.342-1.702.557-1.771l4.462-.342a1 1 0 0 0 .84-.597l1.753-4.022Z" />
                                            </svg>)
                                            :
                                            (<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                <path stroke="currentColor" stroke-width="0.5" d="M11.083 5.104c.35-.8 1.485-.8 1.834 0l1.752 4.022a1 1 0 0 0 .84.597l4.463.342c.9.069 1.255 1.2.556 1.771l-3.33 2.723a1 1 0 0 0-.337 1.016l1.03 4.119c.214.858-.71 1.552-1.474 1.106l-3.913-2.281a1 1 0 0 0-1.008 0L7.583 20.8c-.764.446-1.688-.248-1.474-1.106l1.03-4.119A1 1 0 0 0 6.8 14.56l-3.33-2.723c-.698-.571-.342-1.702.557-1.771l4.462-.342a1 1 0 0 0 .84-.597l1.753-4.022Z" />
                                            </svg>)
                                    }
                                </button>

                                <button
                                    className="
                                        py-2 rounded-lg
                                        bg-purple-50
                                        text-purple-700
                                        hover:bg-purple-100
                                        transition
                                        flex justify-center
                                    "
                                >
                                    <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.5" d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z" />
                                    </svg>

                                </button>

                                <button
                                    onClick={() => handleDelete(ad.id)}
                                    className="
                                        py-2 rounded-lg
                                        bg-red-50
                                        text-red-700
                                        hover:bg-red-100
                                        transition
                                        flex justify-center
                                    "
                                >
                                    <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.5" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z" />
                                    </svg>

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