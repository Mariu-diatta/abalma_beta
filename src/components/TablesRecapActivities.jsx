import React from 'react'
import TitleCompGen from './TitleComponentGen'
import ListProductShoppingCart from '../features/ListProductShoppingCart'
import LoadingCard from './LoardingSpin'
import ProductsRecapTable from '../features/ProductRecaptable'
import MyProductList from './MyProductsList'
import MyBlogsList from './ListManagerBlogs'
import { useTranslation } from 'react-i18next';

const TablesRecapActivities = ({ loading, productsTrasactionBought }) => {

    const { t } = useTranslation();

    return (

        <div className="absolute fixed w-[94dvw] md:w-[80dvw] sm:rounded-lg style-bg h-full overflow-y-auto scrollbor_hidden pb-6">

            <div className="mb-6 text-center style_bg">

                <TitleCompGen title={t('Dashboard.welcomeTitle')} />

                <p className="mt-2 text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto style_bg">

                    {t('Dashboard.welcomeText')}

                </p>

            </div>

            <div className="relative overflow-y-auto h-screen w-auto left-0 scrollbor_hidden">

                <div className="overflow-x-auto">

                    <ListProductShoppingCart />

                </div>

                {
                    loading ?
                        <LoadingCard/>
                        :
                        <div >
                            {
                                (productsTrasactionBought?.length > 0) && (

                                    <ProductsRecapTable products={productsTrasactionBought} />
                                )
                            }
                        </div >
                }

                <MyProductList />

                <MyBlogsList />

            </div>

        </div>
    )
}

export default TablesRecapActivities;