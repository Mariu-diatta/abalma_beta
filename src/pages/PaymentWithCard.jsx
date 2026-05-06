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

        if (!currentUser?.email) alert("Alert erreur lors du paiment")

        try {

            const res = await api.post(

                "create-payment/",

                { items: dataItems, currency: refRate, email: currentUser?.email },
                {
                    withCredentials: true
                }
            );

            window.location.href = res.data.url;

        } catch (error) {

            handlePaymentError(error);
            console.log(error)
            alert(error?.response?.data?.error || "Error, veullez recommencer")

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
            
                <button onClick={createOrder} className="bg-gray-200 py-2.5 text-bold my-1 hover:bg-gray-300 rounded-md w-1/2">
                {
                    !loading ?
                    "Payer"
                    :
                    <LoadingCard />
                }
                </button>

       </>

    )
}