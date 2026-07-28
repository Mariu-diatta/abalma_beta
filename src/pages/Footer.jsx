import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import LanguageDropdown from "../features/Langages";

import { FaAndroid, FaDownload } from "react-icons/fa";
import {
    FaCcVisa,
    FaCcMastercard,
    FaCcAmex,
    FaCcDiscover,
    FaApplePay,
    FaGooglePay,
} from "react-icons/fa";


// ================= DOWNLOAD ================

const DownloadApkButton = () => {
    const { t } = useTranslation();

    return (
        <motion.a
            href="/downloads/app-debug.apk"
            download
            aria-label={t("download_apk") || "Installer l'application Android"}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="
                group
                inline-flex
                items-center
                gap-3
                rounded-xl
                border
                border-indigo-100
                bg-indigo-50
                px-4
                py-2.5
                text-indigo-600
                shadow-sm
                hover:shadow-md
                hover:bg-indigo-500
                hover:border-indigo-500
                hover:text-white
                transition-colors
                duration-200
                w-fit
            "
        >
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/60 group-hover:bg-white/20 transition-colors shrink-0">
                <FaAndroid className="text-lg" />
            </span>

            <span className="flex flex-col leading-tight text-left">
             
                <span className="text-xs font-semibold flex items-center gap-1.5">
                    {t("download_apk") || "Installer l'APK"}
                    <FaDownload className="text-[10px] opacity-70 group-hover:translate-y-0.5 transition-transform" />
                </span>
            </span>
        </motion.a>
    );
};



// ================= ICONES =================

const PhoneIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
        <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            d="M18.427 14.768 17.2 13.542a1.733 1.733 0 0 0-2.45 0l-.613.613a1.732 1.732 0 0 1-2.45 0l-1.838-1.84a1.735 1.735 0 0 1 0-2.452l.612-.613a1.735 1.735 0 0 0 0-2.452L9.237 5.572a1.6 1.6 0 0 0-2.45 0c-3.223 3.22-.673 8.311 3.866 12.85 4.54 4.54 9.631 7.09 12.85 3.866a1.6 1.6 0 0 0 0-2.52Z"
        />
    </svg>
);


const EmailIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
        <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            d="M7 9h5m3 0h2M7 12h2m3 0h5M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-6.616a1 1 0 0 0-.67.257l-2.88 2.592A.5.5 0 0 1 8 18.477V17a1 1 0 0 0-1-1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"
        />
    </svg>
);


// ================= POLICY =================

const PolicyCheckbox = () => {

    const [checked, setChecked] = useState(() => {

        if (typeof window === "undefined")
            return false;

        return localStorage.getItem("ACCEPT_POLICY") === "true";

    });


    useEffect(() => {

        if (typeof window !== "undefined") {
            localStorage.setItem(
                "ACCEPT_POLICY",
                String(checked)
            );
        }

    }, [checked]);


    return (
        <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            className="ft-checkbox"
            aria-label="Accepter la politique"
        />
    );
};


// ================= SOCIAL =================

const SocialBtn = ({
    href,
    label,
    onClick,
    children
}) => (

    <motion.a

        href={href || "#"}

        onClick={onClick}

        target={href ? "_blank" : undefined}

        rel="noopener noreferrer"

        aria-label={label}

        whileHover={{
            y: -3,
            scale: 1.12
        }}

        whileTap={{
            scale: .93
        }}

        className="
            flex items-center justify-center
            w-9 h-9 rounded-xl
            border border-gray-200
            text-gray-500
            hover:text-indigo-500
            hover:border-indigo-200
            hover:bg-indigo-50
            transition
        "

    >

        {children}

    </motion.a>

);


// ================= TITRE =================

const ColTitle = ({ children }) => (

    <p className="
        text-[11px]
        font-semibold
        uppercase
        tracking-widest
        text-gray-400
        mb-4
        ">

        {children}

    </p>

);

// ================= PAYMENT =================

const PaymentFooter = () => {

    const { t } = useTranslation();


    return (

        <div className="
                mt-5
                pt-5
                border-t
                border-gray-100
            "
        >

            <p className="text-xs text-gray-400 mb-3">

                {t("text_payment")}

            </p>


            <div className="
                flex
                gap-3
                text-[32px]
                text-gray-400
                "
            >

                <FaCcVisa />
                <FaCcMastercard />
                <FaCcAmex />
                <FaCcDiscover />
                <FaApplePay />
                <FaGooglePay />

            </div>


            <p className="text-xs mt-2 text-gray-600">

                {t("text_footer_payment")}

            </p>


        </div>

    );

};


// ================= FOOTER =================

const Footer = () => {

    const { t } = useTranslation();

    const navigate = useNavigate();


    const handleSocialAlert = (e) => {

        e.preventDefault();

        alert(
            "Nous serons bientôt présents sur ce réseau"
        );

    };



    return (

        <footer
            className="mt-auto"
            role="contentinfo"
        >


            <div className="
                h-px
                w-full
                bg-gradient-to-r
                from-transparent
                via-indigo-200
                to-transparent
                "
            />


            <div className="
            max-w-6xl
            mx-auto
            px-6
            py-14
            ">


                <div className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    lg:grid-cols-4
                    gap-12
                    ">


                    {/* MARQUE */}

                    <div className="flex flex-col gap-4">

                        <div className="
                        text-2xl
                        font-bold
                        text-gray-900
                        ">

                            Ab<span className="text-indigo-500">
                                alma
                            </span>

                        </div>


                        <p className="text-sm text-gray-500">

                            {t("app_description")}

                        </p>


                        <DownloadApkButton/>


                        <label className="flex gap-3 items-start text-xs text-gray-400">

                            <PolicyCheckbox />


                            <span>

                                {t("footCondition")}

                                {" "}

                                <button

                                    type="button"

                                    onClick={() => navigate(
                                        "/politique-confidentialite"
                                    )}

                                    className="
                                    text-indigo-500
                                    underline
                                    "

                                >

                                    {t("politique")}

                                </button>


                            </span>


                        </label>


                    </div>



                    {/* CONTACT */}

                    <div className="flex flex-col gap-4">

                        <ColTitle>
                            {t("contact_us")}
                        </ColTitle>


                        <div className="flex gap-3 items-center text-sm text-gray-500">

                            <span className="
                            w-8 h-8
                            flex
                            items-center
                            justify-center
                            rounded-lg
                            bg-gray-50
                            ">

                                <PhoneIcon />

                            </span>

                            +33 7 45 68 86 57

                        </div>



                        <div className="flex gap-3 items-center">

                            <span className="
                            w-8 h-8
                            flex
                            items-center
                            justify-center
                            rounded-lg
                            bg-gray-50
                            ">

                                <EmailIcon />

                            </span>


                            <a
                                href="mailto:mariusgdiatta@gmail.com"
                                className="
                                text-indigo-500
                                hover:underline
                                "
                            >

                                {t("footer_sendEmail")}

                            </a>


                        </div>


                    </div>




                    {/* LANGUE */}

                    <div className="flex flex-col gap-4">

                        <ColTitle>

                            {t("choose_language")}

                        </ColTitle>


                        <LanguageDropdown />


                    </div>



                    {/* SOCIAL */}

                    <div className="flex flex-col gap-4">


                        <ColTitle>

                            {t("follow_us")}

                        </ColTitle>


                        <div className="flex gap-2">


                            <SocialBtn
                                href="https://www.facebook.com/profile.php?id=61578340873240"
                                label="Facebook"
                            >


                                F

                            </SocialBtn>


                            <SocialBtn
                                label="X"
                                onClick={handleSocialAlert}
                            >


                                X

                            </SocialBtn>



                            <SocialBtn
                                label="Youtube"
                                onClick={handleSocialAlert}
                            >


                                ▶

                            </SocialBtn>



                            <SocialBtn
                                href="https://fr.linkedin.com/in/mariusdiatta"
                                label="LinkedIn"
                            >


                                in

                            </SocialBtn>


                        </div>



                        <PaymentFooter />


                    </div>


                </div>



                <div className="
                mt-10
                pt-4
                border-t
                border-gray-200
                flex
                flex-col
                sm:flex-row
                justify-between
                gap-2
                text-xs
                text-gray-400
                ">


                    <span>

                        © 2026 <strong>Abalma</strong> — {t("footer_toutDroit")}

                    </span>


                    <span>

                        {t("madeWithLove")}

                    </span>


                </div>


            </div>


        </footer>


    );

};


export default Footer;