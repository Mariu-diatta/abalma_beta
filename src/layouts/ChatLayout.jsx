import React, { useEffect, useState, useCallback, useRef, useLayoutEffect } from 'react';
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

import { addAiChat } from '../slices/aiChatSlice';

import TitleCompGen from '../components/TitleComponentGen';
import AnaliesChatsWithAi from '../pages/ChatWithAi';
import {fetchRooms } from '../utils';
import ButtonToggleChatsPanel from '../components/ButtonHandleChatsPanel';

// Doit correspondre au padding-bottom du <section> dans VerticalNavbar
// (actuellement style={{ padding: "0px 0 40px" }}). Si cette valeur change
// un jour côté VerticalNavbar, mettez-la aussi à jour ici.
const NAVBAR_BOTTOM_PADDING = 40;

const ChatLayout = () => {

    const { t } = useTranslation();

    const [showSidebar, setShowSidebar] = useState(false);

    const currentUser = useSelector((state) => state.auth.user);
    const allChats = useSelector((state) => state.chat.currentChats);
    const currentChat = useSelector((state) => state.chat.currentChat);
    const selectedUser = useSelector((state) => state.chat.userSlected);
    const deleteChat = useSelector((state) => state.chat.deleteChat);

    const [usersCache, setUsersCache] = useState({});
    const fetchingRef = useRef(new Set());

    const dispatch = useDispatch();

    // ── Hauteur dynamique : remplit tout l'espace restant sous le header/bannière,
    // comme WhatsApp Web, quelle que soit la hauteur de ce qui se trouve au-dessus ──
    const containerRef = useRef(null);
    const [height, setHeight] = useState('100dvh');

    useLayoutEffect(() => {
        const updateHeight = () => {
            if (!containerRef.current) return;
            const top = containerRef.current.getBoundingClientRect().top;
            setHeight(`calc(100dvh - ${top}px - ${NAVBAR_BOTTOM_PADDING}px)`);
        };

        updateHeight();

        window.addEventListener('resize', updateHeight);
        // Recalcule aussi si la bannière d'alerte ou la barre du compte
        // apparaît/disparaît ou change de taille après le montage.
        const observer = new ResizeObserver(updateHeight);
        observer.observe(document.body);

        return () => {
            window.removeEventListener('resize', updateHeight);
            observer.disconnect();
        };
    }, []);

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

    useEffect(() => {
        allChats.forEach((room) => {
            getUserProfile(room?.current_receiver);
            getUserProfile(room?.current_owner);
        });
    }, [allChats, getUserProfile]);

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

    useEffect(() => {
        if (!currentUser?.id) return;
        fetchRooms(currentUser, dispatch, addRoom);
    }, [dispatch, currentUser]);

    useEffect(() => {
        if (allChats.length === 0) {
            dispatch(addUser(null));
        }
    }, [allChats.length, dispatch]);

    const handleDeleteRoom = (room) => {

        if (deleteChat === room) {
            return;
        }

        const otherUserId =
            room.current_receiver === currentUser?.id ? room.current_owner : room.current_receiver;
        const otherUser = usersCache[otherUserId];
        const otherUserName = otherUser?.prenom || otherUser?.nom || 'cet utilisateur';

        dispatch(removeRoom(room));
        dispatch(deleteRoomAsync(room));

        if (currentChat?.pk === room?.pk) {
            dispatch(addCurrentChat(null));
        }

        dispatch(addMessageNotif(`Discussion avec ${otherUserName} supprimée`));
    };

    return (
        <main
            ref={containerRef}
            style={{ height }}
            className="relative flex w-full min-w-0 flex-col gap-3 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 p-2 md:flex-row md:p-3 pt-[5dvh]"
        >

            {/* Sidebar : overlay plein écran sur mobile, colonne fixe sur desktop */}
            <div
                className={`
                    absolute inset-0 z-20 flex h-full w-full min-w-0 flex-col overflow-hidden
                    rounded-2xl border border-slate-200/70 bg-white/95 shadow-sm shadow-slate-200/60 backdrop-blur-md
                    transform transition-transform duration-300 ease-in-out
                    ${showSidebar ? 'translate-x-0' : '-translate-x-full'}
                    md:static md:inset-auto md:h-full md:w-[300px] md:flex-shrink-0 md:translate-x-0
                `}
            >
     
                <div className="flex items-center gap-2 border-b border-slate-100 px-4 pb-2 pt-4">
                    <div className="min-w-0 flex-1">
                        <TitleCompGen title={"Discussions"} />
                    </div>
                    <ButtonToggleChatsPanel showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
                </div>

                {(allChats?.length === 0) ? (
                    <div className="flex flex-1 items-center justify-center px-6">
                        <p className="text-center text-sm text-slate-400">
                            {t('message.nomessage')}
                        </p>
                    </div>
                ) : (
                    <ul className="flex-1 space-y-1 overflow-y-auto px-2 py-3 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-200">

                        {allChats?.map((room) => {

                            const otherUserId =
                                room.current_receiver === currentUser?.id
                                    ? room.current_owner
                                    : room.current_receiver;

                            const otherUser = usersCache[otherUserId] || null;
                            const isActive = currentChat?.pk === room?.pk;

                            return (
                                <li
                                    key={room?.pk}
                                    className={`group flex w-full min-w-0 items-center justify-between gap-2 rounded-xl px-2.5 py-2 transition-colors
                                        ${isActive ? 'bg-indigo-50 ring-1 ring-indigo-100' : 'hover:bg-slate-50'}`}
                                >
                                    <button
                                        onClick={() => {
                                            dispatch(addAiChat(null));
                                            dispatch(addCurrentChat(room));
                                            if (otherUser) {
                                                dispatch(addUser(otherUser));
                                            }
                                        }}
                                        className="flex min-w-0 flex-1 items-center gap-3 text-left"
                                    >
                                        {(otherUser?.image || otherUser?.photo_url) ? (
                                            <img
                                                src={otherUser.image || otherUser.photo_url}
                                                alt={`${otherUser?.nom || 'Utilisateur'} avatar`}
                                                className="h-11 w-11 flex-shrink-0 rounded-full object-cover shadow-sm ring-2 ring-white"
                                                onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }}
                                            />
                                        ) : (
                                            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 font-semibold text-white shadow-sm">
                                                {(otherUser?.prenom?.[0] || otherUser?.nom?.[0] || '?').toUpperCase()}
                                            </div>
                                        )}

                                        <div className="min-w-0 leading-tight">
                                            <p className={`truncate text-sm font-semibold ${isActive ? 'text-indigo-700' : 'text-slate-700'}`}>
                                                {otherUser?.prenom?.slice(0, 20) || 'Prénom'}
                                            </p>
                                            <p className="truncate text-xs text-slate-400">
                                                {otherUser?.nom?.toLowerCase()}
                                            </p>
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => handleDeleteRoom(room)}
                                        className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-slate-400 opacity-0 transition-all duration-150 hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                                        aria-label={`Supprimer la conversation avec ${otherUser?.prenom || otherUser?.nom || 'cet utilisateur'}`}
                                    >
                                        ✕
                                    </button>
                                </li>
                            );
                        })}

                    </ul>
                )}

                <AnaliesChatsWithAi />


            </div>

            {/* Zone de chat principale */}
            <section className="h-full min-h-0 w-full min-w-0 flex-1 overflow-hidden">
                <div className="h-full min-w-0 overflow-hidden rounded-2xl border border-slate-200/70 bg-white/90 shadow-sm shadow-slate-200/60 backdrop-blur-md">
                    <ChatApp setShow={setShowSidebar} show={showSidebar} />
                </div>
            </section>

        </main>
    );
};

export default ChatLayout;