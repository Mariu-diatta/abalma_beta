import React, { useEffect, useState } from "react";
import { clearMessage, setCurrentMessage } from "../slices/navigateSlice";
import { useDispatch } from "react-redux";

const AttentionAlertMessage = ({ content, title }) => {

    const dispatch = useDispatch();

    const isError = title === "Erreur";

    const [show, setShow] = useState(true);

    // Après 5 secondes, on cache l'alerte
    useEffect(() => {

        const timeout = setTimeout(() => {

            setShow(false);

            dispatch(clearMessage());

        }, 5000);

        return () => clearTimeout(timeout);

    }, [dispatch]);

    if (!show) return null;

    return (
        <div className="fixed top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-80 w-full max-w-xl bg-transparent shadow-lg backdrop-blur-md">
            <div className="relative flex w-full rounded-lg p-4 md:py-6 shadow-md bg-white dark:bg-dark-2 text-sm sm:text-base">

                {/* Barre animée à gauche */}
                <div className="absolute top-0 left-0 h-full w-[6px] overflow-hidden rounded-l-lg">
                    <div
                        className={`
              h-full w-full
              origin-top
              animate-drain 
              ${isError ? "bg-red-500" : "bg-blue-500"}
            `}
                    ></div>
                </div>

                {/* Contenu alerte */}
                <div className="ml-3 flex items-start gap-3">
                    {/* Icône */}
                    <div className="h-[34px] w-[34px] mt-1">{/* SVG ici */}</div>

                    <div>
                        <h5 className={`mb-1 text-lg font-semibold ${isError ? "text-red-600" : "text-blue-700"}`}>
                            {title}
                        </h5>
                        <p className={`${isError ? "text-red-500" : "text-blue-600"}`}>
                            {content}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const showMessage = (dispatch, message) => {
    dispatch(setCurrentMessage(message));
};

export default AttentionAlertMessage;
