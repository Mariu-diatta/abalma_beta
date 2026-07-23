// hooks/useOpenChatRoom.js
import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { alertMessage, getOrCreateRoom } from '../utils';
import { showMessage } from './AlertMessage';
import { addCurrentChat, addRoom } from '../slices/chatSlice';
import { setCurrentNav } from '../slices/navigateSlice';
import { useTranslation } from 'react-i18next';

/**
 * Hook générique pour ouvrir (ou créer) une conversation avec un utilisateur donné.
 *
 * @param {Object} options
 * @param {Object} options.currentUser - L'utilisateur connecté
 * @param {string} [options.redirectTo='/message-inbox'] - Route vers laquelle naviguer après ouverture
 * @param {string} [options.navKey='message-inbox'] - Clé de navigation à passer à setCurrentNav
 */
export const useOpenChatRoom = ({
    currentUser,
    redirectTo = '/message-inbox',
    navKey = 'message-inbox',
} = {}) => {
    const { t } = useTranslation()
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loadingChat, setLoadingChat] = useState(false);

    const openRoomWith = useCallback(

        async (otherUser) => {

            if (!currentUser) {
                alertMessage("requireConnexion", t)
            }

            if (loadingChat || !otherUser || !currentUser) {
                return;
            }

            setLoadingChat(true);

            try {
                const room = await getOrCreateRoom({
                    currentUser,
                    otherUser,
                });

                if (!room) {
                    showMessage(dispatch, {
                        Type: 'Erreur',
                        Message:
                            "Impossible d'ouvrir la conversation pour le moment.",
                    });
                    return;
                }

                dispatch(addRoom(room));
                dispatch(addCurrentChat(room));
                dispatch(setCurrentNav(navKey));
                navigate(redirectTo);
            } finally {
                setLoadingChat(false);
            }
        },
        [loadingChat, currentUser, dispatch, navigate, redirectTo, navKey, t]
    );

    return { openRoomWith, loadingChat };
};