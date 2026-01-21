import React from 'react';
import { useTranslation } from 'react-i18next';
import ProductCard from '../components/ProductCard';
import NoContentComp from '../components/NoContentComp';

const ListProductByCategory = ({ filteredItems, cartItems, owners, openModal }) => {

    const { t } = useTranslation();

    if (!filteredItems || filteredItems.length === 0) {

        return <NoContentComp content={t('ListItemsFilterProduct.noProduct')} />;
    }

    // Regroupement par catégorie
    const groupedItems = Object.entries(

        filteredItems.reduce((acc, item) => {

            const cat = item?.categorie_product;

            if (!acc[cat]) acc[cat] = [];

            acc[cat].push(item);

            return acc;

        }, {})
    );

    return (

        <section className="w-full flex justify-center">

            {/* Grille centrée */}
            <div
                className="
                    grid
                    grid-cols-2
                    sm:grid-cols-2
                    md:grid-cols-4
                    gap-3
                    justify-items-center
                    mx-auto
                "
            >
                {/* Conteneur centré */}
                <div className="w-full max-w-7xl px-2 md:px-4">

                    {
                        groupedItems.map(([category, items]) => (

                            <React.Fragment key={category}>

                                    {/* Titre de catégorie centré */}
                                    <div className="col-span-full flex justify-center my-2">

                                        <span className="text-xs text-gray-500 px-5 py-1 rounded-full shadow-sm">

                                            {t(`add_product.categories.${category}`)}

                                        </span>

                                    </div>

                                    {/* Produits */}
                                    {
                                        items.map(

                                            (item) => {

                                                const isInCart = cartItems?.some(
                                                    (product) => product?.id === item?.id
                                                );

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

            </div>

        </section>
    );
};

export default ListProductByCategory;
