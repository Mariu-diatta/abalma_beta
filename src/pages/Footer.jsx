import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import LanguageDropdown from "../features/Langages";
import { ENDPOINTS } from "../utils";
import { useSelector } from "react-redux";

// ─── Icônes ───────────────────────────────────────────────────────────────────
const PhoneIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
            d="M18.427 14.768 17.2 13.542a1.733 1.733 0 0 0-2.45 0l-.613.613a1.732 1.732 0 0 1-2.45 0l-1.838-1.84a1.735 1.735 0 0 1 0-2.452l.612-.613a1.735 1.735 0 0 0 0-2.452L9.237 5.572a1.6 1.6 0 0 0-2.45 0c-3.223 3.22-.673 8.311 3.866 12.85 4.54 4.54 9.631 7.09 12.85 3.866a1.6 1.6 0 0 0 0-2.52Z" />
    </svg>
);

const EmailIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
            d="M7 9h5m3 0h2M7 12h2m3 0h5M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-6.616a1 1 0 0 0-.67.257l-2.88 2.592A.5.5 0 0 1 8 18.477V17a1 1 0 0 0-1-1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" />
    </svg>
);

// ─── Checkbox politique ───────────────────────────────────────────────────────
const PolicyCheckbox = () => {
    const [isChecked, setIsChecked] = useState(() => localStorage.getItem("ACCEPT_POLICY") === "true");

    useEffect(() => {
        localStorage.setItem("ACCEPT_POLICY", String(isChecked));
    }, [isChecked]);

    return (
        <input
            type="checkbox"
            className="ft-checkbox"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
            aria-label="Accepter la politique de confidentialité"
        />
    );
};

// ─── Footer ───────────────────────────────────────────────────────────────────
const Footer = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const currentNav = useSelector((state) => state.navigate.currentNav);

    const HIDDEN_NAVS = [ENDPOINTS.REGISTER, ENDPOINTS.LOGIN, ENDPOINTS.FORGETPSWD];
    if (HIDDEN_NAVS.includes(currentNav)) return null;

    const handleSocialAlert = (e) => {
        e.preventDefault();
        alert("Nous serons bientôt présent sur ce réseau");
    };

    return (
        <>
            <footer className="ft-root ft-footer items-center" role="contentinfo">

                {/* Grille principale */}
                <div className="ft-inner">

                    {/* ── Colonne marque ── */}
                    <div>
                        <p className="ft-brand-name">
                            Ab<span>alma</span>
                        </p>
                        <p className="ft-brand-desc">{t("app_description")}</p>

                        <label className="ft-policy">
                            <PolicyCheckbox />
                            <span>
                                {t("footCondition")}{" "}
                                <button
                                    type="button"
                                    className="ft-policy-link"
                                    onClick={() => navigate("/politique-confidentialite")}
                                >
                                    {t("politique")}
                                </button>
                            </span>
                        </label>
                    </div>

                    {/* ── Colonne contact ── */}
                    <div>
                        <p className="ft-col-title">{t("contact_us")}</p>

                        <div className="ft-contact-item">
                            <span className="ft-contact-icon"><PhoneIcon /></span>
                            <span>+33 7 45 68 86 57</span>
                        </div>

                        <div className="ft-contact-item">
                            <span className="ft-contact-icon"><EmailIcon /></span>
                            <a href="mailto:mariusgdiatta@gmail.com" className="ft-contact-link">
                                {t("footer_sendEmail")}
                            </a>
                        </div>
                    </div>

                    {/* ── Colonne langue ── */}
                    <div>
                        <p className="ft-col-title">{t("choose_language")}</p>
                        <LanguageDropdown />
                    </div>

                    {/* ── Colonne réseaux ── */}
                    <div>
                        <p className="ft-col-title">{t("follow_us")}</p>

                        <div className="ft-socials">
                            {/* Facebook */}
                            <a
                                href="https://www.facebook.com/profile.php?id=61578340873240/"
                                target="_blank"
                                rel="noreferrer"
                                className="ft-social-btn"
                                aria-label="Facebook"
                            >
                                <svg width="14" height="14" viewBox="0 0 8 16" fill="currentColor">
                                    <path d="M7.43902 6.4H6.19918H5.75639V5.88387V4.28387V3.76774H6.19918H7.12906C7.3726 3.76774 7.57186 3.56129 7.57186 3.25161V0.516129C7.57186 0.232258 7.39474 0 7.12906 0H5.51285C3.76379 0 2.54609 1.44516 2.54609 3.5871V5.83226V6.34839H2.10329H0.597778C0.287819 6.34839 0 6.63226 0 7.04516V8.90323C0 9.26452 0.243539 9.6 0.597778 9.6H2.05902H2.50181V10.1161V15.3032C2.50181 15.6645 2.74535 16 3.09959 16H5.18075C5.31359 16 5.42429 15.9226 5.51285 15.8194C5.60141 15.7161 5.66783 15.5355 5.66783 15.3806V10.1419V9.62581H6.13276H7.12906C7.41688 9.62581 7.63828 9.41935 7.68256 9.10968V9.08387V9.05806L7.99252 7.27742C8.01466 7.09677 7.99252 6.89032 7.85968 6.68387C7.8154 6.55484 7.61614 6.42581 7.43902 6.4Z" />
                                </svg>
                            </a>

                            {/* X (Twitter) */}
                            <a href="/" onClick={handleSocialAlert} className="ft-social-btn" aria-label="X / Twitter">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M13.795 10.533 20.68 2h-3.073l-5.255 6.517L7.69 2H1l7.806 10.91L1.47 22h3.074l5.705-7.07L15.31 22H22l-8.205-11.467Zm-2.38 2.95L9.97 11.464 4.36 3.627h2.31l4.528 6.317 1.443 2.02 6.018 8.409h-2.31l-4.934-6.89Z" />
                                </svg>
                            </a>

                            {/* YouTube */}
                            <a href="/" onClick={handleSocialAlert} className="ft-social-btn" aria-label="YouTube">
                                <svg width="14" height="14" viewBox="0 0 16 12" fill="currentColor">
                                    <path d="M15.6645 1.88018C15.4839 1.13364 14.9419 0.552995 14.2452 0.359447C13.0065 6.59222e-08 8 0 8 0C8 0 2.99355 6.59222e-08 1.75484 0.359447C1.05806 0.552995 0.516129 1.13364 0.335484 1.88018C0 3.23502 0 6 0 6C0 6 0 8.79263 0.335484 10.1198C0.516129 10.8664 1.05806 11.447 1.75484 11.6406C2.99355 12 8 12 8 12C8 12 13.0065 12 14.2452 11.6406C14.9419 11.447 15.4839 10.8664 15.6645 10.1198C16 8.79263 16 6 16 6C16 6 16 3.23502 15.6645 1.88018ZM6.4 8.57143V3.42857L10.5548 6L6.4 8.57143Z" />
                                </svg>
                            </a>

                            {/* LinkedIn */}
                            <a
                                href="https://fr.linkedin.com/in/mariusdiatta"
                                target="_blank"
                                rel="noreferrer"
                                className="ft-social-btn"
                                aria-label="LinkedIn"
                            >
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                                    <path d="M13.0214 0H1.02084C0.453707 0 0 0.451613 0 1.01613V12.9839C0 13.5258 0.453707 14 1.02084 14H12.976C13.5432 14 13.9969 13.5484 13.9969 12.9839V0.993548C14.0422 0.451613 13.5885 0 13.0214 0ZM4.15142 11.9H2.08705V5.23871H4.15142V11.9ZM3.10789 4.3129C2.42733 4.3129 1.90557 3.77097 1.90557 3.11613C1.90557 2.46129 2.45002 1.91935 3.10789 1.91935C3.76577 1.91935 4.31022 2.46129 4.31022 3.11613C4.31022 3.77097 3.81114 4.3129 3.10789 4.3129ZM11.9779 11.9H9.9135V8.67097C9.9135 7.90323 9.89082 6.8871 8.82461 6.8871C7.73571 6.8871 7.57691 7.74516 7.57691 8.60323V11.9H5.51254V5.23871H7.53154V6.16452H7.55423C7.84914 5.62258 8.50701 5.08065 9.52785 5.08065C11.6376 5.08065 12.0232 6.43548 12.0232 8.2871V11.9H11.9779Z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                </div>

                {/* ── Barre du bas ── */}
                <div className="ft-bottom">
                    <span>© 2026 <strong>Abalma</strong> — {t("footer_toutDroit")}</span>
                </div>

            </footer>
        </>
    );
};

export default Footer;