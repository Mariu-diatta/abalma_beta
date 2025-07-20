import React from 'react';
import { useTranslation } from 'react-i18next';
import Logo from '../components/LogoApp';

const PrivacyPolicy = () => {

    const { t } = useTranslation();

    return (

        <div className="max-w-3xl mx-auto p-6 text-gray-800 dark:text-gray-200 text-sm shadow-lg">

            {/* Logo */}
            <div className="absolute top-1 left-2 hidden lg:block">
                <Logo />
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-primary mb-2">{t('title_policy')}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">{t('last_updated')}</p>

            {/* Sections */}
            <section className="mb-8">
                <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-2">{t('section_1_title')}</h2>
                <p className="leading-relaxed">{t('section_1_content')}</p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-2">{t('section_2_title')}</h2>
                <ul className="list-disc list-inside space-y-1">
                    <li>{t('section_2_list.1')}</li>
                    <li>{t('section_2_list.2')}</li>
                    <li>{t('section_2_list.3')}</li>
                    <li>{t('section_2_list.4')}</li>
                    <li>{t('section_2_list.5')}</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-2">{t('section_3_title')}</h2>
                <ul className="list-disc list-inside space-y-1">
                    <li>{t('section_3_list.1')}</li>
                    <li>{t('section_3_list.2')}</li>
                    <li>{t('section_3_list.3')}</li>
                    <li>{t('section_3_list.4')}</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-2">{t('section_4_title')}</h2>
                <p className="leading-relaxed">{t('section_4_content')}</p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-2">{t('section_5_title')}</h2>
                <p className="leading-relaxed">{t('section_5_content')}</p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-2">{t('section_6_title')}</h2>
                <ul className="list-disc list-inside space-y-1">
                    <li>{t('section_6_list.1')}</li>
                    <li>{t('section_6_list.2')}</li>
                    <li>{t('section_6_list.3')}</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-2">{t('section_7_title')}</h2>
                <p className="leading-relaxed">{t('section_7_content_1')}</p>
                <p className="leading-relaxed mt-2">{t('section_7_content_2')}</p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-2">{t('section_8_title')}</h2>
                <p className="leading-relaxed">{t('section_8_content')}</p>
            </section>

            <section>
                <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-2">{t('section_9_title')}</h2>
                <p className="leading-relaxed">{t('section_9_content')}</p>
            </section>
        </div>
    );
};

export default PrivacyPolicy;
