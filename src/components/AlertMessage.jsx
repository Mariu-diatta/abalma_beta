import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearMessage, setCurrentMessage } from "../slices/navigateSlice";
import { CONSTANTS } from "../utils";

// Durée d'affichage en ms — sert à la fois pour le timeout de fermeture
// ET pour la durée de l'animation de la barre, afin qu'ils restent toujours synchronisés.
const DISPLAY_DURATION_MS = 5000;
const EXIT_TRANSITION_MS = 300;

const AttentionAlertMessage = () => {
    const dispatch = useDispatch();

    const messageAlert = useSelector(
        (state) => state.navigate.messageAlert
    );

    const [show, setShow] = useState(false);
    // Contrôle la largeur de la barre : false = 0%, true = 100%.
    // On bascule à true juste après le montage pour déclencher la transition CSS.
    const [progressFilled, setProgressFilled] = useState(false);

    const isError = useMemo(
        () => messageAlert?.Type === CONSTANTS.ERRREUR,
        [messageAlert]
    );

    const closeTimeoutRef = useRef(null);
    const dismissTimeoutRef = useRef(null);
    const progressFrameRef = useRef(null);

    useEffect(() => {
        if (!messageAlert) return;

        setShow(true);
        setProgressFilled(false);

        // On attend une frame avant de passer la barre à 100% : si on le faisait
        // dans le même tick que le "false" initial, le navigateur risquerait de
        // fusionner les deux états et la transition ne se jouerait pas (la barre
        // apparaîtrait déjà pleine au lieu de se remplir progressivement).
        progressFrameRef.current = requestAnimationFrame(() => {
            setProgressFilled(true);
        });

        // Une fois la barre pleine (durée = DISPLAY_DURATION_MS), on masque le popover...
        closeTimeoutRef.current = setTimeout(() => {
            setShow(false);

            // ...puis on nettoie le message du store une fois la transition de sortie terminée.
            dismissTimeoutRef.current = setTimeout(() => {
                dispatch(clearMessage());
            }, EXIT_TRANSITION_MS);
        }, DISPLAY_DURATION_MS);

        return () => {
            cancelAnimationFrame(progressFrameRef.current);
            clearTimeout(closeTimeoutRef.current);
            clearTimeout(dismissTimeoutRef.current);
        };
    }, [messageAlert, dispatch]);

    const handleManualClose = () => {
        cancelAnimationFrame(progressFrameRef.current);
        clearTimeout(closeTimeoutRef.current);
        clearTimeout(dismissTimeoutRef.current);

        setShow(false);
        dispatch(clearMessage());
    };

    if (!messageAlert) return null;

    return (
        <div
            className={`
                fixed top-6 right-6 z-[9999]
                transition-all duration-300 ease-out
                ${show
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 -translate-y-3 pointer-events-none"}
            `}
        >
            <div
                className={`
                    relative overflow-hidden
                    min-w-[320px]
                    max-w-md
                    rounded-2xl
                    border
                    backdrop-blur-lg
                    shadow-2xl
                    p-4
                    ${isError
                        ? "bg-red-50 border-red-200"
                        : "bg-blue-50 border-blue-200"
                    }
                `}
            >
                <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div
                        className={`
                            flex items-center justify-center
                            w-10 h-10 rounded-full shrink-0
                            ${isError
                                ? "bg-red-100 text-red-600"
                                : "bg-blue-100 text-blue-600"
                            }
                        `}
                    >
                        {isError ? "⚠️" : "✓"}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                        <h3
                            className={`
                                font-semibold text-base
                                ${isError
                                    ? "text-red-700"
                                    : "text-blue-700"
                                }
                            `}
                        >
                            {messageAlert?.Type}
                        </h3>

                        <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                            {messageAlert?.Message}
                        </p>
                    </div>

                    {/* Close */}
                    <button
                        onClick={handleManualClose}
                        className="text-gray-400 hover:text-gray-700 transition"
                        aria-label="Fermer"
                    >
                        ✕
                    </button>
                </div>

                {/* Progress bar : se remplit progressivement de 0% à 100%.
                    transition-[width] avec une durée linéaire == DISPLAY_DURATION_MS,
                    déclenchée par le changement de classe width (w-0 -> w-full). */}
                <div
                    className={`
                        absolute bottom-0 left-0 h-1
                        transition-[width] ease-linear
                        ${isError ? "bg-red-500" : "bg-blue-500"}
                        ${progressFilled ? "w-full" : "w-0"}
                    `}
                    style={{ transitionDuration: `${DISPLAY_DURATION_MS}ms` }}
                />
            </div>
        </div>
    );
};

export const showMessage = (dispatch, message) => {
    dispatch(setCurrentMessage(message));
};

export default AttentionAlertMessage;