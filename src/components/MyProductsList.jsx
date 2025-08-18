import React, { useEffect, useState} from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import SuspenseCallback from "../components/SuspensCallback";
import { useNavigate } from "react-router-dom";
import api from "../services/Axios";

const MyProductList = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Récupérer l’utilisateur courant
    const currentUser = useSelector(state => state.auth.user);
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    // Récupérer les produits de Redux (ceux de l’utilisateur)
   // const { items: myProducts, loading } = useSelector(state => state.products);

    // Charger les produits de l’utilisateur au montage
    useEffect(() => {
        if (currentUser?.id) {

            try {

                const products = api.get("produits/").then(

                    resp => {

                        console.log("DATTA", resp.data)

                        setProducts(resp.data)
                    }
                )

                console.log("DATA :::", products)


            } catch (error) {

            }
 
        }
    }, [currentUser, dispatch]);

    // Supprimer un produit
    const handleDelete = (id) => {

        if (window.confirm(t("confirmDeleteProduct"))) {

            try {

                api.delete(`produits/${id}/`)

            } catch {

            }
        
        }
    };

    // Rediriger vers page d’édition
    const handleEdit = (id) => {

        try {

            api.put(`produits/${id}/`)

        } catch {

        }
    };

    // Filtrer : pas en cours d’achat
    //const filteredProducts = myProducts.filter(p => !p.isBeingPurchased);

    return (
        <div
            className="style_bg mb-2 relative overflow-x-auto sm:rounded-md p-2"
            style={{
                backgroundColor: "var(--color-bg)",
                color: "var(--color-text)"
            }}
        >
            <nav className="flex flex-row items-center gap-2 ">
                <svg className="w-[25px] h-[25px] text-gray-800 dark:text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round"
                        strokeLinejoin="round" strokeWidth="0.8"
                        d="M4 4h16M4 8h16M4 12h16M4 16h16" />
                </svg>
                <h2 className="ms-2 font-extrabold text-gray-500 dark:text-gray-400">
                    {t('myProducts')}
                </h2>
            </nav>

            {loading ? (
                <p>{t("loading")}...</p>
            ) : (
                <table
                    className="w-full text-sm text-left text-gray-500 dark:text-gray-400 shadow-lg p-2"
                    style={{
                        backgroundColor: "var(--color-bg)",
                        color: "var(--color-text)"
                    }}
                >
                    <thead className="text-sm style_bg">
                        <tr>
                            <th className="px-16 py-3"><span className="sr-only">{t('tableEntries.image')}</span></th>
                            <th className="px-6 py-3">{t('tableEntries.product')}</th>
                            <th className="px-6 py-3">{t('tableEntries.category')}</th>
                            <th className="px-6 py-3">{t('tableEntries.quantity')}</th>
                            <th className="px-6 py-3">{t('tableEntries.price')}</th>
                            <th className="px-6 py-3">{t('tableEntries.action')}</th>
                            <th className="px-6 py-3">{t('tableEntries.action')}</th>
                        </tr>
                    </thead>

                    <SuspenseCallback>

                        <tbody>
                                {Array.isArray(products) && products.length > 0 && products.map(({ id, description_product, categorie_product, image_product, price_product, quantity_product }) => (
                                <tr key={id}
                                    className="dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                                    style={{
                                        backgroundColor: "var(--color-bg)",
                                        color: "var(--color-text)"
                                    }}
                                >
                                    <td className="p-1">
                                        <div className="w-10 h-10 md:w-20 md:h-20 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-600">
                                            <img
                                                src={image_product}
                                                alt={description_product || "Image du produit"}
                                                className="object-contain w-full h-full"
                                                loading="lazy"
                                            />
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">{description_product}</td>
                                    <td className="px-6 py-4">{categorie_product}</td>
                                    <td className="px-6 py-4">{quantity_product}</td>
                                    <td className="px-6 py-4">${Number(price_product).toFixed(2)}</td>

                                    <td className="px-6 py-4 gap-2">

                                        <button
                                            onClick={() => handleEdit(id)}
                                            className="text-blue-600 hover:underline"
                                        >
                                            {t("edit")}
                                        </button>
                                    </td>

                                    <td className="px-6 py-4 gap-2">
                                        <button
                                            onClick={() => handleDelete(id)}
                                            className="text-red-600 hover:underline"
                                        >
                                            {t("delete")}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </SuspenseCallback>
                </table>
            )}
        </div>
    );
};

export default MyProductList;
