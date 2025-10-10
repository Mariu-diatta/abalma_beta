import { useEffect, useRef, useState } from "react";

export const ButtonScrollTopDown = ({ children }) => {
    const topRef = useRef(null);
    const bottomRef = useRef(null);

    const [isScrollable, setIsScrollable] = useState(false);
    const [atTop, setAtTop] = useState(true);

    useEffect(() => {

        const checkScrollability = () => {

            const scrollable = document.documentElement.scrollHeight >= window.innerHeight;

            console.log("valuer du scroller", document.documentElement.scrollHeight, "\nvaleur de la fenêtre", window.innerHeight)

            setIsScrollable(scrollable);
        };

        const handleScroll = () => {

            const scrollY = window.scrollY || document.documentElement.scrollTop;

            console.log("valuer du scrollY", window.scrollY, "\nvaleur scrool Top", document.documentElement.scrollTop)

            if (scrollY > 0) setAtTop(true)
            else setAtTop(false)     
        };

        checkScrollability();
        handleScroll();

        window.addEventListener("scroll", handleScroll);
        window.addEventListener("resize", checkScrollability);

        const observer = new MutationObserver(() => {
            checkScrollability();
            handleScroll();
        });

        observer.observe(document.body, { childList:true, subtree: true, attributes: true});

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", checkScrollability);
            observer.disconnect();
        };
    },[]);

    const handleScrollClick = () => {
        console.log("Valeur du top :::", atTop)
        if (!atTop && bottomRef.current) {
            bottomRef.current.scrollTo({ bottom: 0, behavior: 'smooth' });
        } else if (topRef.current) {
            alert("btn scroll handle")
            topRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <>
            {/* point d’ancrage en haut */}
            <div ref={topRef}></div>

            {children}

            {/* point d’ancrage en bas */}
            <div ref={bottomRef}></div>

            {isScrollable && (
                <button
                    className="hidden cursor-pointer fixed right-4 bottom-[50px] md:bottom-6 p-3 rounded-full shadow-lg bg-gradient-to-br from-purple-300 to-blue-300 hover:from-purple-400 hover:to-blue-400 text-purple-600 transition-colors"
                    onClick={(e)=>handleScrollClick(e)}
                >
                    {atTop ? (
                        // flèche vers le bas
                        <svg className="w-5 h-5 text-gray-800 dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m5 9 7 7 7-7" />
                        </svg>
                    ) : (
                        // flèche vers le haut
                        <svg className="w-5 h-5 text-gray-800 dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 15-7-7-7 7" />
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