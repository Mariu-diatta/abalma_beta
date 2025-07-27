import React from "react";
import Logo from "../components/LogoApp";
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { LanguageDropdown } from "./Header";


const Footer = () => {

    const { t } = useTranslation();

    const navigate = useNavigate();

    return (

        <footer

            className="w-full bg-[var(--color-bg)] text-[var(--color-text)] text-sm pt-20 pb-0 flex flex-col items-center justify-center z-10"

            style={
                {
                    backgroundColor: "var(--color-bg)",
                    color: "var(--color-text)"
                }
            }
        >
            <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between px-4 gap-10">

                <div className="w-full lg:w-1/3 text-center lg:text-left">

                    <div className="mb-10">

                        <a href="/home" className="block w-full py-2">
                            <Logo/>
                        </a>

                        <p className="mb-7 text-base text-sm text-body-color dark:text-dark-6">
                          {t("app_description")}
                        </p>

                        <span className="flex text-sm font-medium text-dark dark:text-white text-sm">

                            <div className="flex flex-col gap-4">

                                {/* Téléphone */}
                                <div className="flex items-center gap-3">

                                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="m17.0896 13.371 1.1431 1.1439c.1745.1461.3148.3287.4111.5349.0962.2063.1461.4312.1461.6588 0 .2276-.0499.4525-.1461.6587-.0963.2063-.4729.6251-.6473.7712-3.1173 3.1211-6.7739 1.706-9.90477-1.4254-3.13087-3.1313-4.54323-6.7896-1.41066-9.90139.62706-.61925 1.71351-1.14182 2.61843-.23626l1.1911 1.19193c1.1911 1.19194.3562 1.93533-.4926 2.80371-.92477.92481-.65643 1.72741 0 2.38391l1.8713 1.8725c.3159.3161.7443.4936 1.191.4936.4468 0 .8752-.1775 1.1911-.4936.8624-.8261 1.6952-1.6004 2.8382-.4565ZM14 8.98134l5.0225-4.98132m0 0L15.9926 4m3.0299.00002v2.98135" />
                                    </svg>

                                    <span>+012 (345) 678 99</span>

                                </div>

                                {/* Email */}
                                <div className="flex items-center gap-3">

                                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M7 9h5m3 0h2M7 12h2m3 0h5M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-6.616a1 1 0 0 0-.67.257l-2.88 2.592A.5.5 0 0 1 8 18.477V17a1 1 0 0 0-1-1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" />
                                    </svg>

                                    <a href="mailto:mariusgdiatta@gmail.com" className="hover:underline">
                                        {t("footer_sendEmail")}
                                    </a>

                                </div>

                                <div className="flex items-center gap-3 text-sm">

                                     <span>{t("choose_language")}</span>

                                     <LanguageDropdown/>

                                </div>

                            </div>

                        </span>

                    </div>

                    <label className="flex gap-2 text-sm text-gray-700 mb-5">

                        <input type="checkbox" required className="mt-1" />

                        {t("footCondition")}

                        <button onClick={()=>navigate("/politique-confidentialite")} target="_blank" className="text-blue-600 underline ml-1">

                            {t("politique")}

                        </button>

                    </label>

                </div>

                <div className="w-full lg:w-2/3 flex flex-wrap justify-center lg:justify-end gap-8">

                    <LinkGroup header={t("Resources")}>
                        <NavLink link="/#" label={t('footer_saas')}/>
                        <NavLink link="/#" label={t("footer_product")} />
                        <NavLink link="/#" label={t("footer_userflow")} />
                    </LinkGroup>

                    <LinkGroup header="Company">
                        <NavLink link="/#" label={t("about_app")} />
                        <NavLink link="/#" label={t("contact_support")} />
                        <NavLink link="/#" label={t("success_history")} />
                    </LinkGroup>

                    <LinkGroup header={t('quick_links')} >
                        <NavLink link="/#" label={t("premium_support")} />
                        <NavLink link="/#" label={t("our_services")} />
                        <NavLink link="/#" label={t("know_our_team")} />
                    </LinkGroup>
                </div>

            </div>

            <div className="bg-[var(--color-bg)] text-[var(--color-text)] mb-10 w-full border-t border-gray-200 dark:border-dark-3 mt-10 bg-gray-200 text-center text-sm text-gray-600 dark:text-gray-400 px-4">

                <div className="flex-wrap justify-center gap-2 items-center p-2">

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        &copy; 2025 <strong>Abalma</strong> {t("footer_toutDroit")}
                    </p>

                    <div className="mb-6 flex justify-center flex-wrap gap-1">

                        <a
                            href="/home"
                            className="bg-[var(--color-bg)] text-[var(--color-text)] mr-3 flex h-8 w-8 items-center justify-center rounded-full border border-stroke text-dark hover:border-primary hover:bg-primary hover:text-white dark:border-dark-3 dark:text-white dark:hover:border-primary sm:mr-4 lg:mr-3 xl:mr-4"
                        >
                            <svg
                                width="8"
                                height="16"
                                viewBox="0 0 8 16"
                                className="fill-current"
                            >
                                <path d="M7.43902 6.4H6.19918H5.75639V5.88387V4.28387V3.76774H6.19918H7.12906C7.3726 3.76774 7.57186 3.56129 7.57186 3.25161V0.516129C7.57186 0.232258 7.39474 0 7.12906 0H5.51285C3.76379 0 2.54609 1.44516 2.54609 3.5871V5.83226V6.34839H2.10329H0.597778C0.287819 6.34839 0 6.63226 0 7.04516V8.90323C0 9.26452 0.243539 9.6 0.597778 9.6H2.05902H2.50181V10.1161V15.3032C2.50181 15.6645 2.74535 16 3.09959 16H5.18075C5.31359 16 5.42429 15.9226 5.51285 15.8194C5.60141 15.7161 5.66783 15.5355 5.66783 15.3806V10.1419V9.62581H6.13276H7.12906C7.41688 9.62581 7.63828 9.41935 7.68256 9.10968V9.08387V9.05806L7.99252 7.27742C8.01466 7.09677 7.99252 6.89032 7.85968 6.68387C7.8154 6.55484 7.61614 6.42581 7.43902 6.4Z" />

                            </svg>

                        </a>

                        <a
                            href="/home"
                            className="bg-[var(--color-bg)] text-[var(--color-text)] mr-3 flex h-8 w-8 items-center justify-center rounded-full border border-stroke text-dark hover:border-primary hover:bg-primary hover:text-white dark:border-dark-3 dark:text-white dark:hover:border-primary sm:mr-4 lg:mr-3 xl:mr-4"
                        >
                            <svg
                                width="16"
                                height="12"
                                viewBox="0 0 16 12"
                                className="fill-current"
                            >
                                <path d="M14.2194 2.06654L15.2 0.939335C15.4839 0.634051 15.5613 0.399217 15.5871 0.2818C14.8129 0.704501 14.0903 0.845401 13.6258 0.845401H13.4452L13.3419 0.751468C12.7226 0.258317 11.9484 0 11.1226 0C9.31613 0 7.89677 1.36204 7.89677 2.93542C7.89677 3.02935 7.89677 3.17025 7.92258 3.26419L8 3.73386L7.45806 3.71037C4.15484 3.61644 1.44516 1.03327 1.00645 0.587084C0.283871 1.76125 0.696774 2.88845 1.13548 3.59296L2.0129 4.90802L0.619355 4.20352C0.645161 5.18982 1.05806 5.96477 1.85806 6.52838L2.55484 6.99804L1.85806 7.25636C2.29677 8.45401 3.27742 8.94716 4 9.13503L4.95484 9.36986L4.05161 9.93346C2.60645 10.8728 0.8 10.8024 0 10.7319C1.62581 11.7652 3.56129 12 4.90323 12C5.90968 12 6.65806 11.9061 6.83871 11.8356C14.0645 10.2857 14.4 4.41487 14.4 3.2407V3.07632L14.5548 2.98239C15.4323 2.23092 15.7935 1.8317 16 1.59687C15.9226 1.62035 15.8194 1.66732 15.7161 1.6908L14.2194 2.06654Z" />
                            </svg>
                        </a>

                        <a
                            href="/home"
                            className="bg-[var(--color-bg)] text-[var(--color-text)] mr-3 flex h-8 w-8 items-center justify-center rounded-full border border-stroke text-dark hover:border-primary hover:bg-primary hover:text-white dark:border-dark-3 dark:text-white dark:hover:border-primary sm:mr-4 lg:mr-3 xl:mr-4"
                        >
                            <svg
                                width="16"
                                height="12"
                                viewBox="0 0 16 12"
                                className="fill-current"
                            >
                                <path d="M15.6645 1.88018C15.4839 1.13364 14.9419 0.552995 14.2452 0.359447C13.0065 6.59222e-08 8 0 8 0C8 0 2.99355 6.59222e-08 1.75484 0.359447C1.05806 0.552995 0.516129 1.13364 0.335484 1.88018C0 3.23502 0 6 0 6C0 6 0 8.79263 0.335484 10.1198C0.516129 10.8664 1.05806 11.447 1.75484 11.6406C2.99355 12 8 12 8 12C8 12 13.0065 12 14.2452 11.6406C14.9419 11.447 15.4839 10.8664 15.6645 10.1198C16 8.79263 16 6 16 6C16 6 16 3.23502 15.6645 1.88018ZM6.4 8.57143V3.42857L10.5548 6L6.4 8.57143Z" />
                            </svg>
                        </a>

                        <a
                            href="/home"
                            className="bg-[var(--color-bg)] text-[var(--color-text)] mr-3 flex h-8 w-8 items-center justify-center rounded-full border border-stroke text-dark hover:border-primary hover:bg-primary hover:text-white dark:border-dark-3 dark:text-white dark:hover:border-primary sm:mr-4 lg:mr-3 xl:mr-4"
                        >
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 14 14"
                                className="fill-current"
                            >
                                <path d="M13.0214 0H1.02084C0.453707 0 0 0.451613 0 1.01613V12.9839C0 13.5258 0.453707 14 1.02084 14H12.976C13.5432 14 13.9969 13.5484 13.9969 12.9839V0.993548C14.0422 0.451613 13.5885 0 13.0214 0ZM4.15142 11.9H2.08705V5.23871H4.15142V11.9ZM3.10789 4.3129C2.42733 4.3129 1.90557 3.77097 1.90557 3.11613C1.90557 2.46129 2.45002 1.91935 3.10789 1.91935C3.76577 1.91935 4.31022 2.46129 4.31022 3.11613C4.31022 3.77097 3.81114 4.3129 3.10789 4.3129ZM11.9779 11.9H9.9135V8.67097C9.9135 7.90323 9.89082 6.8871 8.82461 6.8871C7.73571 6.8871 7.57691 7.74516 7.57691 8.60323V11.9H5.51254V5.23871H7.53154V6.16452H7.55423C7.84914 5.62258 8.50701 5.08065 9.52785 5.08065C11.6376 5.08065 12.0232 6.43548 12.0232 8.2871V11.9H11.9779Z" />
                            </svg>
                        </a>

                    </div>
                </div>
                  
            </div>

        </footer>
    );
};

export default Footer;

const LinkGroup = ({ children, header }) => {

    return (

        <>
            <div className="w-full px-4 sm:w-1/2 lg:w-2/12 text-sm">

                <div className="mb-10 w-full">

                    <h4 className="mb-9 text-md font-semibold text-dark dark:text-white">
                        {header}
                    </h4>

                    <ul className="space-y-3 text-sm">{children}</ul>

                </div>

            </div>
        </>
    );
};

const NavLink = ({ link, label }) => {

    return (
        <li>
            <a
                href={link}
                className="inline-block text-base leading-loose text-body-color hover:text-primary dark:text-dark-6"
            >
                {label}
            </a>
        </li>
    );
};
