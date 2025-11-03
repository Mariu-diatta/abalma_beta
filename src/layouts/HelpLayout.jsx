import React, { useState } from "react";
import TitleCompGen, { TitleCompGenLitle } from "../components/TitleComponentGen";
import { messages } from "../utils";
import { useTranslation } from 'react-i18next';
import api from "../services/Axios";
import LoadingCard from "../components/LoardingSpin";
import { useSelector } from "react-redux";

const HelpPage = () => {
    const { t } = useTranslation();
    const [problemType, setProblemType] = useState("");
    const [description, setDescription] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const currentUser = useSelector(state => state.auth.user)

    const sendData = () => {

        setSubmitted(!submitted);

        setProblemType("")

        setDescription("")

    }

    const handleSubmit =async (e) => {
        e.preventDefault();

        if (!problemType || !description.trim()|| !currentUser) {
            alert(t("alertSuccesMessageFormHelp.text3"));
            return;
        }

        setLoading(true)

        // 👉 Ici tu pourras envoyer les données à ton backend (API, email, etc.)
        try {

            const response = await api.post("help/messages/",
                {
                    "title": problemType,
                    "content": description,
                }
            )

            console.log("Support request:", { problemType, description }, response?.detail);

            sendData();

        } catch (e) {

            console.log("Erreur de données", e)
        } finally {
            setLoading(false)
        }

    };

    if (submitted) {

        return (

            <div
                className="relative max-w-lg mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-md text-center "

                style={{

                    backgroundColor: "var(--color-bg)",

                    color: "var(--color-text)"
                }}

            >

                <button className="absolute font-bold right-2 top-2" onClick={() => sendData()}>⨉</button> 

                <h2 className="text-xl font-bold mb-2">✅ {t("alertSuccesMessageFormHelp.text1")}</h2>

                <p className="text-gray-600">

                    {t("alertSuccesMessageFormHelp.text2")}

                </p>

            </div>
        );
    }

    return (

        <div
            className="d-flex flex-column items-start justify-between style-bg mx-1 mb-5 m-auto mb-6 pb-[20dvh]"

            style={{

                backgroundColor: "var(--color-bg)",

                color: "var(--color-text)"
            }}

        >

            <div

                className="text-start py-2 px-8 max-w-md dark:bg-gray-800 dark:text-white flex flex-wrap gap-1 mb-6"

                style={{

                    backgroundColor: "var(--color-bg)",

                    color: "var(--color-text)"
                }}
            >

                <TitleCompGen title="Support & Aide" />

            </div>

            <div className="dark:bg-gray-800 dark:text-white flex flex-wrap gap-1">

                <form
                    onSubmit={handleSubmit}
                    className="translate-y-0 transition-all duration-1000 ease-in-out w-full p-4 max-w-md bg-white  rounded-lg shadow-lg mx-auto"

                    style={{

                        backgroundColor: "var(--color-bg)",

                        color: "var(--color-text)"
                    }}
                >
                    {/* Sélecteur */}
                    <div
                        className="mb-4"
                        style={{

                            backgroundColor: "var(--color-bg)",

                            color: "var(--color-text)"
                        }}
                    >
                        <label
                            className="block mb-2 text-sm font-medium text-gray-900"
                            style={{

                                backgroundColor: "var(--color-bg)",

                                color: "var(--color-text)"
                            }}
                        >
                            {t('helpPage.problemType.index')}
                        </label>

                        <select
                            value={problemType}
                            onChange={(e) => setProblemType(e.target.value)}
                            className="bg-gray-50 border-0  text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        >
                            <option value="">{t('helpPage.problemType.select')}</option> 
                            <option value="connexion">{t('helpPage.problemType.connexion')}</option>
                            <option value="paiement">{t('helpPage.problemType.paiement')}</option>
                            <option value="bug">{t('helpPage.problemType.bug')}</option>
                            <option value="autre">{t('helpPage.problemType.autre')}</option>
                        </select>
                    </div>

                    {/* Zone de texte */}
                    <div className="mb-4">

                        <label
                            className="block mb-2 text-sm font-medium text-gray-900"
                            style={{

                                backgroundColor: "var(--color-bg)",

                                color: "var(--color-text)"
                            }}
                        >
                            {t('helpPage.problemType.description')}
                        </label>

                        <textarea
                            rows="4"
                            placeholder="Décrivez votre problème..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg  focus:ring-blue-0"
                        />
                    </div>

                    {/* Bouton */}
                    {
                        (!loading)?
                        <button
                            type="submit"
                            className="w-full text-white bg-gradient-to-br from-purple-50 to-blue-100 hover:from-purple-100 hover:to-blue-400 text-purple-600 rounded-lg text-sm px-5 py-2.5"
                        >
                            {t('helpPage.problemType.send')}
                        </button>
                        :
                        <LoadingCard/>
                    }
                </form>

                <MessagesListWithPopover/>

            </div>


        </div>
    );
};


export default HelpPage;


export const MessagesListWithPopover = () => {

    const [activeIndex, setActiveIndex] = useState(null);

    const { t } = useTranslation();

    return (
        <div
            className="mx-auto max-w-md"

            style={{

                backgroundColor: "var(--color-bg)",

                color: "var(--color-text)"
            }}

        >

            <TitleCompGenLitle title={t('helpPage.currentMessages.index')} />

            <ul

                className="space-y-3 shadow-sm rounded-lg bg-white border border-gray-200 border-0 p-2"

                style={{

                    backgroundColor: "var(--color-bg)",

                    color: "var(--color-text)"
                }}
            >

                {
                    messages(t)?.map(

                        (item, index) => (

                            <li key={index} className="relative">

                                <button
                                    className="text-left w-full p-2 hover:bg-gray-100 rounded-md bg-gray-50 shadow-sm cursor-pointer "
                                    onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                                    style={{

                                        backgroundColor: "var(--color-bg)",

                                        color: "var(--color-text)"
                                    }}
                                >
                                    {item.text}
                                </button>

                                {activeIndex === index && (
                                    <div className="absolute z-10 left-0 top-full mt-1 w-full bg-gray-50 border border-gray-300 p-3 rounded-md shadow-md">
                                        <p className="text-sm text-gray-700">{item.advice}</p>
                                    </div>
                                )}
                            </li>
                        )
                    )
                }
            </ul>
        </div>
    );
};



