import React from 'react';
import { useTranslation } from 'react-i18next';
import ProductCard from '../components/ProductCard';
import NoContentComp from '../components/NoContentComp';

const ListProductByCategory = ({ filteredItems, cartItems, owners, openModal }) => {
    const { t } = useTranslation();

    if (!filteredItems || filteredItems.length === 0) {
        return <NoContentComp content={t('ListItemsFilterProduct.noProduct')} />;
    }

    const groupedItems = filteredItems.reduce((acc, item) => {
        const cat = item?.categorie_product;
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(item);
        return acc;
    }, {});

    return (

        <div className="space-y-6">

            {
                Object.entries(groupedItems).map(([category, items]) => {

                const cols = Math.min(items?.length, 5);

                return (

                    <div key={category} className="flex flex-col items-center gap-3">

                        {/* Nom catégorie */}
                        <div className="text-center text-xs text-gray-500 rounded-full px-5 py-0.5 shadow-sm">
                            {t(`add_product.categories.${category}`)}
                        </div>

                        {/* Produits */}
                        <div
                            className={`
                                grid
                                gap-2
                                w-fit
                                grid-cols-2
                                md:grid-cols-${cols}
                                mx-1
                            `}
                        >
                            {
                                items?.map((item) => {

                                        const isInCart = cartItems?.some(
                                            (product) => product?.id === item?.id
                                        );

                                        const owner = owners[item?.fournisseur];

                                        return (

                                            <ProductCard
                                                key={item.id}
                                                id={item.id}
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

                        </div>

                    </div>
                );
                })
            }

        </div>
    );
};

export default ListProductByCategory;
