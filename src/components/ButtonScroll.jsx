import { useEffect, useRef, useState } from "react";


export const ButtonScrollTopDown = ({ children }) => {
    const [atTop, setAtTop] = useState(true);
    const [isScrollable, setIsScrollable] = useState(false);

    useEffect(() => {
        const checkScrollability = () => {
            const scrollable = document.body.scrollHeight > window.innerHeight;
            setIsScrollable(scrollable);
        };

        const handleScroll = () => {
            const scrollY = window.scrollY || document.documentElement.scrollTop;
            setAtTop(scrollY < 100);
        };

        // Vérifie au montage et à chaque redimensionnement
        checkScrollability();
        handleScroll();

        window.addEventListener("scroll", handleScroll);
        window.addEventListener("resize", checkScrollability);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", checkScrollability);
        };
    }, []);

    const handleScrollClick = () => {
        if (atTop) {
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: "smooth",
            });
        } else {
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        }
    };

    return (

        <>
            {children}

            {/* Affiche le bouton uniquement si scrollable */}
            {
                isScrollable && (

                <button
                    className="fixed right-4 bottom-4 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition"
                    onClick={handleScrollClick}
                >
                    {
                        atTop ?
                        <svg class="w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7" />
                         </svg>
                        : 
                        <svg class="w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m5 15 7-7 7 7" />
                        </svg>
                    }

                </button>
            )}
        </>
    );
};

const ScrollTop = () => {

    const messagesEndRef = useRef()

    useEffect(

        () => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        },[]
    )

    return (

        <div ref={messagesEndRef} />
    )
}

export default ScrollTop;