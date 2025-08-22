import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '../slices/cartSlice';
import api from '../services/Axios';
import OwnerAvatar from '../components/OwnerProfil';
import { useRef, } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { addMessageNotif, addUser } from '../slices/chatSlice';
import ProductModal from '../pages/ProductViewsDetails';
import { useTranslation } from 'react-i18next';
import LoadingCard from '../components/LoardingSpin';
import { numberStarsViews, productViews, removeAccents, translateCategory } from '../utils';
import RendrePrixProduitMonnaie from '../components/ConvertCurrency';


export function ImageGalleryPan({imagesEls}) {

    return (

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 scrollbor_hidden_ overflow-y-auto h-full">

            {imagesEls?.map((prod, idx) => (

                <div key={idx}>

                    <img
                        className="h-auto max-w-full rounded-lg"
                        src={prod?.image_product}
                        alt={`Gallery  ${idx + 1}`}
                    />

                </div>
            ))}
        </div>
    );
}

export const ImageGallery = ({ imagesEls }) => (

    <div className="grid gap-4 h-auto w-auto overflow-x-auto w-full overflow-y-auto h-full">
        {/*<div>*/}
        {/*    <img className="h-auto rounded-lg" src={mainImage} alt="Main" />*/}
        {/*</div>*/}
        <div className="grid grid-cols-5 gap-4">

            {imagesEls?.map((prod, idx) => (

                <img key={idx} className="h-auto max-w-full rounded-lg" src={prod.image_product} alt={`Sub ${idx + 1}`} />
            ))}

        </div>

    </div>
);

export function Carousel({ products }) {

    const pictures = useMemo(() => {
        if (!products || !Array.isArray(products)) return [];
        return products.flatMap((product) => product.image_product || []);
    }, [products]);

    const [currentIndex, setCurrentIndex] = useState(0); 

    const [productScroll, setProductScroll] = useState(null);

    const prevSlide = () => {
        setCurrentIndex((prev) => (pictures.length ? (prev === 0 ? pictures.length - 1 : prev - 1) : 0));
    };

    const nextSlide = () => {
        setCurrentIndex((prev) => (pictures.length ? (prev === pictures.length - 1 ? 0 : prev + 1) : 0));
    };

    // Auto slide toutes les 2 secondes
    useEffect(() => {

        if (!pictures.length) return;

        const interval = setInterval(() => {

            setCurrentIndex((prev) => (prev === pictures.length - 1 ? 0 : prev + 1));

        }, 2000);

        return () => clearInterval(interval);

    }, [pictures, productScroll]);

    if (!pictures.length) return null;

    return (

        <div className="relative w-full">

            <div className="relative  overflow-hidden rounded-lg h-70 lg:h-70 md:h-auto">

                {products?.length > 0 &&  products.map((prod, idx) => (

                    <section className="shadow-lg">

                        <img
                            key={idx}
                            src={prod.image_product}
                            alt={`Slide ${idx + 1}`}
                            title={"Nombre d'articles disponibles: " + prod.quantity_product}
                            className={`absolute top-1/2 left-1/2 w-full h-[300px] object-cover -translate-x-1/2 -translate-y-1/2 transition-opacity duration-700 ease-in-out scale-100 ${idx === currentIndex ? "opacity-100 z-2" : "opacity-0 z-2"
                                }`}
                        />

                        <span
                            className={`w-2/3 text-sm absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-lg font-bold z-4 rounded-lg border-1 border-blue-700 p-2 ${idx === currentIndex ? "opacity-100" : "opacity-0"
                                }`}
                        >
                            {prod?.description_product}
                        </span>

                        <button
                            onClick={() => setProductScroll(prod)}
                            type="button"
                            className="w-full sm:w-auto absolute bottom-0 left-1/2 -translate-x-1/2 -translate-y-1/2 py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 z-[20]">
                            Voir le produit
                        </button>

                    </section>
                ))}

            </div>

            <button
                onClick={prevSlide}
                className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 py-12"
            >
                <ChevronLeft className="w-6 h-6 text-white" />
            </button>

            <button
                onClick={nextSlide}
                className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 py-12"
            >
                <ChevronRight className="w-6 h-6 text-white" />
            </button>
        </div>
    );
}

export const ScrollableCategoryButtons = ({ activeCategory, setActiveCategory, products }) => {

    const { t } = useTranslation();

    const categories = useMemo(
        () =>
            [
                "All",
                "JOUET",
                "HABITS",
                "MATERIELS_INFORMATIQUES",
                "CAHIERS",
                "SACS",
                "LIVRES",
                "ELECTROMENAGER",
                "TELEPHONIE",
                "ACCESSOIRES",
                "SPORT",
                "JEUX_VIDEO",
                "MEUBLES",
                "VEHICULES",
                "FOURNITURES_SCOLAIRES",
                "DIVERS",
            ].map((cat) => t(`ListItemsFilterProduct.${cat}`)),
        [t]
    );

    const scrollRef = useRef(null);
    const panelRef = useRef(null);

    const [showLeft, setShowLeft] = useState(false);
    const [showRight, setShowRight] = useState(false);
    const [btnId, setBtnId] = useState(false);
    const [btnOver, setBtnOver] = useState(null);

    const updateButtonsVisibility = useCallback(() => {

        const container = scrollRef.current;

        if (!container) return;

        const { scrollLeft, scrollWidth, clientWidth } = container;

        setShowLeft(scrollLeft > 0);

        setShowRight(scrollLeft + clientWidth < scrollWidth - 1);

    }, []);

    const scroll = useCallback(

        (direction) => {

            scrollRef.current?.scrollBy({ left: direction === "left" ? -200 : 200, behavior: "smooth" });
        },
        []
    );

    useEffect(() => {

        const container = scrollRef.current;

        if (!container) return;

        updateButtonsVisibility();

        container.addEventListener("scroll", updateButtonsVisibility);

        window.addEventListener("resize", updateButtonsVisibility);

        return () => {

            container.removeEventListener("scroll", updateButtonsVisibility);

            window.removeEventListener("resize", updateButtonsVisibility);
        };

    }, [updateButtonsVisibility]);

    useEffect(() => {

        const handleClickOutside = (e) => {

            if (panelRef.current && !panelRef.current.contains(e.target) && !scrollRef.current.contains(e.target)) {

                setBtnId(false);
            }
        };

        document.addEventListener("dblclick", handleClickOutside);

        return () => document.removeEventListener("dblclick", handleClickOutside);

    }, []);

    useEffect(() => {

        if (btnOver) {

            setActiveCategory(btnOver);
        }

    }, [btnOver, setActiveCategory]);

    return (
        <>
            <div
                ref={panelRef}
                className={`${btnId && products?.length ? "flex gap-2 bg-grey-9000 shadow-lg rounded-md h-70 lg:h-70 w-full" : "hidden"}`}
            >
                <div style={{ flex: 2 }} className="hidden lg:block">
                    <ImageGallery imagesEls={products} />
                </div>

                <div style={{ flex: 3 }}>
                    <Carousel products={products} />
                </div>

                <div style={{ flex: 2 }}>
                    <ImageGalleryPan imagesEls={products} />
                </div>
            </div>

            <div className="relative w-full mb-4">
                {showLeft && (
                    <button
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-5 bg-white p-2 shadow rounded-full"
                        onClick={() => scroll("left")}
                    >
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                )}

                <div ref={scrollRef} className="overflow-x-auto px-10 scrollbor_hidden_">
                    <div className="flex gap-2 min-w-max py-2">
                        {categories?.map((cat) => (
                            <button
                                key={cat}
                                onMouseEnter={() => setBtnId(true)}
                                onMouseOver={() => setBtnOver(cat)}
                                onClick={() => setActiveCategory(cat.replace(" ", "_"))}
                                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm transition ${activeCategory === cat
                                        ? "bg-blue-500 text-white"
                                        : "text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white"
                                    }`}
                            >
                                {cat.replace("_", " ")}
                            </button>
                        ))}
                    </div>
                </div>

                {showRight && (

                    <button
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-5 bg-white p-2 shadow rounded-full"
                        onClick={() => scroll("right")}
                    >
                        <ChevronRight className="w-5 h-5 text-gray-600" />

                    </button>
                )}
            </div>
        </>
    );
};

const GridLayoutProduct = () => {

    const [productNbViews, setProductNbViews] = useState(null);

    const [filteredItems, setFilteredItems] = useState([])

    const { t } = useTranslation();

    const [loading, setLoading] = useState(true)

    const dispatch = useDispatch();

    const cartItems = useSelector(state => state?.cart?.items);

    const lang = useSelector((state) => state?.navigate?.lang);

    const defaultCategory = lang === 'fr' ? 'Tous' : 'Tous';

    const [activeCategory, setActiveCategory] = useState(defaultCategory);

    const [modalData, setModalData] = useState(null);

    const [owners, setOwners] = useState({});

    const addProductToCart = (item) => dispatch(addToCart(item));

    const openModal = (item) => setModalData(item);

    const closeModal = () => setModalData(null);


    useEffect(() => {

        const fetchProductsAndOwners = async () => {

             removeAccents(translateCategory(activeCategory))

            try {
                const { data: products } =

                    (!!activeCategory && ((activeCategory && defaultCategory) &&  removeAccents(translateCategory(activeCategory))?.toLowerCase() === defaultCategory?.toLowerCase()))

                        ? await api.get("products/filter/")

                        : await api.get(`products/filter/?categorie_product=${activeCategory && removeAccents(translateCategory(activeCategory))?.toUpperCase()}`);

                const filtered = products.filter(item => parseInt(item?.quantity_product) !== 0);

                setFilteredItems(filtered);

                // IDs uniques des fournisseurs
                const uniqueOwnerIds = [...new Set(products.map(p => p?.fournisseur))].filter(Boolean);

                // Appels en parallèle
                const responses = await Promise.all(

                    uniqueOwnerIds.map(id =>

                        api.get(`clients/${id}/`).then(res => ({ id, data: res.data })).catch(() => ({ id, data: null }))
                    )
                );

                // Map id → owner
                const ownerMap = responses.reduce((acc, { id, data }) => {

                    if (data) acc[id] = data;

                    return acc;

                }, {});

                setOwners(ownerMap);

            } catch (error) {

                //console.error("Erreur lors du chargement :", error);

            } finally {

                setLoading(false);
            }
        };

        fetchProductsAndOwners();

    }, [activeCategory, defaultCategory]); // 🔹 Plus de filteredItems ici


  
    return (

        <div

            className="p-1 space-y-4 dark:bg-gray-900 dark:text-white"

            style={{

                backgroundColor: "var(--color-bg)",

                color: "var(--color-text)"
            }}
        >

            <ScrollableCategoryButtons

                activeCategory={activeCategory}

                setActiveCategory={setActiveCategory}

                products={filteredItems}
            />

            {
                loading ?

                <LoadingCard />
                :
                <>
                    {filteredItems.length > 0 ? (

                        <div
                            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 "
                        >

                            {filteredItems.length>0 && filteredItems.map(item => {

                                const isInCart = cartItems?.some(product => product?.id === item?.id);

                                const owner = owners[item?.fournisseur];

                                productViews(item, setProductNbViews)

                                return (

                                    <ProductCard
                                        item={item}
                                        isInCart={isInCart}
                                        owner={owner}
                                        productNbViews={productNbViews}
                                        t={t}
                                        numberStarsViews={numberStarsViews}
                                        openModal={openModal}
                                        addUser={addUser}
                                        owners={owners}
                                        addProductToCart={addProductToCart}
                                        addMessageNotif={addMessageNotif}
                                        dispatch={dispatch}
                                        qut_sold={item?.quanttity_product_sold}
                                    />
                                );
                            })}

                        </div>

                    ) : (

                        <div className="flex items-center justify-center mx-auto max-w-md p-4 rounded-full border border-gray-200  shadow-sm font-extrabold">
 
                            <span className="text-sm font-medium">{t('ListItemsFilterProduct.noProduct')}</span>

                        </div>
                     )}

                </>

            }

            <ProductModal isOpen={!!modalData} onClose={closeModal} dataProduct={modalData} />

        </div>
    );
};

export default GridLayoutProduct;

export const ProductCard = ({
    item,
    qut_sold,
    isInCart,
    owner,
    productNbViews,
    t,
    numberStarsViews,
    openModal,
    addUser,
    owners,
    addProductToCart,
    addMessageNotif,
    dispatch
}) => {
    return (
        <div
            key={item.id}

            style={{

                backgroundColor: "var(--color-bg)",

                color: "var(--color-text)"
            }}

            className={`var(--color-text) var(--color-bg) rounded-lg shadow-md transition transform hover:-translate-y-1 hover:shadow-lg ${isInCart ? "opacity-50 pointer-events-none bg-gray-100" : "bg-white"
                }`}

        >
            {/* Image & Modal Trigger */}
            <button
                onClick={() => {
                    openModal(item);
                    dispatch(addUser(owners[item?.fournisseur]));
                }}
                className="block w-full rounded-lg overflow-hidden"
            >
                <img
                    src={item?.image_product}
                    alt={item?.description_product}
                    className="w-full h-55 object-cover rounded-lg mb-2 transition duration-300 ease-in-out hover:brightness-75 hover:grayscale"
                    onError={(e) => {
                        if (e.target.src !== window.location.origin + "/default-product.jpg") {
                            e.target.src = "/default-product.jpg";
                        }
                    }}
                />
            </button>

            {/* Infos Produit */}
            <div className="p-1">

                {/* Avatar & Quantité */}
                <div className="flex justify-between items-center mb-1">

                    {owner && <OwnerAvatar owner={owner} />}

                    {item?.quantity_product !== "0" && (
                        <span className="text-xs text-gray-600">
                            {t("quantity")} {item?.quantity_product}
                        </span>
                    )}

                </div>

                {/* Étoiles & Reviews */}
                <div className="flex items-center">

                    <div className="flex items-center">

                        {[...Array(parseInt(numberStarsViews(productNbViews)))].map((_, i) => (
                            <svg
                                key={i}
                                className="size-5 text-gray-900"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        ))}

                    </div>

                    <a
                        href="/home"
                        className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500 sm:text-sx"
                    >
                        {productNbViews} {t("reviews")}
                    </a>

                </div>

                {/* Description */}
                <p className="text-xs text-start truncate mb-1 md:text-sm">
                    {item?.description_product}
                </p>

                <div className="flex text-xs gap-1 md:hidden bg-green-100 dark:bg-white-100 my-auto w-auto p-1 rounded-lg"><p>{t('quantity_sold')}</p>{qut_sold} </div>

                {/* Prix & Boutons */}
                <div className="flex justify-between items-center">

                    <span className="text-blue-700 font-semibold text-sm flex gap-2 items-center">

                        <RendrePrixProduitMonnaie item={item} />

                        <div className="hidden md:flex items-center gap-1 bg-green-50 text-green-800 dark:bg-white dark:text-black rounded-lg px-2 py-1 text-xs font-medium">

                            <span>{t('quantity_sold')}</span>

                            <span className="font-semibold">{qut_sold}</span>

                        </div>

                    </span>

                    <div className="flex gap-2">

                        <button

                            title="Ajouter au panier"

                            onClick={
                                () => {

                                addProductToCart(item);

                                dispatch(
                                    addMessageNotif(
                                        `Produit ${item?.code_reference} sélectionné le ${Date.now()}`
                                    )
                                );
                            }}

                            className="cursor-pointer p-1 rounded-full hover:bg-green-100 transition"
                        >
                            <svg
                                className="w-8 h-6 text-gray-800 dark:text-white border-1 rounded-lg"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1"
                                    d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7h-1M8 7h-.688M13 5v4m-2-2h4"
                                />
                            </svg>

                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
};








