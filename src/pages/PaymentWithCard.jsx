import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import api from '../services/Axios';
import { showMessage } from '../components/AlertMessage';
import LoadingCard from '../components/LoardingSpin';

export function PaymentWithCard(
    {
        refRate
    }
) {

    const [loading, setLoading] = useState(false)

    const { t } = useTranslation();

    const dispatch = useDispatch()

    const dataItems = useSelector(state => state.cart.items);


    const currentUser = useSelector(state => state.auth.user);

    const currentUserNotConnected = !currentUser && !currentUser?.is_connected

    const createOrder = async () => {

        setLoading(true)

        try {

            const res = await api.post(

                "create-payment/",

                { items: dataItems, currency: refRate }
            );

            window.location.href = res.data.url;

        } catch (error) {

            handlePaymentError(error);

            throw error;

        } finally {

            setLoading(false)
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

        <>
            {
                !loading?
                <button onClick={createOrder} className="bg-gray-200 py-2.5 text-bold my-1 hover:bg-gray-300 rounded-md w-1/2">
                    Payer
                </button>
                :
                <LoadingCard/>
           }
       </>

    )
}