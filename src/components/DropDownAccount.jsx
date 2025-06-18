import React, { useEffect, useRef, useState } from "react";
import { useNavigate} from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import {setCurrentNav } from '../slices/navigateSlice'
import { logout } from "../slices/authSlice";
import api from "../services/Axios";
import { clearCart } from "../slices/cartSlice";
import { addMessageNotif, clearRooms, removeMessageNotif } from "../slices/chatSlice";
import toast, { Toaster } from 'react-hot-toast';

const NotificationsComponent = ({ userId }) => {

    const currentNotifMessages = useSelector(state => state.chat.messageNotif)

    const dispatch = useDispatch()

    useEffect(() => {

        const socket = new WebSocket(`ws://localhost:8000/ws/notifications/${userId}/`);

        socket.onopen = () => {
            console.log("✅ WebSocket connecté");
        };

        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                if (data.type === "send_notification" && data.payload) {

                    console.log("🔔 Notification reçue:", data);

                    dispatch(addMessageNotif(data.message))
                }

            } catch (e) {
                console.error("Erreur JSON:", e);
            }
        };

        socket.onclose = () => {
            console.warn("❌ WebSocket fermé");
        };

        socket.onerror = (err) => {
            console.error("❗ WebSocket erreur:", err);
        };

        return () => socket.close();
    }, [userId]);

    return <div>🔔 {currentNotifMessages.length}</div>;
};



export default function AccountDropdown3() {

    const [dropdownOpen, setDropdownOpen] = useState(false);

    const dispatch = useDispatch()

    const nbItems = useSelector(state => state.cart.nbItem)

    const currentUser = useSelector(state => state.auth.user)

    const currentNotifMessages = useSelector(state => state.chat.messageNotif)

    const trigger = useRef(null);

    const dropdown = useRef(null);

    const navigate = useNavigate();

    const notify = () => {

        toast(currentNotifMessages[0]);

        dispatch(removeMessageNotif())
    };

    // close on click outside
    useEffect(() => {

        const clickHandler = ({ target }) => {

            if (!dropdown.current) return;

            if (

                !dropdownOpen ||

                dropdown.current.contains(target) ||

                trigger.current.contains(target)
            )
                return;

            setDropdownOpen(false);
        };

        document.addEventListener("click", clickHandler);

        return () => document.removeEventListener("click", clickHandler);
    });

    // close if the esc key is pressed
    useEffect(() => {

        const keyHandler = ({ keyCode }) => {

            if (!dropdownOpen || keyCode !== 27) return;

            setDropdownOpen(false);
        };

        document.addEventListener("keydown", keyHandler);

        return () => document.removeEventListener("keydown", keyHandler);

    });




    const getUserLogOut =async () => {

        if (window.confirm("Voulez-vous vous deconnecter???")) {

            if (!currentUser?.id) {

                dispatch(logout())

                return navigate("/logIn", { replace: true });
            }

            try {
                //const response = await api.post('logout/');

                const formData = new FormData();

                formData.append("is_connected", false);

                 await api.put(`clients/${currentUser?.id}/`, formData, {

                    headers: { "Content-Type": "multipart/form-data" },
                });

                dispatch(logout())

                dispatch(clearCart())

                dispatch(clearRooms())

                return navigate("/logIn", { replace: true });

            }catch (error) {

                console.log("error..................", error)
            }

        }

    };

    return (
        <section className="bg-gray-2 py-20 dark:bg-dark">

            <div className="container">

                <div className="flex justify-center">

                    <div className="relative inline-block">

                        <div className="mb-3.5 flex items-center gap-4">


                            <div>
                                {
                                    (currentNotifMessages.length > 0) &&
                                    <button onClick={notify}>
                                        <NotificationsComponent userId={currentUser?.id} />
                                    </button>
                                }
                                <Toaster />
                            </div>


                            {/* Icon 2 */}

                            <button

                                onClick={() => dispatch(setCurrentNav("payment"))}

                                className="cursor-pointer flex h-12 w-12 items-center justify-center rounded-lg border-0 bg-white dark:border-dark-3 dark:bg-dark-2 text-dark"
                            >
                                <svg
                                    className="h-5 text-gray-800 dark:text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 4h1.5L8 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm.75-3H7.5M11 7H6.312M17 4v6m-3-3h6"
                                    />
                                </svg>
                                {nbItems}
                            </button>


                            {/* Dropdown Button */}
                            <button
                                ref={trigger}
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border-0  bg-white px-4 py-2 text-base font-medium text-dark dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                            >

                                {
                                    currentUser?.image ?
                                       
                                    <div className="relative h-[30px] w-[30px] rounded-full">
                                        <img
                                            src={currentUser?.image}
                                            alt="avatar"
                                            title={currentUser?.email}
                                            className="h-full w-full rounded-full object-cover object-center cursor-pointer"
                                        />
                                        {
                                            currentUser?.is_connected && 
                                                <span className="absolute -right-0.5 -top-0.5 block h-[14px] w-[14px] rounded-full border-[2.3px] border-white bg-[#219653] dark:border-dark"></span>
                                            }
                                    </div>
                                        :
                                        <div className="relative h-[30px] w-[30px] rounded-full" title={currentUser?.email}>

                                            <svg
                                                className="w-6 h-6 text-gray-800 dark:text-white cursor-pointer"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                                
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M12 20a7.966 7.966 0 0 1-5.002-1.756l.002.001v-.683c0-1.794 1.492-3.25 3.333-3.25h3.334c1.84 0 3.333 1.456 3.333 3.25v.683A7.966 7.966 0 0 1 12 20ZM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10c0 5.5-4.44 9.963-9.932 10h-.138C6.438 21.962 2 17.5 2 12Zm10-5c-1.84 0-3.333 1.455-3.333 3.25S10.159 13.5 12 13.5c1.84 0 3.333-1.455 3.333-3.25S13.841 7 12 7Z"
                                                    clipRule="evenodd"
                                                />
                                             </svg>

                                         {
                                            currentUser?.is_connected &&
                                            <span className="absolute -right-0.5 -top-0.5 block h-[14px] w-[14px] rounded-full border-[2.3px] border-white bg-[#219653] dark:border-dark"></span>
                                            }

                                     </div>
                                }

                                <span className={`duration-100 ${dropdownOpen ? "-scale-y-100" : ""}`}>
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 20 20"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M10 14.25C9.8125 14.25 9.65625 14.1875 9.5 14.0625L2.3125 7C2.03125 6.71875 2.03125 6.28125 2.3125 6C2.59375 5.71875 3.03125 5.71875 3.3125 6L10 12.5312L16.6875 5.9375C16.9688 5.65625 17.4062 5.65625 17.6875 5.9375C17.9688 6.21875 17.9688 6.65625 17.6875 6.9375L10.5 14C10.3437 14.1562 10.1875 14.25 10 14.25Z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                </span>
                            </button>
                        </div>

                        <div
                            ref={dropdown}
                            onFocus={() => setDropdownOpen(true)}
                            onBlur={() => setDropdownOpen(false)}
                            className={`absolute right-0 top-full w-[240px] divide-y divide-stroke overflow-hidden rounded-lg bg-white dark:divide-dark-3 dark:bg-dark-2 z-[70] ${dropdownOpen ? "block" : "hidden"}`}
                        >

                            <div className="px-4 py-3">
                                <p className="text-sm font-semibold text-dark dark:text-white">
                                    Account menu
                                </p>
                            </div>

                            <div>
                                <button
                                    onClick={() => dispatch(setCurrentNav("user_profil")) }
                                    className="cursor-pointer flex w-full items-center justify-between px-4 py-2.5 text-sm font-medium text-dark hover:bg-gray-50 dark:text-white dark:hover:bg-white/5"
                                >
                                    Voir profile
                                </button>

                            </div>

                            <div>
                                <button
                                    onClick={() => dispatch(setCurrentNav("dashboard"))}
                                    className="cursor-pointer  flex w-full items-center justify-between px-4 py-2.5 text-sm font-medium text-dark hover:bg-gray-50 dark:text-white dark:hover:bg-white/5"
                                >
                                    Vos activités
                                </button>
                            </div>

                            <div>
                                <button
                                    onClick={() => dispatch(setCurrentNav("support"))}
                                    className="cursor-pointer flex w-full items-center justify-between px-4 py-2.5 text-sm font-medium text-dark hover:bg-gray-50 dark:text-white dark:hover:bg-white/5"
                                >
                                    Support
                                </button>
                            </div>

                            <div>
                                <button
                                    onClick={() => getUserLogOut()}
                                    className="flex w-full items-center justify-between px-4 py-2.5 text-sm font-medium text-dark hover:bg-gray-50 dark:text-white dark:hover:bg-white/5">
                                    Log out
                                </button>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}
