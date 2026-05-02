import React, { useState } from 'react'
//import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
//import { CONSTANTS, payNow } from '../utils';
import PaymentCard from '../components/PaymentTools';
import LoadingCard from '../components/LoardingSpin';
//import { showMessage } from '../components/AlertMessage';
import { PaymentWithCard } from '../pages/PaymentWithCard';


const PaymentTransaction = (
    {
        totalPrice,
        referenceRate,  
        setShowPaymentForm
    }
) => {

    const currentUser = useSelector(state => state.auth.user);

    const [loadingPayPal, setLoadingPayPal] = useState(false);

    const forCurrentUser = !currentUser && !currentUser?.is_connected

    if (forCurrentUser) return

    return (

        <PaymentCard >
            {
                !loadingPayPal ?
                    <PaymentWithCard
                        amount={totalPrice}
                        setLoadingPayPal={setLoadingPayPal}
                        refRate={referenceRate}
                        setShowPaymentForm={setShowPaymentForm}
                    />
                    :
                    <LoadingCard />
            }

        </PaymentCard >

    )
}

export default PaymentTransaction;