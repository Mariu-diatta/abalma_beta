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

            <div className="flex items-center gap-0 px-2 py-2 bg-white border-t border-gray-100">

                <input
                    disabled={disabled}
                    value={input}
                    onChange={(e) => {
                        setInput(e.target.value);
                        setShow(false);
                        handleTyping();
                    }}
                    onKeyDown={(e) => e.key === "Enter" && !disabled && sendMessage()}
                    placeholder={disabled ? "Sélectionnez une conversation pour écrire..." : "Votre message..."}
                    aria-label="Votre message"
                    className="flex-1 px-3.5 py-2.5 border border-gray-300 border-r-0 rounded-l-xl text-sm outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1]/30 disabled:bg-gray-50 disabled:text-gray-400 transition-colors"
                />

                <button
                    onClick={() => sendMessage()}
                    disabled={disabled || !input?.trim()}
                    className="rounded-r-xl border border-gray-300 border-l-0 px-4 py-2.5 text-white transition-colors bg-[#6366f1] hover:bg-[#4f46e5] disabled:bg-gray-300 disabled:cursor-not-allowed"
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