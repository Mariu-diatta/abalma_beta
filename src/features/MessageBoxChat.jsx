import React from 'react';
import { useSelector } from 'react-redux';
import { Download, FileText } from 'lucide-react';

const MessageBubble = ({ msg }) => {

    const currentUser = useSelector((state) => state.auth.user);

    const ISFORCURRENTUSER = (msg?.user?.email || msg?.sender_id) ?
        (
            msg?.user?.email ? (msg?.user?.email === currentUser?.email) : (currentUser?.id === msg?.sender_id)
        )
        :
        undefined;

    if (ISFORCURRENTUSER === undefined) return null;

    // ── message de type fichier (ex: msg.type === 'file') ──
    if (msg?.type === 'file') {
        return (
            <div className={`flex w-full mb-1.5 ${ISFORCURRENTUSER ? "justify-end" : "justify-start"}`}>
                <div
                    className={`max-w-[78%] sm:max-w-[65%] rounded-2xl shadow-sm overflow-hidden bg-white border border-gray-200 ${ISFORCURRENTUSER ? "rounded-br-sm" : "rounded-bl-sm"
                        }`}
                >
                    <div className="flex items-center gap-3 px-3.5 py-3">
                        <div className="w-9 h-9 rounded-lg bg-red-50 text-red-500 flex items-center justify-center flex-shrink-0">
                            <FileText size={18} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">{msg.fileName}</p>
                            <p className="text-xs text-gray-400">{msg.fileSize}</p>
                        </div>
                        <a
                            href={msg.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="ml-2 text-gray-400 hover:text-indigo-500 transition-colors"
                        >
                            <Download size={16} />
                        </a>
                    </div>
                </div>
                {msg?.created_at && (
                    <span className="sr-only">{msg.created_at}</span>
                )}
            </div>
        );
    }

    return (
        <div className={`flex w-full mb-1.5 ${ISFORCURRENTUSER ? "justify-end" : "justify-start"}`}>
            <div
                className={`max-w-[78%] sm:max-w-[65%] px-3.5 py-2 text-sm leading-relaxed shadow-sm break-words ${ISFORCURRENTUSER
                    ? "bg-indigo-500 text-white rounded-2xl rounded-br-sm"
                    : "bg-gray-100 text-gray-800 rounded-2xl rounded-bl-sm"
                    }`}
            >
                <p className="whitespace-pre-wrap">{msg?.text}</p>
                {msg?.created_at && (
                    <span
                        className={`block text-[10px] mt-1 text-right ${ISFORCURRENTUSER ? "text-white/70" : "text-gray-400"
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