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

    return null;
};

export default NotificationsComponent;