import React from 'react';
import { Paperclip, Smile, Mic, Send } from 'lucide-react';

const InputBoxChat = ({
    disabled,
    input,
    setInput,
    setShow,
    sendMessage,
    handleTyping
}) => {
    return (
        <div className="absolute bottom-0 left-0 w-full">
            <div className="flex items-center gap-2 px-4 py-3 bg-white border-t border-gray-100">

                {/* ATTACHMENT */}
                <button
                    disabled={disabled}
                    className="text-gray-400 hover:text-indigo-500 disabled:opacity-40 transition-colors flex-shrink-0"
                    aria-label="Joindre un fichier"
                >
                    <Paperclip size={19} />
                </button>

                {/* INPUT */}
                <div className="flex-1 relative">
                    <input
                        disabled={disabled}
                        value={input}
                        onChange={(e) => {
                            setInput(e.target.value);
                            setShow(false);
                            handleTyping();
                        }}
                        onKeyDown={(e) => e.key === "Enter" && !disabled && sendMessage()}
                        placeholder={
                            disabled
                                ? "Sélectionnez une conversation pour écrire..."
                                : "Écrivez un message..."
                        }
                        aria-label="Votre message"
                        className="
                            w-full
                            pl-4 pr-9
                            py-2.5
                            text-sm
                            bg-gray-50
                            border border-gray-200
                            rounded-full
                            outline-none
                            transition-all
                            duration-200
                            focus:bg-white
                            focus:border-indigo-400
                            focus:ring-4
                            focus:ring-indigo-100
                            disabled:bg-gray-100
                            disabled:text-gray-400
                        "
                    />
                    <button
                        disabled={disabled}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-500 disabled:opacity-40 transition-colors"
                        aria-label="Emoji"
                    >
                        <Smile size={17} />
                    </button>
                </div>

                {/* VOICE */}
                <button
                    disabled={disabled}
                    className="text-gray-400 hover:text-indigo-500 disabled:opacity-40 transition-colors flex-shrink-0"
                    aria-label="Message vocal"
                >
                    <Mic size={19} />
                </button>

                {/* SEND */}
                <button
                    onClick={() => sendMessage()}
                    disabled={disabled || !input?.trim()}
                    className="
                        w-10 h-10
                        flex items-center justify-center
                        rounded-full
                        bg-indigo-500
                        text-white
                        shadow-sm
                        transition-all
                        duration-200
                        hover:bg-indigo-600
                        hover:scale-105
                        active:scale-95
                        disabled:bg-gray-300
                        disabled:cursor-not-allowed
                        disabled:scale-100
                        flex-shrink-0
                    "
                    aria-label="Envoyer"
                >
                    <Send size={16} />
                </button>
            </div>
        </div>
    )
}

export default InputBoxChat;