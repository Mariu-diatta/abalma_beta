import { Toaster } from 'react-hot-toast';
import NotificationsComponent from "./NotificationComponent";
import PayBack from "./BacketButtonPay";
import ThemeToggle from '../features/Theme';
import LanguageDropdown from '../features/Langages';
import { useSelector } from 'react-redux';
import { ENDPOINTS } from '../utils';


const GroupThemNotifPayLangageButtons = ({ notify, changeLanguage }) => {

    const currentNav = useSelector(state => state.navigate.currentNav);

    const currentNotifMessages = useSelector(state => state.chat.messageNotif);

    // Actif dans tout le dashboard (petit ET grand écran), masqué uniquement
    // quand on est sur la messagerie (le chat a déjà sa propre barre d'actions).
    const currentNavIsMessageInbox = (currentNav === ENDPOINTS?.MESSAGE_INBOX);

    const lengthMessage = (currentNotifMessages?.length > 0);

    if (currentNavIsMessageInbox) return null;

    return (

        <div
            className="
                flex items-center justify-end gap-2 z-50
                bg-white/80 md:bg-transparent lg:bg-transparent
                rounded-full px-2 py-1
            "
        >
            <Toaster />

            {
                lengthMessage && (
                    <button
                        onClick={notify}
                        className="hover:bg-gray-200 cursor-pointer relative flex items-center justify-center h-8 w-8 px-1 rounded-full text-white"
                    >
                        <NotificationsComponent />
                    </button>
                )
            }

            <ThemeToggle />

            <PayBack />

            <LanguageDropdown changeLanguage={changeLanguage} />

        </div>
    )

};

export default GroupThemNotifPayLangageButtons;