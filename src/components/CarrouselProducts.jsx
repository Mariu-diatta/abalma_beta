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
    });

    if (!pictures.length) return null;

    const current = pictures[currentIndex];

    return (

        <div className="relative w-full rounded-lg overflow-hidden group">

            {/* IMAGE */}
            <div className="relative h-70 md:h-70 w-full">

                <div
                    className="relative w-full h-full overflow-hidden"
                >
                    {/* Image de fond floutée */}
                    <div

                        className="absolute inset-0 bg-cover bg-center blur-xl scale-110"

                        style={{
                            backgroundImage: `url(${current?.image_product})`,
                        }}
                    />

                    {/* Overlay sombre pour lisibilité */}
                    <div className="absolute inset-0 bg-black/20" />

                    {/* Image principale */}
                    <img
                        src={current?.image_product}
                        alt="product"
                        className="relative w-full h-full object-contain "
                    />

                </div>


                {/* OVERLAY GRADIENT */}
                <div
                    className="
                        absolute inset-0
                        bg-gradient-to-t from-gray/10 via-gray/20 to-transparent
                        flex flex-col items-center justify-end
                        p-6 text-white
                        transition-opacity duration-500
                      "
                >

                    {/* DESCRIPTION */}
                    <p
                        className="
                          text-sm md:text-white text-center
                          px-2 py-1 rounded-md bg-black/50
                          opacity-0 translate-y-2
                          group-hover:opacity-100 group-hover:translate-y-0
                          transition-all duration-500
                        "
                    >
                        {(current?.description_product?.toLowerCase())?.slice(0, 50)}...

                    </p>

                    {/* BUTTON */}
                    <button

                        onClick={() => {
                            openModal(current);
                            dispatch(addUser(owners[current?.fournisseur]));
                        }}

                        className="
                          mt-4 px-6 py-2 rounded-full text-sm
                          bg-white/80 text-gray-800 
                          hover:bg-white shadow-lg transition-all duration-300
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
                    ${pictures?.length <= 1 ? "hidden" : ""}
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
                    ${pictures?.length <= 1 ? "hidden" : ""}
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
