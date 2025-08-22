import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ChatApp from '../pages/ChatApp';
import api from '../services/Axios';
import {
    addCurrentChat,
    addMessageNotif,
    addRoom,
    addUser,
    deleteRoomAsync
} from '../slices/chatSlice';

const ChatLayout = () => {

    const [showSidebar, setShowSidebar] = useState(false);

    const dispatch = useDispatch();

    const allChats = useSelector(state => state.chat.currentChats);

    const currentUser = useSelector(state => state.auth.user);

    const currentChat = useSelector(state => state.chat.currentChat);

    const selectedUser = useSelector(state => state.chat.userSlected);

    // 🔁 Récupérer les rooms au démarrage
    useEffect(() => {

        const fetchRooms = async () => {

            try {
                const response = await api.get('/rooms/');

                const rooms = response?.data || [];

                const userRooms = rooms.filter(

                    room =>

                        room?.current_receiver === currentUser?.id ||

                        room?.current_owner === currentUser?.id
                );

                userRooms.forEach(room => dispatch(addRoom(room)));

                // Définir automatiquement un chat si aucun sélectionné
                if (userRooms.length > 0 && !currentChat) {

                    dispatch(addCurrentChat(userRooms[0]));
                }

                ///console.log("LES ROOMS", userRooms);

            } catch (err) {

                //console.error("Erreur lors du chargement des rooms:", err);
            }
        };

        fetchRooms();

    }, [dispatch, currentUser, currentChat]);

    // 🔁 Récupérer l'utilisateur sélectionné si vide
    useEffect(() => {

        const fetchSelectedUser = async () => {

            if (!selectedUser && allChats.length > 0) {

                try {

                    const firstUserId = allChats[0]?.current_receiver;

                    const response = await api.get(`/clients/${firstUserId}/`);

                    const user = response?.data;

                    if (user) {

                        dispatch(addUser(user));
                    }
                } catch (e) {

                    ///console.error("Erreur lors de la récupération de l'utilisateur :", e);
                }
            }
        };

        fetchSelectedUser();

    }, [selectedUser, allChats, dispatch]);

    // 🔁 Si plus de chat, vider l'utilisateur sélectionné
    useEffect(() => {

        if (allChats.length === 0) {

            dispatch(addUser(null));
        }

    }, [allChats.length, dispatch]);

    // 🗑 Supprimer une room
    const handleDeleteRoom = room => {

        dispatch(addMessageNotif(`Discussion ${room?.name?.slice(5, 15)} supprimée`));

        dispatch(deleteRoomAsync(room.name));
    };

    return (

        <div

            className="container flex h-screen w-auto overflow-hidden relative"

            style={{
                backgroundColor: "var(--color-bg)",
                color: "var(--color-text)"
            }}
        >

            {/* Sidebar */}
            <div
                className={
                  `fixed top-0 left-0 h-full bg-gray-100 z-20 transform transition-transform duration-300 ease-in-out
                   ${showSidebar ? 'translate-x-0' : '-translate-x-full'}
                    md:static md:translate-x-0 md:w-1/4 md:block`
                }

                style={{
                    backgroundColor: "var(--color-bg)",
                    color: "var(--color-text)"
                }}
            >
                <div className="p-1 gap-5 pt-6">

                    <h2 className="font-bold text-gray-500 mb-6 h-3">Discussions</h2>

                    <div className="w-full h-px bg-gray-300 mb-6 mt-6" />

                    {allChats.length === 0 ? (

                        <p className="text-center text-md font-bold">Vous n'avez aucun message</p>

                    ) : (
                            <ul className="mt-5 space-y-2">

                                {allChats.map((room, index) => (

                                <li
                                    key={room.name || index}

                                    className={`flex items-center justify-between p-2 rounded-lg text-sm font-medium transition-colors

                                    ${currentChat?.name === room?.name
                                        ? 'bg-blue-500 text-white'
                                        : 'hover:bg-gray-100 text-gray-800'
                                    }`}
                                >
                                    <span

                                        onClick={() => {
                                            dispatch(addCurrentChat(room));
                                            setShowSidebar(false);
                                        }}

                                        className="flex gap-2 cursor-pointer flex-grow"
                                    >
                                        <img
                                            src={selectedUser?.image}
                                            alt={`${selectedUser?.nom || "Moi"} avatar`}
                                            className="h-7 w-7 rounded-full object-cover"
                                        />

                                        <div className="flex flex-col leading-tight">

                                            <span className="text-md font-medium text-gray-600">
                                                {selectedUser?.prenom || "Prénom"}
                                            </span>

                                            <span className="text-xs text-gray-500">
                                                {selectedUser?.nom?.toLowerCase() || "Nom"}
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
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* Toggle button for mobile */}
            <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="md:hidden fixed top-[8] border-1 right-6 z-30  text-white px-3 py-2 rounded-full shadow-md"
                aria-label="Toggle menu"
            >
                {
                    showSidebar ?
                    <svg className="w-[26px] h-[26px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="m15 19-7-7 7-7" />
                    </svg>
                    :
                    <svg className="w-[26px] h-[26px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="m9 5 7 7-7 7" />
                    </svg>
                }
            </button>

            {/* Main Chat Area */}
            <div

                className="lg:me-5 lg:pe-5 lg:ps-5 flex-1 flex flex-col overflow-hidden"

                style={{
                    backgroundColor: "var(--color-bg)",
                    color: "var(--color-text)"
                }}
            >
                <ChatApp roomName={currentChat} />

            </div>

        </div>
    );
};

export default ChatLayout;
