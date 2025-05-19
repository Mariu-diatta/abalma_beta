import React, { useState } from 'react';

const MessageCard = () => {
    const initialMessages = [
        {
            id: 1,
            sender: 'Bonnie Green',
            time: '11:46',
            content: 'Check out this open-source UI component library...',
            url: 'https://github.com/themesberg/flowbite',
            imageUrl: 'https://flowbite.com/docs/images/og-image.png',
            status: 'new', // could be 'new', 'read', or 'deleted'
        },
        {
            id: 2,
            sender: 'Alice',
            time: '12:10',
            content: 'Here is another great resource.',
            url: '',
            imageUrl: '',
            status: 'read',
        },
        {
            id: 3,
            sender: 'Alice',
            time: '12:10',
            content: 'Here is another great resource.',
            url: '',
            imageUrl: '',
            status: 'read',
        },
        {
            id: 4,
            sender: 'Alice',
            time: '12:10',
            content: 'Here is another great resource.',
            url: '',
            imageUrl: '',
            status: 'read',
        },
        {
            id: 5,
            sender: 'Alice',
            time: '12:10',
            content: 'Here is another great resource.',
            url: '',
            imageUrl: '',
            status: 'read',
        },
    ];

    const [messages, setMessages] = useState(initialMessages);
    const [filter, setFilter] = useState('all');
    const [showDropdownAll, setShowDropdownAll] = useState(false);
    const [activeDropdownId, setActiveDropdownId] = useState(null);

    const filteredMessages = messages.filter((msg) => {
        if (filter === 'all') return msg.status !== 'deleted';
        return msg.status === filter;
    });

    const deleteMessage = (id) => {
        setMessages((prev) =>
            prev.map((msg) =>
                msg.id === id ? { ...msg, status: 'deleted' } : msg
            )
        );
        setActiveDropdownId(null);
    };

    const handleFilter = (status) => {
        setFilter(status === 'Nouveaux' ? 'new' : status === 'Lus' ? 'read' : 'deleted');
        setShowDropdownAll(false);
    };

    return (
        <div className="flex flex-col justify-center items-center gap-5 ">
            {/* Header + Filter Dropdown */}
            <div className="flex items-center mb-6 space-x-4 relative ">
                <svg className="w-7 h-8 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 576 512">
                    <path d="M64 0C28.7 0 0 28.7 0 64L0 352c0 35.3 28.7 64 64 64l96 0 0 80c0 6.1 3.4 11.6 8.8 14.3s11.9 2.1 16.8-1.5L309.3 416 448 416c35.3 0 64-28.7 64-64l0-288c0-35.3-28.7-64-64-64L64 0z" />
                </svg>

                <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Messages</h2>

                <button onClick={() => setShowDropdownAll(!showDropdownAll)} className="p-2 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-900 rounded-lg">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 4 15">
                        <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                    </svg>
                </button>

                {showDropdownAll && (
                    <div className="absolute right-0 top-10 p-2 bg-white dark:bg-gray-700 rounded-lg shadow-lg w-40 z-100">
                        <button onClick={() => setShowDropdownAll(false)} className="absolute right-2 top-1 text-sm">X</button>
                        <ul className="mt-5 text-sm text-gray-700 dark:text-gray-200">
                            {['Nouveaux', 'Lus', 'Supprimés'].map((item, i) => (
                                <li key={i}>
                                    <button
                                        onClick={() => handleFilter(item)}
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                                    >
                                        {item}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Message Cards */}
            {filteredMessages.map((msg) => (
                <div key={msg.id} className="flex items-start justify-center gap-2.5 relative w-full">
                    <img className="w-8 h-8 rounded-full" src="/docs/images/people/profile-picture-3.jpg" alt="Profile" />
                    <div className="flex flex-col w-full max-w-[320px] p-4 bg-gray-100 dark:bg-gray-700 rounded-e-xl rounded-es-xl">
                        <div className="flex items-center space-x-2">
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">{msg.sender}</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{msg.time}</span>
                        </div>
                        <p className="text-sm text-gray-900 dark:text-white py-2.5">{msg.content}</p>
                        {msg.url && (
                            <a href={msg.url} className="text-blue-700 dark:text-blue-500 underline break-all text-sm font-medium">{msg.url}</a>
                        )}
                        {msg.imageUrl && (
                            <a href="#" className="bg-gray-50 dark:bg-gray-600 rounded-xl p-4 mb-2 block hover:bg-gray-200 dark:hover:bg-gray-500">
                                <img src={msg.imageUrl} alt="Preview" className="rounded-lg mb-2" />
                                <span className="text-sm font-medium text-gray-900 dark:text-white block">GitHub Preview</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">github.com</span>
                            </a>
                        )}
                        <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">{msg.status}</span>
                    </div>

                    {/* Message Actions Dropdown */}
                    <button
                        onClick={() => setActiveDropdownId(activeDropdownId === msg.id ? null : msg.id)}
                        className="p-2 text-sm text-gray-900 bg-white dark:bg-gray-900 rounded-lg"
                    >
                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 4 15">
                            <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                        </svg>
                    </button>

                    {activeDropdownId === msg.id && (
                        <div className="absolute right-0 top-0 mt-2 p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm w-40 z-10">
                            <button onClick={() => setActiveDropdownId(null)} className="absolute right-2 top-1 text-sm">X</button>
                            <ul className="mt-5 text-sm text-gray-700 dark:text-gray-200">
                                {['Reply', 'Forward', 'Copy', 'Report', 'Delete'].map((item, i) => (
                                    <li key={i}>
                                        <button
                                            onClick={item === 'Delete' ? () => deleteMessage(msg.id) : () => { }}
                                            className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                                        >
                                            {item}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default MessageCard;
