import React from 'react'

const ThemeSelector = ({ value, onChange, t }) => (

    <div className="flex flex-col sm:flex-row sm:items-center gap-4">

        <label className="ms-2 font-extrabold ">{t('settingsText.theme')}</label>

        <select
            name="theme"
            value={value}
            onChange={onChange}
            className="style-bg border-0 bg-gray-50 border-0 border-gray-300 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 p-2.5"
        >
            <option value="light">{t('settingsText.themeLight')}</option>

            <option value="dark" className="hidden">{t('settingsText.themeDark')}</option>

        </select>

    </div>
);

export default ThemeSelector;