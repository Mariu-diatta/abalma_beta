import React from "react";
import { useTranslation } from "react-i18next";
import { services } from "../utils";
import TitleCompGen from "../components/TitleComponentGen";


// ─── Composant ────────────────────────────────────────────────────────────────
const ServicesSection = () => {
    const { t } = useTranslation();

    return (
        <>
            <section className="ss-root ss-section" aria-labelledby="services-title">

                {/* Header */}
                <div className="ss-header">
                    <TitleCompGen title="Nos services" />
                </div>

                {/* Grille de services */}
                <div className="ss-grid" role="list">
                    {services?.map((service, index) => (
                        <article
                            key={service?.key ?? index}
                            className="ss-card"
                            role="listitem"
                        >
                            <div className="ss-icon-wrap" aria-hidden="true">
                                {service.icon}
                            </div>

                            <div>
                                <h3 className="ss-card-title">
                                    {t(`${service.key}.title`)}
                                </h3>
                            </div>

                            <p className="ss-card-desc">
                                {t(`${service.key}.description`)}
                            </p>

                            <span className="ss-card-link" aria-hidden="true">
                                En savoir plus
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="m9 5 7 7-7 7" />
                                </svg>
                            </span>
                        </article>
                    ))}
                </div>

            </section>
        </>
    );
};

export default ServicesSection;