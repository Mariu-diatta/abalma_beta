import React, { useState } from "react";
import TitleCompGen from "../components/TitleComponentGen";
import { messages } from "../utils";
import { useTranslation } from 'react-i18next';
import api from "../services/Axios";
import LoadingCard from "../components/LoardingSpin";

const HelpPage = () => {
    const { t } = useTranslation();
    const [problemType, setProblemType] = useState("");
    const [description, setDescription] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit =async (e) => {
        e.preventDefault();

        if (!problemType || !description.trim()) {
            alert("Merci de remplir tous les champs.");
            return;
        }

        setLoading(true)

        // 👉 Ici tu pourras envoyer les données à ton backend (API, email, etc.)
        try {

            const response = await api.post("help/messages/",
                {
                    "title": problemType,
                    "content": description
                }
            )

            console.log("Support request:", { problemType, description }, response?.detail);

            setSubmitted(true);

        } catch (e) {

            console.log("Erreur de données", e)
        } finally {
            setLoading(false)
        }

    };

    if (submitted) {
        return (
            <div className="max-w-lg mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-md text-center">
                <h2 className="text-xl font-bold mb-2">✅ Merci pour votre retour !</h2>
                <p className="text-gray-600">
                    Notre équipe de support analysera votre problème dès que possible.
                </p>
            </div>
        );
    }

    return (

        <div className="d-flex flex-column items-start justify-between style-bg mx-1 mb-5 m-auto mb-6">

            <div className="text-start py-2 px-8 max-w-md dark:bg-gray-800 dark:text-white flex flex-wrap gap-1 mb-6">

                <TitleCompGen title="Support & Aide" />

            </div>

            <div className="dark:bg-gray-800 dark:text-white flex flex-wrap gap-1">

                <form
                    onSubmit={handleSubmit}
                    className="translate-y-0 transition-all duration-1000 ease-in-out w-full p-4 max-w-md bg-white  rounded-lg shadow-lg mx-auto"
                >
                    {/* Sélecteur */}
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-900">
                            {t('helpPage.problemType.index')}
                        </label>
                        <select
                            value={problemType}
                            onChange={(e) => setProblemType(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
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
                        <label className="block mb-2 text-sm font-medium text-gray-900">
                            {t('helpPage.problemType.description')}
                        </label>
                        <textarea
                            rows="4"
                            placeholder="Décrivez votre problème..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Bouton */}
                    {
                        (!loading)?
                        <button
                            type="submit"
                            className="w-full text-white bg-gradient-to-br from-purple-300 to-blue-300 hover:from-purple-400 hover:to-blue-400 text-purple-600 rounded-lg text-sm px-5 py-2.5"
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
        <div className="mx-auto max-w-md ">

            <h2 className="text-xl font-bold mb-4">{t('helpPage.currentMessages.index')}</h2>

            <ul className="space-y-3 shadow-sm rounded-lg bg-white border border-gray-200 border-0 p-2">

                {
                    messages(t)?.map(

                        (item, index) => (

                            <li key={index} className="relative">

                                <button
                                    className="text-left w-full p-2 hover:bg-gray-100 rounded-md bg-gray-50 shadow-sm cursor-pointer"
                                    onClick={() => setActiveIndex(activeIndex === index ? null : index)}
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



