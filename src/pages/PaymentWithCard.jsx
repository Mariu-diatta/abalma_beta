import React, { useState } from 'react'
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useCallback } from 'react';
//import { CONSTANTS } from '../utils';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import api from '../services/Axios';
import { showMessage } from '../components/AlertMessage';
import { clearCart } from '../slices/cartSlice';

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

    const [datatPayLoad, setDataPayLoad] = useState({})

    const boughtProduct = useCallback(async (payload) => {

            try {

                setLoadingPayPal(true)

                // Envoi en JSON  const products =
                await api.post("creat/transactions/products/",

                    payload,

                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                )

                showMessage(dispatch, { Type: "Message", Message: t("success_transaction") });

                //dispatch(addMessageNotif("Transaction effectué"))

                dispatch(clearCart())

            } catch (err) {

                setShowPaymentForm(false)

                showMessage(dispatch, { Type: "Erreur", Message: err?.response?.data?.detail || err?.message });


            } finally {

                setLoadingPayPal(false)
            }

        }, [setShowPaymentForm, setLoadingPayPal, dispatch,t]
    )

    const createOrder = async () => {

        const response = await api.post("create-paypal-order/",

            { items: dataItems, currency: refRate },
         
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        const data = await response.json();

        setDataPayLoad(data?.productsData)

        return data; // ID que PayPal Buttons utilise
    }


    const onApprovePayment = async (actions) => {
            
        try {

            const details = await actions.order.capture();

            // Appel fonction post-transaction
            boughtProduct(datatPayLoad);

            // Notification personnalisée
            showMessage(

                dispatch,

                {
                    Type: "Message",
                    Message: `Merci ${details.payer.name.given_name}, ${t("success_transaction")}!`,
                }
            );

        } catch (err) {

            handlePaymentError(err);
            // Notification personnalisée
            showMessage(

                dispatch,

                {
                    Type: "Erreur",
                    Message: `Hupps! ${err?.response?.data?.detail || err?.message}, ${t('transaction_fail')}`,
                }
            );
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

        <PayPalScriptProvider

            options={
                {
                    "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID,

                    currency: refRate,
                }
            }
        >

            <PayPalButtons

                style={
                    {
                        layout: "vertical",
                        color: "blue",
                        shape: "rect",
                        label: "paypal",
                    }
                }

                createOrder={(data, actions) => createOrder(actions)}

                onApprove={(data, actions) => onApprovePayment(actions)}

                onError={(err) => handlePaymentError(err)}
            />

        </PayPalScriptProvider>

    );
}