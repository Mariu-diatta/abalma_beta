import React from 'react'
import TitleCompGen from './TitleComponentGen'
import ListProductShoppingCart from '../features/ListProductShoppingCart'
import ProductsRecapTable from '../features/ProductRecaptable'
import MyProductList from './MyProductsList'
import MyBlogsList from './ListManagerBlogs'
import { useTranslation } from 'react-i18next';

const TablesRecapActivities = ({productsTrasactionBought }) => {

    const { t } = useTranslation();

    return (

        <div className="absolute fixed w-[98dvw] md:w-[80dvw] sm:rounded-lg style-bg  scrollbor_hidden pb-6  overflow-hidden ">

            <div className="mb-6 text-center style_bg">

                <TitleCompGen title={t('Dashboard.welcomeTitle')} />

                <p className="mt-2 text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto style_bg">

                    {t('Dashboard.welcomeText')}

                </p>

            </div>

            <div className="relative overflow-y-auto max-h-[60dvh] w-auto left-0 scrollbor_hidden mb-[30dvh]">

                <ListProductShoppingCart />

                <ProductsRecapTable products={productsTrasactionBought} />

                <MyProductList />

                <MyBlogsList />

            </div>

        </div>
    )
}

export default TablesRecapActivities;