import React from 'react'
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import api from '../services/Axios';
import { showMessage } from '../components/AlertMessage';

export function PaymentWithCard(
    {
        amount,
        setLoadingPayPal,
        refRate,
        setShowPaymentForm
    }
) {

    //const [loading, setLoading] = useState(false)

    const { t } = useTranslation();


    const dispatch = useDispatch()

    const dataItems = useSelector(state => state.cart.items);


    const currentUser = useSelector(state => state.auth.user);

    const currentUserNotConnected = !currentUser && !currentUser?.is_connected

    const createOrder = async () => {

        try {
             await api.post(

                "create-payment/",

                { items: dataItems, currency: refRate }
            );

            alert("Payment réussie!!!")

        } catch (error) {

            handlePaymentError(error);

            throw error;
        }
    };

    const handlePaymentError = (err) => {

        showMessage(dispatch, {
            Type: "Erreur",
            Message: t("unsuccess_transaction"),
        });
    };

    if (currentUserNotConnected) return

    return (

        <button onClick={createOrder} className="bg-gray-200 py-2.5 text-bold my-1 hover:bg-gray-300 rounded-md w-1/2">
            S’abonner
        </button>

    );
}