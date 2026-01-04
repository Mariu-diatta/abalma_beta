import React, {useState } from "react";
import api from "../services/Axios";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { addAiChat } from "../slices/aiChatSlice";
import LoadingCard from "../components/LoardingSpin";

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
                className="bg-gray-50 rounded-lg px-4 py-2 hover:bg-gray-200 fixed top-10 right-5 md:absolute mb-2 shadow-lg translate-y-0 transition-all duration-1000 ease-in-out"
            >
                {
                    loadingList ?
                        t("loading")
                        :
                        t("ai_analies")
                }

            </button>

            {/* POPOVER */}
            {
                open && (

                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 pt-3 shadow-lg">

                        <div className="bg-white w-full max-w-3xl rounded-xl shadow-lg p-6 relative mx-2 ">

                            {/* CLOSE */}
                            <button
                                onClick={() => setOpen(false)}
                                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>

                            <h2 className="text-md font-semibold mb-4 shadow-sm p-2">
                                {t("title_ai_analyse")}
                            </h2>

                            <div className="text-md max-h-[70vh] overflow-y-auto space-y-6 scrollbor_hidden">

                                {
                                    (aiData.length === 0) && (<p className="text-gray-500">{t("no_resum_ai")}</p>)
                                }

                                {
                                    aiData?.map(

                                        (item) => (

                                            <div key={item.id} className="border-gray-50 rounded-lg p-4 space-y-3">

                                                <div className="flex justify-between items-center flex-wrap gap-2">

                                                    <p className="text-sm text-gray-400">
                                                        {new Date(item.created_at).toLocaleString()}
                                                    </p>

                                                    <div className="flex gap-2">

                                                        <button
                                                            onClick={() => handleViewAiChat(item.id)}
                                                            className="shadow-lg text-sm bg-gray-100 hover:bg-gray-200 p-2 rounded-lg"
                                                            disabled={loadingViewId}
                                                        >
                                                            {loadingViewId===item.id ? <LoadingCard /> : t("view_ai_discuss")}
                                                        </button>

                                                        <button
                                                            onClick={() => handleDeleteAiChat(item.id)}
                                                            className="shadow-lg text-sm bg-red-100 hover:bg-red-200 p-2 rounded-lg"
                                                            disabled={loadingDeleteId}
                                                        >
                                                            {loadingDeleteId=== item.id ? <LoadingCard /> : t("del_ai_discuss")}
                                                        </button>

                                                    </div>
                                                </div>

                                                <Section title={t("summary")} content={item.resume}/>

                                                <Section title={t("advice")} content={item.advise}/>

                                                <Section title={t("directive")} content={item.directive}/>

                                            </div>
                                        )
                                    )
                                }

                            </div>

                            {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}

                        </div>

                    </div>
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
