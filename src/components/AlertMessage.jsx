import React from "react";
import { clearMessage, setCurrentMessage } from "../slices/navigateSlice";

const AttentionAlertMesage = ({ content, title }) => {
    return (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-xl px-4">
            <div className="border-yellow bg-yellow-light-4 flex w-full rounded-lg border-l-[6px] px-7 py-4 md:py-6 shadow-md dark:bg-dark">
                <div className="bg-yellow mr-5 flex h-[34px] w-[34px] items-center justify-center rounded-md">
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M17.0156 11.6156L10.9969 1.93125C10.5188 1.28437 9.78752 0.91875 9.00002 0.91875C8.18439 0.91875 7.45314 1.28437 7.00314 1.93125L0.984395 11.6156C0.421895 12.375 0.33752 13.3594 0.759395 14.2031C1.18127 15.0469 2.02502 15.5813 2.98127 15.5813H15.0188C15.975 15.5813 16.8188 15.0469 17.2406 14.2031C17.6625 13.3875 17.5781 12.375 17.0156 11.6156Z"
                            fill="white"
                        />
                        <path
                            d="M8.9999 6.15002C8.6624 6.15002 8.35303 6.43127 8.35303 6.79689V9.86252C8.35303 10.2 8.63428 10.5094 8.9999 10.5094C9.36553 10.5094 9.64678 10.2281 9.64678 9.86252V6.76877C9.64678 6.43127 9.3374 6.15002 8.9999 6.15002Z"
                            fill="white"
                        />
                        <path
                            d="M8.9999 11.25C8.6624 11.25 8.35303 11.5313 8.35303 11.8969V12.0375C8.35303 12.375 8.63428 12.6844 8.9999 12.6844C9.36553 12.6844 9.64678 12.4031 9.64678 12.0375V11.8688C9.64678 11.5313 9.3374 11.25 8.9999 11.25Z"
                            fill="white"
                        />
                    </svg>
                </div>
                <div>
                    <h5 className="mb-1 text-lg font-semibold text-[#9D5425]">
                        {title}
                    </h5>
                    <p className="text-base leading-relaxed text-[#D0915C]">
                        {content}
                    </p>
                </div>
            </div>
        </div>
    );
};

// Fonction pour afficher un message temporaire
export const showMessage = (dispatch, message) => {
    dispatch(setCurrentMessage(message));
    setTimeout(() => {
        dispatch(clearMessage());
    }, 5000);
};

export default AttentionAlertMesage;
