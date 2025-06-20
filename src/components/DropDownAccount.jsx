import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { setCurrentNav } from '../slices/navigateSlice'
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

    return <div className="flex">

                <svg className="w-[26px] h-[25px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.8" d="M12 5.365V3m0 2.365a5.338 5.338 0 0 1 5.133 5.368v1.8c0 2.386 1.867 2.982 1.867 4.175 0 .593 0 1.292-.538 1.292H5.538C5 18 5 17.301 5 16.708c0-1.193 1.867-1.789 1.867-4.175v-1.8A5.338 5.338 0 0 1 12 5.365ZM8.733 18c.094.852.306 1.54.944 2.112a3.48 3.48 0 0 0 4.646 0c.638-.572 1.236-1.26 1.33-2.112h-6.92Z" />
                </svg>

                {currentNotifMessages.length}

           </div>;
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




    const getUserLogOut = async () => {

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

            } catch (error) {

                console.log("error..................", error)
            }

        }

    };

    return (
        <section className="absolute top-2 bg-gray-2 dark:bg-dark">

             <div className="flex justify-center items-center ">

                <div className="flex justify-center items-center">

                        <div className=" flex items-center justify-center gap-2">

                         
                            {
                                (currentNotifMessages.length > 0) &&

                                <button onClick={notify}>

                                    <NotificationsComponent userId={currentUser?.id} />

                                </button>
                            }

                            <Toaster />
                            
                            {/* Icon 2 */}

                            <button

                                onClick={() => dispatch(setCurrentNav("payment"))}

                                className="cursor-pointer flex h-12 w-12 items-center justify-center rounded-lg border-0 bg-white dark:border-dark-3 dark:bg-dark-2 text-dark"
                            >
                                <svg className="w-[26px] h-[26px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">

                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.8" d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7h-1M8 7h-.688M13 5v4m-2-2h4" />

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

                                        <div className="absolute top-0 relative h-[30px] w-[30px] rounded-full mt-2">

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
                                        <div className="absolute top-0 relative h-[20px] w-[30px] rounded-full" title={currentUser?.email}>

                                            <svg className="w-[26px] h-[25px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">

                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.8" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0a8.949 8.949 0 0 0 4.951-1.488A3.987 3.987 0 0 0 13 16h-2a3.987 3.987 0 0 0-3.951 3.512A8.948 8.948 0 0 0 12 21Zm3-11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />

                                            </svg>

                                            {
                                                currentUser?.is_connected &&

                                                <span className="absolute -right-0.5 -top-0.5 block h-[14px] w-[14px] rounded-full border-[2.3px] border-white bg-[#219653] dark:border-dark"></span>
                                            }

                                        </div>
                                }

                                <span className={`duration-100 mr-1 ${dropdownOpen ? "-scale-y-100" : ""}`}>

                                    <svg className="w-[26px] h-[26px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">

                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.8" d="m8 10 4 4 4-4" />

                                    </svg>

                                </span>

                            </button>

                        </div>

                        <div
                            ref={dropdown}
                            onFocus={() => setDropdownOpen(true)}
                            onBlur={() => setDropdownOpen(false)}
                            className={`border-0 absolute right-0 top-full w-[240px] divide-y divide-stroke overflow-hidden rounded-lg bg-white dark:divide-dark-3 dark:bg-dark-2 z-[70] ${dropdownOpen ? "block" : "hidden"}`}
                        >

                            <div className="px-4 py-3">
                                <p className="text-sm font-semibold text-dark dark:text-white">
                                    Account menu
                                </p>
                            </div>

                            <div>
                                <button
                                    onClick={() => dispatch(setCurrentNav("user_profil"))}
                                    className="cursor-pointer flex w-full items-center justify-between px-4 py-2.5 text-sm  text-dark hover:bg-gray-50 dark:text-white dark:hover:bg-white/5"
                                >
                                    Voir profile
                                </button>

                            </div>

                            <div>
                                <button
                                    onClick={() => dispatch(setCurrentNav("dashboard"))}
                                    className="cursor-pointer  flex w-full items-center justify-between px-4 py-2.5 text-sm  text-dark hover:bg-gray-50 dark:text-white dark:hover:bg-white/5"
                                >
                                    Vos activités
                                </button>
                            </div>

                            <div>
                                <button
                                    onClick={() => dispatch(setCurrentNav("support"))}
                                    className="cursor-pointer flex w-full items-center justify-between px-4 py-2.5 text-sm  text-dark hover:bg-gray-50 dark:text-white dark:hover:bg-white/5"
                                >
                                    Support
                                </button>
                            </div>

                            <div>
                                <button
                                    onClick={() => getUserLogOut()}
                                    className="flex w-full items-center justify-between px-4 py-2.5 text-sm  text-dark hover:bg-gray-50 dark:text-white dark:hover:bg-white/5">
                                    Log out
                                </button>
                            </div>

                        </div>

                    </div>
                </div>

        </section>
    );
}