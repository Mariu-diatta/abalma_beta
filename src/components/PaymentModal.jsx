import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

const PaymentModal = ({ children, onClose }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, []);

    if (!mounted) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center p-0 h-full w-full overflow-y-auto scrollbor_hidden">
            <div
                className="
                    relative
                    bg-white
                    rounded-2xl
                    shadow-2xl
                    w-full
                    max-w-lg
                    max-h-[90vh]
                    overflow-hidden
                "
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-700"
                >
                    ✕
                </button>

                <div className="overflow-y-auto max-h-[90vh] p-6">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
};


export default PaymentModal;