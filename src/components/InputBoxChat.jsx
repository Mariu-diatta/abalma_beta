import React from 'react'

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

            <div className="flex items-end gap-2 px-3 py-3 bg-white border-t border-gray-100">

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
                                : "Envoyer un message..."
                        }
                        aria-label="Votre message"
                        className="
                            w-full
                            px-4 py-3
                            pr-12
                            text-sm
                            bg-gray-50
                            border border-gray-200
                            rounded-2xl
                            outline-none
                            transition-all
                            duration-200
                            focus:bg-white
                            focus:border-[#6366f1]
                            focus:ring-4
                            focus:ring-[#6366f1]/10
                            disabled:bg-gray-100
                            disabled:text-gray-400
                        "
                    />

                    {/* shortcut icon / decoration (optionnel style ChatGPT) */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <span className="text-xs">⏎</span>
                    </div>
                </div>

                {/* BUTTON */}
                <button
                    onClick={() => sendMessage()}
                    disabled={disabled || !input?.trim()}
                    className="
                        w-11 h-11
                        flex items-center justify-center
                        rounded-full
                        bg-[#6366f1]
                        text-white
                        shadow-sm
                        transition-all
                        duration-200
                        hover:bg-[#4f46e5]
                        hover:scale-105
                        active:scale-95
                        disabled:bg-gray-300
                        disabled:cursor-not-allowed
                        disabled:scale-100
                    "
                    aria-label="Envoyer"
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M12 2a1 1 0 0 1 .932.638l7 18a1 1 0 0 1-1.326 1.281L13 19.517V13a1 1 0 1 0-2 0v6.517l-5.606 2.402a1 1 0 0 1-1.326-1.281l7-18A1 1 0 0 1 12 2Z"
                        />
                    </svg>
                </button>

            </div>

        </div>

    )
}

export default InputBoxChat;