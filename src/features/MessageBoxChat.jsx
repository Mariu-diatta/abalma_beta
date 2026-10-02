import React from 'react';
import { useSelector } from 'react-redux';
import { Download, FileText } from 'lucide-react';
import { formatRelativeDate } from '../utils';

const MessageBubble = ({ msg,  handlePointerDown,  handlePointerMove, handlePointerUp, dragX,  draggingMessage}) => {

    const currentUser = useSelector((state) => state.auth.user);

    const ISFORCURRENTUSER = (msg?.user?.email || msg?.sender_id) ?
        (
            msg?.user?.email ? (msg?.user?.email === currentUser?.email) : (currentUser?.id === msg?.sender_id)
        )
        :
        undefined;

    const scrollToOriginal = (e) => {
        e.stopPropagation();

        const replyId = msg?.replyTo?.id ?? msg?.replyTo;
        const target = document.getElementById(`message-${replyId}`);
        console.log("replyTo =", msg?.replyTo, "| id cherché =", `message-${replyId}`, "| trouvé =", target);

        if (!target) return;

        target.scrollIntoView({ behavior: "smooth", block: "center" });
        target.classList.add("message-highlight");
        setTimeout(() => target.classList.remove("message-highlight"), 1500);
    };

    if (ISFORCURRENTUSER === undefined) return null;

    // ── message de type fichier (ex: msg.type === 'file') ──
    if (msg?.type === 'file') {
        return (
            <div className={`flex w-full mb-1.5 ${ISFORCURRENTUSER ? "justify-end" : "justify-start"}`} id={`message-${msg.id}`}>
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
                    <span className="sr-only">{formatRelativeDate(msg.created_at)}</span>
                )}
            </div>
        );
    }

    return (
        <>     
            <div
                className={`flex flex-row message whitespace-pre-wrap w-full ${ISFORCURRENTUSER ? "justify-end" :" justify-start"}`}
                style={{
                    transform:
                        draggingMessage?.id === msg.id
                            ? `translateX(${dragX}px)`
                            : "translateX(0)",
                    transition: draggingMessage
                        ? "none"
                        : "transform 0.2s ease",
                }}
                onPointerDown={(e) => handlePointerDown(e, msg)}
                onPointerMove={(e) => handlePointerMove(e, msg)}
                onPointerUp={(e) => handlePointerUp(e, msg)}

            >    
                <div
                    className={`flex flex-col mb-1.5  w-auto max-w-[50%] sm:max-w-[50%] px-3.5 py-2 text-sm leading-relaxed shadow-sm break-words ${ISFORCURRENTUSER
                        ? "bg-indigo-500 text-white rounded-full rounded-br-sm "
                        : "bg-gray-100 text-gray-800 rounded-full rounded-bl-sm"
                    }`}
                >
                    <nav className="flex flex-col text-start px-2">
                        <span>{msg?.text}</span>

                        {msg?.created_at && (
                            <span
                                className={`block text-[10px]  ${ISFORCURRENTUSER
                                    ? "text-white/70"
                                    : "text-gray-400"
                                    }`}
                            >
                                {formatRelativeDate(msg.created_at)}
                            </span>
                        )}
                    </nav>

                    {msg?.replyTo ? (
                        <nav
                            className="bg-gray-300 rounded-full rounded-br-sm p-2 flex flex-col cursor-pointer"
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={scrollToOriginal}
                        >
                            <nav>{msg.replyTo.text}</nav>
                            <nav className="text-[10px]">{msg.replyTo.created_at_formatted}</nav>
                        </nav>
                    ) : null}

                </div>
         
            </div>
        </>
    );
};

export default MessageBubble;