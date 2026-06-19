import React, { useEffect, useState} from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { addToCart } from "../slices/cartSlice";
import { X, ShoppingCart, Clock, Heart} from "lucide-react"; // Optionnel: icons plus fines

import PrintNumberStars from "../components/SystemStar";
import RendrePrixProduitMonnaie from "../features/ConvertCurrency";
import TextParagraphs from "../components/TextToParagraph";
import ProfilPopPov from "../features/PopovProfile";
import api from "../services/Axios";

// Assets
import express_delivery from "../../src/assets/express-delivery_1981844.png";
import home_5657414 from "../../src/assets/home-address_12248895.png";
import pay_8331969 from "../../src/assets/pay_8331969.png";
import { getMediaUrl } from "../utils";

const ProductDetailsSection = ({ isOpen, onClose }) => {
    const [selectedColor, setSelectedColor] = useState(null);
    const [index, setIndex] = useState(0);
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const product = useSelector(state => state.cart.selectedProductView);

    const variantsProduct = product?.variants || [];
    const imageCurrentVariantImage = variantsProduct[index]?.image;

    // Logique d'affichage
    const handleAddToCart = () => dispatch(addToCart(product));
    const createdDate = new Date(product?.created);
    const isToday = createdDate.toDateString() === new Date().toDateString();

    const operations = [
        { logo: express_delivery, title: t("delivery"), value: product?.delivery },
        { logo: home_5657414, title: t("adress"), value: product?.address },
        { logo: pay_8331969, title: t("paymentMethod"), value: product?.payment_method }
    ];

    useEffect(() => {
        if (!product?.id || !isOpen) return;
        const controller = new AbortController();
        const updateViewCount = async () => {
            try {
                await api.get(`products_details/${product.id}/`, {
                    signal: controller.signal,
                    withCredentials: true
                });
            } catch (err) {
                if (err.name !== "CanceledError") console.error(err);
            }
        };
        updateViewCount();
        return () => controller.abort();
    }, [product?.id, isOpen]);

    if (!isOpen || !product?.id) return null;

    return (

        <div className="fixed inset-0 z-[100] flex items-center justify-center p-1">

            {/* Overlay flouté pour un look premium */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={() => { onClose(); setIndex(0); }}
            />

            {/* Modal */}
            <div   className="scrollbor_hidden relative bg-white max-w-[100vw] w-full rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">

                {/* Header Mobile / Close Button */}
                <button
                    onClick={() => { onClose(); setIndex(0); }}
                    className="absolute right-1 top-0.5 z-50 p-2 bg-white/80 backdrop-blur rounded-full shadow-lg text-gray-500 hover:text-black transition-all active:scale-90"
                >
                    <X size={20} />
                </button>

                <div className="overflow-y-auto p-6 md:p-10 scrollbor_hidden">

                    <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-start">

                        {/* SECTION GAUCHE : VISUEL */}
                        <div className="space-y-4">

                            <div className="relative aspect-square rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden group">
                                <img
                                    src={getMediaUrl(imageCurrentVariantImage)}
                                    alt={product?.name_product}
                                    className="w-full h-full object-contain  transition-transform duration-500 group-hover:scale-105 cursor-zoom-in"
                                    onClick={() => setIndex((index + 1) % variantsProduct.length)}
                                />
                            </div>

                            {/* Miniatures (facultatif mais pro) */}
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {variantsProduct.map((v, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setIndex(i)}
                                        className={`w-16 h-16 rounded-lg border-2 flex-shrink-0 overflow-hidden transition-all ${index === i ? 'border-blue-600' : 'border-transparent opacity-60'}`}
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
                                    <p className="text-xs font-bold text-blue-500 mt-1 tracking-widest uppercase">
                                        Ref: {product?.code_reference}
                                    </p>
                                </div>
                                <ProfilPopPov />
                            </div>

                            <div className="mt-6 flex items-center justify-between bg-blue-50/50 p-4 rounded-2xl border border-blue-100">

                                <div className="text-3xl font-black text-blue-600">
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
                                                className={`w-9 h-9 rounded-full border-2 shadow-sm transition-all ${selectedColor === variant.color ? "ring-2 ring-blue-500 ring-offset-2 scale-110" : "border-white"}`}
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
                                    className="flex-1 flex items-center justify-center gap-3 py-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-2xl font-bold shadow-xl shadow-blue-200 transition-all active:scale-95"
                                >
                                    <ShoppingCart size={20} />
                                    {t("add_in_basket")}
                                </button>

                                <button className="p-4 bg-gray-100 text-gray-400 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-colors">
                                    <Heart size={20} />
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
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsSection;