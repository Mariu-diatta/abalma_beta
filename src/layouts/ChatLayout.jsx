import React, { useEffect, useState, useCallback, useRef } from 'react';
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
import { fetchRooms } from '../utils';

const ChatLayout = () => {

    const { t } = useTranslation();

    const [showSidebar, setShowSidebar] = useState(false);

    const currentUser = useSelector((state) => state.auth.user);
    const allChats = useSelector((state) => state.chat.currentChats);
    const currentChat = useSelector((state) => state.chat.currentChat);
    const selectedUser = useSelector((state) => state.chat.userSlected);

    const deleteChat = useSelector((state) => state.chat.deleteChat);

    // Un seul cache pour les profils (owner ET receiver interrogent le même
    // endpoint /clients/{id}/ — séparer "senders" et "receivers" n'apportait
    // rien et faisait parfois rater l'affichage de l'avatar/nom selon le
    // sens de la conversation).
    const [usersCache, setUsersCache] = useState({});
    const fetchingRef = useRef(new Set());

    const dispatch = useDispatch();

    const getUserProfile = useCallback(
        async (userId) => {

            if (!userId || fetchingRef.current.has(userId)) return;

            fetchingRef.current.add(userId);

            try {
                const res = await api.get(`/clients/${userId}/`);
                const user = res?.data;

                if (user) {
                    setUsersCache((prev) => (prev[userId] ? prev : { ...prev, [userId]: user }));
                }

            } catch (e) {
                console.error(e);
            }
        },
        []
    );

    // Charger infos des users (receiver/sender) quand allChats change
    useEffect(() => {

        allChats.forEach((room) => {

            getUserProfile(room?.current_receiver);

            getUserProfile(room?.current_owner);
        });

    }, [allChats, getUserProfile]);

    // Charger la room d'un utilisateur sélectionné
    useEffect(() => {
        if (!selectedUser?.id || !currentUser?.id) return;

        const fetchRoom = async () => {
            try {
                const { data } = await api.get("/allRooms/");

                const room = (data || []).find(
                    (r) =>
                        (r?.current_owner === currentUser.id && r?.current_receiver === selectedUser.id) ||
                        (r?.current_owner === selectedUser.id && r?.current_receiver === currentUser.id)
                );

                if (!room) return;

                dispatch(addRoom(room));
                dispatch(addCurrentChat(room));
            } catch (err) {
                console.error(err);
            }
        };

        fetchRoom();
    }, [selectedUser?.id, currentUser?.id, dispatch]);

    // Charger toutes les rooms de l'utilisateur actuel (owner ou receiver)
    useEffect(() => {
        if (!currentUser?.id) return;
        fetchRooms(currentUser, dispatch, addRoom);
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

        const otherUserId =
            room.current_receiver === currentUser?.id ? room.current_owner : room.current_receiver;
        const otherUser = usersCache[otherUserId];
        const otherUserName = otherUser?.prenom || otherUser?.nom || 'cet utilisateur';

        dispatch(removeRoom(room))

        dispatch(deleteRoomAsync(room));

        if (currentChat?.pk === room?.pk) {
            dispatch(addCurrentChat(null))
        }

        dispatch(addMessageNotif(`Discussion avec ${otherUserName} supprimée`));

    };

    return (

        <main className="sticky bottom-1 border-0 overflow-hidden grid grid-cols-12 mt-12  backdrop-blur-md rounded-lg mx-2 px-2 py-2 border border-gray-300 gap-2 ">

            {/* Sidebar */}
            <section className="relative col-span-12 md:col-span-5 h-full overflow-y-auto border border-gray-200 rounded-lg px-2">

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
                                        (room) => {

                                            const otherUserId =
                                                room.current_receiver === currentUser?.id
                                                    ? room.current_owner
                                                    : room.current_receiver;

                                            const otherUser = usersCache[otherUserId] || null;
                                            const isActive = currentChat?.pk === room?.pk;

                                            return (

                                                <li
                                                    key={room?.pk}
                                                    className={`w-full flex items-center justify-between px-2 py-1 rounded-lg text-sm font-medium transition-colors
                                                    ${isActive
                                                        ? 'bg-[#eef2ff] text-[#4338ca]'
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
                                                        {(otherUser?.image || otherUser?.photo_url) ? (
                                                            <img
                                                                src={otherUser.image || otherUser.photo_url}
                                                                alt={`${otherUser?.nom || 'Utilisateur'} avatar`}
                                                                className="h-[60px] w-[60px] rounded-full object-cover"
                                                                onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }}
                                                            />
                                                        ) : (
                                                            <div
                                                                className="h-[60px] w-[60px] rounded-full flex items-center justify-center text-white font-semibold text-lg flex-shrink-0"
                                                                style={{ background: '#6366f1' }}
                                                            >
                                                                {(otherUser?.prenom?.[0] || otherUser?.nom?.[0] || '?').toUpperCase()}
                                                            </div>
                                                        )}

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
                                                        aria-label={`Supprimer la conversation avec ${otherUser?.prenom || otherUser?.nom || 'cet utilisateur'}`}
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
