import { useEffect, useRef, useState } from "react";
import RendrePrixProduitMonnaie from "./ConvertCurrency";

export default function ScrollingContent({ item, qut_sold, t }) {
    const containerRef = useRef(null);
    const contentRef = useRef(null);
    const [shouldScroll, setShouldScroll] = useState(false);

    useEffect(() => {
        const container = containerRef.current;
        const content = contentRef.current;

        if (container && content) {
            const isOverflowing = content.scrollWidth > container.clientWidth
            setShouldScroll(isOverflowing);
        }
    }, []);

    return (
        <div
            ref={containerRef}
            className="relative w-full overflow-hidden"
        >
            <div
                ref={contentRef}
                className={`flex gap-4 items-center whitespace-nowrap ${shouldScroll ? "animate-scroll" : ""
                    }`}
            >
                <span className="text-blue-700 font-semibold text-sm flex gap-2 items-center">
                    <RendrePrixProduitMonnaie item={item} />
                    <div className="flex items-center gap-1 hidden md:flex text-blue-50 dark:text-black rounded-lg px-2 py-1 text-xs font-medium">
                        <span className="whitespace-nowrap">{t("quantity_sold")}</span>
                        <span className="text-sm font-semibold">{qut_sold}</span>
                    </div>
                </span>
            </div>
        </div>
    );
}
