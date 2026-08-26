import React, { useRef, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getMediaUrl } from "../utils";

const randomRot = () => (Math.random() - 0.5) * 6;

const PaginationProduit = ({ products = [] }) => {

    const scrollRef = useRef(null);
    const itemRefs = useRef([]);
    const rotationsRef = useRef([]);


    /**
     * Initialisation des rotations
     */
    useEffect(() => {

        rotationsRef.current =
            products.map(() => randomRot());


        requestAnimationFrame(() => {
            applyRotations();
        });


    }, [products]);



    /**
     * Applique les rotations sans rerender
     */
    const applyRotations = () => {

        itemRefs.current.forEach((el, i) => {

            if (!el) return;


            el.style.transform =
                `rotate(${rotationsRef.current[i] ?? 0}deg)`;


            el.style.zIndex = "1";

        });

    };



    /**
     * Navigation boutons
     */
    const scroll = (direction) => {

        const track = scrollRef.current;

        if (!track) return;


        track.scrollBy({

            left:
                direction === "left"
                    ? -(track.clientWidth * 0.65)
                    : track.clientWidth * 0.65,


            behavior: "smooth"

        });

    };



    /**
     * Vérifie qu'une carte est visible
     */
    const revealItem = (el) => {

        const track = scrollRef.current;

        if (!el || !track) return;


        const item =
            el.getBoundingClientRect();


        const container =
            track.getBoundingClientRect();



        if (item.right > container.right) {

            track.scrollBy({

                left:
                    item.right -
                    container.right +
                    30,

                behavior: "smooth"

            });

        }



        if (item.left < container.left) {

            track.scrollBy({

                left:
                    item.left -
                    container.left -
                    30,

                behavior: "smooth"

            });

        }

    };



    /**
     * Hover entrée
     */
    const handleEnter = useCallback((index) => {


        const el =
            itemRefs.current[index];


        if (!el) return;



        revealItem(el);



        el.style.transform =
            `
            translateY(-18px)
            scale(1.08)
            rotate(0deg)
            `;


        el.style.zIndex = "20";



        const label =
            el.querySelector(".fan-label");


        if (label)
            label.style.opacity = "1";



    }, []);





    /**
     * Hover sortie
     */
    const handleLeave = useCallback((index) => {


        const el =
            itemRefs.current[index];


        if (!el) return;



        const rotation =
            randomRot();



        rotationsRef.current[index] =
            rotation;



        el.style.transform =
            `rotate(${rotation}deg)`;


        el.style.zIndex = "1";



        const label =
            el.querySelector(".fan-label");


        if (label)
            label.style.opacity = "0";



    }, []);




    /**
     * Animation apparition progressive
     */
    useEffect(() => {


        const observers = [];


        itemRefs.current.forEach((el, index) => {


            if (!el) return;



            const observer =
                new IntersectionObserver(
                    ([entry]) => {


                        if (entry.isIntersecting) {


                            setTimeout(() => {


                                el.style.opacity = "1";


                                el.style.transform =
                                    `
                                rotate(
                                ${rotationsRef.current[index] ?? 0}
                                deg)
                                `;


                            }, index * 50);



                            observer.disconnect();

                        }


                    },

                    {
                        threshold: 0.15
                    }

                );



            observer.observe(el);


            observers.push(observer);



        });



        return () => {

            observers.forEach(
                obs => obs.disconnect()
            );

        };


    }, [products]);




    if (!products.length)
        return null;




    return (

        <div
            className="
            relative
            group
            w-full
            py-2
            overflow-hidden
            "
        >



            <button

                onClick={() => scroll("left")}

                className="
                absolute
                left-0
                top-1/2
                -translate-y-1/2
                z-20
                bg-white/90
                p-2
                rounded-full
                shadow-lg
                border
                opacity-0
                group-hover:opacity-100
                transition
                hidden
                md:flex
                "

            >

                <ChevronLeft className="w-5 h-5" />

            </button>




            <div

                ref={scrollRef}

                className="
                fan-track
                flex
                overflow-x-auto justify-start w-full
                scroll-smooth
                pt-10
                pb-4
                px-4
                scrollbar-hidden
                "

                style={{
                    gap: 0
                }}

            >



                {
                    products.map((product, index) => {


                        const image =
                            product?.variants?.[0]?.image;


                        const name =
                            product?.name ??
                            `Produit ${index + 1}`;



                        return (


                            <div


                                key={
                                    product.id ??
                                    index
                                }


                                ref={(el) =>
                                    itemRefs.current[index] = el
                                }


                                className="
                                    fan-item
                                    flex-shrink-0
                                    cursor-pointer
                                    relative
                                    opacity-0
                                    transition-all
                                    duration-300
                                    ease-out
                                    rounded-2xl
                                    overflow-hidden
                                    bg-gray-50
                                    border
                                    border-gray-100
                                    aspect-square
                                    hover:shadow-md
                                    transition-shadow
                                "


                                style={{

                                    width: "11rem",

                                    marginLeft:
                                        index === 0
                                            ? "0"
                                            : "-2.5rem",


                                    transformOrigin:
                                        "bottom center"

                                }}


                                onMouseEnter={() =>
                                    handleEnter(index)
                                }


                                onMouseLeave={() =>
                                    handleLeave(index)
                                }


                                onClick={() =>
                                    handleEnter(index)
                                }


                            >



                     

                                    <img

                                        src={
                                            getMediaUrl(image)
                                        }


                                        alt={name}


                                        className="
                                        w-full
                                        h-full
                                        object-cover
                                        transition-transform
                                        duration-500
                                        hover:scale-110
                                        "

                                    />





                            </div>


                        );


                    })

                }



            </div>





            <button

                onClick={() => scroll("right")}


                className="
                absolute
                right-0
                top-1/2
                -translate-y-1/2
                z-20
                bg-white/90
                p-2
                rounded-full
                shadow-lg
                border
                opacity-0
                group-hover:opacity-100
                transition
                hidden
                md:flex
                "

            >


                <ChevronRight className="w-5 h-5" />


            </button>



        </div>

    );

};


export default PaginationProduit;