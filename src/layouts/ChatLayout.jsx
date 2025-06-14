import React, { useEffect, useState } from 'react';
import ChatApp from '../pages/ChatApp';
import api from '../services/Axios';

const fakeRooms = [
    { name: "general", label: "Général" },
    { name: "dev", label: "Développeurs" },
    { name: "design", label: "Design" },
    { name: "random", label: "Blabla" },
];

const ChatLayout = () => {
    const [selectedRoom, setSelectedRoom] = useState("general");
    const [showSidebar, setShowSidebar] = useState(false);

    const [rooms, setRooms] = useState(fakeRooms);

    useEffect(() => {
        //get messages in already in the selected chat
        try {
            api.get(`/rooms/?name=${selectedRoom}`).then(
                resp => {
                    console.log("MESSAGES DES ", resp?.data)

                    resp?.data?.map((el, _) =>
                        el?.messages.map(
                            (msg, _) =>

                                setRooms(prev =>
                                    [...prev,
                                        {
                                            "name": msg?.name,
                                            "sender": msg?.image,
                                            label: msg?.name
                                        }
                                    ]
                                )

                        )
                    )
                }
            )
        } catch (err) {

        }
    }, [selectedRoom]);

    return (
        <div className="flex h-screen w-auto overflow-hidden bg-white relative">

            {/* Sidebar */}
            <div className={`
        fixed top-0 left-0 h-full w-100 bg-gray-100 z-20 transform transition-transform duration-300 ease-in-out
        ${showSidebar ? "translate-x-0" : "-translate-x-full"}
        md:static md:translate-x-0 md:w-1/4 md:block
      `}>
                <div className="p-4 pt-6">
                    <h2 className="text-lg font-bold mb-4">💬 Discussions</h2>
                    <ul className="space-y-2">
                        {rooms.map((room) => (
                            <li
                                key={room.name}
                                onClick={() => {
                                    setSelectedRoom(room.name);
                                    setShowSidebar(false); // Ferme la sidebar sur mobile
                                }}
                                className={`cursor-pointer p-2 rounded-lg text-sm font-medium transition-colors
                  ${selectedRoom === room.name
                                        ? 'bg-blue-500 text-white'
                                        : 'hover:bg-gray-200 text-gray-700'}
                `}
                            >
                                {room.label}
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
                ☰
            </button>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <ChatApp roomName={selectedRoom} />
            </div>

        </div>
    );
};

export default ChatLayout;
