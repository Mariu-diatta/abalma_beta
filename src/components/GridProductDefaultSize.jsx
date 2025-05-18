import React, { useState } from "react";
import HorizontalCard from "./HorizontalCard";
import GridSlideProduct from "./GridProductSlide";

const products = [
    { src: "image", price: 79, title: "Produit 1", description: "Description courte 1" },
    { src: "image-1", price: 89, title: "Produit 2", description: "Description courte 2" },
    { src: "image-2", price: 99, title: "Produit 3", description: "Description courte 3" },
    { src: "image-3", price: 109, title: "Produit 4", description: "Description courte 4" },
    { src: "image-4", price: 69, title: "Produit 5", description: "Description courte 5" },
    { src: "image-5", price: 59, title: "Produit 6", description: "Description courte 6" },
    { src: "image-6", price: 89, title: "Produit 7", description: "Description courte 7" },
    { src: "image-7", price: 79, title: "Produit 8", description: "Description courte 8" },
    { src: "image-8", price: 99, title: "Produit 9", description: "Description courte 9" },
    { src: "image-9", price: 109, title: "Produit 10", description: "Description courte 10" },
    { src: "image-10", price: 69, title: "Produit 11", description: "Description courte 11" },
    { src: "image-11", price: 59, title: "Produit 12", description: "Description courte 12" },
];

const GridProductDefault = () => {

    const cols = products.reduce((acc, product, idx) => {
        const col = Math.floor(idx / 3);
        if (!acc[col]) acc[col] = [];
        acc[col].push(product);
        return acc;
    }, []);

    const [modalData, setModalData] = useState(null); // null ou { img, price, title, id }

    const openModal = (id) => {
        setModalData({
            id,
            img: `https://flowbite.s3.amazonaws.com/docs/gallery/square/image${id ? `-${id}` : ''}.jpg`,
            price: 79,
            title: 'Saussure neuve.',
        });
    };

    const closeModal = () => setModalData(null);

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
            {cols.map((productsInCol, colIndex) => (
                <div key={colIndex} className="grid gap-4">
                    {productsInCol.map(({ src, price, title, description }) => (
                        <div key={src} className="bg-white rounded-lg shadow p-2 flex flex-col">

                            {/* Image avec overlay description (inchangé) */}
                            <button
                                type="button"
                                className="relative p-0 border-0 bg-transparent cursor-pointer block rounded-lg overflow-hidden"
                                onClick={() => openModal(src)}
                                aria-label={`Voir l'image ${src}`}
                            >
                                <img
                                    src={`https://flowbite.s3.amazonaws.com/docs/gallery/masonry/${src}.jpg`}
                                    alt={`Image ${src}`}
                                    className="h-auto max-w-full rounded-lg transition duration-300 ease-in-out hover:brightness-75 hover:grayscale"
                                />
                                <div
                                    className="absolute inset-0 bg-black bg-opacity-60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white p-4 text-center"
                                    style={{ pointerEvents: "none" }}
                                >
                                    <p>{description}</p>
                                </div>
                            </button>

                            {/* TITRE OU DESCRIPTION AU-DESSUS DES BOUTONS */}
                            <p className="text-center text-gray-600 dark:text-gray-300 text-sm md:text-base tracking-normal text-gray-500 tracking-wide">
                                {title}
                            </p>

                            {/* Boutons + prix sur la même ligne */}
                            <div className="flex items-center justify-between mt-1 space-x-2 text-white text-sm">

                                {/* Prix aligné avec les boutons */}
                                <span className="flex-1 text-center text-md font-semibold text-gray-800 dark:text-white">
                                    ${price}
                                </span>



                                <button
                                   
                                    className="flex-1  py-1 rounded flex justify-center items-center cursor-pointer"
                                >
                                    <svg
                                        className="w-6 h-4  text-yellow-800 dark:text-white cursor-pointer"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                        onClick={() => alert(`Cadeau ajouté: ${src}`)}
                                    >
                                        <path d="M20 7h-.7c.229-.467.349-.98.351-1.5a3.5 3.5 0 0 0-3.5-3.5c-1.717 0-3.215 1.2-4.331 2.481C10.4 2.842 8.949 2 7.5 2A3.5 3.5 0 0 0 4 5.5c.003.52.123 1.033.351 1.5H4a2 2 0 0 0-2 2v2a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V9a2 2 0 0 0-2-2Zm-9.942 0H7.5a1.5 1.5 0 0 1 0-3c.9 0 2 .754 3.092 2.122-.219.337-.392.635-.534.878Zm6.1 0h-3.742c.933-1.368 2.371-3 3.739-3a1.5 1.5 0 0 1 0 3h.003ZM13 14h-2v8h2v-8Zm-4 0H4v6a2 2 0 0 0 2 2h3v-8Zm6 0v8h3a2 2 0 0 0 2-2v-6h-5Z" />
                                    </svg>
                                </button>

                                <button
                                    onClick={() => alert(`Ajouter au panier: ${src}`)}
                                    className="flex-1  py-1 rounded flex justify-center items-center cursor-pointer"
                                >
                                    <svg
                                        className="w-6 h-5 text-green-800 dark:text-white cursor-pointer"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 4h1.5L8 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm.75-3H7.5M11 7H6.312M17 4v6m-3-3h6"
                                        />
                                    </svg>
                                </button>

                             
                            </div>
                        </div>
                    ))}

                </div>
            ))}

            {/* Modal Popup */}
            {modalData && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50"
                    onClick={closeModal}  // clic en dehors => ferme modal
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-title"
                >
                    <div
                        onClick={(e) => e.stopPropagation()} // empêche la fermeture quand on clique dans ce div
                    >
                        <HorizontalCard>
                            <GridSlideProduct />
                        </HorizontalCard>
                    </div>
                </div>

            )}

        </div>
    );
};

export default GridProductDefault;
