import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateSelectedProduct } from '../slices/cartSlice';
import api from '../services/Axios';
import { API_ENDPOINTS } from "../services/apiEndpoints";
import ModalViewProduct from '../pages/ProductViewsDetails';
import LoadingCard from '../components/LoardingSpin';
import { CONSTANTS, removeAccents, translateCategory } from '../utils';
import SearchBar from '../components/BtnSearchWithFilter';
import ScrollableButtonsCategoryProducts from './ScrollCategoryButtons';
import ListProductByCategory from './ListProductCategory';
import PaginationProduit from './PaginationProduit';


const GridLayoutProduct = () => {

    const [filteredItems, setFilteredItems] = useState([])

    const productsFiltered = filteredItems.filter(prod =>

        prod.variants?.some(variant => variant?.image)

    );

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

    const filteredItemsLenght = (productsFiltered?.length === 0)

    const isCurrentUserConnected = (currentUser && currentUser?.is_connected)

    useEffect(

        () => {

            dispatch(updateSelectedProduct(modalData))

        }, [dispatch, modalData]
    )

    useEffect(() => {

        setLoading(true);

        const isDefaultCategory = (cleanCategory) => {

            if (!cleanCategory) return false;

            return cleanCategory?.toLowerCase() === DEFAULT_ACTIVE_CATEGORY?.toLowerCase();
        }

        const fetchProductsAndOwners = async () => {

            try {

                const translatedCategory = translateCategory(activeButtonCategory.replace("_", " ")).toLocaleUpperCase();


                let cleanCategory = removeAccents(translatedCategory)?.toLowerCase();

                const url = isDefaultCategory(cleanCategory) ? API_ENDPOINTS.PRODUCTS.DEFAULT_LIST : API_ENDPOINTS.PRODUCTS.FILTER

                const { data: products } = await api.get(url, {
                    params: {
                        product_categorie: cleanCategory,
                    },
                });

                const filtered = products.filter(item => parseInt(item?.quantity_product) !== 0);

                setFilteredItems(filtered);

                const uniqueOwnerIds = [...new Set(products.map(p => p?.fournisseur?.id))]
                    .filter(id => id != null);

                const responses = await Promise.all(

                    uniqueOwnerIds.map(id =>

                        api.get(API_ENDPOINTS.CLIENTS.DETAIL(id))

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

    }, [activeButtonCategory, DEFAULT_ACTIVE_CATEGORY]);

    useEffect(() => {

        const fetchProductsAndOwners = async () => {

            try {


                const isDefaultCategory = (cleanCategory) => {

                    if (!cleanCategory) return true;

                    return cleanCategory === DEFAULT_ACTIVE_CATEGORY?.toLowerCase();
                }

                const translatedCategory = translateCategory(isButtonOver.replace("_", " ").toLocaleUpperCase());

                var cleanCategory = removeAccents(translatedCategory)?.toLowerCase();

                const url = isDefaultCategory(cleanCategory) ? API_ENDPOINTS.PRODUCTS.DEFAULT_LIST : API_ENDPOINTS.PRODUCTS.FILTER;

                const { data: products } = await api.get(url, {
                    params: {
                        product_categorie: cleanCategory?.toUpperCase(),
                    },
                });

                const filtered = products.filter(item => parseInt(item?.quantity_product) !== 0);

                setFilteredItemsPopover(filtered);

            } catch (error) {

                // console.error("Erreur lors du chargement :", error);
            } finally {
            }
        };

        fetchProductsAndOwners();

    }, [isButtonOver, DEFAULT_ACTIVE_CATEGORY]);

    useEffect(

        () => {

            if (!categorySelectedData?.query) return

            const getDataSearch = async () => {

                setLoading(true)

                try {
                    const { data: products } = await api.get(API_ENDPOINTS.PRODUCTS.FILTER_SEARCH(categorySelectedData?.query))

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

        <div className="space-y-1 h-full py-[2dvh]">

            { isCurrentUserConnected && <SearchBar /> }

            <ScrollableButtonsCategoryProducts

                setActiveCategory={setActiveButtonCategory}

                products={filteredItemsPopover}

                setActiveBtnOver={setIsButtonOver}

                openModal={openModal}

                owners={owners}

            />


            <aside className={`${filteredItemsLenght ? "hidden" : "p-0"}`}>

                <PaginationProduit products={productsFiltered} />

            </aside>

            <main className="h-full overflow-x-hidden">

            {
                (loading) ?
                <LoadingCard />
                :
                <ListProductByCategory
                    filteredItems={productsFiltered}
                    cartItems={cartItems}
                    owners={owners}
                    openModal={openModal}
                />

            }

            </main>

            <ModalViewProduct isOpen={!!modalData} onClose={closeModal}/>

        </div>
    );
};

export default GridLayoutProduct;








