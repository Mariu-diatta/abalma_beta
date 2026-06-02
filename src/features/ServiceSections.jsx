import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { services } from "../utils";
import TitleCompGen from "../components/TitleComponentGen";

const ServicesSection = () => {

    const { t } = useTranslation();

    return (
        <section
            className="relative py-20 max-w-6xl mx-auto"
            aria-labelledby="services-title"
        >
            <div className="mb-16 text-center">
                <TitleCompGen title="Nos services" />
            </div>

            <div className="relative">
                {services?.map((service, index) => (
                    <motion.article
                        key={service?.key ?? index}
                        initial={{ opacity: 0, y: 0, scale: 0.98 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: false, amount: 0.7 }}
                        transition={{
                            duration: 0.6,
                            ease: "easeOut",
                        }}
                        className="
                            sticky
                            max-w-3xl
                            mx-auto
                            bg-white
                            rounded-3xl
                            shadow-xl
                            p-8
                            h-[400px]
                        "
                        style={{
                            top: `${index * 10}px`, // 🔥 clé du décalage vers le HAUT
                            zIndex: index + 1,
                        }}
                    >
                        <div className="flex flex-col items-center text-center">
                            <div className="text-5xl mb-4">{service.icon}</div>

                            <h3 className="text-2xl font-bold mb-3">
                                {t(`${service.key}.title`)}
                            </h3>

                            <p className="text-gray-600">
                                {t(`${service.key}.description`)}
                            </p>
                        </div>
                    </motion.article>
                ))}
            </div>

        </section>
    );
};

export default ServicesSection;



