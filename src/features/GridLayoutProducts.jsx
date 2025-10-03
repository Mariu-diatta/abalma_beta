import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateSelectedProduct } from '../slices/cartSlice';
import api from '../services/Axios';
import ProductModal from '../pages/ProductViewsDetails';
import { useTranslation } from 'react-i18next';
import LoadingCard from '../components/LoardingSpin';
import { removeAccents, translateCategory } from '../utils';
import SearchBar from '../components/BtnSearchWithFilter';
import ProductCard from '../components/ProductCard';
import ScrollableCategoryButtons from '../components/ScrollCategoryButtons';

const GridLayoutProduct = () => {

    const [filteredItems, setFilteredItems] = useState([])

    const [filteredItemsPopover, setFilteredItemsPopover] = useState([])

    const { t } = useTranslation();

    const [loading, setLoading] = useState(true)

    const dispatch = useDispatch();

    const cartItems = useSelector(state => state?.cart?.items);

    const lang = useSelector((state) => state?.navigate?.lang);

    const productNbViews = useSelector(state => state.cart.nbrProductViews)

    const currentNav = useSelector(state => state.navigate.currentNav);

    const DEFAULT_ACTIVE_CATEGORY = lang === 'fr' ? 'Tous' : 'Tous';

    const [activeCategory, setActiveCategory] = useState(DEFAULT_ACTIVE_CATEGORY);

    const [modalData, setModalData] = useState(null);

    const [searchData, setSearchData] = useState("null");

    const [activeBtnOver, setActiveBtnOver] = useState(DEFAULT_ACTIVE_CATEGORY);

    const [owners, setOwners] = useState({});

    const openModal = (item) => setModalData(item);

    const closeModal = () => setModalData(null);

    useEffect(

        () => {

            dispatch(updateSelectedProduct(modalData))

        }, [dispatch, modalData]
    )

    useEffect(() => {


        setLoading(true);

        const isDefaultCategory = (cleanCategory) => {

            if (!cleanCategory) return true;

            return cleanCategory === DEFAULT_ACTIVE_CATEGORY?.toLowerCase();
        }

        const fetchProductsAndOwners = async () => {

            try {
                const translatedCategory = translateCategory(activeCategory);

                const cleanCategory = removeAccents(translatedCategory)?.toLowerCase();

                const url = isDefaultCategory(cleanCategory)
                    ? "products/filter/"
                    : `products/filter/?categorie_product=${cleanCategory?.toUpperCase()}`;

                const { data: products } = await api.get(url);

                const filtered = products.filter(item => parseInt(item?.quantity_product) !== 0);

                setFilteredItems(filtered);

                const uniqueOwnerIds = [...new Set(products.map(p => p?.fournisseur))].filter(Boolean);

                const responses = await Promise.all(

                    uniqueOwnerIds.map(id =>

                        api.get(`clients/${id}/`)

                            .then(res => ({ id, data: res.data }))

                            .catch(() => ({ id, data: null }))
                    )
                );

                const ownerMap = responses.reduce((acc, { id, data }) => {

                    if (data) acc[id] = data;

                    return acc;

                }, {});

                setOwners(ownerMap);

            } catch (error) {

                // console.error("Erreur lors du chargement :", error);
            } finally {

                setLoading(false);
            }
        };

        fetchProductsAndOwners();

    }, [activeCategory, DEFAULT_ACTIVE_CATEGORY]);

    useEffect(() => {


        const isDefaultCategory = (cleanCategory) => {
                if (!cleanCategory) return true;
                return cleanCategory === DEFAULT_ACTIVE_CATEGORY?.toLowerCase();
        }

        const fetchProductsAndOwners = async () => {


            try {
                const translatedCategory = translateCategory(activeBtnOver);

                const cleanCategory = removeAccents(translatedCategory)?.toLowerCase();

                const url = isDefaultCategory(cleanCategory)
                    ? "products/filter/"
                    : `products/filter/?categorie_product=${cleanCategory?.toUpperCase()}`;

                const { data: products } = await api.get(url);

                const filtered = products.filter(item => parseInt(item?.quantity_product) !== 0);

                setFilteredItemsPopover(filtered);

                const uniqueOwnerIds = [...new Set(products.map(p => p?.fournisseur))].filter(Boolean);

                const responses = await Promise.all(

                    uniqueOwnerIds.map(id =>

                        api.get(`clients/${id}/`)

                            .then(res => ({ id, data: res.data }))

                            .catch(() => ({ id, data: null }))
                    )
                );

                const ownerMap = responses.reduce((acc, { id, data }) => {

                    if (data) acc[id] = data;

                    return acc;

                }, {});

                setOwners(ownerMap);

            } catch (error) {

                // console.error("Erreur lors du chargement :", error);
            } finally {

            }
        };

        fetchProductsAndOwners();

    }, [activeBtnOver, DEFAULT_ACTIVE_CATEGORY]);

    useEffect(

        () => {

            const getDataSearch = async () => {

                try {
                    const { data: products } = await api.get(`products/filter/?search=${searchData?.query}`)

                    const filtered = products.filter(item => item?.categorie_product === searchData?.category);

                    setFilteredItems(filtered);

                } catch (e) {

                }
            }

            getDataSearch()

        }, [searchData]
    )
  
    return (

        <div

            className="p-1 space-y-4 dark:bg-gray-900 dark:text-white"

            style={{

                backgroundColor: "var(--color-bg)",

                color: "var(--color-text)"
            }}
        >
        
            <div
                  className={`flex mx-auto items-center  
                  ${(currentNav === "account_home" ) ? "w-full md:w-1/2" : "md:hidden"} 
                  sticky top-[55px] z-[5] 
                  ${(currentNav === "home" || currentNav === "blogs" || currentNav === "account_home" || currentNav === "all_products") ? "" : "hidden"}`}
            >
                <SearchBar  onSearch={setSearchData} />

            </div>

            <ScrollableCategoryButtons

                activeCategory={activeCategory}

                setActiveCategory={setActiveCategory}

                products={filteredItemsPopover}

                setActiveBtnOver={setActiveBtnOver}

                openModal={openModal}

                owners={owners}

            />

            {
                (loading) ?

                <LoadingCard />
                :
                <>
                    {filteredItems.length > 0 ? (

                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-3">

                            {filteredItems.length>0 && filteredItems.map(item => {

                                const isInCart = cartItems?.some(product => product?.id === item?.id);

                                const owner = owners[item?.fournisseur];

                                return (

                                    <ProductCard
                                        key={item?.id}
                                        item={item}
                                        isInCart={isInCart}
                                        owner={owner}
                                        productNbViews={productNbViews}
                                        openModal={openModal}
                                        owners={owners}
                                        qut_sold={item?.quanttity_product_sold}
                                    />
                                );
                            })}

                        </div>

                    ) : (

                        <div className="flex items-center justify-center mx-auto max-w-md p-4 rounded-full border border-gray-200 mb-2">
 
                            <span className="text-sm">{t('ListItemsFilterProduct.noProduct')}</span>

                        </div>
                     )}

                </>

            }

            <ProductModal isOpen={!!modalData} onClose={closeModal} products={filteredItems}/>

        </div>
    );
};

export default GridLayoutProduct;








