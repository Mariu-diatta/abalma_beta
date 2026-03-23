import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import LanguageDropdown from "../features/Langages";
import TitleCompGen, { TitleCompGenLitle } from "../components/TitleComponentGen";
import { ENDPOINTS } from "../utils";
import { useSelector } from "react-redux";

const Footer = () => {

    const { t } = useTranslation();

    const navigate = useNavigate();

    const componentRef = useRef(null);

    const componentRef_ = useRef(null);

    const currentNav = useSelector(state => state.navigate.currentNav);

    useEffect(() => {

        const observer = new IntersectionObserver(

            (entries) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {
                        entry.target.classList.add("animate-in");
                        entry.target.classList.remove("animate-out");

                    } else {
                        entry.target.classList.add("animate-out");
                        entry.target.classList.remove("animate-in");
                    }
                });
            },

            { threshold: 0.05 } // Déclenche quand 10% du composant est visible
        );

        const node = componentRef.current

        if (node) {
            observer.observe(node);
        }

        // Nettoyage de l'observateur lors du démontage
        return () => {

            if (node) {

                node.removeEventListener('scroll', () => { console.log(node) });
            }
        };

    }, []);


    useEffect(() => {

        const observer = new IntersectionObserver(

            (
                entries) => {

                entries.forEach(

                    (entry) => {

                        if (entry.isIntersecting) {
                            entry.target.classList.add("animate-in");
                            entry.target.classList.remove("animate-out");

                        } else {
                            entry.target.classList.add("animate-out");
                            entry.target.classList.remove("animate-in");
                        }
                    }
                );
            },

            { threshold: 0.1 } // Déclenche quand 10% du composant est visible
        );


        const node = componentRef_.current

        if (componentRef_.current) {
            observer.observe(componentRef_.current);
        }

        // Nettoyage de l'observateur lors du démontage
        return () => {

            if (node) {
                node.removeEventListener('scroll', () => { console.log(node) });
            }
        };

    }, []);

    if (currentNav === ENDPOINTS.REGISTER || currentNav === ENDPOINTS.LOGIN || currentNav === ENDPOINTS.FORGETPSWD) return

    return (

        <footer
            className="shadow-md border border-gray-100 w-full text-sm flex flex-col items-start justify-center mt-0 pt-0 bg-white/20"
        >

            <div className="flex flex-col gap-6 items-start lg:flex-row w-full  mx-auto px-4 text-center lg:text-left translate-y-1 transition-all duration-1000 ease-in-out bg-none" ref={componentRef_}>

                {/* Logo et description */}
                <div className="mb-3 md:mb-10 lg:w-1/2 flex flex-col justify-start ">

                    <TitleCompGen title={t('Abalma')} />

                    <p className=" mb-2 text-sm text-body-color">
                        {t("app_description")}
                    </p>

                    {/* Conditions et politique */}
                    <label className="flex flex-wrap gap-3 justify-start text-sm text-gray-700 mb-2">

                        <MyCheckbox/>

                        {t("footCondition")}

                        <button
                            onClick={() => navigate("/politique-confidentialite")}
                            target="_blank"
                            className="whitespace-nowrap text-blue-600 underline ml-1"
                        >
                            {t("politique")}
                        </button>

                    </label>

                </div>

                {/* Contact et langue */}
                <div className="flex flex-col gap-4 mb-2 mb:mb-5 lg:mb-0 lg:ml-auto">

                    <TitleCompGenLitle title={t('contact_us')} />

                    {/* Téléphone */}
                    <div className="flex items-center gap-3">

                        <svg
                            className="w-6 h-6 text-gray-800 dark:text-white"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1"
                                d="m17.0896 13.371 1.1431 1.1439c.1745.1461.3148.3287.4111.5349.0962.2063.1461.4312.1461.6588 0 .2276-.0499.4525-.1461.6587-.0963.2063-.4729.6251-.6473.7712-3.1173 3.1211-6.7739 1.706-9.90477-1.4254-3.13087-3.1313-4.54323-6.7896-1.41066-9.90139.62706-.61925 1.71351-1.14182 2.61843-.23626l1.1911 1.19193c1.1911 1.19194.3562 1.93533-.4926 2.80371-.92477.92481-.65643 1.72741 0 2.38391l1.8713 1.8725c.3159.3161.7443.4936 1.191.4936.4468 0 .8752-.1775 1.1911-.4936.8624-.8261 1.6952-1.6004 2.8382-.4565ZM14 8.98134l5.0225-4.98132m0 0L15.9926 4m3.0299.00002v2.98135"
                            />

                        </svg>

                        <span>+33 7 45 68 86 57</span>

                    </div>

                    {/* Email */}
                    <div className="flex items-center gap-3">

                        <svg
                            className="w-6 h-6 text-gray-800 dark:text-white"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1"
                                d="M7 9h5m3 0h2M7 12h2m3 0h5M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-6.616a1 1 0 0 0-.67.257l-2.88 2.592A.5.5 0 0 1 8 18.477V17a1 1 0 0 0-1-1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"
                            />

                        </svg>

                        <a href="mailto:mariusgdiatta@gmail.com" className="hover:underline">
                            {t("footer_sendEmail")}
                        </a>

                    </div>

                </div>

                {/* Langue */}
                <div className="flex flex-col items-center gap-1  text-sm">
                    <TitleCompGenLitle title={t("choose_language")} />
                    <LanguageDropdown/>
                </div>

                <div>

                    <TitleCompGenLitle title={t('follow_us')} />

                    <div className="flex gap-0 gap-3 bg-none py-5 mb:py-2 ">

                        <a
                            href="https://www.facebook.com/profile.php?id=61578340873240/"
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-stroke text-dark hover:border-primary hover:bg-primary hover:text-white dark:border-dark-3 dark:text-white dark:hover:border-primary"
                        >
                            <svg viewBox="0 0 8 16" className="w-4 h-4   fill-current">
                                <path d="M7.43902 6.4H6.19918H5.75639V5.88387V4.28387V3.76774H6.19918H7.12906C7.3726 3.76774 7.57186 3.56129 7.57186 3.25161V0.516129C7.57186 0.232258 7.39474 0 7.12906 0H5.51285C3.76379 0 2.54609 1.44516 2.54609 3.5871V5.83226V6.34839H2.10329H0.597778C0.287819 6.34839 0 6.63226 0 7.04516V8.90323C0 9.26452 0.243539 9.6 0.597778 9.6H2.05902H2.50181V10.1161V15.3032C2.50181 15.6645 2.74535 16 3.09959 16H5.18075C5.31359 16 5.42429 15.9226 5.51285 15.8194C5.60141 15.7161 5.66783 15.5355 5.66783 15.3806V10.1419V9.62581H6.13276H7.12906C7.41688 9.62581 7.63828 9.41935 7.68256 9.10968V9.08387V9.05806L7.99252 7.27742C8.01466 7.09677 7.99252 6.89032 7.85968 6.68387C7.8154 6.55484 7.61614 6.42581 7.43902 6.4Z" />
                            </svg>

                        </a>

                        <a
                            href="/"
                            onClick={()=>alert("Nous serons bientôt présent sur ce réseau") }
                            className="flex h-7 w-7  items-center justify-center rounded-full border border-stroke text-dark hover:border-primary hover:bg-primary hover:text-white dark:border-dark-3 dark:text-white dark:hover:border-primary"
                        >
                            <svg className="w-4 h-4   text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M13.795 10.533 20.68 2h-3.073l-5.255 6.517L7.69 2H1l7.806 10.91L1.47 22h3.074l5.705-7.07L15.31 22H22l-8.205-11.467Zm-2.38 2.95L9.97 11.464 4.36 3.627h2.31l4.528 6.317 1.443 2.02 6.018 8.409h-2.31l-4.934-6.89Z" />
                            </svg>
                        </a>

                        <a
                            href="/"
                            onClick={() => alert("Nous serons bientôt présent sur ce réseau")}
                            className="flex h-7 w-7  items-center justify-center rounded-full border border-stroke text-dark hover:border-primary hover:bg-primary hover:text-white dark:border-dark-3 dark:text-white dark:hover:border-primary"
                        >
                            <svg viewBox="0 0 16 12" className="w-4 h-4  fill-current">
                                <path d="M15.6645 1.88018C15.4839 1.13364 14.9419 0.552995 14.2452 0.359447C13.0065 6.59222e-08 8 0 8 0C8 0 2.99355 6.59222e-08 1.75484 0.359447C1.05806 0.552995 0.516129 1.13364 0.335484 1.88018C0 3.23502 0 6 0 6C0 6 0 8.79263 0.335484 10.1198C0.516129 10.8664 1.05806 11.447 1.75484 11.6406C2.99355 12 8 12 8 12C8 12 13.0065 12 14.2452 11.6406C14.9419 11.447 15.4839 10.8664 15.6645 10.1198C16 8.79263 16 6 16 6C16 6 16 3.23502 15.6645 1.88018ZM6.4 8.57143V3.42857L10.5548 6L6.4 8.57143Z" />
                            </svg>
                        </a>

                        <div
                            className="flex h-7 w-7  items-center justify-center rounded-full border border-stroke text-dark hover:border-primary hover:bg-primary hover:text-white dark:border-dark-3 dark:text-white dark:hover:border-primary"
                        >

                            <div className="badge-base LI-profile-badge" data-locale="fr_FR" data-size="medium" data-theme="light" data-type="VERTICAL" data-vanity="mariusdiatta" data-version="v1">

                                <a className="badge-base__link LI-simple-link" href="https://fr.linkedin.com/in/mariusdiatta?trk=profile-badge">

                                    <svg viewBox="0 0 14 14" className="w-4 h-4  fill-current">
                                        <path d="M13.0214 0H1.02084C0.453707 0 0 0.451613 0 1.01613V12.9839C0 13.5258 0.453707 14 1.02084 14H12.976C13.5432 14 13.9969 13.5484 13.9969 12.9839V0.993548C14.0422 0.451613 13.5885 0 13.0214 0ZM4.15142 11.9H2.08705V5.23871H4.15142V11.9ZM3.10789 4.3129C2.42733 4.3129 1.90557 3.77097 1.90557 3.11613C1.90557 2.46129 2.45002 1.91935 3.10789 1.91935C3.76577 1.91935 4.31022 2.46129 4.31022 3.11613C4.31022 3.77097 3.81114 4.3129 3.10789 4.3129ZM11.9779 11.9H9.9135V8.67097C9.9135 7.90323 9.89082 6.8871 8.82461 6.8871C7.73571 6.8871 7.57691 7.74516 7.57691 8.60323V11.9H5.51254V5.23871H7.53154V6.16452H7.55423C7.84914 5.62258 8.50701 5.08065 9.52785 5.08065C11.6376 5.08065 12.0232 6.43548 12.0232 8.2871V11.9H11.9779Z" />
                                    </svg>
                                </a>

                            </div>

                        </div>

                    </div>

                </div>


            </div>

            {/* Bas de page */}
            <div className="w-full  text-center text-sm  px-4 pt-2 mb-5 border-t border-gray-300 mb-8 pb-8 lg:mb-0 bg-none">

                <p className="text-sm mb-1 bg-none">
                    &copy; 2026 <strong className="text-blue-500">Abalma</strong> {t("footer_toutDroit")}
                </p>

            </div>

        </footer>
    );
};

function MyCheckbox() {

    const [isChecked, setIsChecked] = useState(() => {

        const saved = localStorage.getItem("ACCEPT_POLICY");

        return saved === "true"; // transforme string en boolean

    });

    useEffect(() => {

        // Synchronise localStorage à chaque changement de l'état
        localStorage.setItem("ACCEPT_POLICY", isChecked);

    }, [isChecked]);

    const handleCheckBox = (e) => {

        setIsChecked(e.target.checked); // récupère directement le booléen
    };

    return (

        <input
            type="checkbox"
            required
            className="mt-1 whitespace_nowrap"
            checked={isChecked}
            onChange={handleCheckBox}
        />
    );
}


export default Footer;