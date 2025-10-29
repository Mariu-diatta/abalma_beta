import React from 'react'

const NotificationToggle = ({ checked, onChange, t }) => (

    <div className="flex items-center">

        <input
            id="notifications"
            type="checkbox"
            name="notifications"
            checked={checked}
            onChange={onChange}
            className="w-4 h-4 text-blue-100 bg-gray-100 border-gray-300 rounded focus:ring-blue-100 dark:bg-gray-100 dark:border-gray-100"
        />

        <label htmlFor="notifications" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('settingsText.notifications')}
        </label>

    </div>
);

export default NotificationToggle;