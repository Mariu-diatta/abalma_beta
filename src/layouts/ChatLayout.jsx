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
    removeRoom,
} from '../slices/chatSlice';

//import { setCurrentNav } from '../slices/navigateSlice';

import { addAiChat } from '../slices/aiChatSlice';

import TitleCompGen from '../components/TitleComponentGen';
import AnaliesChatsWithAi from '../pages/ChatWithAi';

const ChatLayout = () => {

    const { t } = useTranslation();

    const [showSidebar, setShowSidebar] = useState(false);

    const currentUser = useSelector((state) => state.auth.user);
    const allChats = useSelector((state) => state.chat.currentChats);
    const currentChat = useSelector((state) => state.chat.currentChat);
    const selectedUser = useSelector((state) => state.chat.userSlected);

    const deleteChat = useSelector((state) => state.chat.deleteChat);

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
        if (!selectedUser?.id) return;

        const fetchRoom = async () => {
            try {
                const res = await api.get(`/rooms/?receiver_id=${selectedUser.id}`);

                const room = res?.data?.[0];

                if (!room) return;

                if (room?.messages?.length) {
                    dispatch(addRoom(room));
                    dispatch(addCurrentChat(room));
                }

            } catch (err) {
                console.error(err);
            }
        };

        fetchRoom();
    }, [selectedUser?.id, dispatch]);

    // Charger la room de l'utilisateur actuel 
    useEffect(() => {

        const fetchRooms = async () => {

            if (!currentUser?.id) return;

            try {
                const response = await api.get(`/rooms/?receiver_id=${currentUser?.id}`);

                if (response?.data?.length > 0) {

                    response?.data?.forEach(

                        room => {


                            if (room?.messages.length>0) {

                                dispatch(addRoom(room));
                            }
            
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

    //suppresion du room
    const handleDeleteRoom = (room) => {

        if (deleteChat === room) {
            return
        }

        dispatch(removeRoom(room))            

        dispatch(deleteRoomAsync(room));

        dispatch(addCurrentChat(null))

        dispatch(

            addMessageNotif(

                `Discussion ${selectedUser?.prenom + room?.name?.slice(10, 15)} supprimée`
            )
        );

    };

    return (

        <main className="sticky bottom-1 overflow-hidden grid grid-cols-12 mt-12  backdrop-blur-md rounded-lg mx-2 px-2 py-2 border border-gray-300 gap-2 shadow-xl">

            {/* Sidebar */}
            <section className="relative md:col-span-5 h-full overflow-y-auto border border-gray-200 rounded-lg px-2">

                <div

                    className={`
                        bg-white fixed top-0 left-0 h-full border-0  overflow_hidden  overflow-y-auto md:h-[70dvh] h-[90dvh]
                        z-20 transform transition-transform duration-300 ease-in-out  rounded-lg px-1
                        ${showSidebar ? 'translate-x-0' : '-translate-x-full'}
                        md:static md:translate-x-0 md:block
                        flex flex-col
                      `
                    }
                >


                    <TitleCompGen title={"Discussions"} />

                    {
                        (allChats?.length === 0) ?
                        (
                            <div className="text-center text-md py-6 border border-gray-50 rounded-full">
                                {t('message.nomessage')}
                            </div>
                        )
                        :
                        (
                                <ul className="mt-10 space-y-2  overflow-y-auto scrollbor_hidden ">

                                {
                                    allChats?.map(

                                        (room, index) => {

                                            const otherUserId =
                                                room.current_receiver === currentUser?.id
                                                    ? room.current_owner
                                                    : room.current_receiver;

                                            const otherUser = receivers[otherUserId] || null;

                                            return (

                                                <li
                                                    key={index}
                                                    className={`w-full flex items-center justify-between px-2 py-1 rounded-lg text-sm font-medium transition-colors
                                                    ${currentChat?.name === room?.name
                                                        ? 'bg-blue-50 text-white-800'
                                                        : 'hover:bg-gray-50'
                                                    }`}
                                                >
                                                    <button

                                                        onClick={() => {
                                                            dispatch(addAiChat(null));
                                                            dispatch(addCurrentChat(room));
                                                            if (otherUser) {
    dispatch(addUser(otherUser));
}
                                                        }}

                                                        className="flex gap-1 cursor-pointer flex-grow items-center "
                                                    >
                                                        <img

                                                            src={
                                                                otherUser?.image ||
                                                                otherUser?.photo_url
                                                            }

                                                            alt={`${otherUser?.nom || 'Moi'
                                                                } avatar`}
                                                            className="h-[60px] w-[60px] rounded-full object-cover"
                                                        />

                                                        <div className="flex leading-tight gap-1 items-center">

                                                            <span className="text-md font-medium text-gray-600">
                                                                {otherUser?.prenom?.slice(0, 20) ||
                                                                    'Prénom'}
                                                            </span>

                                                            <span className="text-xs text-gray">
                                                                {otherUser?.nom?.toLowerCase()}
                                                            </span>

                                                        </div>

                                                    </button>

                                                    <button
                                                        onClick={
                                                            () => handleDeleteRoom(room)
                                                        }
                                                        className="cursor-pointer ml-2 bg-none hover:bg-red-200 text-lg shadow-sm h-7 w-7 rounded-full"
                                                        aria-label={`Supprimer ${room.name}`}
                                                    >
                                                        ✕
                                                    </button>

                                                </li>
                                            );
                                        }
                                    )
                                }

                            </ul>
                        )
                    }

                    <AnaliesChatsWithAi />

                </div>

            </section>

             {/*Main Chat Area */}
            <section className="col-span-12 md:col-span-7  scrollbor_hidden overflow-y-hidden md:max-h-[70dvh] max-h-[90dvh] w-full">

                <div className=" flex overflow_hidden  overflow-y-auto md:h-[70dvh] h-[90dvh] w-full">

                    <ChatApp setShow={setShowSidebar} show={showSidebar} />

                </div>

            </section>
            
        </main>
    );
};

export default ChatLayout;
