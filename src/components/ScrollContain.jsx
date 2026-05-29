import { useEffect, useRef, useState } from "react";
import RendrePrixProduitMonnaie from "../features/ConvertCurrency";

export default function ScrollingContent({ item, qut_sold, t }) {
    const containerRef = useRef(null);
    const contentRef = useRef(null);
    const [shouldScroll, setShouldScroll] = useState(false);

    const quantSoldNotZero = (qut_sold === 0)

    useEffect(() => {
        const container = containerRef.current;
        const content = contentRef.current;

        if (container && content) {
            const isOverflowing = content?.scrollWidth > container?.clientWidth
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
                className={` items-center whitespace-nowrap ${shouldScroll ? "animate-scroll" : ""
                    }`}
            >
                <span className="flex gap-4 text-blue-700 font-semibold text-sm flex gap-2 items-center">

                    <RendrePrixProduitMonnaie item={item} />

                    <div className={` ${quantSoldNotZero?"hidden":""} flex items-center gap-1 text-blue-600 rounded-lg rouded-lg p-1 text-md font-medium`}>

                        {t("quantity_sold")} :
                        <p className="ml-2 inline-flex items-center px-2.5 py-1 rounded-full text-sm font-semibold bg-yellow-200 text-green-700">
                            {qut_sold}
                        </p>
                    </div>

                </span>

            </div>
        </div>
    );
}
