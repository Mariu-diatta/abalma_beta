import React, { useState } from 'react';
import ProfileCard from './ProfilUser';
import ProductTable from './ListProductShoppingCart';
import ProductTablePagination from './ListProductPagination';
import ProductsRecapTable from './ProductRecaptable';
import UserTable from '../components/ContactUser';
import SettingsForm from './Settings';

const users = [
    {
        name: "Neil Sims",
        email: "neil.sims@flowbite.com",
        position: "Commerçant",
        status: "Online",
        img: "/docs/images/people/profile-picture-1.jpg",
    },
    {
        name: "Bonnie Green",
        email: "bonnie@flowbite.com",
        position: "Acheteur",
        status: "Online",
        img: "/docs/images/people/profile-picture-3.jpg",
    },
    {
        name: "Jese Leos",
        email: "jese@flowbite.com",
        position: "Emprunteur",
        status: "Online",
        img: "/docs/images/people/profile-picture-2.jpg",
    },
    {
        name: "Thomas Lean",
        email: "thomes@flowbite.com",
        position: "Particulier",
        status: "Online",
        img: "/docs/images/people/profile-picture-5.jpg",
    },
    {
        name: "Leslie Livingston",
        email: "leslie@flowbite.com",
        position: "SEO Specialist",
        status: "Offline",
        img: "/docs/images/people/profile-picture-4.jpg",
    },
];

const mockProducts = [
    { id: 1, name: 'MacBook Pro', category: 'Laptop', statut: 'en cours', price: '$2999' },
    { id: 2, name: 'AirPods', category: 'Accessories', statut: 'offert', price: '$199' },
    { id: 3, name: 'iPad Pro', category: 'Tablet', statut: 'preter', price: '$699' },
    { id: 4, name: 'Surface Pro', category: 'Laptop', statut: 'vendu', price: '$1599' },
    { id: 5, name: 'MacBook Pro', category: 'Laptop', statut: 'en cours', price: '$2999' },
    { id: 6, name: 'AirPods', category: 'Accessories', statut: 'offert', price: '$199' },
    { id: 7, name: 'iPad Pro', category: 'Tablet', statut: 'preter', price: '$699' },
    { id: 8, name: 'Surface Pro', category: 'Laptop', statut: 'vendu', price: '$1599' },
    { id: 9, name: 'MacBook Pro', category: 'Laptop', statut: 'en cours', price: '$2999' },
    { id: 10, name: 'AirPods', category: 'Accessories', statut: 'offert', price: '$199' },
    { id: 11, name: 'iPad Pro', category: 'Tablet', statut: 'preter', price: '$699' },
    { id: 12, name: 'Surface Pro', category: 'Laptop', statut: 'vendu', price: '$1599' }
];

const initialProducts = [
    {
        id: 1,
        name: "Apple Watch",
        image: "/docs/images/products/apple-watch.png",
        price: 599,
        quantity: 1,
    },
    {
        id: 2,
        name: 'iMac 27"',
        image: "/docs/images/products/imac.png",
        price: 2499,
        quantity: 1,
    },
    {
        id: 3,
        name: "iPhone 12",
        image: "/docs/images/products/iphone-12.png",
        price: 999,
        quantity: 1,
    },
];

const data = [
    { id: 1, name: 'Apple MacBook Pro 17"', color: "Silver", category: "Laptop", price: 2999, statut: "en cours" },
    { id: 2, name: "Microsoft Surface Pro", color: "White", category: "Laptop PC", price: 1999, statut: "vendu" },
    { id: 3, name: "Magic Mouse 2", color: "Black", category: "Accessories", price: 99, statut: "offert" },
    { id: 4, name: "Apple Watch", color: "Black", category: "Watches", price: 199, statut: "offert" },
    { id: 5, name: "Apple iMac", color: "Silver", category: "PC", price: 2999, statut: "prete" },
    { id: 6, name: "Apple AirPods", color: "White", category: "Accessories", price: 399, statut: "prete" },
    { id: 7, name: "iPad Pro", color: "Gold", category: "Tablet", price: 699, statut: "offert" },
    { id: 8, name: "Magic Keyboard", color: "Black", category: "Accessories", price: 99, statut: "offert" },
    { id: 9, name: "Smart Folio iPad Air", color: "Blue", category: "Accessories", price: 79, statut: "offert" },
    { id: 10, name: "AirTag", color: "Silver", category: "Accessories", price: 29, statut: "en cours" },
];


const Tabs = () => {

    const [activeTab, setActiveTab] = useState('dashboard');


    const tabs = [
        //{ id: 'profile', label: 'Profil' },
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'settings', label: 'Paramètres' },
        { id: 'contacts', label: 'Contacts' },
    ];

    const tabContent = {

        //profile: <ProfileCard/>,

        dashboard: (

            <div className="p-2 space-y-6 max-w-7xl mx-auto">

                <div className="mb-6 text-center">

                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
                        Bienvenue sur votre tableau de bord !
                    </h1>

                    <p className="mt-2 text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                        Gérez vos produits, suivez vos activités et accédez rapidement aux informations essentielles pour optimiser votre expérience.
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <ProductTable initialProducts={initialProducts} />
                </div>

                <ProductTablePagination data={data} />

                <div className="">
                    <ProductsRecapTable products={mockProducts} />
                </div>

            </div>
        ),

        settings: (
            <div className="p-1 max-full mx-auto text-gray-700 dark:text-gray-300">
                <SettingsForm/>
            </div>
        ),

        contacts: (
            <div className="p-1 max-full mx-auto text-gray-700 dark:text-gray-300">
                <UserTable />
            </div>
        ),
    };

    return (
        <div className="h-full w-full bg-gray-100 dark:bg-gray-900 px-1 py-1">

            <div className="">

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
                                    className={`inline-block px-4 py-3 rounded-t-md transition-colors duration-300 cursor-pointer ${activeTab === tab.id
                                        ? 'border-b-purple-600 text-purple-600 border-b-2 dark:border-b-purple-500 dark:text-purple-500'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                        } focus:outline-none `}
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
                    className="bg-white dark:bg-gray-800 rounded-lg  min-h-auto overflow-auto"
                >
                    {tabContent[activeTab]}

                </section>

            </div>

        </div>
    );
};

export default Tabs;
