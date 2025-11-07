import React from 'react'
import { formatDateRelative, maintenant } from '../utils';
import { useSelector } from 'react-redux';


const PrintMessagesOnChat = ({ messages, messagesEndRef }) => {

    const selectedUser = useSelector((state) => state.chat.userSlected);

    const currentUser = useSelector((state) => state.auth.user);

    return (

        <>

            <ul className="flex-1 overflow-y-auto border-b-0  mb-10 px-2 mx-3 mt-8 scrollbor_hidden max-h-[70dvh] min-h-[70dvh] md:px-[3vh]">

                {
                    (
                        () => {

                            let lastDateLabel = null;

                            if (!currentUser?.id) return

                            return messages?.map(

                                (msg, idx) => {

                                    var isCurrentUser = false

                                    if (msg.sender_id?.id === currentUser?.id || msg.sender_id === currentUser?.id)
                                    {
                                        isCurrentUser = true

                                    } else {

                                        isCurrentUser = false
                                    }

                                    const alignment = isCurrentUser ? "justify-end" : "justify-start";

                                    const bubbleColor = isCurrentUser
                                        ? "bg-blue-300 text-white rounded-br-none"
                                        : "text-gray-500 rounded-bl-none border border-gray-100";

                                    const currentDateLabel = formatDateRelative(msg.date);

                                    const showDateLabel = currentDateLabel !== lastDateLabel;

                                    lastDateLabel = currentDateLabel;

                                    return (

                                        <React.Fragment key={`${msg.date}-${idx}`} >

                                            {
                                                showDateLabel && (

                                                    <li className="text-center text-xs text-gray-500 py-2">
                                                        {currentDateLabel}
                                                    </li>
                                                )
                                            }

                                            <li className={`flex items-end gap-2 pb-3 ${alignment}`}>

                                                {
                                                    !isCurrentUser && (

                                                        <img
                                                            src={
                                                                selectedUser?.image ||
                                                                selectedUser?.photo_url
                                                            }
                                                            alt="avatar"
                                                            className="h-5 w-5 rounded-full object-cover shadow-lg"
                                                        />
                                                    )
                                                }

                                                <div className="d-flex flex-col w-auto">

                                                    <div className={`w-full px-2 py-2 text-sm rounded-2xl flex flex-col shadow-md ${bubbleColor}`}>
                                                        <p>{msg?.text}</p>
                                                    </div>

                                                    <p className="text-[9px] text-grey-500 mt-1">{(msg?.date?.split(" ")[1]) || maintenant.toLocaleTimeString()}</p>

                                                </div>

                                                {
                                                    isCurrentUser && (
                                                        <img
                                                            src={
                                                                currentUser?.image ||
                                                                currentUser?.photo_url
                                                            }
                                                            alt="avatar"
                                                            className="h-5 w-5 rounded-full object-cover"
                                                        />
                                                    )
                                                }

                                            </li>

                                            <div ref={messagesEndRef} />

                                        </React.Fragment>
                                    );
                            
                                }
                            );
                        }
                    )()
                }

            </ul>

        </>

    )
}

export default PrintMessagesOnChat;


