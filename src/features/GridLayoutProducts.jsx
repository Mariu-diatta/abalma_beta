import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateSelectedProduct } from '../slices/cartSlice';
import api from '../services/Axios';
import ModalViewProduct from '../pages/ProductViewsDetails';
import LoadingCard from '../components/LoardingSpin';
import { CONSTANTS, removeAccents, translateCategory } from '../utils';
import SearchBar from '../components/BtnSearchWithFilter';
import ScrollableButtonsCategoryProducts from './ScrollCategoryButtons';
import PaginationProduit from './ProductPagination';
import ListProductByCategory from './ListProductCategory';

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
                    ? "produits/"
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
                    ?
                    "produits/"
                    :
                    `products/filter/?categorie_product=${cleanCategory?.toUpperCase()}`;

                const { data: products } = await api.get(url);

                const filtered = products.filter(item => parseInt(item?.quantity_product) !== 0);

                setFilteredItemsPopover(filtered);

                const uniqueOwnerIds = [...new Set(products.map(p => p?.fournisseur))].filter(Boolean);

                const responses = await Promise.all(

                    uniqueOwnerIds?.map(id =>

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

            if (!categorySelectedData?.query) return

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

        <div className="space-y-4  pb-[10dvh]">

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

            <aside className={`${(filteredItems?.length === 0) ? "hidden" : "p-0"}`}>

                <PaginationProduit products={filteredItems} />

            </aside>

            <main className="h-full">

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

            </main>

            <ModalViewProduct isOpen={!!modalData} onClose={closeModal} products={filteredItems}/>

        </div>
    );
};

export default GridLayoutProduct;








