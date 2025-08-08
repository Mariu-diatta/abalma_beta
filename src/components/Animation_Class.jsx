import React, { useEffect, useRef } from "react";

const AnimatedComponent = ({children}) => {
    const componentRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("animate-in");
                    } else {
                        entry.target.classList.remove("animate-in");
                        entry.target.classList.add("animate-out");
                    }
                });
            },
            { threshold: 0.1 } // Déclenche quand 10% du composant est visible
        );

        if (componentRef.current) {
            observer.observe(componentRef.current);
        }

        return () => {
            if (componentRef.current) {
                observer.unobserve(componentRef.current);
            }
        };
    }, []);

    return (
        <div
            ref={componentRef}
            className="opacity-0 translate-y-20 transition-all duration-1000 ease-in-out"
        >
            {children}
        </div>
    );
};

export default AnimatedComponent;