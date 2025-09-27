import React from 'react'
import { formatDateRelative, maintenant } from '../utils';

const PrintMessagesOnChat = ({ messages, currentUser, selectedUser, messagesEndRef }) => {

    return (

        <>

            <ul className="flex-1 overflow-y-auto border-b-0  mb-10 px-2 mx-3 mt-8 scrollbor_hidden h-screen mb-7 pb-6">

                {(() => {

                    let lastDateLabel = null;

                    return messages.map((msg, idx) => {

                        const isCurrentUser = msg.sender?.email === currentUser?.email;
                        const alignment = isCurrentUser ? "justify-end" : "justify-start";
                        const bubbleColor = isCurrentUser
                            ? "bg-blue-300 text-white rounded-br-none"
                            : "bg-gray-200 text-gray-800 rounded-bl-none";

                        const currentDateLabel = formatDateRelative(msg.date);

                        const showDateLabel = currentDateLabel !== lastDateLabel;

                        lastDateLabel = currentDateLabel;

                        return (

                            <React.Fragment key={`${msg.date}-${idx}`} >

                                {showDateLabel && (

                                    <li className="text-center text-xs text-gray-500 py-2">
                                        {currentDateLabel}
                                    </li>
                                )}

                                <li className={`flex items-end gap-2 ${alignment}`}>

                                    {!isCurrentUser && (

                                        <img
                                            src={
                                                selectedUser?.image ||
                                                selectedUser?.photo_url
                                            }
                                            alt="avatar"
                                            className="h-5 w-5 rounded-full object-cover shadow-lg"
                                        />
                                    )}

                                    <div className="d-flex flex-col w-auto">

                                        <div className={`w-full px-2 py-2 text-sm shadow rounded-2xl flex flex-col shadow-md ${bubbleColor}`}>
                                            <p>{msg?.message}</p>
                                        </div>

                                        <p className="text-[9px] text-grey-500 mt-1">{(msg?.date?.split(" ")[1]) || maintenant.toLocaleTimeString()}</p>

                                    </div>

                                    {isCurrentUser && (
                                        <img
                                            src={
                                                msg?.sender?.image ||
                                                msg?.sender?.photo_url
                                            }
                                            alt="avatar"
                                            className="h-5 w-5 rounded-full object-cover"
                                        />
                                    )}

                                </li>

                                <div ref={messagesEndRef} />

                            </React.Fragment>
                        );
                    });
                })()}

            </ul>

        </>

    )
}

export default PrintMessagesOnChat;
