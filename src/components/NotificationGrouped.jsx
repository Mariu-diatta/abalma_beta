import { Toaster } from 'react-hot-toast';
import NotificationsComponent from "./NotificationComponent";
import PayBack from "./BacketButtonPay";
import ThemeToggle from '../features/Theme';
import LanguageDropdown from '../features/Langages';


const GroupThemNotifPayLangageButtons = ({ currentNotifMessages, notify, changeLanguage}) => (

    <>

        {
            (currentNotifMessages?.length > 0) && (

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

        <PayBack />

        <LanguageDropdown changeLanguage={changeLanguage} />


    </>
);

export default GroupThemNotifPayLangageButtons;