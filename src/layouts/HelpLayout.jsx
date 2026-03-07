import React, { useEffect, useState } from "react";
import TitleCompGen, { TitleCompGenLitle } from "../components/TitleComponentGen";
import { messages } from "../utils";
import { useTranslation } from 'react-i18next';
import api from "../services/Axios";
import LoadingCard from "../components/LoardingSpin";
import { useDispatch, useSelector } from "react-redux";
import { showMessage } from "../components/AlertMessage";


const HelpPage = () => {
    const { t } = useTranslation();
    const [problemType, setProblemType] = useState("");
    const [description, setDescription] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const currentUser = useSelector(state => state.auth.user)
    const currznUserType = !problemType || !description.trim() || !currentUser

    const sendData = () => {

        setSubmitted(!submitted);

        setProblemType("")

        setDescription("")

    }

    const handleSubmit =async (e) => {
        e.preventDefault();

        if (currznUserType) {
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

        <div className="d-flex flex-column items-start justify-between mx-1 mb-5 m-auto mb-6 pb-[20dvh]">

            <div className="text-start py-2 px-8 max-w-md dark:text-white flex flex-wrap gap-1 mb-6">

                <TitleCompGen title="Support & Aide" />

            </div>

            <div className=" dark:text-white flex flex-wrap gap-1">

                <form
                    onSubmit={handleSubmit}
                    className="translate-y-0 transition-all duration-1000 ease-in-out w-full px-4 max-w-md bg-white  rounded-lg shadow-sm mx-auto gap-5"
                >
                    {/* Sélecteur */}
                    <div
                        className="mb-4"
                    >
                        <TitleCompGenLitle title={t('helpPage.problemType.index')} />

                        <select
                            value={problemType}
                            onChange={(e) => setProblemType(e.target.value)}
                            className="focus:ring-0 ring-0 bg-gray-50 border-0  text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
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
                        >
                            {t('helpPage.problemType.description')} *

                        </label>

                        <textarea
                            rows="4"
                            placeholder="Décrivez votre problème..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg  focus:ring-blue-0 focus:ring-0"
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

                <MessagesListWithPopover />

                <TestmonyList/>

            </div>


        </div>
    );
};


export default HelpPage;


export const MessagesListWithPopover = () => {

    const [activeIndex, setActiveIndex] = useState(null);

    const { t } = useTranslation();

    return (

        <div className="mx-auto max-w-md">

            <TitleCompGenLitle title={t('helpPage.currentMessages.index')} />

            <ul className="space-y-3 shadow-sm rounded-lg  border border-gray-200 border-0 p-2" >

                {
                    messages(t)?.map(

                        (item, index) => (

                            <li key={index} className="relative">

                                <button
                                    className="text-left w-full p-2 hover:bg-gray-100 rounded-md bg-gray-50 shadow-sm cursor-pointer "
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


function TestmonyList() {

    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);
    const [content, setContent] = useState("");
    const dispatch = useDispatch()
    const [rating, setRating] = useState(0);

    // Charger les témoignages (GET)
    useEffect(() => {
        api.get("content/testmony/")
            .then((res) => res.data)
            .then((data) => setItems(data)).catch(
                (err)=>console.warn(err?.messages)
            );
    }, []);

    // Ajouter un témoignage (POST)
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            api.post("/content/testmony/", { content, rating })
                .then((res) => res.data)
                .then((newItem) => {
                    setItems([newItem, ...items]);
                    setContent("");
                    setRating(0);
                    showMessage(dispatch, { Type: "Success", Message: "✔️" });
                });

        } catch (error) {

            console.error("Erreur loadind :", error);

        } finally {
            setLoading(false)
        }

    };


    return (

        <main
            className="relative max-w-lg mx-auto  border border-gray-200 shadow-md text-center border-0 mt-10 w-full rounded-br-none"
        >

            <TitleCompGenLitle title={t('Comment')} />

            {/* Formulaire d'envoi */}
            <form onSubmit={handleSubmit}

                className="gap-4 translate-y-0 transition-all duration-1000 ease-in-out w-full p-1 border-0 max-w-md bg-white  rounded-lg mx-auto "
            >
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Écris ton témoignage..."
                    className="border-blue-800 p-3 rounded-xl w-full focus:ring-0"
                    rows="3"
                    required
                />

                {/* Stars rating */}
                <div className="flex justify-center mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span
                            key={star}
                            onClick={() => setRating(star)}
                            className={`cursor-pointer text-2xl ${star <= rating ? "bg-yellow-400" : "bg    -gray-300"
                                }`}
                        >
                            ★
                        </span>
                    ))}
                </div>

                {
                    loading ?
                    <LoadingCard/>
                    :
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-br from-purple-50 to-blue-100 hover:from-purple-100 hover:to-blue-400 text-purple-600 rounded-lg text-sm px-5 py-2.5"
                    >
                        {t('send')}

                    </button>
                }
            </form>

        </main>
    );
}


