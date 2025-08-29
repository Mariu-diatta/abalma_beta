import React, { useState, useRef, useEffect } from 'react';
import { setCurrentNav } from '../slices/navigateSlice';
import { useDispatch, useSelector } from 'react-redux';
import { addCurrentChat, addRoom, addUser, newRoom } from '../slices/chatSlice';
import api from '../services/Axios';
import { useNavigate } from "react-router";


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

    let navigate = useNavigate();

    const dispatch = useDispatch()

    const currentUser = useSelector(state => state.auth.user)

    const selectedProductOwner = useSelector(state => state.chat.userSlected)

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

    const chatWithOwner = async () => {

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

                        resp => {

                            dispatch(newRoom({ name: `room_${owner?.nom}_${res}` }))

                            dispatch(addCurrentChat(`room_${owner?.nom}_${res}`))

                        }

                    ).catch(

                        err => {

                            const errorMsg = err?.response?.data;

                            console.error("Erreur lors de la création du chat:", errorMsg);

                            const roomAlreadyExists =
                                errorMsg?.name?.[0]?.includes("already exists") ||
                                errorMsg?.current_receiver?.[0]?.includes("already exists");
                                errorMsg?.current_owner?.[0]?.includes("already exists");

                            if (roomAlreadyExists) {

                                const ownerPhone = selectedProductOwner?.telephone;

                                const ownerName = owner?.nom;

                                if (ownerPhone && ownerName) {

                                    hashPassword(ownerPhone)

                                        .then(hashed => {

                                            const roomName = `room_${ownerName}_${hashed}`;

                                            console.log("le room", roomName);

                                            dispatch(addRoom({ name: roomName }));

                                            dispatch(addCurrentChat({name:roomName}));

                                        })
                                        .catch(hashErr => {

                                            console.error("Erreur lors du hachage du numéro de téléphone:", hashErr);
                                        });
                                } else {
                                    console.warn("Données manquantes pour créer une room de fallback.");
                                }

                            } else {
                                console.error("Erreur inconnue lors de la création du chat:", errorMsg);
                            }
                        }
                    )

                } catch (err) {

                    console.log("ERREUR DE LA CREATION DU CHAT", err)
                }

                dispatch(newRoom({ name: `room_${owner?.nom}_${res}` }))

            }

        )

        dispatch(addUser(owner))

        dispatch(setCurrentNav("message_inbox"))

        return navigate("/message_inbox")
    }

    if (!owner) return null

    return (

        <span
            ref={ref}

            className="absolute left-0 mt-0 rounded-xl border border-gray-200 opacity-100 p-1 shadow-xl animate-fade-in z-[9999]"

            style={
                {

                    backgroundColor: "var(--color-bg)",

                    color: "var(--color-text)",

                    width: calculatedWidth
                }
            }
        >
            <div className="flex items-center gap-3 ">

                <img

                    src={owner?.image}

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

                        dispatch(setCurrentNav("user_profil_product"));

                        navigate("/user_profil")

                        onClose();
                    }}

                    className=" rounded-md text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800 cursor-pointer"

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

                            () => {
                                chatWithOwner();
                            }
                        }

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
                }


            </div>

        </span>
    );
};

const OwnerAvatar = ({ owner }) => {

    const [showPopover, setShowPopover] = useState(false);

    const containerRef = useRef(null);

    if(!owner) return 

    return (

        <div className="relative inline-block " ref={containerRef}>

            {
                owner?.image ?
                    <img

                        src={owner?.image}

                        alt={owner?.nom || 'Fournisseur'}

                        className="h-6 w-6 rounded-full object-cover cursor-pointer ring-1 ring-gray-300 hover:ring-blue-500 transition z-[2999]"

                        title={owner?.nom}

                        onClick={() => {

                            setShowPopover((prev) => !prev);
                        }}
                    />
                    :
                    <svg
                        className="w-6 h-6 text-gray-800 dark:text-white cursor-pointer"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"

                        title={owner?.nom}

                        onClick={() => {

                            setShowPopover((prev) => !prev);

                        }}

                    >
                        <path
                            fillRule="evenodd"
                            d="M12 20a7.966 7.966 0 0 1-5.002-1.756l.002.001v-.683c0-1.794 1.492-3.25 3.333-3.25h3.334c1.84 0 3.333 1.456 3.333 3.25v.683A7.966 7.966 0 0 1 12 20ZM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10c0 5.5-4.44 9.963-9.932 10h-.138C6.438 21.962 2 17.5 2 12Zm10-5c-1.84 0-3.333 1.455-3.333 3.25S10.159 13.5 12 13.5c1.84 0 3.333-1.455 3.333-3.25S13.841 7 12 7Z"
                            clipRule="evenodd"
                        />
                    </svg>
            }

            {
                owner?.is_connected &&

                <span className="absolute -right-0.5 -top-0.5 block h-[14px] w-[14px] rounded-full border-[2.3px] border-white bg-[#219653] dark:border-dark"></span>
            }

            {
                showPopover && (

                    <OwnerPopover owner={owner} onClose={() => setShowPopover(false)} />
                )
            }
        </div>
    );
};

export default OwnerAvatar;
