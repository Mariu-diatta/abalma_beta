import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ChatApp from '../pages/ChatApp';
import api from '../services/Axios';
import { addCurrentChat, addMessageNotif, addRoom, removeRoom } from '../slices/chatSlice';

const ChatLayout = () => {
    const [showSidebar, setShowSidebar] = useState(false);
    const dispatch = useDispatch();

    const allChats = useSelector(state => state.chat.currentChats);
    const currentUser = useSelector(state => state.auth.user);
    const currentChat = useSelector(state => state.chat.currentChat);

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

                userRooms.forEach(room => {
                    dispatch(addRoom(room));
                });

                // Optionnel : définir automatiquement le premier chat
                if (userRooms.length > 0 && !currentChat) {
                    dispatch(addCurrentChat(userRooms[0]));
                }

                console.log("LES ROOMS", userRooms);
            } catch (err) {
                console.error("Erreur lors du chargement des rooms:", err);
            }
        };

        fetchRooms();

    }, [dispatch, currentUser, currentChat]);

    const handleDeleteRoom = room => {

        dispatch(addMessageNotif(`Discussion ${room?.name.slice(5, 15)} supprimée`));

        return dispatch(removeRoom(room?.name));
    };

    return (
        <div className="flex h-screen w-auto overflow-hidden bg-white relative">
            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 h-full bg-gray-100 z-20 transform transition-transform duration-300 ease-in-out
        ${showSidebar ? 'translate-x-0' : '-translate-x-full'}
        md:static md:translate-x-0 md:w-1/4 md:block`}
            >
                <div className="p-4 pt-6">
                    <h2 className="text-lg font-bold mb-4">💬 Discussions</h2>

                    {allChats.length === 0 ? (
                        <p className="text-center text-md font-bold">Vous n'avez aucun message</p>
                    ) : (
                        <ul className="space-y-2">
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
                                        className="cursor-pointer flex-grow"
                                    >
                                        {room?.name?.slice(5, 15)}
                                    </span>

                                    <button
                                        onClick={() =>handleDeleteRoom(room)}
                                        className="ml-2 text-red-600 hover:text-red-800 text-xs"
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
                className="md:hidden fixed top-4 right-4 z-30 bg-blue-500 text-white px-3 py-2 rounded-full shadow-md"
                aria-label="Toggle menu"
            >
                {showSidebar ? "X" : "☰"}
            </button>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <ChatApp roomName={currentChat} />
            </div>
        </div>
    );
};

export default ChatLayout;
