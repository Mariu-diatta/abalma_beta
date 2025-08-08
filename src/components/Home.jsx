import React, { useEffect, useRef, useState } from 'react'
//import SingleImage from '../components/Image';
import { useTranslation } from 'react-i18next';
//import { useDispatch } from 'react-redux';
//import { useNavigate } from 'react-router-dom';
//import { setCurrentNav } from '../slices/navigateSlice';
import image from '../assets/image.jpg'


const HomeContain = () => {

    const { t } = useTranslation();

    //const dispatch = useDispatch();

    //const navigate = useNavigate();


    return (

        <>
            <div className="m-0 relative pb-[110px] pt-[120px] dark:bg-dark lg:pt-[150px] style-bg bg_home shadow-lg rounded-lg">

                <div className="container">

                    <div className="-mx-4 flex flex-wrap">

                        <div className="w-full px-4 lg:w-5/12">

                            <div className="hero-content">

                                <div className="shadow-lg px-4 animate-trains">

                                    <h4 className="mb-2  !leading-[1.208] text-dark dark:text-white sm:text-[42px] lg:text-[20px] xl:text-2xl">
                                        {t("homePage.headline")}
                                    </h4>

                                    <p className="mb-8 max-w-[480px] text-sm text-body-color dark:text-dark-6">
                                        {t("homePage.subheadline")}
                                    </p>

                                </div>

                                <ul className="flex flex-wrap items-center">

                                    {/*<li>*/}
                                    {/*    <button*/}

                                    {/*        onClick={*/}

                                    {/*                () => {*/}

                                    {/*                    navigate("/logIn");*/}

                                    {/*                    dispatch(setCurrentNav("logIn")*/}

                                    {/*                )*/}
                                    {/*            }*/}
                                    {/*        }*/}

                                    {/*        className="cursor-pointer inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-center text-base  text-white hover:bg-blue-dark lg:px-7"*/}
                                    {/*    >*/}
                                    {/*        {t("homePage.getStarted")}*/}

                                    {/*    </button>*/}
                                    {/*</li>*/}

                                    <li>
                                        <button
                                            onClick={()=>alert("L'application sera bientôt disponible")}
                                            className="cursor-pointer inline-flex items-center justify-center px-5 py-3 text-center text-base font-medium text-[#464646] hover:text-primary dark:text-white"
                                        >
                                            <span className="mr-2">
                                                <svg
                                                    width="24"
                                                    height="25"
                                                    viewBox="0 0 24 25"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <circle cx="12" cy="12.6152" r="12" fill="#3758F9" />
                                                    <rect
                                                        x="7.99893"
                                                        y="14.979"
                                                        width="8.18182"
                                                        height="1.63636"
                                                        fill="white"
                                                    />
                                                    <rect
                                                        x="11.2717"
                                                        y="7.61523"
                                                        width="1.63636"
                                                        height="4.09091"
                                                        fill="white"
                                                    />
                                                    <path
                                                        d="M12.0898 14.1606L14.9241 11.0925H9.25557L12.0898 14.1606Z"
                                                        fill="white"
                                                    />
                                                </svg>
                                            </span>

                                            {t("homePage.downloadApp")}

                                        </button>

                                    </li>

                                </ul>

                                {/*<LogoDropdown />*/}

                            </div>

                        </div>

                        <div className="hidden px-4 lg:block lg:w-1/12"></div>

                        <div className="w-full px-2 lg:w-6/12 sticky top-10 self-start">

                            <div className="lg:ml-auto lg:text-right">

                                <div className="relative z-10 inline-block pt-2 lg:pt-0">

                                    <h1 className="text-md font-medium text-gray-500 text-center dark:text-white mb-3 var(--color-text)">
                                        {t('text_home_picture')}
                                    </h1>

                                    <img
                                        src={image}
                                        alt="hero"
                                        className=" lg:ml-auto shadow-xl rounded-lg transition-transform duration-300 hover:scale-105 App-logo"
                                    />

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>
        </>
    );
};


export default HomeContain;


const brands = [
    { name: "Ayroui", img: "https://cdn.tailgrids.com/assets/images/marketing/brands/ayroui.svg" },
    { name: "Graygrids", img: "https://cdn.tailgrids.com/assets/images/marketing/brands/graygrids.svg" },
    { name: "Uideck", img: "https://cdn.tailgrids.com/assets/images/marketing/brands/uideck.svg" },
    { name: "Brand 4", img: "https://via.placeholder.com/24" },
    { name: "Brand 5", img: "https://via.placeholder.com/24" },
];

export function LogoDropdown() {
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 2; // Nombre d'éléments par page
    const totalPages = Math.ceil(brands.length / itemsPerPage);
    const scrollRef = useRef(null);

    // Animation automatique de défilement
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentPage((prev) => (prev + 1) % totalPages);
        }, 3000); // Change toutes les 3 secondes

        return () => clearInterval(interval); // Nettoyage de l'intervalle
    }, [totalPages]);

    // Calcul des éléments à afficher
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const visibleBrands = brands.slice(startIndex, endIndex);

    // Calcul de la largeur pour l'animation horizontale
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.style.width = `${scrollRef.current.scrollWidth}px`;
        }
    }, [currentPage, visibleBrands]);

    return (
        <div className="relative inline-block text-left">
            {/* Bouton */}
            <button
                onClick={() => setCurrentPage((prev) => (prev + 1) % totalPages)} // Changement manuel
                className="flex items-center border rounded-lg p-2 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
                <img
                    src={visibleBrands[0]?.img}
                    alt={visibleBrands[0]?.name}
                    className="w-6 h-6 mr-2 object-contain"
                />
                {visibleBrands[0]?.name || "Sélectionnez une marque"}
            </button>

            {/* Liste horizontale avec animation */}
            <div
                ref={scrollRef}
                className="absolute mt-2 w-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg z-50 overflow-hidden transition-all duration-500 ease-in-out"
                style={{ width: 0, whiteSpace: "nowrap" }} // Ajustement pour l'affichage horizontal
            >
                <div className="flex space-x-5 space-y-0 w-lg"> {/* Conteneur horizontal pour la liste */}
                    {visibleBrands.map((brand) => (
                        <div
                            key={brand.name}
                            onClick={() => {
                                setCurrentPage(Math.floor(brands.indexOf(brand) / itemsPerPage));
                            }}
                            className="flex flex-col items-start p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors inline-block"
                        >
                            <img
                                src={brand.img}
                                alt={brand.name}
                                className="w-12 h-12 mb-2 object-contain"
                            />
                            <span className="text-sm font-medium">{brand.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Indicateur de page */}
            <div className="flex justify-center mt-2 space-x-1">
                {Array.from({ length: totalPages }, (_, index) => (
                    <span
                        key={index}
                        className={`w-2 h-2 rounded-full ${currentPage === index ? "bg-blue-500" : "bg-gray-300"}`}
                    ></span>
                ))}
            </div>
        </div>
    );
}