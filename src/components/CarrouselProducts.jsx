import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { addUser } from "../slices/chatSlice";

const Carousel = ({ products, openModal, owners }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const filteredProducts = useMemo(() => {
        if (!Array.isArray(products)) return [];
        return products.filter((p) => p?.quantity_product > 0);
    }, [products]);

    const pictures = filteredProducts;

    const prevSlide = () => {
        setCurrentIndex((prev) =>
            prev === 0 ? pictures.length - 1 : prev - 1
        );
    };

    const nextSlide = () => {
        setCurrentIndex((prev) =>
            prev === pictures.length - 1 ? 0 : prev + 1
        );
    };

    useEffect(() => {
        if (!pictures.length) return;
        const interval = setInterval(nextSlide, 2500);
        return () => clearInterval(interval);
    }, [pictures]);

    if (!pictures.length) return null;

    const current = pictures[currentIndex];

    return (
        <div className="relative w-full rounded-lg overflow-hidden group">

            {/* IMAGE */}
            <div className="relative h-70 md:h-70 w-full">

                <img
                    src={current.image_product}
                    alt="product"
                    className="
                        w-full h-full object-cover
                        transition-transform duration-700
                        group-hover:scale-110
                    "
                />

                {/* OVERLAY GRADIENT */}
                <div
                    className="
                        absolute inset-0
                        bg-gradient-to-t from-gray/2 via-gray/20 to-transparent
                        flex flex-col items-center justify-end
                        p-6
                        text-white
                        transition-opacity duration-500 
                    "
                >

                    {/* DESCRIPTION */}
                    <p
                        className="
                            text-sm md:text-base
                            opacity-0 group-hover:opacity-100
                            translate-y-5 group-hover:translate-y-0
                            transition-all duration-500
                            text-center
                            px-2 py-1
                            bg-black/50 text-white rounded-md
                        "
                    >
                        {current.description_product?.toLowerCase()}
                    </p>

                    {/* BUTTON */}
                    <button
                        onClick={() => {
                            openModal(current);
                            dispatch(addUser(owners[current?.fournisseur]));
                        }}
                        className="
                            mt-4 px-6 py-2 rounded-full text-sm
                            bg-white/80 text-gray-800 backdrop-blur-sm
                            hover:bg-white shadow-lg
                            transition-all duration-300
                            opacity-0 group-hover:opacity-100
                            translate-y-5 group-hover:translate-y-0
                        "
                    >
                        {t("views_product")}
                    </button>
                </div>

            </div>

            {/* LEFT BUTTON */}
            <button
                onClick={prevSlide}
                className={`
                    ${pictures.length <= 1 ? "hidden" : ""}
                    absolute left-2 top-1/2 -translate-y-1/2
                    bg-black/30 hover:bg-black/50
                    p-2 rounded-full transition
                `}
            >
                <ChevronLeft className="text-white w-5 h-5" />
            </button>

            {/* RIGHT BUTTON */}
            <button
                onClick={nextSlide}
                className={`
                    ${pictures.length <= 1 ? "hidden" : ""}
                    absolute right-2 top-1/2 -translate-y-1/2
                    bg-black/30 hover:bg-black/50
                    p-2 rounded-full transition
                `}
            >
                <ChevronRight className="text-white w-5 h-5" />
            </button>
        </div>
    );
};

export default Carousel;
