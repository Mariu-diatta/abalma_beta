import React, { useEffect, useState} from 'react';
import ProductsRecapTable from './ProductRecaptable';
import UserTable from '../components/ContactUser';
import api from '../services/Axios';
import { useTranslation } from 'react-i18next';
import ListProductShoppingCart from './ListProductShoppingCart';

const Tabs = () => {

    const { t } = useTranslation();

    const [activeTab, setActiveTab] = useState('dashboard');

    const [productsTrasactionBought, setProductsTrasactionBought] = useState([])

    const tabs = [
        { id: 'dashboard', label: t('Dashboard.dashboard') },
        { id: 'contacts', label: t('Dashboard.contacts') },
    ];

    useEffect(() => {

        const getProduct = async () => {

            try {
                const productTransaction= await api.get('product/fournisseur/transaction/');

                console.log("DashbordProfileUsr, LES PRODUITS BOUGHT DE LA TRANSACTION", productTransaction?.data);

                setProductsTrasactionBought(productTransaction?.data);

            } catch (e) {

                console.log("ERREUR LORS DU DEBUGGING", e);
            }
        };

        getProduct();

    }, []);



    const tabContent = {

        dashboard: (

            <div className="p-2 pt-0 mt-0 space-y-6 max-w-7xl mx-auto style-bg mb-2  h-screan mb-2 pb-3 ">

                <div className="mb-6 text-center style_bg">

                    <h1 className="text-2xl font-extrabold text-gray-500 dark:text-white px-4 pt-4 pb-2">
                        {t('Dashboard.welcomeTitle')}
                    </h1>

                    <p className="mt-2 text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto style_bg">
                        {t('Dashboard.welcomeText')}
                    </p>

                </div>

                <div className="overflow-x-auto">

                    <ListProductShoppingCart/>

                </div>

                {
                    productsTrasactionBought?.length > 0 && (

                        <ProductsRecapTable products={productsTrasactionBought} />
                    )
                }

            </div>
        ),

        contacts: (

            <div className="p-1 max-full mx-auto text-gray-700 dark:text-gray-300 h-screan">

                <UserTable />

            </div>
        ),
    };

    return (

        <div className="h-screan w-full bg-gray-100 dark:bg-gray-900 px-1 py-1 style_bg z-0">


            {/* Tabs Navigation */}
            <nav className="mb-4 border-0 border-gray-200 dark:border-gray-700 style_bg" role="tablist" aria-label="Main tabs">

                <ul className="flex space-x-2 overflow-x-auto text-sm font-medium text-center style_bg">

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
                className="style_bg dark:bg-gray-800 rounded-lg  h-screan overflow-x-auto z-0"
            >
                {tabContent[activeTab]}

            </section>

        </div>
    );
};

export default Tabs;
