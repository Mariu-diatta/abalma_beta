import React, { useEffect, useState} from 'react';
import ProductTable from './ListProductShoppingCart';
import ProductTablePagination from './ListProductPagination';
import ProductsRecapTable from './ProductRecaptable';
import UserTable from '../components/ContactUser';
import SettingsForm from './Settings';
import api from '../services/Axios';
import { useSelector } from 'react-redux';



const Tabs = () => {

    const [activeTab, setActiveTab] = useState('dashboard');

    const [productsTrasactionSold, setProductsTrasactionSold] = useState([])

    const [productsTrasactionBought, setProductsTrasactionBought] = useState([])

    const currentUser=useSelector((state)=>state.auth.user)


    const tabs = [
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'settings', label: 'Paramètres' },
        { id: 'contacts', label: 'Contacts' },
    ];

    useEffect(

        () => {

            const getTransactionProduct = async () => {

                try {

                    const responseBought = await api.get(`/transactions/products/?client=${currentUser?.id}`)

                    responseBought?.data?.map(

                        (data_, _) => {

                            if (data_?.client === currentUser?.id) {

                                const data_product = { ...data_?.product, statut: "En cours" }

                                setProductsTrasactionBought((prev) => [...prev, data_product])
                            }
                        }
                    )

                } catch (e) {

                }

                try {

                    const response = await api.get(`/transactions/products/?owner=${currentUser?.id}`)

                    response?.data?.map(

                        (data_, _) => {

                            if (data_?.owner === currentUser?.id) {

                                const data_product = { ...data_?.product, statut: "En cours" }

                                setProductsTrasactionSold((prev) => [...prev, data_product])
                            }
                        }
                    )
                  
                } catch (e) {

                }

            }

            getTransactionProduct()

        }, []

    )

 

    const tabContent = {

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

                    <ProductTable />

                </div>

                <ProductTablePagination data={productsTrasactionSold} />

                <ProductsRecapTable products={productsTrasactionBought} />

            </div>
        ),

        settings: (

            <div className="p-1 max-full mx-auto text-gray-700 dark:text-gray-300">

                <SettingsForm />

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

                        {
                            tabs.map((tab) => (

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
                            ))
                        }
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
