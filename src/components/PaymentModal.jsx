import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

const PaymentModal = ({ children, onClose }) => {
    const [mounted, setMounted] = useState(false);
    const [open, setOpen] = useState(true);

    useEffect(() => {
        setMounted(true);

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, []);

    const handleClose = () => {
        setOpen(false);
        setTimeout(() => {
            onClose?.();
        }, 200); // laisse le temps à l’animation de sortie
    };

    if (!mounted) return null;

    return createPortal(

        <AnimatePresence>

            {open && (

                <motion.div
                    className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-0 h-full w-full overflow-y-auto scrollbor_hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="
                            relative
                            bg-white
                            rounded-2xl
                            shadow-2xl
                            ring-1
                            ring-black/5
                            w-full
                            max-w-lg
                            max-h-[90vh]
                            overflow-hidden
                        "
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {/* Liseré décoratif, cohérent avec les autres modales (Login/Register) */}
                        <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500" />

                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-white/90 shadow-sm text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                            ✕
                        </button>

                        <div className="overflow-y-auto max-h-[90vh] p-6 scrollbor_hidden">
                            {children}
                        </div>

                    </motion.div>

                </motion.div>
            )}

        </AnimatePresence>,

        document.body
    );
};

export default PaymentModal;