import React  from 'react';

import { useSelector} from 'react-redux';

const PrintMessagesOnChat = ({ messages, messagesEndRef }) => {
    const currentUser = useSelector((state) => state.auth.user);
    const selectedUser = useSelector((state) => state.chat.userSlected);

    return (
        <div className="flex flex-col h-full px-4 py-3 overflow-y-auto space-y-3 bg-gray-50">

            {messages?.map((msg, idx) => {

                const isMine = msg.senderId === currentUser?.id;

                return (
                    <div
                        key={msg.id || idx}
                        className={`flex w-full ${isMine ? "justify-end" : "justify-start"}`}
                    >
                        {/* Avatar gauche */}
                        {!isMine && (
                            <img
                                src={selectedUser?.image}
                                className="w-8 h-8 rounded-full mr-2 self-end"
                                alt="user"
                            />
                        )}

                        {/* Bubble */}
                        <div
                            className={`
                                max-w-[70%] px-4 py-2 rounded-2xl text-sm shadow
                                ${isMine
                                    ? "bg-indigo-500 text-white rounded-br-none"
                                    : "bg-white text-gray-700 border rounded-bl-none"
                                }
                            `}
                        >
                            <p className="whitespace-pre-wrap break-words">
                                {msg.text}
                            </p>

                            <div className={`text-[10px] mt-1 opacity-60 ${isMine ? "text-right" : "text-left"}`}>
                                {msg.createdAt}
                            </div>
                        </div>

                        {/* Avatar droite */}
                        {isMine && (
                            <img
                                src={currentUser?.image}
                                className="w-8 h-8 rounded-full ml-2 self-end"
                                alt="me"
                            />
                        )}
                    </div>
                );
            })}

            <div ref={messagesEndRef} />
        </div>
    );
}


export default PrintMessagesOnChat;