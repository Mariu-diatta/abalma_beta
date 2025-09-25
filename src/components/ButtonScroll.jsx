import { useEffect, useRef, useState } from "react";

export const ButtonScrollTopDown = ({ children }) => {
    const [atTop, setAtTop] = useState(true);
    const [isScrollable, setIsScrollable] = useState(false);

    useEffect(() => {
        const checkScrollability = () => {
            // Vérifie si la hauteur du document dépasse la hauteur de la fenêtre
            const scrollable = document.documentElement.scrollHeight > window.innerHeight;
            setIsScrollable(scrollable);
        };

        const handleScroll = () => {
            const scrollY = window.scrollY || document.documentElement.scrollTop;
            setAtTop(scrollY < 100);
        };

        // Vérifie dès le montage
        checkScrollability();
        handleScroll();

        window.addEventListener("scroll", handleScroll);
        window.addEventListener("resize", checkScrollability);

        // Vérifie aussi quand le DOM change (si du contenu s’ajoute après coup)
        const observer = new MutationObserver(checkScrollability);
        observer.observe(document.body, { childList: true, subtree: true, attributes: true });

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", checkScrollability);
            observer.disconnect();
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
            {isScrollable && (
                <button
                    className="fixed right-4 bottom-[50px] md:bottom-6 p-3 rounded-full bg-gradient-to-br from-purple-300 to-blue-300 hover:bg-gradient-to-br hover:from-purple-400 text-purple-600 dark:border-b-purple-500 dark:text-purple-500"
                    onClick={handleScrollClick}
                >
                    {atTop ? (
                        <svg className="w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m5 15 7-7 7 7" />
                        </svg>
                    )}
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