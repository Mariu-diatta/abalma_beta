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

        <div className="mb-5 m-auto pb-[20dvh]">

            <div className="text-start max-w-md dark:text-white flex items-center gap-1 ">

                <svg class="w-auto max-w-[16rem] h-40 text-gray-800 dark:text-white" aria-hidden="true" width="674" height="447" viewBox="0 0 674 447" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M529.768 447C564.466 400.375 585 342.586 585 280C585 125.36 459.64 0 305 0C150.36 0 25 125.36 25 280C25 342.586 45.5338 400.375 80.2318 447H529.768Z" fill="#d6e2fb" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M529.768 447C564.466 400.375 585 342.586 585 280C585 125.36 459.64 0 305 0C150.36 0 25 125.36 25 280C25 342.586 45.5338 400.375 80.2318 447H529.768Z" fill="url(#paint0_linear_748_166)" />
                    <path d="M607.5 379C605.5 383 559.667 414 537 429L530.5 379C556.167 365.167 607.5 338.5 607.5 342.5C607.5 346.5 571.5 378.5 553.5 394C572.333 387.333 609.5 375 607.5 379Z" fill="#c8d8fa" />
                    <path d="M6.99966 290C9.39966 298.8 47.333 353.667 65.9997 380C81.9993 398.5 131.5 372.5 131.5 358.5C131.5 344.5 124 323 122 324C120.4 324.8 115 349.333 112.5 361.5C111 348.5 71 274.5 70 280.5C69.2 285.3 79.9998 329.833 85.4997 351.5C58.333 327.333 4.59966 281.2 6.99966 290Z" fill="#c8d8fa" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M391.661 191.786C411.954 187.568 427.842 175.37 432.511 157.945C439.944 130.205 416.13 99.7215 379.321 89.8585C342.512 79.9955 306.646 94.4879 299.213 122.228C291.78 149.968 315.594 180.452 352.404 190.315C358.044 191.826 363.662 192.766 369.159 193.173L378.717 209.727C379.503 211.09 381.482 211.052 382.217 209.661L391.661 191.786Z" fill="#2563eb" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M391.661 191.786C411.954 187.568 427.842 175.37 432.511 157.945C439.944 130.205 416.13 99.7215 379.321 89.8585C342.512 79.9955 306.646 94.4879 299.213 122.228C291.78 149.968 315.594 180.452 352.404 190.315C358.044 191.826 363.662 192.766 369.159 193.173L378.717 209.727C379.503 211.09 381.482 211.052 382.217 209.661L391.661 191.786Z" fill="url(#paint1_linear_748_166)" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M388.063 132.577C388.769 133.426 388.654 134.687 387.805 135.393L355.411 162.366L345.439 142.195C344.949 141.205 345.355 140.005 346.345 139.516C347.335 139.026 348.535 139.432 349.024 140.422L356.749 156.047L385.246 132.32C386.095 131.613 387.356 131.728 388.063 132.577Z" fill="#d6e2fb" />
                    <path d="M97.3041 55.6569C100.428 52.5327 105.494 52.5327 108.618 55.6569L266.303 213.342C269.427 216.466 269.427 221.531 266.303 224.655L174.656 316.302C171.532 319.426 166.466 319.426 163.342 316.302L5.65739 158.617C2.5332 155.493 2.53321 150.428 5.6574 147.304L97.3041 55.6569Z" fill="#c8d8fa" />
                    <path d="M97.3041 55.6569C100.428 52.5327 105.494 52.5327 108.618 55.6569L266.303 213.342C269.427 216.466 269.427 221.531 266.303 224.655L174.656 316.302C171.532 319.426 166.466 319.426 163.342 316.302L5.65739 158.617C2.5332 155.493 2.53321 150.428 5.6574 147.304L97.3041 55.6569Z" fill="url(#paint2_linear_748_166)" />
                    <path d="M40.027 156.773C41.5891 155.211 44.1218 155.211 45.6839 156.773L68.3113 179.401C69.8734 180.963 69.8734 183.495 68.3113 185.058C66.7492 186.62 64.2166 186.62 62.6545 185.058L40.027 162.43C38.4649 160.868 38.4649 158.335 40.027 156.773Z" fill="#d6e2fb" />
                    <path d="M72.5544 189.3C74.1165 187.738 76.6491 187.738 78.2112 189.3L100.839 211.928C102.401 213.49 102.401 216.022 100.839 217.584C99.2766 219.146 96.7439 219.146 95.1818 217.584L72.5544 194.957C70.9923 193.395 70.9923 190.862 72.5544 189.3Z" fill="#d6e2fb" />
                    <path d="M105.082 221.827C106.644 220.265 109.176 220.265 110.739 221.827L133.366 244.454C134.928 246.016 134.928 248.549 133.366 250.111C131.804 251.673 129.271 251.673 127.709 250.111L105.082 227.484C103.52 225.922 103.52 223.389 105.082 221.827Z" fill="#d6e2fb" />
                    <path d="M137.609 254.354C139.171 252.792 141.704 252.792 143.266 254.354L165.893 276.981C167.455 278.543 167.455 281.076 165.893 282.638C164.331 284.2 161.799 284.2 160.236 282.638L137.609 260.011C136.047 258.449 136.047 255.916 137.609 254.354Z" fill="#d6e2fb" />
                    <path d="M206.906 189.3C209.249 186.957 213.048 186.957 215.391 189.3L233.069 206.978C235.412 209.321 235.412 213.12 233.069 215.463L222.462 226.07C220.119 228.413 216.32 228.413 213.977 226.07L196.299 208.392C193.956 206.049 193.956 202.25 196.299 199.907L206.906 189.3Z" fill="#2563eb" />
                    <path d="M206.906 189.3C209.249 186.957 213.048 186.957 215.391 189.3L233.069 206.978C235.412 209.321 235.412 213.12 233.069 215.463L222.462 226.07C220.119 228.413 216.32 228.413 213.977 226.07L196.299 208.392C193.956 206.049 193.956 202.25 196.299 199.907L206.906 189.3Z" fill="url(#paint3_linear_748_166)" />
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M200.717 212.812L219.809 193.72L220.869 194.78L201.777 213.872L200.717 212.812Z" fill="#B7D6FE" />
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M208.494 220.59L227.586 201.498L228.647 202.559L209.555 221.651L208.494 220.59Z" fill="#B7D6FE" />
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M206.021 190.184L232.184 216.347L231.123 217.408L204.96 191.245L206.021 190.184Z" fill="#B7D6FE" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M198.243 197.963L224.406 224.125L223.346 225.186L197.183 199.023L198.243 197.963Z" fill="#B7D6FE" />
                    <path d="M203 386.3L11.3 384.1L353 293.1H544L203 386.3Z" fill="#d6e2fb" />
                    <path d="M203 386.3L11.3 384.1L353 293.1H544L203 386.3Z" fill="url(#paint4_linear_748_166)" />
                    <path d="M203 384H10V447H203V384Z" fill="#d6e2fb" />
                    <path d="M203 384H10V447H203V384Z" fill="url(#paint5_linear_748_166)" />
                    <path d="M221.555 372.602C218.134 373.53 214.604 373.999 211.059 373.997L77.0574 373.905C75.8889 373.905 75.6702 372.243 76.7987 371.94L306.003 310.37C309.388 309.461 312.876 309 316.381 309H448.593C449.761 309 449.982 310.66 448.855 310.965L221.555 372.602Z" fill="#F9FAFB" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M84.6163 371.91L211.06 371.997C214.428 371.999 217.781 371.553 221.032 370.672L441.084 311H316.381C313.052 311 309.737 311.438 306.522 312.301L84.6163 371.91ZM211.059 373.997C214.604 373.999 218.134 373.53 221.555 372.602L448.855 310.965C449.982 310.66 449.761 309 448.593 309H316.381C312.876 309 309.388 309.461 306.003 310.37L76.7987 371.94C75.6702 372.243 75.8889 373.905 77.0574 373.905L211.059 373.997Z" fill="#c8d8fa" />
                    <path d="M203 384L546 292.5V447H203V384Z" fill="#d6e2fb" />
                    <path d="M203 384L546 292.5V447H203V384Z" fill="url(#paint6_linear_748_166)" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M513 366.49C513 365.851 512.408 365.376 511.784 365.514L334.784 404.63C334.326 404.731 334 405.137 334 405.606V447H332V405.606C332 404.199 332.978 402.981 334.353 402.677L511.353 363.561C513.225 363.147 515 364.573 515 366.49V447H513V366.49Z" fill="#c8d8fa" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M513 366.49C513 365.851 512.408 365.376 511.784 365.514L334.784 404.63C334.326 404.731 334 405.137 334 405.606V447H332V405.606C332 404.199 332.978 402.981 334.353 402.677L511.353 363.561C513.225 363.147 515 364.573 515 366.49V447H513V366.49Z" fill="url(#paint7_linear_748_166)" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M36 405C35.4477 405 35 405.448 35 406V447H33V406C33 404.343 34.3431 403 36 403H177C178.657 403 180 404.343 180 406V447H178V406C178 405.448 177.552 405 177 405H36Z" fill="#c8d8fa" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M36 405C35.4477 405 35 405.448 35 406V447H33V406C33 404.343 34.3431 403 36 403H177C178.657 403 180 404.343 180 406V447H178V406C178 405.448 177.552 405 177 405H36Z" fill="url(#paint8_linear_748_166)" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M527.797 227.604C545.804 219.835 567.766 214.8 594.193 214.8C615.949 214.8 632.146 218.982 644.032 225.741C655.913 232.497 663.518 241.845 668.066 252.231C677.026 272.693 674.124 297.205 668.566 313.8H558.337C562.399 301.746 564.976 285.474 562.646 269.552C560.333 253.744 543.175 238.249 527.797 227.604Z" fill="#d6e2fb" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M527.797 227.604C545.804 219.835 567.766 214.8 594.193 214.8C615.949 214.8 632.146 218.982 644.032 225.741C655.913 232.497 663.518 241.845 668.066 252.231C677.026 272.693 674.124 297.205 668.566 313.8H558.337C562.399 301.746 564.976 285.474 562.646 269.552C560.333 253.744 543.175 238.249 527.797 227.604Z" fill="url(#paint9_linear_748_166)" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M349.676 299.5C358.512 270.966 397.214 215 483.501 215H584.941C511.487 222.699 477.711 272.964 469.63 299.5H349.676Z" fill="#A8A8A8" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M349.676 299.5C358.512 270.966 397.214 215 483.501 215H584.941C511.487 222.699 477.711 272.964 469.63 299.5H349.676Z" fill="#F9FAFB" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M462.5 291H362V289H462.5V291Z" fill="#c8d8fa" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M473 271L425 271L425 269L473 269L473 271Z" fill="#c8d8fa" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M375 269H395V271H375V269Z" fill="#c8d8fa" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M493 251L447 251L447 249L493 249L493 251Z" fill="#c8d8fa" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M399 249H414V251H399V249Z" fill="#c8d8fa" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M523 231L488 231L488 229L523 229L523 231Z" fill="#c8d8fa" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M431 229H445V231H431V229Z" fill="#c8d8fa" />
                    <defs>
                        <linearGradient id="paint0_linear_748_166" x1="305.832" y1="196.202" x2="305.832" y2="624.008" gradientUnits="userSpaceOnUse">
                            <stop stopColor="white" stopOpacity="0" />
                            <stop offset="1" stopColor="white" />
                        </linearGradient>
                        <linearGradient id="paint1_linear_748_166" x1="439.5" y1="343.5" x2="370.919" y2="121.45" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#111928" />
                            <stop offset="1" stopColor="#111928" stopOpacity="0" />
                        </linearGradient>
                        <linearGradient id="paint2_linear_748_166" x1="224" y1="160.5" x2="-32.5" y2="-17" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#d6e2fb" stopOpacity="0" />
                            <stop offset="1" stopColor="#d6e2fb" />
                        </linearGradient>
                        <linearGradient id="paint3_linear_748_166" x1="208.422" y1="213.947" x2="230.05" y2="192.319" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#9ab7f6" stopOpacity="0" />
                            <stop offset="1" stopColor="#9ab7f6" />
                        </linearGradient>
                        <linearGradient id="paint4_linear_748_166" x1="243" y1="315.5" x2="620" y2="254.5" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#c8d8fa" stopOpacity="0" />
                            <stop offset="1" stopColor="#c8d8fa" />
                        </linearGradient>
                        <linearGradient id="paint5_linear_748_166" x1="159.108" y1="455.4" x2="159.108" y2="384.127" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#c8d8fa" stopOpacity="0" />
                            <stop offset="1" stopColor="#c8d8fa" />
                        </linearGradient>
                        <linearGradient id="paint6_linear_748_166" x1="281.005" y1="467.6" x2="281.005" y2="292.812" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#c8d8fa" stopOpacity="0" />
                            <stop offset="1" stopColor="#c8d8fa" />
                        </linearGradient>
                        <linearGradient id="paint7_linear_748_166" x1="387.5" y1="391" x2="423.5" y2="483" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#2563eb" stopOpacity="0" />
                            <stop offset="1" stopColor="#2563eb" />
                        </linearGradient>
                        <linearGradient id="paint8_linear_748_166" x1="77.6602" y1="391" x2="77.6602" y2="482.5" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#2563eb" stopOpacity="0" />
                            <stop offset="1" stopColor="#2563eb" />
                        </linearGradient>
                        <linearGradient id="paint9_linear_748_166" x1="561" y1="327" x2="561" y2="215" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#c8d8fa" stopOpacity="0" />
                            <stop offset="1" stopColor="#c8d8fa" />
                        </linearGradient>
                    </defs>
                </svg>

                <TitleCompGen title="Support & Aide" />

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div className="flex flex-col gap-3">

                    <form
                        onSubmit={handleSubmit}
                        className="backdrop-blur-xl bg-white/40 border border-white/20 
                          p-5 rounded-2xl shadow-2xl transition-all duration-300 
                          hover:shadow-xl w-full max-w-md mx-auto space-y-4"
                    >
                        <TitleCompGenLitle title={t('Déclarer un problème')} />

                        {/* Sélecteur */}
                        <div className="my-4">

                            <label className="block mb-2 text-sm font-medium text-gray-900">
                                {t('Choisir un type de problème')}
                            </label>

                            <select
                                value={problemType}
                                onChange={(e) => setProblemType(e.target.value)}
                                className="w-full p-3 rounded-xl bg-white/70 border border-gray-200 
                                 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
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
                                maxLength={100}
                                className="w-full p-3 rounded-xl bg-white/70 border border-gray-200 
                                focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none"
                            />

                        </div>

                        {/* Bouton */}
                        {
                            (!loading)?
                                <button
                                    type="submit"
                                    className="w-full text-white font-semibold 
                                      bg-gradient-to-r from-blue-500 to-purple-100 
                                      hover:from-blue-300 hover:to-purple-100
                                      rounded-xl py-2.5 transition-all duration-300 
                                      shadow-lg hover:shadow-xl active:scale-95"
                                >
                                    {t('helpPage.problemType.send')}
                                </button>
                            :
                            <LoadingCard/>
                        }
                    </form>

                    <TestmonyList />

                </div>

                <MessagesListWithPopover />

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

            <ul className="space-y-4 rounded-lg border-0 py-2 w-full" >

                {
                    messages(t)?.map(

                        (item, index) => (

                            <li key={index} className="relative ">

                                <button
                                    className="flex items-center justify-between gap-3 w-full p-3 
                                      bg-white/60 backdrop-blur-md rounded-xl 
                                      hover:bg-white/80 transition shadow-sm hover:shadow-md"
                                    onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                                >
                                    <> {item.text}</>

                                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="m9 5 7 7-7 7" />
                                    </svg>

                                </button>

                                {activeIndex === index && (
                                    <div className="absolute z-10 left-0 top-full mt-2 w-full 
                                        bg-white/80 backdrop-blur-lg border border-gray-200 
                                        p-3 rounded-xl shadow-lg"
                                    >
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
    const [hover, setHover] = useState(0);

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
            api.post("/content/testmony/", { content, number_stars: rating })
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

        <div>
            {/* Formulaire d'envoi */}
            <form
                onSubmit={handleSubmit}

                className="backdrop-blur-xl bg-white/40 border border-white/20 
                          p-5 rounded-2xl shadow-2xl transition-all duration-300 
                          hover:shadow-xl w-full max-w-md mx-auto space-y-4"
            >

                <label className="block mb-2 text-sm font-medium text-gray-900"> {t('Donnez votre avis')} </label>

                <section className="flex justify-between">

                    {/* Stars rating */}
                    <div className="flex justify-start mb-3 ">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                                key={star}
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHover(star)}
                                onMouseLeave={() => setHover(0)}
                                className={`w-6 h-6 cursor-pointer transition-transform duration-200 
                                        ${star <= (hover || rating)
                                        ? "text-yellow-400 scale-110"
                                        : "text-gray-300 hover:scale-110"}`}
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24" height="24"
                                fill={star <= rating ? "yellow" : "gray"}
                                viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeWidth="0" d="M11.083 5.104c.35-.8 1.485-.8 1.834 0l1.752 4.022a1 1 0 0 0 .84.597l4.463.342c.9.069 1.255 1.2.556 1.771l-3.33 2.723a1 1 0 0 0-.337 1.016l1.03 4.119c.214.858-.71 1.552-1.474 1.106l-3.913-2.281a1 1 0 0 0-1.008 0L7.583 20.8c-.764.446-1.688-.248-1.474-1.106l1.03-4.119A1 1 0 0 0 6.8 14.56l-3.33-2.723c-.698-.571-.342-1.702.557-1.771l4.462-.342a1 1 0 0 0 .84-.597l1.753-4.022Z" />
                            </svg>
                        ))}
                    </div>

                    <span className="flex items-center justify-center text-xs font-bold 
                        rounded-full bg-green-500 text-white h-6 min-w-[24px] px-2 
                        shadow-md"
                    >
                        {items.length}

                    </span>

                </section>

                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Écris ton témoignage..."
                    className="border-blue-800 p-3 rounded-xl w-full focus:ring-0 outline-none border border-gray-200"
                    rows="2"
                    maxLength={100}
                    required
                />

                {
                    loading ?
                    <LoadingCard/>
                    :
                    <button
                        type="submit"
                        className="w-full text-white font-semibold 
                                    bg-gradient-to-r from-blue-500 to-purple-100 
                                    hover:from-blue-300 hover:to-purple-100
                                    rounded-xl py-2.5 transition-all duration-300 
                                    shadow-lg hover:shadow-xl active:scale-95"
                    >
                        {t('send')}

                    </button>
                }
            </form>
            
        </div>
    );
}


