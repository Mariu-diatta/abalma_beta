import React from 'react'

const InputBoxChat=({allRoomsChats, input, setInput, setShow, sendMessage})=>{

    return(

        <div className=" fixed bottom-0 md:bottom-2 w-screen md:w-[50dvw] p-0">

	         <div className="bg-none  flex items-center gap-0 me-0 px-2 py-2  rounded-xl mb-0">
            
                <input
                    disabled={allRoomsChats.length === 0}
                    value={input}
                    onChange={e => { setInput(e.target.value); setShow(false); }}
                    onKeyDown={e => e.key === "Enter" && sendMessage()}
                    placeholder="Votre message..."
                    className="bg-none flex-1 px-3 py-2 border-r-0 border border-gray-300 rounded-e-none rounded-xl text-sm focus:outline-none focus:ring-0 "
                />

                <button
                    onClick={sendMessage}
                    className="rounded-e-full border-l-0 border border-gray-300 px-5 py-2 text-base  text-white transition bg-none from-purple-300 to-blue-300 hover:bg-gradient-to-br hover:from-purple-50 "
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
        </div >

    )
}

export default InputBoxChat;