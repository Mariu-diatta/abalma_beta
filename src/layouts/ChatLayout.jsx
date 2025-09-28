import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ChatApp from '../pages/ChatApp';
import api from '../services/Axios';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
    addCurrentChat,
    addMessageNotif,
    addRoom,
    addUser,
    cleanAllMessageNotif,
    clearRooms,
    deleteRoomAsync,
    removeRoom,
} from '../slices/chatSlice';
import { clearCart } from '../slices/cartSlice';
import { logout } from '../slices/authSlice';
import { setCurrentNav } from '../slices/navigateSlice';

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

    const navigate = useNavigate();

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

        const fetchRoom = async () => {

            if (!selectedUser?.id) return;

            try {
                const response = await api.get(`/rooms/?receiver_id=${selectedUser?.id}`);

                const response_room = response?.data[0];

                if ((response_room?.current_receiver === currentUser?.id) && (response_room?.messages.length > 0) && (response?.data?.length > 0) ) {

                    if ((response_room?.current_receiver === currentUser?.id || response_room?.current_owner === currentUser?.id)) {

                        console.log("Romm with lenght", response_room?.messages.length)

                        dispatch(addRoom(response_room));

                        dispatch(addCurrentChat(response_room));
                    }
       

                }
            } catch (err) {

                console.error('Erreur lors du chargement des rooms:', err);

                if (err?.response?.data?.detail === "Informations d'authentification non fournies.") {

                    if (window.confirm("Votre session a expiré veullez vous reconnecter")) {

                        try {

                            dispatch(clearCart());

                            dispatch(clearRooms());

                            dispatch(cleanAllMessageNotif());

                            dispatch(logout());

                            dispatch(setCurrentNav("/logIn"))

                            return navigate("/logIn", { replace: true });



                        } catch (error) {

                            //showMessage(dispatch, { Type: "Erreur", Message: error?.message || error?.request?.response });

                        } finally {

                            //setLoading(false)
                        }
                    }
                }
            }
        };

        fetchRoom();

    }, [selectedUser?.id, dispatch, currentUser?.id, navigate]);

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

                                console.log("room with lenght:::", room?.messages.length)

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

        <div
            className="grid grid-cols-12  flex justify-center items-start mx-auto gap-2 pb-2  bg-grey-100  mb-4 fixed"
            style={{
                backgroundColor: 'var(--color-bg)',
                color: 'var(--color-text)',
            }}
        >
            {/* Sidebar */}

            <div className=" md:col-span-4">

                <div
                    className={
                        `bg-white fixed top-0 left-0 h-full bg-gray-100 z-20 transform transition-transform duration-300 ease-in-out
                        ${showSidebar ? 'translate-x-0' : '-translate-x-full'}
                        md:static md:translate-x-0  md:block`
                    }
                    style={
                        {
                            backgroundColor: 'var(--color-bg)',
                            color: 'var(--color-text)',
                        }
                    }
                >
                    <div className="p-1 gap-3 pt-6 ">

                        <h2 className="font-bold text-gray-500 mb-6 h-3">Discussions</h2>

                        {
                            (allChats.length === 0) ?
                            (
                                <p className="text-center text-md font-bold">
                                    {t('message.nomessage')}
                                </p>
                            )
                            :
                            (
                            <ul className="mt-5 space-y-2 ">

                                {
                                    allChats.map(

                                        (room, index) => {

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
                                                        ? 'bg-blue-50 text-white'
                                                        : 'hover:bg-gray-100 text-gray-800'
                                                    }`}
                                                >
                                                    <button
                                                        onClick={() => {
                                                            dispatch(addCurrentChat(room));
                                                            dispatch(addUser(whoCurrentUserChatWith))
                                                        }}
                                                        className="flex gap-1 cursor-pointer flex-grow items-center "
                                                    >
                                                        <img
                                                            src={
                                                                whoCurrentUserChatWith?.image ||
                                                                whoCurrentUserChatWith?.photo_url
                                                            }
                                                            alt={`${whoCurrentUserChatWith?.nom || 'Moi'
                                                                } avatar`}
                                                            className="h-[60px] w-[60px] rounded-full object-cover"
                                                        />

                                                        <div className="flex leading-tight gap-1 items-center">
                                                            <span className="text-md font-medium text-gray-600">
                                                                {whoCurrentUserChatWith?.prenom?.slice(0, 20) ||
                                                                    'Prénom'}
                                                            </span>
                                                            <span className="text-xs text-gray">
                                                                {whoCurrentUserChatWith?.nom?.toLowerCase()}
                                                            </span>
                                                        </div>

                                                    </button>

                                                    <button
                                                        onClick={() => handleDeleteRoom(room)}
                                                        className="cursor-pointer ml-2 text-red-600 hover:text-red-800 text-xs"
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
                        )}

                    </div>

                </div>

            </div>

             {/*Main Chat Area */}
            <div className="col-span-12 md:col-span-8  p-0  scrollbor_hidden  ">
                <div
                    className="lg:me-2 lg:pe-2 lg:ps-1 flex overflow_hidden "
                    style={{
                        backgroundColor: 'var(--color-bg)',
                        color: 'var(--color-text)',
                    }}
                >

                    <ChatApp setShow={setShowSidebar} show={showSidebar} />

                </div>
            </div>
            
        </div>
    );
};

export default ChatLayout;
