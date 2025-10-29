import PrintMessagesOnChat from "../components/BoxMessagesOnChats";
import ProfilPictureView from "../components/ProfilPictureView";
import { useTranslation } from 'react-i18next';

const BoxMessagesChats = ({ selectedUser, messages, currentUser, messagesEndRef }) => {

    const { t } = useTranslation();

    return (
        <div className="relative flex-1 space-y-0 pr-2 max-h-[100dvh] min-h-[100dvh]">

            <div className="w-full h-px bg-gray-300 mb-3" />

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
                            currentUser={currentUser}
                            selectedUser={selectedUser}
                            messagesEndRef={messagesEndRef}
                        />

                    )

            }

        </div>
    )
}

export default BoxMessagesChats;