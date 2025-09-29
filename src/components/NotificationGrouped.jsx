import { LanguageDropdown, ThemeToggle } from "../pages/Header";
import { setCurrentNav } from "../slices/navigateSlice";
import { Toaster } from 'react-hot-toast';
import NotificationsComponent from "./NotificationComponent";
import PayBack from "./BacketButtonPay";


const NotificationGroup = ({ currentNotifMessages, notify, changeLanguage, nbItems, dispatch, navigate }) => (

    <>

        {
            currentNotifMessages.length > 0 && (

                <button

                    onClick={notify}

                    className="bg-none cursor-pointer relative flex items-center justify-center h-8 w-8 px-1 py-1 mx-4 rounded-full dark:bg-dark-2 text-white dark:text-white shadow-sm"

                >
                    <NotificationsComponent/>

                </button>
            )
        }

        <Toaster />

        <ThemeToggle/>

        {/* Paiement */}
        <button

            onClick={() => { navigate("/payment"); dispatch(setCurrentNav("/payment")) }}

            className="hidden relative flex items-center justify-between rounded-lg  dark:bg-dark-2 text-dark dark:text-white h-6 w-8 mx-4  hover:bg-gray-50 dark:hover:bg-gray-800"

            style={{ color: "var(--color-text)" }}
        >
            {/*<svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">*/}
            {/*    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7H7.312" />*/}
            {/*</svg>*/}


            {/*<span className=" text-xs text-green-600">{nbItems}</span>*/}

        </button>

        <PayBack />

        <LanguageDropdown changeLanguage={changeLanguage} />


    </>
);

export default NotificationGroup;