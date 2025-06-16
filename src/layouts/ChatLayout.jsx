import React, { useEffect, useState } from 'react';
import ChatApp from '../pages/ChatApp';
import api from '../services/Axios';
import { addCUrrentChat, addRoom, removeRoom } from '../slices/chatSlice';
import { useDispatch, useSelector } from 'react-redux';


const ChatLayout = () => {

    const [showSidebar, setShowSidebar] = useState(false);

    const allRooms = useSelector(state => state.chat.currentChats)

    const newroom = useSelector(state => state.chat.newChat) 

    const currentUser = useSelector(state => state.auth.user)

    const currentChat = useSelector(state => state.chat.currentChat)

    const dispatch = useDispatch()


    useEffect(() => {

        const fetchRooms = async () => {

            try {

                await api.get(`/rooms/`).then(

                    response => {

                        console.log("LES ROOMS", response?.data)

                        response?.data.map(

                            (room, _) => {

                                if (room?.current_receiver === currentUser?.id || room?.current_owner === currentUser?.id) {

                                    dispatch(addRoom(room));

                                }

                            }
                        )

                    }

                )

            } catch (err) {

            }
        }

        fetchRooms()

    }, [newroom])



    return (
        <div className="flex h-screen w-auto overflow-hidden bg-white relative">

            {/* Sidebar */}
            <div className={`fixed top-0 left-0 h-full w-100 bg-gray-100 z-20 transform transition-transform duration-300 ease-in-out
                ${showSidebar ? "translate-x-0" : "-translate-x-full"}
                md:static md:translate-x-0 md:w-1/4 md:block`}>

                <div className="p-4 pt-6">

                    <h2 className="text-lg font-bold mb-4">💬 Discussions</h2>

                    {allRooms.length === 0 && (
                        <h2 className="text-center items-center text-md font-bold mb-4">
                            Vous n'avez aucun message
                        </h2>
                    )}

                    <ul className="space-y-2">

                        {allRooms.map((room) => (

                            <li
                                key={room.name}
                                className={`
                                flex items-center justify-between p-2 rounded-lg text-sm font-medium transition-colors
                                ${currentChat === room.name ? 'bg-blue-500 text-white' : 'hover:bg-gray-100 text-gray-800'}
                              `}
                            >
                                <span

                                    onClick={() => {
                                        dispatch(addCUrrentChat(room.name))
                                        setShowSidebar(false); // Ferme la sidebar sur mobile
                                    }}

                                    className="cursor-pointer flex-grow"
                                >
                                    {room.name?.slice(5, 15)}

                                </span>

                                <button
                                    onClick={() =>
                                        {
                                            dispatch(removeRoom(room))
                                            dispatch(addCUrrentChat(""))
                                        }
                                    }
                                    className="ml-2 text-red-600 hover:text-red-800 text-xs"
                                    aria-label={`Supprimer ${room.label}`}
                                >
                                    ✕
                                </button>
                            </li>
                        ))}
                    </ul>

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
