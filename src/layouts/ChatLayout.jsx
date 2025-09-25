import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ChatApp from '../pages/ChatApp';
import api from '../services/Axios';
import { useTranslation } from 'react-i18next';

import {
    addCurrentChat,
    addMessageNotif,
    addRoom,
    addUser,
    deleteRoomAsync,
} from '../slices/chatSlice';

const ChatLayout = () => {
    const { t } = useTranslation();
    const [showSidebar, setShowSidebar] = useState(false);

    const currentUser = useSelector((state) => state.auth.user);
    const allChats = useSelector((state) => state.chat.currentChats);
    const currentChat = useSelector((state) => state.chat.currentChat);
    const selectedUser = useSelector((state) => state.chat.userSlected);

    const [receivers, setReceivers] = useState({});
    const [senders, setSenders] = useState({});

    const dispatch = useDispatch();

    // Récupération du sender
    const getSender = useCallback(

        async (userId) => {

            if (!userId || senders[userId]) return; // évite doublons

            try {

                const res = await api.get(`/clients/${userId}/`);

                const user = res?.data;

                if (user && user?.id !== currentUser?.id) {

                    setSenders((prev) => ({ ...prev, [userId]: user }));
                }

            } catch (e) {

                console.error(e);
            }
        },
        [senders, currentUser?.id]
    );

    // Récupération du receiver
    const getReceiver = useCallback(

        async (userId) => {

            if (!userId || receivers[userId]) return; // évite doublons
            try {
                const res = await api.get(`/clients/${userId}/`);

                const user = res?.data;

                if (user) {

                    setReceivers((prev) => ({ ...prev, [userId]: user }));
                }

            } catch (e) {

                console.error(e);
            }
        },

        [receivers]
    );

    // Charger infos des users (receiver/sender) quand allChats change
    useEffect(() => {
        allChats.forEach((room) => {
            getReceiver(room?.current_receiver);
            getSender(room?.current_owner);
        });
    }, [allChats, getReceiver, getSender]);


    // Charger la room d'un utilisateur sélectionné
    useEffect(() => {
        const fetchRooms = async () => {

            if (!selectedUser?.id) return;

            try {
                const response = await api.get(`/rooms/?receiver_id=${selectedUser?.id}`);

                const response_room = response?.data[0];

                if (response?.data?.length > 0 && response_room) {

                    response?.data?.forEach(

                        room => {

                            if (room?.current_receiver === currentUser?.id || room?.current_owner === currentUser?.id) {

                                dispatch(addRoom(response_room));

                                dispatch(addCurrentChat(response_room));
                            }
                        }
                    )
                }
            } catch (err) {

                console.error('Erreur lors du chargement des rooms:', err);
            }
        };

        fetchRooms();

    }, [selectedUser?.id, dispatch, currentUser?.id]);


    // Charger la room d'un utilisateur sélectionné
    useEffect(() => {

        const fetchRooms = async () => {

            if (!currentUser?.id) return;

            try {
                const response = await api.get(`/rooms/?receiver_id=${currentUser?.id}`);

                if (response?.data?.length > 0) {

                    response?.data?.forEach(

                        room => {

                            dispatch(addRoom(room));
                        }
                    )

                }
            } catch (err) {

                console.error('Erreur lors du chargement des rooms:', err);
            }
        };

        fetchRooms();
    }, [dispatch, currentUser]);

    // Si plus de chat → reset utilisateur sélectionné
    useEffect(() => {
        if (allChats.length === 0) {
            dispatch(addUser(null));
        }
    }, [allChats.length, dispatch]);

    const handleDeleteRoom = (room) => {
        dispatch(
            addMessageNotif(
                `Discussion ${selectedUser?.prenom + room?.name?.slice(10, 15)} supprimée`
            )
        );
        dispatch(deleteRoomAsync(room));
    };

    return (
        <div
            className="container flex h-screen w-auto overflow-hidden relative"
            style={{
                backgroundColor: 'var(--color-bg)',
                color: 'var(--color-text)',
            }}
        >
            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 h-full bg-gray-100 z-20 transform transition-transform duration-300 ease-in-out
          ${showSidebar ? 'translate-x-0' : '-translate-x-full'}
          md:static md:translate-x-0 md:w-1/4 md:block`}
                style={{
                    backgroundColor: 'var(--color-bg)',
                    color: 'var(--color-text)',
                }}
            >
                <div className="p-1 gap-5 pt-6">
                    <h2 className="font-bold text-gray-500 mb-6 h-3">Discussions</h2>
                    <div className="w-full h-px bg-gray-300 mb-6 mt-6" />
                    {allChats.length === 0 ? (
                        <p className="text-center text-md font-bold">
                            {t('message.nomessage')}
                        </p>
                    ) : (
                        <ul className="mt-5 space-y-2">

                            {allChats.map((room, index) => {

                                const currentReceiver = receivers[room?.current_receiver];
                                const currentSender = senders[room?.current_owner];
                                const whoCurrentUserChatWith =
                                currentReceiver?.email === currentUser?.email
                                    ? currentSender
                                    : currentReceiver;

                                return (
                                    <li
                                        key={index}
                                        className={`w-full flex items-center justify-between p-2 rounded-lg text-sm font-medium transition-colors
                                        ${currentChat?.name === room?.name
                                            ? 'bg-blue-500 text-white'
                                            : 'hover:bg-gray-100 text-gray-800'
                                        }`}
                                    >
                                        <span
                                            onClick={() => {
                                                dispatch(addCurrentChat(room));
                                                dispatch(addUser(whoCurrentUserChatWith))
                                            }}
                                            className="flex gap-2 cursor-pointer flex-grow"
                                        >
                                            <img
                                                src={
                                                    whoCurrentUserChatWith?.image ||
                                                    whoCurrentUserChatWith?.photo_url
                                                }
                                                alt={`${whoCurrentUserChatWith?.nom || 'Moi'
                                                    } avatar`}
                                                className="h-7 w-7 rounded-full object-cover"
                                            />

                                            <div className="flex flex-col leading-tight">
                                                <span className="text-md font-medium text-gray-600">
                                                    {whoCurrentUserChatWith?.prenom?.slice(0, 20) ||
                                                        'Prénom'}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {whoCurrentUserChatWith?.nom?.toLowerCase()}
                                                </span>
                                            </div>

                                        </span>

                                        <button
                                            onClick={() => handleDeleteRoom(room)}
                                            className="cursor-pointer ml-2 text-red-600 hover:text-red-800 text-xs"
                                            aria-label={`Supprimer ${room.name}`}
                                        >
                                            ✕
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </div>

            {/* Toggle button for mobile */}
            <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="md:hidden fixed top-[8] border-0 right-5 z-8 text-white px-2 py-2 rounded-full shadow-sm bg-white"
                aria-label="Toggle menu"
            >
                {showSidebar ? (
                    <svg
                        className="w-[26px] h-[26px] text-gray-800 dark:text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1"
                            d="m15 19-7-7 7-7"
                        />
                    </svg>
                ) : (
                    <svg
                        className="w-[26px] h-[26px] text-gray-800 dark:text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1"
                            d="m9 5 7 7-7 7"
                        />
                    </svg>
                )}
            </button>

            {/* Main Chat Area */}
            <div
                className="lg:me-5 lg:pe-5 lg:ps-5 flex-1 flex flex-col overflow-hidden"
                style={{
                    backgroundColor: 'var(--color-bg)',
                    color: 'var(--color-text)',
                }}
            >
                <ChatApp setShow={setShowSidebar} />
            </div>
        </div>
    );
};

export default ChatLayout;
