import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
//import { addToCart, updateSelectedProduct } from "../slices/cartSlice";
import { X, ShoppingCart, Clock, Heart, Play, Pause } from "lucide-react";

import PrintNumberStars from "../components/SystemStar";
import RendrePrixProduitMonnaie from "../features/ConvertCurrency";
import TextParagraphs from "../components/TextToParagraph";
import ProfilPopPov from "../features/PopovProfile";
//import api from "../services/Axios";
//import { API_ENDPOINTS } from "../services/apiEndpoints";
// Assets
import express_delivery from "../../src/assets/express-delivery_1981844.png";
import home_5657414 from "../../src/assets/home-address_12248895.png";
import pay_8331969 from "../../src/assets/pay_8331969.png";
import { getMediaUrl, getProducts } from "../utils";
import { addToCart } from "../slices/cartSlice";
import LikeButton from "../components/LikeButton";

const ProductDetailsSection = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [selectedColor, setSelectedColor] = useState(null);
    const [index, setIndex] = useState(0);
    const product = useSelector(state => state.cart.selectedProductView);

    const variantsProduct = product?.variants || [];
    const medias = [
        ...variantsProduct.map(v => ({
            type: "image",
            url: v.image
        })),
        ...(product?.video
            ? [{
                type: "video",
                url: product.video
            }]
            : [])
    ];
    //const imageCurrentVariantImage = variantsProduct[index]?.image;

    // Logique d'affichage
    const handleAddToCart = () => dispatch(addToCart(product));
    const createdDate = new Date(product?.created);
    const isToday = createdDate.toDateString() === new Date().toDateString();
    const [sameProductCategory, setSameProductCategory] = useState([])
    const [mediaIndex, setMediaIndex] = useState(0);
    const [isMediaPaused, setIsMediaPaused] = useState(false);

    const videoRef = React.useRef(null);
    const resumeTimer = React.useRef(null);

    const pauseMediaSlider = () => {

        setIsMediaPaused(true);

        clearTimeout(resumeTimer.current);

        resumeTimer.current = setTimeout(() => {

            setIsMediaPaused(false);

        }, 10000); // reprend après 10 secondes

    };

    let adresse = "";

    try {
        adresse = JSON.parse(product?.address)?.adresse || "";
    } catch (error) {
        adresse = "";
    }

    const operations = [
        { logo: express_delivery, title: t("delivery"), value: product?.delivery },
        { logo: home_5657414, title: t("adress"), value: adresse },
        { logo: pay_8331969, title: t("paymentMethod"), value: product?.payment_method }
    ];

    useEffect(() => {

        if (isOpen) {

            document.body.style.overflow = "hidden";

        } else {

            document.body.style.overflow = "";

        }


        return () => {

            document.body.style.overflow = "";

        }


    }, [isOpen]);

    useEffect(
        () => {

            const fetchProducts = async () => {
                try {
                    const { products } = await getProducts(product?.categorie_product);

                    setSameProductCategory(products);

                } catch (error) {
                    console.error(error);
                }
            };

            fetchProducts()

        }, [product]
    )

    // ⚠️ Correction : il y avait deux useEffect quasi identiques qui faisaient
    // défiler mediaIndex en parallèle — l'un d'eux ignorait isMediaPaused, donc
    // le slider continuait à avancer même après un clic sur la photo/vidéo.
    // Un seul effect fait foi désormais, et respecte bien la pause.
    useEffect(() => {

        if (
            !isOpen ||
            medias.length <= 1 ||
            isMediaPaused
        ) return;


        const timer = setInterval(() => {

            setMediaIndex(prev =>
                prev === medias.length - 1
                    ? 0
                    : prev + 1
            );

        }, 5000);


        return () => clearInterval(timer);


    }, [
        isOpen,
        medias.length,
        isMediaPaused
    ]);

    if (!isOpen || !product?.id) return null;

    return createPortal(

        <div
            className="
        fixed
        inset-0
        z-[2147483647]
        flex
        items-center
        justify-center
        bg-black/40
        backdrop-blur-sm
        "
        >

            {/* Overlay flouté pour un look premium */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={() => {
                    onClose();
                    setIndex(0);

                    if (videoRef.current) {
                        videoRef.current.pause();
                        videoRef.current.currentTime = 0;
                    }
                }}
            />

            {/* Modal */}
            <div className="scrollbor_hidden relative bg-white max-w-[100vw] w-full rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">

                {/* Header Mobile / Close Button */}
                <button
                    onClick={() => {
                        onClose();
                        setIndex(0);

                        if (videoRef.current) {
                            videoRef.current.pause();
                            videoRef.current.currentTime = 0;
                        }
                    }}
                    className="absolute right-1 top-3 z-50 p-2 bg-white/80 backdrop-blur rounded-full shadow-lg text-gray-500 hover:text-black transition-all active:scale-90"
                    aria-label={t("close") || "Fermer"}
                >
                    <X size={20} />
                </button>

                <div className="overflow-y-auto p-6 md:p-10 scrollbor_hidden">

                    <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-start">

                        {/* SECTION GAUCHE : VISUEL */}
                        <div className="space-y-4">

                            <div className="
                                    relative
                                    aspect-square
                                    rounded-2xl
                                    bg-black
                                    border
                                    border-gray-100
                                    overflow-hidden
                                    group
                                ">

                                {/* Indicateur d'état du défilement automatique */}
                                {medias.length > 1 && (
                                    <div
                                        className={`
                                            absolute top-3 left-3 z-10
                                            flex items-center gap-1.5
                                            px-2.5 py-1 rounded-full
                                            text-[10px] font-semibold uppercase tracking-wide
                                            backdrop-blur-md transition-colors duration-300
                                            ${isMediaPaused
                                                ? "bg-white/90 text-gray-600"
                                                : "bg-indigo-600/90 text-white"}
                                        `}
                                    >
                                        {isMediaPaused ? (
                                            <>
                                                <Pause size={11} />
                                                {t("paused") || "En pause"}
                                            </>
                                        ) : (
                                            <>
                                                <Play size={11} />
                                                {t("auto") || "Auto"}
                                            </>
                                        )}
                                    </div>
                                )}

                                {medias[mediaIndex]?.type === "image" && (

                                    <img
                                        key={mediaIndex}
                                        src={getMediaUrl(medias[mediaIndex].url)}
                                        alt={product?.name_product}
                                        onClick={pauseMediaSlider}
                                        className="
                                            media-fade-in
                                            w-full
                                            h-full
                                            object-contain
                                            cursor-pointer
                                            select-none
                                            transition-transform
                                            duration-500
                                        "
                                    />

                                )}


                                {medias[mediaIndex]?.type === "video" && (

                                    <video
                                        key={mediaIndex}

                                        ref={videoRef}

                                        autoPlay
                                        muted
                                        controls
                                        loop
                                        playsInline

                                        onClick={pauseMediaSlider}

                                        onLoadedMetadata={(e) => {
                                            e.target.volume = 0.5;
                                        }}

                                        className="
                                            media-fade-in
                                            w-full
                                            h-full
                                            object-contain
                                            cursor-pointer
                                        "

                                    >

                                        <source
                                            src={getMediaUrl(medias[mediaIndex].url)}
                                            type="video/mp4"
                                        />

                                    </video>

                                )}

                                {/* petite feuille de style locale pour le fondu d'apparition
                                    (évite de dépendre d'un plugin Tailwind externe) */}
                                <style>{`
                                    .media-fade-in {
                                        animation: proMediaFade .45s ease both;
                                    }
                                    @keyframes proMediaFade {
                                        from { opacity: 0; transform: scale(1.02); }
                                        to   { opacity: 1; transform: scale(1); }
                                    }
                                `}</style>


                                {/* Navigation média */}

                                {medias.length > 1 && (

                                    <div className="
                                            absolute
                                            bottom-4
                                            left-1/2
                                            -translate-x-1/2
                                            flex
                                            gap-2
                                        ">

                                        {medias.map((_, i) => (

                                            <button

                                                key={i}

                                                onClick={() => {
                                                    setMediaIndex(i);
                                                    pauseMediaSlider();
                                                }}

                                                aria-label={`${t("view_media") || "Voir le média"} ${i + 1}`}

                                                className={`
                                                        h-2
                                                        rounded-full
                                                        transition-all
                                                        duration-300
                                                        ${mediaIndex === i
                                                        ?
                                                        "bg-indigo-600 w-6"
                                                        :
                                                        "bg-white/60 hover:bg-white/80 w-2"
                                                    }
                                                    `}

                                            />

                                        ))}

                                    </div>

                                )}

                            </div>

                            {/* Miniatures (facultatif mais pro) */}
                            <div className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory scrollbor_hidden">
                                {variantsProduct.map((v, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setIndex(i)}
                                        className={`w-16 h-16 rounded-lg border-2 flex-shrink-0 overflow-hidden snap-start transition-all ${index === i ? 'border-indigo-600 shadow-sm' : 'border-transparent opacity-60 hover:opacity-90'}`}
                                    >
                                        <img src={getMediaUrl(v.image)} className="w-full h-full object-cover" alt="" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* SECTION DROITE : INFOS */}
                        <div className="mt-8 lg:mt-0">

                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight">
                                        {product?.name_product}
                                    </h1>
                                    <p className="text-xs font-bold text-indigo-500 mt-1 tracking-widest uppercase">
                                        Ref: {product?.code_reference}
                                    </p>
                                    <p className="text-xs font-bold text-yellow-300 mt-1 tracking-widest uppercase">
                                        {product?.categorie_product}
                                    </p>
                                </div>
                                <ProfilPopPov />
                            </div>

                            <div className="mt-6 flex items-center justify-between bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100">

                                <div className="text-3xl font-black text-indigo-600">
                                    <RendrePrixProduitMonnaie item={product} />
                                </div>

                                <PrintNumberStars t={t} productNbViews={product?.view_count} />

                            </div>

                            {/* COLORS */}
                            {variantsProduct[0]?.color && (
                                <div className="mt-8">
                                    <h3 className="text-sm font-bold text-gray-900 mb-3">{t("color_prod")}</h3>
                                    <div className="flex gap-3">
                                        {variantsProduct.map((variant, i) => (
                                            <button
                                                key={i}
                                                onClick={() => { setSelectedColor(variant.color); setIndex(i); }}
                                                className={`w-9 h-9 rounded-full border-2 shadow-sm transition-all ${selectedColor === variant.color ? "ring-2 ring-indigo-500 ring-offset-2 scale-110" : "border-white"}`}
                                                style={{ backgroundColor: variant.color }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* DESCRIPTION */}
                            <div className="mt-8">
                                <h3 className="text-sm font-bold text-gray-900 mb-2">{t("description_prod")}</h3>
                                <div className="text-gray-600 leading-relaxed text-sm">
                                    <TextParagraphs text={product?.description_product?.toLowerCase()} />
                                </div>
                            </div>

                            {/* ATTRIBUTES GRID */}
                            <div className="mt-8 grid grid-cols-2 gap-3">
                                {Object.entries(product?.attributes || {}).map(([key, value]) => (
                                    <div key={key} className="flex flex-col p-3 bg-gray-50 rounded-xl border border-gray-100">
                                        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">{key}</span>
                                        <span className="text-sm font-bold text-gray-800">{String(value)}</span>
                                    </div>
                                ))}
                            </div>

                            {/* ACTION BUTTONS */}
                            <div className="mt-10 flex gap-4">

                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 flex items-center justify-center gap-3 py-4 bg-[#6366f1] hover:bg-[#4f46e5] text-white rounded-2xl font-bold shadow-xl shadow-indigo-200 transition-all active:scale-95"
                                >
                                    <ShoppingCart size={20} />
                                    {t("add_in_basket")}
                                </button>

                                <button className="p-4 bg-gray-100 text-gray-400 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-colors">
                                    <LikeButton
                                        contentType="product"
                                        objectId={product.id}
                                        initialLiked={product.is_liked}
                                        initialCount={product.likes_count}
                                    />
                                </button>

                            </div>

                            {/* LOGISTICS */}
                            <div className="mt-10 flex flex-wrap gap-6 py-6 border-y border-gray-100">

                                {operations.map((op, i) => (

                                    <div key={i} className="flex items-center gap-3">

                                        <div className="p-2 bg-gray-50 rounded-lg">
                                            <img src={op.logo} className="w-5 h-5 grayscale opacity-70" alt="" />
                                        </div>

                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-gray-400 font-bold uppercase">{op.title}</span>
                                            <span className="text-xs font-semibold text-gray-700">{op.value}</span>
                                        </div>

                                    </div>
                                ))}

                            </div>

                            {/* FOOTER DATE */}
                            <div className="mt-6 flex items-center justify-end text-[11px] text-gray-400 gap-2">

                                <Clock size={12} />

                                <span>
                                    {isToday
                                        ? `${t("phrasaleDate")} ${createdDate.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`
                                        : `${createdDate.toLocaleDateString("fr-FR")} ${t("at")} ${createdDate.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`}
                                </span>

                            </div>

                        </div>
                    </div>

                    {sameProductCategory?.length > 0 && (
                        <div className="mt-8">

                            {/* Séparateur */}
                            <div className="flex items-center gap-4 mb-5">
                                <div className="flex-1 h-px bg-gray-200" />
                                <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                                    {t("same_category_products")}
                                </span>
                                <div className="flex-1 h-px bg-gray-200" />
                            </div>

                            {/* Liste */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {sameProductCategory.map((prod) => (
                                    <div
                                        key={prod.id}
                                        className="group rounded-xl border border-gray-100 bg-white p-3 hover:shadow-md transition"
                                    >
                                        <img
                                            src={getMediaUrl(medias[mediaIndex].url)}
                                            alt={prod?.name_product || "Produit"}
                                            onClick={pauseMediaSlider}
                                            loading="lazy"
                                            className="
                                                w-full
                                                h-28
                                                object-contain
                                                transition-transform
                                                duration-300
                                                group-hover:scale-110
                                                cursor-pointer
                                            "
                                        />

                                        <p className="mt-3 text-sm font-medium text-gray-700 text-center line-clamp-2">
                                            {prod?.name_product}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>


            </div>

        </div>,

        document.body

    );
};

export default ProductDetailsSection;