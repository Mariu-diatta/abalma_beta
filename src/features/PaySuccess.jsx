import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from "react-router";
import { ENDPOINTS } from '../utils';
import { addMessageNotif } from '../slices/chatSlice';
import { clearCart } from '../slices/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import api from '../services/Axios';
import { showMessage } from '../components/AlertMessage';


const PaySuccess = () => {

    let navigate = useNavigate();

    const dispatch = useDispatch()

    const data = useSelector(state => state.cart);

    const currentUser = useSelector(state => state.auth.user);

    const [isCodeSent, setIsCodeSent]=useState(true)


    // Construire directement le tableau, sans setState
    const productIds = data.items.map((item) => ({ "key": item?.id, "quantity": item?.quanttity_product_sold }))

    // Construire l’objet à envoyer
    const payload = useMemo(() => ({
        product_ids: productIds,
        quantity: data.nbItem,
        price: data.totalPrice,
        transaction_type: "Achat",
        client: currentUser.id,
    }), [productIds, data.nbItem, data.totalPrice, currentUser.id]);

    useEffect(() => {
        if (!isCodeSent) return;

        const sendTransaction = async () => {
            setIsCodeSent(false); // on bloque la prochaine exécution

            try {
                await api.post(
                    "transactions/products/",
                    payload,
                    { headers: { "Content-Type": "application/json" } }
                );

                showMessage(dispatch, { Type: "Message", Message: "Transaction effectuée !" });
                dispatch(addMessageNotif("Transaction effectuée !"));
                dispatch(clearCart());

            } catch (err) {
                const errorMessage = err?.response?.data?.detail || err?.message;
                showMessage(dispatch, { Type: "Erreur", Message: errorMessage });
            }
        };

        sendTransaction();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // [] signifie que le useEffect s'exécute une seule fois

    return (

        <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
            <h1 className="text-2xl font-bold text-green-600 mb-2">
                Paiement réussi 🎉
            </h1>
            <p className="text-gray-700 text-lg">
                Merci ! Votre transaction a été effectuée avec succès.
            </p>
            <p className="text-gray-500 mt-1">
                Vous recevrez bientôt un e-mail de confirmation.
            </p>

            <button
                onClick={(e) => {
                    e.preventDefault();
                    navigate(`/${ENDPOINTS?.PAYMENT}`)
                }}
                className="mt-6 inline-block bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-medium"
            >
                Retour à l’accueil
            </button>
        </div>
    );
};

export default PaySuccess;
