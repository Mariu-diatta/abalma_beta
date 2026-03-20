import React from 'react';
import { useTranslation } from 'react-i18next';
import ProductCard from '../components/ProductCard';
import NoContentComp from '../components/NoContentComp';
import { TitleCompGenLitle } from '../components/TitleComponentGen';

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

                    const cols = Math.min(items.length, 4);

                    const cols_sm= Math.min(items.length, 2);

                    return (

                        <div key={category} className="flex flex-col items-center gap-3">

                            {/* Nom catégorie */}
                            <div className="flex flex-col items-center gap-2">

                                <h2 className="
                                    text-sm md:text-base 
                                    font-semibold 
                                    text-gray-700
                                    tracking-wide
                                ">
                                    
                                    <TitleCompGenLitle title={t(`add_product.categories.${category.toUpperCase() ?? ""}`)} />

                                </h2>

                                <div className="w-10 h-[2px] bg-gray-300 rounded-full" />

                            </div>

                            {/* Produits */}
                            <div
                                className={`
                                    grid
                                    gap-2 md:gap-4
                                    w-fit
                                    grid-cols-${cols_sm}
                                    md:grid-cols-${cols}
                                    mb-2
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
                                    })
                                }

                            </div>

                        </div>
                    );
                    }
                )
            }

        </div>
    );
};

export default ListProductByCategory;
