import React from 'react'
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
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


    const createOrder = async () => {

        try {
            const response = await api.post(

                "create-paypal-order/",

                { items: dataItems, currency: refRate }
            );

            const data = response.data;

            // ⚠️ IMPORTANT : retourner uniquement l'ID
            return data.paypal_order_id;

        } catch (error) {

            handlePaymentError(error);

            throw error;
        }
    };

    const onApprovePayment = async (data) => {
        try {

            setLoadingPayPal(true);

            await api.post(
                "capture-paypal-order/",
                {
                    order_id: data.orderID,
                    items: dataItems,
                    currency: refRate
                }
            );

            showMessage(dispatch, {
                Type: "Message",
                Message: t("success_transaction")
            });

            dispatch(clearCart());
            setShowPaymentForm(false);

        } catch (err) {
            handlePaymentError(err);

        } finally {
            setLoadingPayPal(false);
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
                style={{
                    layout: "vertical",
                    color: "blue",
                    shape: "rect",
                    label: "paypal",
                    innerWidth:"100%"
                }}

                createOrder={createOrder}

                onApprove={onApprovePayment}

                onError={handlePaymentError}
            />

        </PayPalScriptProvider>

    );
}