import { useSelector } from "react-redux";
import PrintMessagesOnChat from "../components/BoxMessagesOnChats";
import ProfilPictureView from "../components/ProfilPictureView";
import { useTranslation } from 'react-i18next';

const BoxMessagesChats = ({ messages, messagesEndRef }) => {

    const selectedUser = useSelector((state) => state.chat.userSlected);

    const { t } = useTranslation();

    return (

        <div className="relative flex-1 space-y-0 pr-2 max-h-[100dvh] min-h-[100dvh] shadow-lg">

            <div className="w-full h-px bg-gray-100 mb-3" />

            {/* 💬 Liste des messages */}

            {
                (messages?.length === 0) ?
                    (
                        <ProfilPictureView
                            currentUser={selectedUser}
                            message={t("no_message")}
                        />
                    )
                    :
                    (
                        <PrintMessagesOnChat
                            messages={messages}
                            selectedUser={selectedUser}
                            messagesEndRef={messagesEndRef}
                        />

                    )

            }

        </div>
    )
}

export default BoxMessagesChats;