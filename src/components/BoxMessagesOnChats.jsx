import React, { useEffect, useState } from 'react';
import { AGENT_AI, formatDateRelative, getDataChat, maintenant } from '../utils';
import { useSelector, useDispatch } from 'react-redux';
import { addUser } from '../slices/chatSlice';
import LoadingCard from './LoardingSpin';
import { useTranslation } from 'react-i18next';
import api from '../services/Axios';

const PrintMessagesOnChat = ({
    messages,
    messagesEndRef
}) => {

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const selectedUser = useSelector((state) => state.chat.userSlected);

    const currentUser = useSelector((state) => state.auth.user);

    const currentChat = useSelector((state) => state.chat.currentChat);

    const currentAnalyseAiSelected = useSelector((state) => state.aiChat.currentChat);

    const [dataDiscussions, setDataDiscussions] = useState(null);

    const [handleButtonDianios, setHandleButtonDianios] = useState(false);

    const iSCurrentUserTheOwner = (currentUser?.id === currentChat?.current_owner)

    const showUserAvatar = (selectedUser?.id !== AGENT_AI?.id)

    const userImage = selectedUser?.image || selectedUser?.photo_url;

    const userName = selectedUser?.nom || 'Fournisseur';

    const [loadingAi, setLoadingAi] = useState(false);

    const buildConversationString = (messages, selectedUserId) => {

        return messages
            .map((msg) => {
                const role = (msg.sender_id.id === selectedUserId) ? "client" : "vendeur";
                return `${role}: "${msg.text}"`;
            })
            .join("\n");
    };

    const getText = (text) => {
        const end = text.indexOf('additional_kwargs'); // arrêt avant additional_kwargs
        return text.substring(9, end - 1).trim();
    };

    const handleClick = async () => {
        setLoadingAi(true);
        dispatch(addUser(AGENT_AI));

        const conversationString = buildConversationString(messages, selectedUser?.id);

        try {
            const result = await getDataChat(conversationString);
            if (result) {
                setDataDiscussions(result);
                setHandleButtonDianios(true);
            }

        } catch (e) {
            console.log("Erreur récupération AI:", e);

        } finally {
            setLoadingAi(false);
        }
    };

    useEffect(() => {
        setDataDiscussions(currentAnalyseAiSelected?.aiChat)

    }, [currentAnalyseAiSelected]);

    useEffect(() => {

        const setDataAnalyse = async () => {

            try {
                api.post('ai-analyse-chat/', {
                    room: currentChat?.pk,
                    resume: dataDiscussions[0],
                    advise: dataDiscussions[1],
                    directive: dataDiscussions[2],
                }).then(
                    resp => {
                        console.log(resp)
                    }
                ).catch(
                    err => {
                        console.log(err)
                    }
                )
            } catch(e) {

            }
        }

        setDataAnalyse()
        
    }, [dataDiscussions, currentChat]);


    if (handleButtonDianios) {

        return (

            <div className="shadow-lg flex flex-col gap-4 h-[70dvh] overflow-y-auto z-0 scrollbor_hidden rounded-lg p-4 bg-gray-50 shadow-lg relative">

                <button
                    onClick={setHandleButtonDianios(false)}
                    className="absolute top-2 right-2 flex items-center p-2 rounded-full hover:bg-gray-200 transition"
                >
                    <svg
                        className="w-6 h-6 text-gray-800 dark:text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M6 18L17.94 6M18 18L6.06 6" />
                    </svg>

                </button>

                {
                    dataDiscussions?.map(

                        (data, idx) => {
                            const textResponseAi = getText(data)
                                .replace(/\n\n/g, " ")
                                .replace(/\n/g, " ")
                                .replace(/\s{2,}/g, " ")
                                .trim();

                            let title = idx === 0 ? t("summary") : idx === 1 ? t("advice") : t("directive");

                            return (

                                <div key={data.id || idx} className="shadow-lg  flex-col gap-2 break-words text-gray-800 text-sm leading-relaxed shadow-lg mt-3">

                                    {/* Titre de la section */}
                                    <div className="flex items-center gap-2 border border-gray-300 bg-blue-100 text-blue-800 px-3 py-1 rounded-md font-semibold">

                                        <svg
                                            className="w-6 h-6 text-gray-800 dark:text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15.2 6H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11.2a1 1 0 0 0 .747-.334l4.46-5a1 1 0 0 0 0-1.332l-4.46-5A1 1 0 0 0 15.2 6Z" />
                                        </svg>

                                        <p>{title}</p>

                                    </div>

                                    {/* Contenu */}
                                    <div className="px-2 py-1 bg-white rounded-md shadow-sm border border-gray-100 leading-relaxed">
                                        {textResponseAi}
                                    </div>

                                </div>
                            );
                        }
                    )
                }

            </div>
        );

    } else { 

        return (

            <>
                {
                    iSCurrentUserTheOwner &&
                    <>
 
                        {

                            !loadingAi?
                            (
                                <button
                                    onClick={handleClick}
                                    className="flex gap-1 items-center mt-auto sticky bottom-2 left-2 rounded-full p-3 m-2 bg-gray-50 hover:bg-blue-100 shadow-lg"
                                >
                                    <svg
                                        className="w-6 h-6 text-gray-800 dark:text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.5" d="M14.7141 15h4.268c.4043 0 .732-.3838.732-.8571V3.85714c0-.47338-.3277-.85714-.732-.85714H6.71411c-.55228 0-1 .44772-1 1v4m10.99999 7v-3h3v3h-3Zm-3 6H6.71411c-.55228 0-1-.4477-1-1 0-1.6569 1.34315-3 3-3h2.99999c1.6569 0 3 1.3431 3 3 0 .5523-.4477 1-1 1Zm-1-9.5c0 1.3807-1.1193 2.5-2.5 2.5s-2.49999-1.1193-2.49999-2.5S8.8334 9 10.2141 9s2.5 1.1193 2.5 2.5Z" />
                                    </svg>

                                     {
                                        showUserAvatar && (
                                            <img
                                                src={userImage}
                                                alt={userName}
                                                className="h-8 w-8 rounded-full object-cover cursor-pointer ring-1 ring-gray-300 hover:ring-blue-500 transition z-[2999]"
                                                title={selectedUser?.nom}
                                            />
                                        )
                                    }
                                </button>
                            )
                            :
                            (
                                <LoadingCard />
                            )

                        }
                    </>
                }

                <ul className="flex-1 overflow-y-auto border-b-0 mb-10 px-2 mx-3 mt-8 scrollbor_hidden max-h-[70dvh] min-h-[70dvh] md:px-[3vh]">

                    {
                        currentUser?.id &&

                        messages?.map((msg, idx) => {
                            const isCurrentUser = msg.sender_id?.id === currentUser?.id || msg.sender_id === currentUser?.id;
                            const alignment = isCurrentUser ? "justify-end" : "justify-start";
                            const bubbleColor = isCurrentUser
                                ? "bg-blue-300 text-white rounded-br-none"
                                : "text-gray-500 rounded-bl-none border border-gray-100";
                            const currentDateLabel = formatDateRelative(msg.date);
                            const showDateLabel = currentDateLabel !== messages[idx - 1]?.date;

                            return (

                                <React.Fragment key={`${msg.date}-${idx}`}>

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
                                                    src={selectedUser?.image || selectedUser?.photo_url}
                                                    alt="avatar"
                                                    className="h-5 w-5 rounded-full object-cover shadow-lg"
                                                />
                                            )
                                        }

                                        <div className="flex flex-col w-auto">

                                            <div className={`w-full px-2 py-2 text-sm rounded-2xl flex flex-col shadow-md ${bubbleColor}`}>
                                                <p>{msg?.text}</p>
                                            </div>

                                            <p className="text-[9px] text-gray-500 mt-1">
                                                {(msg?.date?.split(" ")[1]) || maintenant.toLocaleTimeString()}
                                            </p>

                                        </div>

                                        {
                                            isCurrentUser && (
                                                <img
                                                    src={currentUser?.image || currentUser?.photo_url}
                                                    alt="avatar"
                                                    className="h-5 w-5 rounded-full object-cover"
                                                />
                                            )
                                        }

                                    </li>

                                    <div ref={messagesEndRef} />

                                </React.Fragment>
                            );
                        })
                    }

                </ul>

            </>
        );

    }
};

export default PrintMessagesOnChat;
