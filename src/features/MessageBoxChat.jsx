import React from 'react'

const MessageBubble = ({ msg, isMine }) => (
    <div className={`flex w-full ${isMine ? "justify-end" : "justify-start"}`}>
        <div className={`px-3 py-2 rounded-xl ${isMine ? "bg-blue-500 text-white" : "bg-gray-100"}`}>
            {msg.text}
        </div>
    </div>
);

export default MessageBubble;