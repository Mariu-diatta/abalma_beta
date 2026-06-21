import React from 'react';

const MessageBubble = ({ msg }) => {
    const isMine = msg?.isMine;

    return (
        <div className={`flex w-full mb-1.5 ${isMine ? "justify-end" : "justify-start"}`}>
            <div
                className={`max-w-[78%] sm:max-w-[65%] px-3.5 py-2 text-sm leading-relaxed shadow-sm break-words ${isMine
                        ? "bg-[#6366f1] text-white rounded-2xl rounded-br-sm"
                        : "bg-gray-100 text-gray-800 rounded-2xl rounded-bl-sm"
                    }`}
            >
                <p className="whitespace-pre-wrap">{msg.text}</p>
                {msg.created_at && (
                    <span
                        className={`block text-[10px] mt-1 text-right ${isMine ? "text-indigo-100/80" : "text-gray-400"
                            }`}
                    >
                        {msg.created_at}
                    </span>
                )}
            </div>
        </div>
    );
};

export default MessageBubble;