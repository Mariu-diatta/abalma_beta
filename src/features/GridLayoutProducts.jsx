import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateSelectedProduct } from '../slices/cartSlice';
import api from '../services/Axios';
import ModalViewProduct from '../pages/ProductViewsDetails';
import { useTranslation } from 'react-i18next';
import LoadingCard from '../components/LoardingSpin';
import { CONSTANTS, removeAccents, translateCategory } from '../utils';
import SearchBar from '../components/BtnSearchWithFilter';
import ProductCard from '../components/ProductCard';
import ScrollableButtonsCategoryProducts from './ScrollCategoryButtons';

const GridLayoutProduct = () => {

    const [filteredItems, setFilteredItems] = useState([])

    const [filteredItemsPopover, setFilteredItemsPopover] = useState([])

    const [loading, setLoading] = useState(false)

    const dispatch = useDispatch();

    const cartItems = useSelector(state => state?.cart?.items);

    const DEFAULT_ACTIVE_CATEGORY = CONSTANTS?.ALL;

    const [activeButtonCategory, setActiveButtonCategory] = useState(DEFAULT_ACTIVE_CATEGORY);

    const categorySelectedData = useSelector(state => state?.navigate?.categorySelectedOnSearch)

    const [modalData, setModalData] = useState(null);

    const [isButtonOver, setIsButtonOver] = useState(DEFAULT_ACTIVE_CATEGORY);

    const [owners, setOwners] = useState({});

    const openModal = (item) => setModalData(item);

    const closeModal = () => setModalData(null);

    const currentUser = useSelector(state => state.auth.user);

    useEffect(

        () => {

            dispatch(updateSelectedProduct(modalData))

        }, [dispatch, modalData]
    )

    useEffect(() => {

        setLoading(true);

        const isDefaultCategory = (cleanCategory) => {

            if (!cleanCategory) return true;

            return cleanCategory?.toLowerCase() === DEFAULT_ACTIVE_CATEGORY?.toLowerCase();
        }

        const fetchProductsAndOwners = async () => {

            try {

                const translatedCategory = translateCategory(activeButtonCategory);

                let cleanCategory = removeAccents(translatedCategory)?.toLowerCase();

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

    }, [activeButtonCategory,DEFAULT_ACTIVE_CATEGORY]);

    useEffect(() => {


        const isDefaultCategory = (cleanCategory) => {

                if (!cleanCategory) return true;

                return cleanCategory === DEFAULT_ACTIVE_CATEGORY?.toLowerCase();
        }

        const fetchProductsAndOwners = async () => {

            try {
                const translatedCategory = translateCategory(isButtonOver.replace("_", " ").toLocaleUpperCase());

                var cleanCategory = removeAccents(translatedCategory)?.toLowerCase();

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

    }, [isButtonOver, DEFAULT_ACTIVE_CATEGORY]);

    useEffect(

        () => {

            const getDataSearch = async () => {

                setLoading(true)

                try {
                    const { data: products } = await api.get(`products/filter/?search=${categorySelectedData?.query}`)

                    const filtered = products.filter(item => item?.categorie_product === categorySelectedData?.category);

                    setFilteredItems(filtered);

                } catch (e) {

                } finally {

                    setLoading(false)
                }
            }

            getDataSearch()

        }, [categorySelectedData]
    )
  
    return (

        <div

            className="px-1 space-y-4 dark:bg-gray-900 dark:text-white py-0"

            style={{

                backgroundColor: "var(--color-bg)",

                color: "var(--color-text)"
            }}
        >
            {
                (currentUser && currentUser?.is_connected) &&
                <SearchBar />
            }
 
            <ScrollableButtonsCategoryProducts

                setActiveCategory={setActiveButtonCategory}

                products={filteredItemsPopover}

                setActiveBtnOver={setIsButtonOver}

                openModal={openModal}

                owners={owners}

            />
            
            {
                (loading) ?

                <LoadingCard />
                :
                <ListProductByCategory
                    filteredItems={filteredItems}
                    cartItems={cartItems}
                    owners={owners}
                    openModal={openModal}
                />

            }

            <ModalViewProduct isOpen={!!modalData} onClose={closeModal} products={filteredItems}/>

        </div>
    );
};

export default GridLayoutProduct;


const ListProductByCategory = ({ filteredItems, cartItems, owners, openModal }) => {

    const { t } = useTranslation();

    return (

        <>
            {
                (filteredItems?.length > 0) ?
                    (

                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-3 z-0 mb-[100px]">

                            {/* --- Regroupement des produits par catégorie --- */}
                            {
                                Object.entries(

                                    filteredItems.reduce((acc, item) => {
                                        const cat = item?.categorie_product || "Autres";
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








