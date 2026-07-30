import { useEffect, useRef, useState } from "react";

export const useFooterVisibility = (delay = 300) => {

    const [visible, setVisible] = useState(true);

    const lastScroll = useRef(0);
    const stopTimer = useRef(null);

    useEffect(() => {

        const container = document.querySelector("main");

        if (!container) {
            return;
        }

        const handleScroll = () => {

            const current = container.scrollTop;


            // Toujours visible en haut
            if (current <= 5) {

                setVisible(true);
                lastScroll.current = current;
                return;

            }

            // Scroll vers le bas → masquer le footer
            if (current > lastScroll.current) {


                setVisible(false);

            }

            // Scroll vers le haut → afficher le footer
            else if (current < lastScroll.current) {

                setVisible(true);

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

    }, [delay]);

    return visible;
};