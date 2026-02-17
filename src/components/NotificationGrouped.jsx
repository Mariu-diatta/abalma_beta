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

    const currentNavIsMessageInbox = (currentNav === ENDPOINTS?.MESSAGE_INBOX)

    const lengthMessage = (currentNotifMessages?.length > 0)

    return (

        <>
            { 
                currentNavIsMessageInbox?  
                null
                :
                <div
                    className = {`
                        bg-white/80  py-1 md:py-0 lg:py-0 lg:rounded-lg lg:bg-transparent md:rounded-lg md:bg-transparent
                        flex items-center justify-around gap-2 z-50
                        /* Mobile: fixed bottom bar */
                        fixed bottom-0 left-0 right-0 md:static 
                        md:justify-between
                        /* Visible: mobile + desktop without duplicating the component */
                        sm:flex md:flex lg:flex

                    `}
                >

                    {/*style = {{ backgroundColor: "var(--color-bg)", color: "var(--color-text)" }}*/}

                    {
                            lengthMessage && (

                            <button

                                onClick={notify}

                                className="bg-none cursor-pointer relative flex items-center justify-center h-8 w-8 px-1 mx-4 rounded-full dark:bg-dark-2 text-white dark:text-white"

                            >
                                <NotificationsComponent />

                            </button>
                        )
                    }

                    <Toaster />

                    <ThemeToggle />

                    <PayBack />

                    <LanguageDropdown changeLanguage={changeLanguage} />
    
                </div >
            }

        </>
    )

};

export default GroupThemNotifPayLangageButtons;