import React, { useEffect, useState } from 'react';
import ChatApp from '../pages/ChatApp';
import api from '../services/Axios';
import { addRoom, removeRoom } from '../slices/chatSlice';
import { useDispatch, useSelector } from 'react-redux';

const ChatLayout = () => {

    const [showSidebar, setShowSidebar] = useState(false);

    const allRooms = useSelector(state => state.chat.currentChats)

    const newroom = useSelector(state => state.chat.newChat)

    const [selectedRoom, setSelectedRoom] = useState(newroom);

    const [rooms, setRooms] = useState(allRooms);

    const dispatch = useDispatch()


    useEffect(() => {


        const fetchRooms = async () => {

            try {

                const resp = await api.get(`/rooms/`);

                console.log("rooms", resp?.data)

                resp?.data.map((el, _) => {

                    dispatch(addRoom({ "name": el?.name, "label": el?.name, "pk": el?.pk }));

                })


            } catch (err) {

            }
        }

        fetchRooms()

    }, [newroom])

    useEffect(() => {

        const fetchRoom = async () => {
            try {
                const resp = await api.get(`/rooms/?name=${selectedRoom}`);
                const data = resp?.data;

                if (!data || data.length === 0) return;

                const roomName = data[0]?.name;
                const roomLabel = data[0]?.label || roomName;

                dispatch(addRoom({
                    name: roomName,
                    label: roomLabel,
                }));

                const alreadyExists = rooms.some(r => r.name === roomName);

                if (!alreadyExists) {
                    setRooms(prev => [
                        ...prev,
                        {
                            name: roomName,
                            label: roomLabel,
                        },
                    ]);
                }
            } catch (error) {
                console.error("Erreur de récupération de la room :", error);
            }
        };

        fetchRoom();

    }, [selectedRoom]);

    return (
        <div className="flex h-screen w-auto overflow-hidden bg-white relative">
            {/* Sidebar */}
            <div className={`fixed top-0 left-0 h-full w-100 bg-gray-100 z-20 transform transition-transform duration-300 ease-in-out
                ${showSidebar ? "translate-x-0" : "-translate-x-full"}
                md:static md:translate-x-0 md:w-1/4 md:block`}>
                <div className="p-4 pt-6">
                    <h2 className="text-lg font-bold mb-4">💬 Discussions</h2>
                    <ul className="space-y-2">
                        {allRooms.map((room) => (
                            <li
                                key={room.name}
                                className={`
                                flex items-center justify-between p-2 rounded-lg text-sm font-medium transition-colors
                                ${selectedRoom === room.name ? 'bg-blue-500 text-white' : 'hover:bg-gray-100 text-gray-800'}
                              `}
                            >
                                <span
                                    onClick={() => {
                                        setSelectedRoom(room.name);
                                        setShowSidebar(false); // Ferme la sidebar sur mobile
                                    }}
                                    className="cursor-pointer flex-grow"
                                >
                                    {room.label}
                                </span>

                                <button
                                    onClick={() => dispatch(removeRoom({ name: room.name,pk:room?.pk }))}
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
                {showSidebar ? "X" :"☰"}
            </button>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <ChatApp roomName={selectedRoom} />
            </div>
        </div>
    );
};

export default ChatLayout;
