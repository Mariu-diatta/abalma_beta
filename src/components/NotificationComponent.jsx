import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMessageNotif, removeRoom } from "../slices/chatSlice";
import { backendBase } from "../services/Axios";

const MAX_RECONNECT_DELAY = 30000;

const NotificationsComponent = () => {

    const dispatch = useDispatch();
    const ws = useRef(null);
    const currentUser = useSelector((state) => state.auth.user);
    const reconnectTimeoutRef = useRef(null);
    const reconnectAttemptsRef = useRef(0);
    const manualCloseRef = useRef(false);

    // ✅ Empêcher les doublons grâce à un Set
    const receivedNotifs = useRef(new Set());

    useEffect(() => {

        if (!currentUser?.id) return;

        manualCloseRef.current = false;

        const connect = () => {
            // ✅ ws:// ou wss:// uniquement — jamais https:// (BASE_URL),
            // sinon le constructeur WebSocket lève une erreur et ne connecte jamais.
            const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
            const socketUrl = `${protocol}://${backendBase}/ws/notifications/${currentUser.id}/`;

            if (ws.current) ws.current.close();
            ws.current = new WebSocket(socketUrl);

            ws.current.onopen = () => {
                console.log("✅ Notification WebSocket connecté");
                reconnectAttemptsRef.current = 0;
            };

            ws.current.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);

                    // ✅ Vérifie si la notif existe déjà (en se basant sur room_pk + contenu)
                    const notifId = `${data?.room_pk}_${data?.content}`;

                    if (
                        data?.typeNotif === "Delete" &&
                        data?.typeItem === "Delete" &&
                        !receivedNotifs.current.has(notifId)
                    ) {
                        receivedNotifs.current.add(notifId);
                        dispatch(addMessageNotif(data?.content));
                        dispatch(removeRoom({ pk: data?.room_pk }));
                    }

                    // Note : les notifications typeItem === "Chat" (nouveaux messages)
                    // ne sont pas traitées ici pour l'instant — à étendre si vous
                    // voulez un badge "non lu" basé sur ce canal plutôt que sur
                    // le WebSocket de ChatApp.jsx.
                } catch (e) {
                    console.error("❌ Erreur JSON:", e);
                }
            };

            ws.current.onclose = () => {
                if (manualCloseRef.current) {
                    console.warn("❌ WebSocket fermé");
                    return;
                }
                const attempt = reconnectAttemptsRef.current + 1;
                reconnectAttemptsRef.current = attempt;
                const delay = Math.min(1000 * 2 ** (attempt - 1), MAX_RECONNECT_DELAY);
                reconnectTimeoutRef.current = setTimeout(connect, delay);
            };

            ws.current.onerror = (err) => {
                console.error("❗ WebSocket erreur:", err);
            };
        };

        connect();

        return () => {
            manualCloseRef.current = true;
            clearTimeout(reconnectTimeoutRef.current);
            ws.current?.close();
            ws.current = null;
        };

    }, [currentUser?.id, dispatch]);

    return (
        <div className="h-7 w-7 flex gap-1 items-center">
            <div>
                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="m10.827 5.465-.435-2.324m.435 2.324a5.338 5.338 0 0 1 6.033 4.333l.331 1.769c.44 2.345 2.383 2.588 2.6 3.761.11.586.22 1.171-.31 1.271l-12.7 2.377c-.529.099-.639-.488-.749-1.074C5.813 16.73 7.538 15.8 7.1 13.455c-.219-1.169.218 1.162-.33-1.769a5.338 5.338 0 0 1 4.058-6.221Zm-7.046 4.41c.143-1.877.822-3.461 2.086-4.856m2.646 13.633a3.472 3.472 0 0 0 6.728-.777l.09-.5-6.818 1.277Z" />
                </svg>
            </div>
            {reconnectAttemptsRef.current}
        </div>
    );
};

export default NotificationsComponent;