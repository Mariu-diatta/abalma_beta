import React, { useState } from 'react';
import ProductTable from './ListProductFilterWithImage';
import ProductTablePagination from './ListProductPagination';
import Settings from './Settings';

const ProfileCard = () => {
    return (
        <div className="w-full bg-white rounded-md overflow-hidden shadow-md max-w-xl mx-auto">
            {/* Cover Image */}
            <div
                className="relative h-56 bg-cover bg-center"
                style={{
                    backgroundImage:
                        "url('https://images.unsplash.com/photo-1612832020897-593fae15346e')",
                }}
            >
                <div className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-100 transition">
                    📷
                </div>
            </div>

            {/* Profile Section */}
            <div className="relative px-6 pb-6">
                {/* Profile Picture */}
                <div className="absolute -top-16 left-1/2 sm:left-6 transform -translate-x-1/2 sm:translate-x-0">
                    <div className="relative">
                        <img
                            src="https://randomuser.me/api/portraits/men/32.jpg"
                            alt="Profile"
                            className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-md object-cover"
                        />
                        <div className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-md cursor-pointer hover:bg-gray-100 transition">
                            📷
                        </div>
                    </div>
                </div>

                {/* Info */}
                <div className="pt-20 sm:pt-6 sm:ml-40">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                                Danish Hebo
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Professional UI/UX Designer
                            </p>
                        </div>
                        <div className="flex items-center flex-wrap gap-3 text-gray-600 dark:text-gray-400">
                            <span className="text-sm">Follow me on</span>
                            <svg
                                className="w-6 h-6 cursor-pointer hover:text-purple-600 transition"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                aria-label="Social Icon 1"
                            >
                                <path d="M12 4a8 8 0 0 0-6.895 12.06l.569.718-.697 2.359 2.32-.648.379.243A8 8 0 1 0 12 4Z" />
                            </svg>
                            <svg
                                className="w-6 h-6 cursor-pointer hover:text-purple-600 transition"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                aria-label="Social Icon 2"
                            >
                                <path d="M13.135 6H15V3h-1.865a4.147 4.147 0 0 0-4.142 4.142V9H7v3h2v9.938h3V12h2.021l.592-3H12V6.591..." />
                            </svg>
                        </div>
                    </div>

                    {/* Description */}
                    <p className="mt-4 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
                        posuere fermentum urna, eu condimentum mauris tempus ut. Donec fermentum
                        blandit aliquet.
                    </p>
                </div>

                {/* Buttons */}
                <div
                    className="mt-6 flex flex-col sm:flex-row gap-2 rounded-md shadow-sm w-full sm:w-auto"
                    role="group"
                    aria-label="Profile actions"
                >
                    <button
                        type="button"
                        className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-md sm:rounded-r-none hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white transition"
                    >
                        Modifier
                    </button>
                    <button
                        type="button"
                        className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-md sm:rounded-none hover:bg-red-100 hover:text-red-700 focus:z-10 focus:ring-2 focus:ring-red-700 focus:text-red-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-red-500 dark:focus:text-white transition"
                    >
                        Supprimer
                    </button>
                    <button
                        type="button"
                        className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-md sm:rounded-l-none hover:bg-yellow-100 hover:text-yellow-700 focus:z-10 focus:ring-2 focus:ring-yellow-500 focus:text-yellow-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-yellow-400 dark:focus:text-white transition"
                    >
                        Passer à compte pro
                    </button>
                </div>
            </div>
        </div>
    );
};

const Tabs = () => {
    const [activeTab, setActiveTab] = useState('profile');

    const tabs = [
        { id: 'profile', label: 'Profil' },
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'settings', label: 'Paramètres' },
        { id: 'contacts', label: 'Contacts' },
    ];

    const tabContent = {
        profile: <ProfileCard />,
        dashboard: (
            <div className="p-6 space-y-6 max-w-7xl mx-auto">
                <div className="mb-6 text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
                        Bienvenue !
                    </h1>
                    <p className="mt-2 text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                        Here at Flowbite we focus on markets where technology, innovation, and capital
                        can unlock long-term value and drive economic growth.
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <ProductTable />
                </div>

                <ProductTablePagination />
            </div>
        ),
        settings: (
            <div className="p-6 max-w-4xl mx-auto text-gray-700 dark:text-gray-300">
                <Settings />
            </div>
        ),
        contacts: (
            <div className="p-6 max-w-4xl mx-auto text-gray-700 dark:text-gray-300">
                Contacts content goes here.
            </div>
        ),
    };

    return (
        <div className="min-h-screen w-full bg-gray-100 dark:bg-gray-900 px-4 py-6">
            <div className="max-w-7xl mx-auto">
                {/* Tabs Navigation */}
                <nav className="mb-4 border-b border-gray-200 dark:border-gray-700" role="tablist" aria-label="Main tabs">
                    <ul className="flex space-x-2 overflow-x-auto text-sm font-medium text-center">
                        {tabs.map((tab) => (
                            <li key={tab.id} role="presentation">
                                <button
                                    type="button"
                                    role="tab"
                                    aria-selected={activeTab === tab.id}
                                    aria-controls={`${tab.id}-tab`}
                                    id={`${tab.id}-tab-button`}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`inline-block px-4 py-3 border-b-2 rounded-t-md transition-colors duration-300 ${activeTab === tab.id
                                            ? 'border-purple-600 text-purple-600 dark:border-purple-500 dark:text-purple-500'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                        } focus:outline-none focus:ring-2 focus:ring-purple-600 dark:focus:ring-purple-500`}
                                >
                                    {tab.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Tab Content */}
                <section
                    id={`${activeTab}-tab`}
                    role="tabpanel"
                    aria-labelledby={`${activeTab}-tab-button`}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md min-h-[400px] overflow-auto"
                >
                    {tabContent[activeTab]}
                </section>
            </div>
        </div>
    );
};

export default Tabs;
