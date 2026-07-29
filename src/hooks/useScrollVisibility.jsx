import { useEffect, useRef, useState } from "react";

export const useScrollVisibility = ({
    delay = 300,
    mode = "footer", // footer | header
    breakpoint = 1024, // lg
} = {}) => {

    const [visible, setVisible] = useState(true);

    const lastScroll = useRef(0);
    const stopTimer = useRef(null);

    useEffect(() => {

        // Seulement sur mobile / tablette
        if (window.innerWidth >= breakpoint) {
            setVisible(true);
            return;
        }

        const container = document.querySelector("main");

        if (!container) return;

        const handleScroll = () => {

            const current = container.scrollTop;

            // Toujours visible en haut
            if (current <= 5) {
                setVisible(true);
                lastScroll.current = current;
                return;
            }

            if (mode === "header") {

                // Header : cache vers le bas, affiche vers le haut
                if (current > lastScroll.current) {
                    setVisible(false);
                } else {
                    setVisible(true);
                }

            } else {

                // Footer / BottomSheet :
                // dès qu'on scrolle on cache
                setVisible(false);

            }

            lastScroll.current = current;

            clearTimeout(stopTimer.current);

            stopTimer.current = setTimeout(() => {
                setVisible(true);
            }, delay);
        };

        container.addEventListener("scroll", handleScroll, {
            passive: true,
        });

        return () => {
            container.removeEventListener("scroll", handleScroll);
            clearTimeout(stopTimer.current);
        };

    }, [delay, mode, breakpoint]);

    return visible;
};