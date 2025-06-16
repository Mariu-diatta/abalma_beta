import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setCurrentNav } from '../slices/navigateSlice';
import { useDispatch, useSelector } from 'react-redux';
import { addUser, newRoom } from '../slices/chatSlice';
import api from '../services/Axios';

export async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

const OwnerPopover = ({ owner, onClose }) => {

    const ref = useRef();

    const dispatch = useDispatch()

    const currentUser=useSelector(state=>state.auth.user)

    useEffect(() => {

        const handleClickOutside = (event) => {

            if (ref.current && !ref.current.contains(event.target)) {

                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => document.removeEventListener('mousedown', handleClickOutside);

    }, [onClose]);

    const chatWithOwner = () => {

        hashPassword(owner?.telephone).then(

            res => {

                try {
                    api.post('rooms/',

                        {
                            "name": `room_${owner?.nom}_${res}`,
                            "current_owner": currentUser?.id,
                            "current_receiver": owner?.id
                        }

                    ).then(

                        resp => console.log("ERREUR DE LA CREATION DU CHAT", resp)

                    ).catch(

                        err => console.log("ERREUR DE LA CREATION DU CHAT", err)
                    )

                } catch (err) {

                    console.log("ERREUR DE LA CREATION DU CHAT", err)
                }

                dispatch(newRoom({ name: `room_${owner?.nom}_${res}` }))
            }

        )

        dispatch(addUser(owner))

        dispatch(setCurrentNav("message_inbox"))
    }

    return (
        <div
            ref={ref}
            className="absolute left-0 mt-3 w-auto p-3 rounded-xl border border-gray-200 bg-white p-1 shadow-xl z-100 animate-fade-in"
        >
            <div className="flex items-center gap-3 ">
                <img
                    src={owner.image}
                    alt={owner.nom || 'Fournisseur'}
                    className="h-6 w-6 rounded-full object-cover shadow-sm"
                />
                <div>
                    <p className="text-sm font-semibold text-gray-800">{owner.nom || 'Nom inconnu'}</p>
                    <p className="text-xs text-gray-500">{owner.prenom || ''}</p>
                </div>
            </div>

            <div className="flex gap-1 z-100 ">

                {/* Voir le profil */}
                <button
                    onClick={() => {
                        dispatch(addUser(owner));
                        dispatch(setCurrentNav("user_profil_product"));
                        chatWithOwner()
                        onClose();
                    }}
                    className="p-1.5 rounded-md text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800 cursor-pointer"
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
                <button
                    onClick={() => chatWithOwner()}
                    className="p-1.5 rounded-md text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800 cursor-pointer"
                    title="Écrire un message"
                >
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
                </button>


            </div>

        </div>
    );
};

const OwnerAvatar = ({ owner }) => {

    const [showPopover, setShowPopover] = useState(false);

    const containerRef = useRef(null);

    return (

        <div className="relative inline-block" ref={containerRef}>

            <img
                src={owner.image}
                alt={owner.nom || 'Fournisseur'}
                className="h-8 w-8 rounded-full object-cover cursor-pointer ring-1 ring-gray-300 hover:ring-blue-500 transition"
                title={owner.nom}
                onClick={() => setShowPopover((prev) => !prev)}
            />

            {
                owner?.is_connected &&
                <span className="absolute -right-0.5 -top-0.5 block h-[14px] w-[14px] rounded-full border-[2.3px] border-white bg-[#219653] dark:border-dark"></span>
            }

            {showPopover && (

                <OwnerPopover owner={owner} onClose={() => setShowPopover(false)} />
            )}
        </div>
    );
};

export default OwnerAvatar;
