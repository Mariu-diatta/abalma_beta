import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useTranslation } from 'react-i18next';
import { addUser } from "../slices/chatSlice";
import { useDispatch } from "react-redux";


const Carousel = ({ products, openModal, owners }) => {

    const [productScroll, setProductScroll] = useState(null);

    const [currentIndex, setCurrentIndex] = useState(0);

    const { t } = useTranslation();

    const dispatch=useDispatch()

    const filteredProducts = useMemo(() => {

        if (!products || !Array.isArray(products)) return [];

        return products.filter(
            (item) => item?.quantity_product>0
        );

    }, [products]);

    const pictures = filteredProducts.flatMap((product) => product.image_product || []);

    const prevSlide = () => {
        setCurrentIndex((prev) =>
            pictures.length ? (prev === 0 ? pictures.length - 1 : prev - 1) : 0
        );
    };

    const nextSlide = () => {
        setCurrentIndex((prev) =>
            pictures.length ? (prev === pictures.length - 1 ? 0 : prev + 1) : 0
        );
    };

    useEffect(() => {
        if (!pictures.length) return;

        const interval = setInterval(() => {

            setCurrentIndex((prev) =>

                prev === pictures.length - 1 ? 0 : prev + 1
            );
        }, 2000);

        return () => clearInterval(interval);

    }, [pictures, productScroll]);

    if (!filteredProducts.length) return null;

    return (
        <div className="relative w-full">

            <div className="relative overflow-hidden rounded-lg h-70 lg:h-70 md:h-auto">

                {
                    filteredProducts.map((prod, idx) => (

                            <section className="shadow-lg " key={idx}>

                                <img
                                    src={prod.image_product}
                                    alt={`Slide ${idx + 1}`}
                                    title={`Nombre d'articles disponibles: ${prod.quantity_product}`}
                                    className={`absolute top-1/2 left-1/2 w-full h-[300px] object-cover -translate-x-1/2 -translate-y-1/2 transition-opacity duration-700 ease-in-out scale-100 hover:scale-150 ${idx === currentIndex ? "opacity-100 z-2" : "opacity-0 z-2"
                                        }`}
                                />
                                <span
                                    className={`dark:text-white w-2/3 text-sm absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-lg font-sm z-4 rounded-lg  p-2 overflow-auto h-1/3 w-2/3 scrollbor_hidden ${idx === currentIndex ? "opacity-100" : "opacity-0"
                                        }`}
                                >
                                    {prod?.description_product.toLowerCase()}

                                </span>

                                {
                                    (idx === currentIndex) && (

                                        <button
                                            onClick={() => {
                                                openModal(prod);
                                                dispatch(addUser(owners[prod?.fournisseur]));
                                                setProductScroll(prod);
                                            }}
                                            type="button"
                                            className="bg-none w-full sm:w-auto absolute bottom-0 left-1/2 -translate-x-1/2 -translate-y-1/2 py-1 px-5 me-2 mb-2 text-sm text-gray-900 focus:outline-none rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 z-[10]"
                                        
                                        >
                                            {t("views_product")}

                                        </button>
                                    )
                                }

                            </section>
                        )
                    )
                }
            </div>

            <button
                onClick={prevSlide}
                className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-1 py-12"
            >
                <ChevronLeft className="w-6 h-6 text-white" />

            </button>

            <button
                onClick={nextSlide}
                className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-1 py-12"
            >
                <ChevronRight className="w-6 h-6 text-white" />

            </button>
        </div>
    );
};

export default Carousel;
