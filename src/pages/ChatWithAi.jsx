import React, {useState } from "react";
import api from "../services/Axios";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { addAiChat } from "../slices/aiChatSlice";
import LoadingCard from "../components/LoardingSpin";
import { createPortal } from "react-dom";

const AnaliesChatsWithAi = () => {

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const [aiData, setAiData] = useState([]);

    const [open, setOpen] = useState(false);

    const [loadingList, setLoadingList] = useState(false);

    const [loadingViewId, setLoadingViewId] = useState(null);

    const [loadingDeleteId, setLoadingDeleteId] = useState(null);

    const [error, setError] = useState(null);

    /* ============================
       FETCH LIST
    ============================ */
    const fetchAiAnalysisList = async () => {
        setLoadingList(true);
        setError(null);

        try {
            const { data } = await api.get("ai-analyse-chat/");
            setAiData(data);
            setOpen(true);
        } catch (err) {
            console.error(err);
            setError(t("error_loading_ai"));
        } finally {
            setLoadingList(false);
        }
    };

    /* ============================
       VIEW AI DISCUSSION
    ============================ */
    const handleViewAiChat = async (id) => {
        if (!id) return;

        setLoadingViewId(id);

        try {
            const { data } = await api.get(`ai-analyse-chat/${id}/`);
            dispatch(addAiChat(data));
            setOpen(false);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingViewId(null);
        }
    };

    /* ============================
       DELETE AI DISCUSSION
    ============================ */
    const handleDeleteAiChat = async (id) => {

        if (!id) return;

        setLoadingDeleteId(id);

        try {
            await api.delete(`ai-analyse-chat/${id}/`);
            setAiData((prev) => prev.filter((item) => item.id !== id));

        } catch (err) {
            console.error(err);

        } finally {
            setLoadingDeleteId(null);
        }
    };

    return (

        <div>

            {/* BUTTON OPEN */}

            <button
                onClick={fetchAiAnalysisList}
                className=" bg-gradient-to-r from-blue-400 to-gray-200 text-gray-700 font-sm text-sm z-10 rounded-full  hover:font-medium px-2 cursor-pointer py-2 fixed bottom-2 left-1/2 md:absolute w-full -translate-x-1/2 shadow-md hover:shadow-lg  transition-all duration-200"
            >
                {loadingList ? t("loading") : t("ai_analies")}

            </button>

            {/* POPOVER */}
            {
                open && createPortal(

                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-2">

                        <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl p-5 md:p-6 relative">

                            {/* CLOSE */}
                            <button
                                onClick={() => setOpen(false)}
                                className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-lg"
                            >
                                ✕
                            </button>

                            <h2 className="text-lg md:text-xl font-semibold mb-4 border-b border-gray-400 pb-2">
                                {t("title_ai_analyse")}
                            </h2>

                            <div className="text-sm md:text-base max-h-[70vh] overflow-y-auto space-y-5 pr-1">

                                {
                                    (aiData.length === 0) && (
                                        <p className="text-gray-500 text-center py-4">
                                            {t("no_resum_ai")}
                                        </p>
                                    )
                                }

                                {
                                    aiData?.map(

                                        (item) => (

                                            <div key={item.id} className="border border-gray-300 rounded-xl p-4 space-y-3 shadow-sm hover:shadow-md transition">

                                                <div className="flex justify-between items-center flex-wrap gap-2">

                                                    <p className="text-xs md:text-sm text-gray-400">
                                                        {new Date(item.created_at).toLocaleString()}
                                                    </p>

                                                    <div className="flex gap-2">

                                                        <button
                                                            onClick={() => handleViewAiChat(item.id)}
                                                            className="border border-blue-300 text-xs md:text-sm bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded-lg transition flex items-center justify-center min-w-[90px]"
                                                            disabled={loadingViewId}
                                                        >
                                                            {loadingViewId === item.id ? <LoadingCard /> : t("view_ai_discuss")}
                                                        </button>

                                                        <button
                                                            onClick={() => handleDeleteAiChat(item.id)}
                                                            className="border border-blue-300 text-xs md:text-sm bg-red-100 hover:bg-red-200 px-3 py-1 rounded-lg transition flex items-center justify-center min-w-[90px]"
                                                            disabled={loadingDeleteId}
                                                        >
                                                            {loadingDeleteId === item.id ? <LoadingCard /> : t("del_ai_discuss")}
                                                        </button>

                                                    </div>
                                                </div>

                                                <Section title={t("summary")} content={item.resume} />

                                                <Section title={t("advice")} content={item.advise} />

                                                <Section title={t("directive")} content={item.directive} />

                                            </div>
                                        )
                                    )
                                }

                            </div>

                            {
                                error && (
                                    <p className="text-red-500 mt-4 text-sm text-center">
                                        {error}
                                    </p>
                                )
                            }


                        </div>

                    </div>,

                    document.body
                )
            }

        </div>
    );
};

/* ============================
   SUB COMPONENT
============================ */
const Section = ({ title, content }) => {
    if (!content) return null;

    return (
        <div>
            <h3 className="font-medium text-gray-800 mb-1">{title}</h3>
            <p className="text-sm text-gray-700 whitespace-pre-line">
                {extractContent(content)}
            </p>
        </div>
    );
};

const extractContent = (raw) => {
    if (typeof raw !== "string") return "";
    const match = raw.match(/content=['"]([^'"]+)/);
    return match ? match[1] : raw;
};

export default AnaliesChatsWithAi;

