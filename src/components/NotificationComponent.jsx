import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
//import { addMessageNotif } from "../slices/chatSlice";

 const NotificationsComponent = ({ userId }) => {

    const currentNotifMessages = useSelector(state => state.chat.messageNotif);

    const dispatch = useDispatch();

    useEffect(() => {

        //process.env.NODE_ENV === 'production'
        const backendBase = true
            ? 'wss://backend-mpb0.onrender.com'
            : 'ws://localhost:8000';

        const socketUrl = `${backendBase}/chat/notifications/${userId}/`;

        const socket = new WebSocket(socketUrl);

        socket.onopen = () => {

            //console.log("✅ WebSocket connecté");
        };

        socket.onmessage = (event) => {

            try {
                //const data = JSON.parse(event.data);

                ////if (data.type === "send_notification" && data.payload) {

                ////    //console.log("🔔 Notification reçue:", data);

                ////    dispatch(addMessageNotif(data.message));
                ////}
            } catch (e) {

            //    console.error("Erreur JSON:", e);
            }
        };

        socket.onclose = () => {

        //    console.warn("❌ WebSocket fermé");
        };

        socket.onerror = (err) => {

        //    console.error("❗ WebSocket erreur:", err);
        };

        return () => socket.close();

    }, [userId, dispatch]);

    return (

        <div className="flex hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg px-2 ">

            {/*<svg className="w-6 h-6 text-gray-800 dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">*/}

            {/*    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.8"*/}
            {/*        d="M12 5.365V3m0 2.365a5.338 5.338 0 0 1 5.133 5.368v1.8c0 2.386 1.867 2.982 1.867 4.175 0 .593 0 1.292-.538 1.292H5.538C5 18 5 17.301 5 16.708c0-1.193 1.867-1.789 1.867-4.175v-1.8A5.338 5.338 0 0 1 12 5.365ZM8.733 18c.094.852.306 1.54.944 2.112a3.48 3.48 0 0 0 4.646 0c.638-.572 1.236-1.26 1.33-2.112h-6.92Z" />*/}

            {/*</svg>*/}

            <p className="text-xs">{currentNotifMessages.length} </p>


        </div>
    );
};


export default NotificationsComponent;