import React from 'react';
import { useTranslation } from 'react-i18next';
import ProductCard from '../components/ProductCard';
import NoContentComp from '../components/NoContentComp';

const ListProductByCategory = ({ filteredItems, cartItems, owners, openModal }) => {

    const { t } = useTranslation();

    if (!filteredItems || filteredItems?.length === 0) {

        return <NoContentComp content={t('ListItemsFilterProduct.noProduct')} />;
    }

    return (

        <>
            {
                (filteredItems?.length > 0) ?
                    (

                        <div className="h-full px-2 md:px-0 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-1 z-0 mb-[10px] mx-0 md:mx-10 lg:mx-10 flex justify-center mt-0 pt-0">

                            {/* --- Regroupement des produits par catégorie --- */}
                            {
                                Object.entries(

                                    filteredItems.reduce((acc, item) => {
                                        const cat = item?.categorie_product;
                                        if (!acc[cat]) acc[cat] = [];
                                        acc[cat].push(item);
                                        return acc;
                                    }, {})
                                )
                                    .map(([category, items]) => (

                                        <React.Fragment key={category}>

                                            {/* Nom de la catégorie */}
                                            <li className="text-center text-xs text-gray-500 py-0.5 col-span-full  rounded-full w-auto mx-auto shadow-sm my-0 px-5">
                                                {t(`add_product.categories.${category}`)}
                                            </li>

                                            {/* Produits de la catégorie */}
                                            {
                                                items?.map((item) => {

                                                    const isInCart = cartItems?.some((product) => product?.id === item?.id);

                                                    const owner = owners[item?.fournisseur];

                                                    return (

                                                        <ProductCard
                                                            key={item?.id}
                                                            id={item?.id}
                                                            item={item}
                                                            isInCart={isInCart}
                                                            owner={owner}
                                                            openModal={openModal}
                                                            owners={owners}
                                                            qut_sold={item?.quanttity_product_sold}
                                                        />
                                                    );
                                                }
                                                )
                                            }

                                        </React.Fragment>
                                    ))
                            }

                        </div>
                    )
                    :
                    (
                        <div className="flex items-center justify-center mx-auto max-w-md p-4 rounded-full border border-gray-200 mb-2">

                            <span className="text-sm">
                                {t('ListItemsFilterProduct.noProduct')}
                            </span>

                        </div>
                    )
            }

        </>
    )
}

export default ListProductByCategory;