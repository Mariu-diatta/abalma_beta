import React, { useEffect, useState} from 'react';
import api from '../services/Axios';
import { useTranslation } from 'react-i18next';
import UsersContactsList from './ContactUser';
import TablesRecapActivities from './TablesRecapActivities';

const Tabs = () => {

    const { t } = useTranslation();

    const [activeTab, setActiveTab] = useState('dashboard');

    const [productsTrasactionBought, setProductsTrasactionBought] = useState([])

    const [productsTrasactionSell, setProductsTrasactionSell] = useState([])

    const tabs = [

        { id: 'dashboard', label: t('Dashboard.dashboard') },

        { id: 'contacts', label: t('Dashboard.contacts') },
    ];

    useEffect(() => {

        const getProduct = async () => {

            try {

                const productTransaction = await api.get('product/fournisseur/transaction/');

                //console.log("DashbordProfileUsr, LES PRODUITS BOUGHT DE LA TRANSACTION", productTransaction?.data);
                setProductsTrasactionBought(productTransaction?.data);

            } catch (e) {

                //console.log("ERREUR LORS DU DEBUGGING", e);

            } finally {

                //setLoading(false)
            }
        };

        getProduct();

    }, []);

    const tabContent = {

        dashboard: (

            <TablesRecapActivities
                productsTrasactionBought={productsTrasactionBought}
                setProductsTrasactionBought={setProductsTrasactionBought}
                productsTrasactionSell={productsTrasactionSell}
                setProductsTrasactionSell={setProductsTrasactionSell}
            />
        ),

        contacts: (

            <UsersContactsList/>
        ),
    };

    return (

        <div className="h-screan w-full px-1 py-1  z-0">


            {/* Tabs Navigation */}
            <nav className="mb-4 border-0  bg-none" role="tablist" aria-label="Main tabs">

                <ul className="flex space-x-0 overflow-x-auto text-sm font-medium text-center ">

                    {
                        tabs?.map((tab) => (

                            <li key={tab.id} role="presentation">

                                <button
                                    type="button"
                                    role="tab"
                                    aria-selected={activeTab === tab.id}
                                    aria-controls={`${tab.id}-tab`}
                                    id={`${tab.id}-tab-button`}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`hover:bg-gray-100 dark:hover:bg-dark-3  inline-block px-10 py-2 rounded-t-md transition-colors duration-300 cursor-pointer ${activeTab === tab.id
                                        ? 'border-b-gray-600 border-b-2 dark:border-b-gray-500 '
                                            : 'border-transparent hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300'
                                        } focus:outline-none `}
                                >
                                    {tab?.label}

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
                className="rounded-lg  h-screan overflow-x-auto z-0"
            >
                {tabContent[activeTab]}

            </section>

        </div>
    );
};

export default Tabs;
