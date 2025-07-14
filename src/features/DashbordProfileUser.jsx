import React, { useEffect, useState} from 'react';
import ProductTablePagination from './ListProductPagination';
import ProductsRecapTable from './ProductRecaptable';
import UserTable from '../components/ContactUser';
import SettingsForm from './Settings';
import api from '../services/Axios';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import ListProductShoppingCart from './ListProductShoppingCart';

const Tabs = () => {

    const { t } = useTranslation();

    const [activeTab, setActiveTab] = useState('dashboard');

    const [productsTrasactionSold, setProductsTrasactionSold] = useState([])

    const [productsTrasactionBought, setProductsTrasactionBought] = useState([])

    const currentUser=useSelector((state)=>state.auth.user)


    const tabs = [
        { id: 'dashboard', label: t('Dashboard.dashboard') },
        { id: 'settings', label: t('Dashboard.settings') },
        { id: 'contacts', label: t('Dashboard.contacts') },
    ];
    useEffect(() => {
        if (!currentUser?.id) {
            console.log("Pas d'utilisateur");
            return;
        }

        const getTransactionProduct = async () => {

            try {

                const productBought = await api.get('item/products/transaction/')
                    .then(
                        (resp) => {
                            const dataResponse = resp?.data

                            const productFournisseur = dataResponse.filter(item => item.product.fournisseur === currentUser?.id)

                            console.log("Products Fournisseur", productFournisseur)
                        }
                  )

                console.log("Les datas produits", productBought)

                const [boughtRes, soldRes] = await Promise.all([
                    api.get(`/transactions/products/?client=${currentUser.id}`),
                    api.get(`/transactions/products/?owner=${currentUser.id}`)
                ]);

                console.log("Bought response:", boughtRes.data);
                console.log("Sold response:", soldRes.data);

                const bought = boughtRes?.data
                    ?.filter((item) => item?.client === currentUser.id && item?.code)
                    ?.map((item) => ({ ...item, statut: "En cours" }));

                const sold = soldRes?.data
                    ?.filter((item) => item?.owner === currentUser.id && item?.code && item?.transaction_type === "Achat")
                    ?.map((item) => ({ ...item, statut: "En cours" }));

                console.log("Mapped bought:", bought);
                console.log("Mapped sold:", sold);

                setProductsTrasactionBought(bought);
                setProductsTrasactionSold(sold);
            } catch (e) {
                console.error("Erreur lors de la récupération :", e);
            }
        };

        getTransactionProduct();
    }, [currentUser?.id]);


    const tabContent = {

        dashboard: (

            <div className="p-2 space-y-6 max-w-7xl mx-auto  style-bg mb-2">

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
                    productsTrasactionSold?.length > 0 && (
                        <ProductTablePagination data={productsTrasactionSold} />
                    )
                }

                {
                    productsTrasactionBought?.length > 0 && (
                        <ProductsRecapTable products={productsTrasactionBought} />
                    )
                }

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

        <div className="h-full w-full bg-gray-100 dark:bg-gray-900 px-1 py-1 style_bg">


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
                className="style_bg bg-white dark:bg-gray-800 rounded-lg  min-h-auto overflow-auto"
            >
                {tabContent[activeTab]}

            </section>

        </div>
    );
};

export default Tabs;
