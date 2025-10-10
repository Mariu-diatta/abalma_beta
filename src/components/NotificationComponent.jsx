import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { backendBase } from "../utils";
import { addMessageNotif, removeRoom } from "../slices/chatSlice";
//import { addMessageNotif } from "../slices/chatSlice";

 const NotificationsComponent = () => {

    const currentNotifMessages = useSelector(state => state.chat.messageNotif);

    const currentUser = useSelector(state => state.auth.user)

    const dispatch = useDispatch();

    const selectedUser = useSelector((state) => state.chat.userSlected);

     const deleteChat = useSelector((state) => state.chat.deleteChat);

    const ws = useRef(null);

     useEffect(() => {
         if (!currentUser?.id) return;

         const socketUrl = `${backendBase}/chat/notifications/${currentUser.id}/`;

         // Fermer une ancienne connexion avant d'en ouvrir une nouvelle
         //if (ws.current) {
         //    ws.current.close();
         //}

         ws.current = new WebSocket(socketUrl);

         ws.current.onopen = () => {
             console.log("✅ Notification WebSocket connecté");
         };

         ws.current.onmessage = (event) => {
             try {
                 const data = JSON.parse(event.data);

                 if (
                     data?.typeNotif === "Delete" &&
                     data?.typeItem === "Delete" &&
                     (deleteChat?.pk !== data?.room_pk)
                 ) {
                      
                     dispatch(addMessageNotif(data?.content));

                     dispatch(removeRoom({ pk: data?.room_pk }))
                 }
             } catch (e) {
                 console.error("❌ Erreur JSON:", e);
             }
         };

         //ws.current.onclose = () => {
         //    console.warn("❌ WebSocket fermé");
         //};

         //ws.current.onerror = (err) => {
         //    console.error("❗ WebSocket erreur:", err);
         //};

         return () => {
             if (ws.current) {
                 ws.current.close();
             }
         };
     }, [currentUser, dispatch, selectedUser, deleteChat]); // 👈 uniquement l'ID utilisateur en dépendance


     useEffect(

         () => {
             if (currentNotifMessages && ws.current?.readyState === WebSocket.OPEN) {

                 ws.current.send(JSON.stringify({
                     user: currentUser,
                     content: currentNotifMessages[0],
                     title: currentNotifMessages[0],
                     room_pk: deleteChat?.pk,
                     typeItem: "Chat",
                     receiver_id: deleteChat?.current_receiver,   
                     typeNotif:"Delete"

                 }));

             }
         },[currentNotifMessages,currentUser,deleteChat]
     )

    return (

        <div className="flex bg-white-50 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-full px-1 py-1 shadow-sm ">

            <svg className="w-6 h-6 text-gray-800 dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">

                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.8"
                    d="M12 5.365V3m0 2.365a5.338 5.338 0 0 1 5.133 5.368v1.8c0 2.386 1.867 2.982 1.867 4.175 0 .593 0 1.292-.538 1.292H5.538C5 18 5 17.301 5 16.708c0-1.193 1.867-1.789 1.867-4.175v-1.8A5.338 5.338 0 0 1 12 5.365ZM8.733 18c.094.852.306 1.54.944 2.112a3.48 3.48 0 0 0 4.646 0c.638-.572 1.236-1.26 1.33-2.112h-6.92Z" />

            </svg>

            <p className="text-xs">{currentNotifMessages.length} </p>


        </div>
    );
};


export default NotificationsComponent;