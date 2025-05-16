import React, { useState } from 'react';

const Tabs = () => {
    const [activeTab, setActiveTab] = useState('profile');

    const tabs = [
        { id: 'profile', label: 'Profile' },
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'settings', label: 'Settings' },
        { id: 'contacts', label: 'Contacts' },
    ];

    const tabContent = {
        profile: "This is some placeholder content for the Profile tab's associated content.",
        dashboard: "This is some placeholder content for the Dashboard tab's associated content.",
        settings: "This is some placeholder content for the Settings tab's associated content.",
        contacts: "This is some placeholder content for the Contacts tab's associated content.",
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
            <div className="mb-4 border-b border-gray-200 dark:border-gray-700 w-full max-w-2xl">
                <ul className="flex flex-wrap -mb-px text-sm font-medium text-center justify-center" role="tablist">
                    {tabs.map((tab) => (
                        <li className="me-2" key={tab.id} role="presentation">
                            <button
                                className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === tab.id
                                    ? 'text-purple-600 border-purple-600 dark:text-purple-500 dark:border-purple-500'
                                    : 'text-gray-500 border-transparent hover:text-gray-600 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                    }`}
                                onClick={() => setActiveTab(tab.id)}
                                type="button"
                                role="tab"
                                aria-selected={activeTab === tab.id}
                            >
                                {tab.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div id="default-styled-tab-content" className="w-full max-w-2xl">
                {tabs.map((tab) => (
                    <div
                        key={tab.id}
                        className={`p-4 rounded-lg bg-gray-50 dark:bg-gray-800 ${activeTab === tab.id ? '' : 'hidden'
                            }`}
                        role="tabpanel"
                        aria-labelledby={`${tab.id}-tab`}
                    >
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            This is some placeholder content for the <strong className="font-medium text-gray-800 dark:text-white">{tab.label} tab's associated content</strong>. Clicking another tab will toggle the visibility of this one for the next.
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Tabs;
