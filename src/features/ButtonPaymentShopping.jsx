import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import { showMessage } from "../components/AlertMessage";
import { useDispatch, useSelector } from 'react-redux';
import api from "../services/Axios";
import LoadingCard from "../components/LoardingSpin";

const BuyButtonWithPaymentForm = ({ total_price,reference }) => {

    const { t } = useTranslation();

    const [loading, setLoading] = useState(false)

    const priceDiffZero = (total_price > 0) 

    const dispatch = useDispatch()

    const dataItems = useSelector(state => state.cart.items);

    const currentUser = useSelector(state => state.auth.user);

    const currentUserNotConnected = !currentUser && !currentUser?.is_connected

    const createOrder = async () => {

        setLoading(true)

        if (currentUserNotConnected) return

        if (!currentUser?.email) alert("Alert erreur lors du paiment")

        try {

            const res = await api.post(

                "create-payment/",

                { items: dataItems, currency: reference, email: currentUser?.email },
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

    return (

        <div className="text-right p-6">

            {
                priceDiffZero &&

                <button onClick={() => createOrder()} className="flex justify-between  items-center gap-2 px-2 cursor-pointer text-white bg-gradient-to-br from-purple-300 to-blue-300 hover:bg-gradient-to-br hover:from-purple-400focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 ">

                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M3 10h18M6 14h2m3 0h5M3 7v10a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1Z" />
                    </svg>

                    <div>{!loading ? <p>{t('paymentModeCard')} - {total_price} {reference} </p> : <LoadingCard />}</div>

                </button>
            }

        </div>
    );
};

export default BuyButtonWithPaymentForm;