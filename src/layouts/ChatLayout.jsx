import React, { useState } from 'react';
import ChatApp from '../pages/ChatApp';

const fakeRooms = [
  { name: "general", label: "Général" },
  { name: "dev", label: "Développeurs" },
  { name: "design", label: "Design" },
  { name: "random", label: "Blabla" },
];

const ChatLayout = () => {
  const [selectedRoom, setSelectedRoom] = useState("general");
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden relative bg-white">

      {/* Sidebar */}
      <div className={`
        fixed z-20 top-0 left-0 h-full w-64 bg-gray-100 border-r transform transition-transform duration-300 ease-in-out
        ${showSidebar ? "translate-x-0" : "-translate-x-full"}
        md:static md:translate-x-0 md:w-1/4
      `}>
        <div className="p-4 pt-6">
          <h2 className="text-lg font-bold mb-4">💬 Discussions</h2>
          <ul className="space-y-2">
            {fakeRooms.map((room) => (
              <li
                key={room.name}
                onClick={() => {
                  setSelectedRoom(room.name);
                  setShowSidebar(false); // close sidebar on mobile
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

      {/* Main Chat area */}
      <div className="flex-1 h-full flex flex-col overflow-hidden md:ml-0">
        <ChatApp roomName={selectedRoom} />
      </div>
    </div>
  );
};

export default ChatLayout;
