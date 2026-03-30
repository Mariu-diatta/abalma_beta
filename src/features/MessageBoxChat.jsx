import { useSelector } from "react-redux";
import PrintMessagesOnChat from "../components/BoxMessagesOnChats";
import ProfilPictureView from "../components/ProfilPictureView";
import { useTranslation } from 'react-i18next';

const BoxMessagesChats = ({ messages, messagesEndRef }) => {

    const selectedUser = useSelector((state) => state.chat.userSlected);

    const { t } = useTranslation();

    const lengthMessages = (messages?.length === 0)

    return (

        <div className="relative flex-1 space-y-0 min-h-[80dvh] min-h-[80dvh] px-3">

            <div className="w-full h-px bg-gray-100" />

            {/* 💬 Liste des messages */}

            {
                lengthMessages ?
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