import React from 'react';
import { useSelector} from 'react-redux';

const MessageBubble = ({ msg }) => {

    const currentUser = useSelector((state) => state.auth.user);

    const ISFORCURRENTUSER = (msg?.user?.email || msg?.sender_id) ?
        (
            msg?.user?.email ? (msg?.user?.email === currentUser?.email) : (currentUser?.id === msg?.sender_id) 
        )
        :
        undefined

    if (ISFORCURRENTUSER===undefined) return

    return (
        <div className={`flex w-full mb-1.5 ${ISFORCURRENTUSER? "justify-end" : "justify-start"}`}>
            <div
                className={`max-w-[78%] sm:max-w-[65%] px-3.5 py-2 text-sm leading-relaxed shadow-sm break-words ${ISFORCURRENTUSER 
                        ? "bg-[#6366f1] text-white rounded-2xl rounded-br-sm"
                        : "bg-gray-100 text-gray-800 rounded-2xl rounded-bl-sm"
                    }`}
            >
                <p className="whitespace-pre-wrap">{msg?.text}</p>
                {msg?.created_at && (
                    <span
                        className={`block text-[10px] mt-1 text-right ${ISFORCURRENTUSER ? "text-indigo-100/80" : "text-gray-400"
                            }`}
                    >
                        {msg?.created_at}
                    </span>
                )}
            </div>
        </div>
    );
};

export default MessageBubble;