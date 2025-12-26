import React, { useEffect, useState } from 'react'
import { AGENT_AI, formatDateRelative, getDataChat, maintenant } from '../utils';
import { useSelector , useDispatch } from 'react-redux';
import {addUser } from '../slices/chatSlice';
import LoadingCard from './LoardingSpin';
import { useTranslation } from 'react-i18next';


const PrintMessagesOnChat = ({ messages, messagesEndRef }) => {

    const { t } = useTranslation();

    const selectedUser = useSelector((state) => state.chat.userSlected);

    const currentUser = useSelector((state) => state.auth.user);

    const dispatch = useDispatch();

    const [dataDiscussions, setDataDiscussions] = useState(null)

    const [handleButtonDianios, setHandleButtonDianios] = useState(false)

    const [loadingAi, setLoadingAi] = useState(false)

    const buildConversationString = (messages, selectedUserId) => {

        return messages

            .map(msg => {
                const role = msg.sender_id.id === selectedUserId ? "client" : "vendeur";
                return `${role}: "${msg.text}"`;
            })

            .join("\n");
    };

    const handleClick = async () => {

        //dispatch(addCurrentChat({ name: "Chat_AI" }));

        setLoadingAi(true)

        dispatch(addUser(AGENT_AI));

        const conversationString = buildConversationString(

            messages,

            selectedUser?.id
        );

        try {

            const result = await getDataChat(conversationString);

            if (result) {

                setDataDiscussions(result);

                setHandleButtonDianios(true)
            }

        } catch (e) {

            console.log("Les données::::", e)

        } finally {

            setLoadingAi(false)
        }


    }

    useEffect(
        () => {
            console.log(dataDiscussions)
            console.log(dataDiscussions?.lenght)
        }, [dataDiscussions]
    )

    const getText = (text) => {   
        const end = text.indexOf('additional_kwargs'); // arrêt avant additional_kwargs
        const conversation = text.substring(9, end-1).trim();
        return conversation;
    }  

    if (handleButtonDianios) {

        return (

            <div className="flex flex-col gap-4 h-[70dvh] overflow-y-auto z-0 scrollbor_hidden rounded-lg p-4 bg-gray-50 shadow-lg">

                <button

                    onClick={()=>setHandleButtonDianios(false)}

                    className="absolute top-0 right-1 flex items-center mt-auto w-auto rouded-full p-3 m-2 bg-none hover:bg-blue-10"
                >
                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M6 18 17.94 6M18 18 6.06 6" />
                    </svg>

                </button>

                {
                    dataDiscussions?.map((data, idx) => {

                          const textResponseAi = getText(data).replace(/\n\n/g, " ")
                            .replace(/\n/g, " ")
                            .replace(/\s{2,}/g, " ")
                            .trim();;

                            // Définir le titre selon l'index
                            let title = "";

                            if (idx === 0) title = t("summary");

                            else if (idx === 1) title = t("advice");

                            else title = t("directive");

                            return (

                                <div

                                    key={data.id || idx}

                                    className="flex flex-col gap-2 break-words text-gray-800 text-sm leading-relaxed shadow-lg mt-3"
                                >
                                    {/* Titre de la section */}
                                    <div className="flex inline-block shadow-sm border border-gray-300 bg-blue-100 text-blue-800 px-3 py-1 rounded-md font-semibold">

                                        <div className="flex gap-4">

                                            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15.2 6H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11.2a1 1 0 0 0 .747-.334l4.46-5a1 1 0 0 0 0-1.332l-4.46-5A1 1 0 0 0 15.2 6Z" />
                                            </svg>

                                            <p>
                                                {title}
                                            </p>

                                        </div>

                                    </div>

                                    {/* Contenu */}
                                    <div className="px-2 py-1 bg-white rounded-md shadow-sm border border-gray-100 leading-relaxed">

                                        {
                                            textResponseAi.trim()
                                        }

                                    </div>

                                </div>
                            );
                        }
                    )
                }
            </div>


        )
    }

    return (

        <>

            {
                !loadingAi ?
                <button

                    onClick={() => handleClick()}

                    className="flex gap-1 items-center mt-auto sticky bottom-2 left-2 rounded-full p-3 m-2 bg-gray-50 hover:bg-blue-10 shadow-lg"
                >

                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.5" d="M14.7141 15h4.268c.4043 0 .732-.3838.732-.8571V3.85714c0-.47338-.3277-.85714-.732-.85714H6.71411c-.55228 0-1 .44772-1 1v4m10.99999 7v-3h3v3h-3Zm-3 6H6.71411c-.55228 0-1-.4477-1-1 0-1.6569 1.34315-3 3-3h2.99999c1.6569 0 3 1.3431 3 3 0 .5523-.4477 1-1 1Zm-1-9.5c0 1.3807-1.1193 2.5-2.5 2.5s-2.49999-1.1193-2.49999-2.5S8.8334 9 10.2141 9s2.5 1.1193 2.5 2.5Z" />
                    </svg>

                    {
                        (selectedUser?.id !== AGENT_AI?.id) ?
                            <img

                                src={selectedUser?.image || selectedUser?.photo_url}

                                alt={selectedUser?.nom || 'Fournisseur'}

                                className="h-8 w-8 rounded-full object-cover cursor-pointer ring-1 ring-gray-300 hover:ring-blue-500 transition z-[2999]"

                                title={selectedUser?.nom}
                            />
                            :
                            null
                    }

                </button>
                :
                <LoadingCard/>
            }

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


