import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateSelectedProduct } from '../slices/cartSlice';
import api from '../services/Axios';
import { API_ENDPOINTS } from "../services/apiEndpoints";
import ModalViewProduct from '../pages/ProductViewsDetails';
import LoadingCard from '../components/LoardingSpin';
import { CONSTANTS, removeAccents, translateCategory, extractResults } from '../utils';
import SearchBar from '../components/BtnSearchWithFilter';
import ScrollableButtonsCategoryProducts from './ScrollCategoryButtons';
import ListProductByCategory from './ListProductCategory';
import NoContentComp from '../components/NoContentComp';
import { useTranslation } from 'react-i18next';
const DEFAULT_ACTIVE_CATEGORY = CONSTANTS?.ALL;

// Résout l'URL + les params d'API selon catégorie / recherche
const resolveProductsRequest = ({ category, searchQuery }) => {

    if (searchQuery) {
        return {
            url: API_ENDPOINTS.PRODUCTS.FILTER_SEARCH(searchQuery),
            params: {},
        };
    }

    const translatedCategory = translateCategory(
        category.replace("_", " ")
    ).toLocaleUpperCase();

    const cleanCategory = removeAccents(translatedCategory)?.toLowerCase();

    const isDefaultCategory =
        !cleanCategory ||
        cleanCategory?.toLowerCase() === DEFAULT_ACTIVE_CATEGORY?.toLowerCase();

    return {
        url: isDefaultCategory
            ? API_ENDPOINTS.PRODUCTS.DEFAULT_LIST
            : API_ENDPOINTS.PRODUCTS.FILTER,
        params: isDefaultCategory
            ? {}
            : { product_categorie: cleanCategory },
    };
};

const GridLayoutProduct = () => {

    const dispatch = useDispatch();
    const { t } = useTranslation()
    const cartItems = useSelector(state => state?.cart?.items);
    const currentUser = useSelector(state => state.auth.user);
    const categorySelectedData = useSelector(state => state?.navigate?.categorySelectedOnSearch)

    const [activeButtonCategory, setActiveButtonCategory] = useState(DEFAULT_ACTIVE_CATEGORY);
    const [isButtonOver, setIsButtonOver] = useState(DEFAULT_ACTIVE_CATEGORY);

    const [products, setProducts] = useState([]);
    const [nextPage, setNextPage] = useState(null);
    const [loading, setLoading] = useState(false);

    const [filteredItemsPopover, setFilteredItemsPopover] = useState([]);
    const [owners, setOwners] = useState({});
    const [modalData, setModalData] = useState(null);

    const loadingRef = useRef(loading);
    const nextPageRef = useRef(nextPage);

    useEffect(() => { loadingRef.current = loading; }, [loading]);
    useEffect(() => { nextPageRef.current = nextPage; }, [nextPage]);

    const openModal = (item) => setModalData(item);
    const closeModal = () => setModalData(null);

    const isCurrentUserConnected = (currentUser && currentUser?.is_connected);

    const productsWithImage = products.filter(prod =>
        prod.variants?.some(variant => variant?.image)
    );

    const filteredItemsLenght = (productsWithImage?.length === 0);

    // Récupère les fournisseurs pour un lot de produits, et fusionne dans le state existant
    const fetchOwnersFor = useCallback(async (productList) => {

        const uniqueOwnerIds = [...new Set(productList.map(p => p?.fournisseur?.id))]
            .filter(id => id != null);

        if (uniqueOwnerIds.length === 0) return;

        const responses = await Promise.all(
            uniqueOwnerIds.map(id =>
                api.get(API_ENDPOINTS.CLIENTS.DETAIL(id))
                    .then(res => ({ id, data: res.data }))
                    .catch(() => ({ id, data: null }))
            )
        );

        setOwners(prev => {
            const next = { ...prev };
            responses.forEach(({ id, data }) => {
                if (data) next[id] = data;
            });
            return next;
        });

    }, []);

    // Fetch initial — se relance si la catégorie active ou la recherche change
    useEffect(() => {

        const fetchProducts = async () => {

            setLoading(true);

            try {

                const { url, params } = resolveProductsRequest({
                    category: activeButtonCategory,
                    searchQuery: categorySelectedData?.query,
                });

                const { data: response } = await api.get(url, { params });

                const results = extractResults(response);

                const filtered = results.filter(
                    item => parseInt(item?.quantity_product) !== 0
                );

                setProducts(filtered);
                setNextPage(response?.next ?? null);

                fetchOwnersFor(filtered);

            } catch (error) {

                setProducts([]);
                setNextPage(null);

            } finally {

                setLoading(false);
            }
        };

        fetchProducts();

    }, [activeButtonCategory, categorySelectedData, fetchOwnersFor]);

    // Popover catégorie survolée (indépendant de la liste principale)
    useEffect(() => {

        const fetchPopoverProducts = async () => {

            try {

                const { url, params } = resolveProductsRequest({
                    category: isButtonOver,
                    searchQuery: null,
                });

                const { data: response } = await api.get(url, { params });

                const results = extractResults(response);

                const filtered = results.filter(
                    item => parseInt(item?.quantity_product) !== 0
                );

                setFilteredItemsPopover(filtered);

            } catch (error) {

                setFilteredItemsPopover([]);
            }
        };

        fetchPopoverProducts();

    }, [isButtonOver]);

    // Chargement de la page suivante (scroll infini)
    const loadMoreProducts = useCallback(async () => {

        if (!nextPageRef.current || loadingRef.current) return;

        try {

            setLoading(true);

            const { data: response } = await api.get(nextPageRef.current);

            const results = extractResults(response);

            const filtered = results.filter(
                item => parseInt(item?.quantity_product) !== 0
            );

            setProducts(prev => [...(Array.isArray(prev) ? prev : []), ...filtered]);
            setNextPage(response?.next ?? null);

            fetchOwnersFor(filtered);

        } catch (error) {

            // silencieux, on garde la liste actuelle

        } finally {

            setLoading(false);
        }

    }, [fetchOwnersFor]);

    // Sentinelle observée pour déclencher le chargement de la page suivante
    const sentinelRef = useRef(null);

    useEffect(() => {

        const node = sentinelRef.current;
        if (!node) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    loadMoreProducts();
                }
            },
            { rootMargin: "800px" }
        );

        observer.observe(node);

        return () => observer.disconnect();

    }, [loadMoreProducts]);

    useEffect(() => {

        dispatch(updateSelectedProduct(modalData));

    }, [dispatch, modalData]);

    return (

        <div className="space-y-1 h-full py-[2dvh]">

            {isCurrentUserConnected && <SearchBar />}

            <ScrollableButtonsCategoryProducts

                setActiveCategory={setActiveButtonCategory}

                products={filteredItemsPopover}

                setActiveBtnOver={setIsButtonOver}

                openModal={openModal}

                owners={owners}

            />

            <main className="h-full overflow-x-hidden">

                {
                    (loading && products.length === 0) ? (

                        <LoadingCard />

                    ) : filteredItemsLenght ? (

                        <div className="mbl-empty">
                            <div className="mbl-empty-icon">📭</div>
                                <NoContentComp content={t('ListItemsFilterProduct.noProduct')} />;
                        </div>

                    ) : (

                        <ListProductByCategory
                            filteredItems={productsWithImage}
                            cartItems={cartItems}
                            owners={owners}
                            openModal={openModal}
                        />

                    )
                }

                {/* Sentinelle pour le scroll infini */}
                <div ref={sentinelRef} className="h-4 w-full" />

                {loading && products.length > 0 && (
                    <div className="flex justify-center py-6">
                        <span className="text-sm text-gray-400">Chargement...</span>
                    </div>
                )}

            </main>

            <ModalViewProduct isOpen={!!modalData} onClose={closeModal} />

        </div>
    );
};

export default GridLayoutProduct;