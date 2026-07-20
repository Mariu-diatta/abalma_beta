import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ButtonToggleChatsPanel = ({ showSidebar, setShowSidebar }) => {
    return (
        <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-full bg-indigo-50 text-indigo-500 hover:bg-indigo-100 transition-colors flex-shrink-0"
            aria-label="Toggle menu"
        >
            {showSidebar ? (
                <ChevronLeft size={20} strokeWidth={2} />
            ) : (
                <ChevronRight size={20} strokeWidth={2} />
            )}
        </button>
    );
};

export default ButtonToggleChatsPanel;