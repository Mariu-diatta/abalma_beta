import React, { useRef, useEffect, useState } from 'react';
import { setCurrentNav } from '../slices/navigateSlice';
import { useDispatch, useSelector } from 'react-redux';
import { addCurrentChat, addRoom, addUser } from '../slices/chatSlice';
import { useNavigate } from "react-router";
import { getMediaUrl, getOrCreateRoom } from '../utils';
import { showMessage } from './AlertMessage';

const OwnerPopover = ({ owner, onClose }) => {

    const ref = useRef();

    let navigate = useNavigate();

    const dispatch = useDispatch()

    const currentUser = useSelector(state => state.auth.user)

    const [loadingChat, setLoadingChat] = useState(false);

    const nomLength = owner?.nom?.length || 0;

    const prenomLength = owner?.prenom?.length || 0;

    const maxLength = Math.max(nomLength, prenomLength);

    const calculatedWidth = `${maxLength * 0.6 + 3}rem`; // ou px/rem adapté à la police


    useEffect(() => {

        const handleClickOutside = (event) => {

            if (ref.current && !ref.current.contains(event.target)) {

                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => document.removeEventListener('mousedown', handleClickOutside);

    }, [onClose]);

    // Ouvre (ou crée) la conversation avec ce fournisseur puis navigue vers
    // la messagerie. getOrCreateRoom cherche d'abord une conversation
    // existante avant d'en créer une — fini les conversations "perdues"
    // quand on recontacte quelqu'un à qui on a déjà écrit.
    const chatWithOwner = async () => {

        if (loadingChat) return;

        setLoadingChat(true);

        dispatch(addUser(owner));

        try {

            const room = await getOrCreateRoom({ currentUser, otherUser: owner });

            if (room) {
                dispatch(addRoom(room));
                dispatch(addCurrentChat(room));
                dispatch(setCurrentNav("message-inbox"));
                navigate("/message-inbox");
            } else {
                showMessage(dispatch, {
                    Type: "Erreur",
                    Message: "Impossible d'ouvrir la conversation pour le moment.",
                });
            }

        } finally {
            setLoadingChat(false);

        }
    }

    if (!owner || !currentUser) return null

    return (

        <span
            ref={ref}

            className="absolute left-0 mt-0 rounded-xl border border-white p-1 shadow-xl animate-fade-in bg-gray-200"

            style={
                {

                    width: calculatedWidth,
                }
            }
        >
            <div className="flex items-center gap-3 ">

                <img

                    src={getMediaUrl(owner?.image) || getMediaUrl(owner?.photo_url)}

                    alt={owner?.nom || 'Fournisseur'}

                    className="h-6 w-6 rounded-full object-cover shadow-sm"
                />

                <div>

                    <p className="text-sm font-semibold text-gray-800">{owner?.nom || 'Nom inconnu'}</p>

                    <p className="text-xs text-gray-500">{owner?.prenom || ''}</p>

                </div>

            </div>

            <div className="flex gap-1 z-100 w-50 style-bg">

                {/* Voir le profil */}
                <button

                    onClick={() => {

                        dispatch(addUser(owner));

                        dispatch(setCurrentNav("user-profil-contact"));

                        navigate("/user-profil-contact")

                        onClose();
                    }}

                    className=" rounded-md text-gray-700 hover:bg-gray-50 dark:text-white cursor-pointer z-50"

                    title="Voir le profil"
                >
                    <svg
                        className="w-6 h-6"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            fillRule="evenodd"
                            d="M5 8C6.8 6.3 9.2 5 12 5s5.2 1.3 7 3c1.1 1 1.9 2 2.3 2.8.2.3.3.7.3 1.2s-.1.9-.3 1.2c-.4.8-1.2 1.8-2.3 2.8-1.8 1.7-4.2 3-7 3s-5.2-1.3-7-3C3.9 14 3.1 13 2.7 12.2c-.2-.3-.3-.7-.3-1.2s.1-.9.3-1.2C3.1 9.9 3.9 9 5 8Zm7 7a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                            clipRule="evenodd"
                        />

                    </svg>

                </button>

                {/* Écrire un message */}
                {
                    !(currentUser?.id === owner?.id) &&
                    <button

                        onClick={
                            () => chatWithOwner()
                        }

                        disabled={loadingChat}

                        className="p-1.5 rounded-md text-gray-700 hover:bg-gray-50 dark:text-white cursor-pointer z-50 disabled:opacity-50"

                        title="Écrire un message"
                    >
                        {loadingChat ? (
                            <svg className="w-6 h-6 animate-spin text-[#6366f1]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                            </svg>
                        ) : (
                            <svg
                                className="w-6 h-6"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M4.9 4c-.5 0-.9.2-1.3.6C3.2 5 3 5.5 3 6v9c0 .5.2 1 .6 1.3.4.4.8.6 1.3.6h4.6l2.4 3.2a1 1 0 0 0 1.6 0l2.4-3.2h4.6c.5 0 .9-.2 1.3-.6.4-.4.6-.8.6-1.3V6c0-.5-.2-1-.6-1.4-.4-.4-.8-.6-1.3-.6H4.9ZM8 8a1 1 0 0 0 0 2h8a1 1 0 1 0 0-2H8Zm0 3a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2H8Z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        )}

                    </button>
                }


            </div>

        </span>
    );
};

export default OwnerPopover;
