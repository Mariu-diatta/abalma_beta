import React, { useEffect, useMemo, useState } from "react";
import { clearMessage, setCurrentMessage } from "../slices/navigateSlice";
import { useDispatch, useSelector } from "react-redux";
import { CONSTANTS } from "../utils";

const AttentionAlertMessage = () => {

    const dispatch = useDispatch();

    const messageAlert = useSelector((state) => state.navigate.messageAlert);

    const isError = useMemo(() => messageAlert?.Type === CONSTANTS.ERRREUR, [messageAlert]);

    const [show, setShow] = useState(false);

    // Après 5 secondes, on cache l'alerte
    useEffect(() => {

        if (messageAlert) setShow(true)

        const timeout = setTimeout(() => {

            setShow(false);

            dispatch(clearMessage());

        }, 5000);

        return () => {

            setShow(false);

            clearTimeout(timeout);

        };

    }, [dispatch, messageAlert]);


    return (

        <div
            className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                        rounded-lg p-4 md:py-6 shadow-md 
                        bg-white dark:bg-dark-2 text-sm sm:text-base z-80 
                        max-w-xl w-auto bg-transparent shadow-lg backdrop-blur-md flex w-full ${!show?"hidden":""}`}
        >

            {/* Barre animée à gauche */}
            <div className="absolute top-0 left-0 h-full w-[6px] overflow-hidden rounded-l-lg">

                <div
                        className={`
                        h-full w-full
                        origin-top
                        animate-drain 
                        ${isError ? "bg-red-500" : "bg-blue-500"}
                    `}
                >
                </div>

            </div>

            {/* Contenu alerte */}
            <main className="ml-3 flex items-start gap-3">

                {/* Icône */}
                <div className="h-[34px] w-[34px] mt-1">{/* SVG ici */}</div>

                <div>

                    <h5 className={`mb-1 text-lg font-semibold ${isError ? "text-red-600" : "text-blue-700"}`}>
                        {messageAlert?.Type}
                    </h5>

                    <p className={`${isError ? "text-red-500" : "text-blue-600"}`}>
                        {messageAlert?.Message}
                    </p>

                </div>
            </main>
        </div>
    );
};

export const showMessage = (dispatch, message) => {

    dispatch(setCurrentMessage(message));
};

export default AttentionAlertMessage;
