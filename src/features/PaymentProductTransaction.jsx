import React  from 'react'
//import { useTranslation } from 'react-i18next'; , { useState }
import { useSelector } from 'react-redux';
//import { CONSTANTS, payNow } from '../utils';
import PaymentCard from '../components/PaymentTools';
//import LoadingCard from '../components/LoardingSpin';
//import { showMessage } from '../components/AlertMessage';
import { PaymentWithCard } from '../pages/PaymentWithCard';


const PaymentTransaction = (
    {
        referenceRate
    }
) => {

    const currentUser = useSelector(state => state.auth.user);

    const forCurrentUser = !currentUser && !currentUser?.is_connected

    if (forCurrentUser) return

    return (

        <PaymentCard >

            <PaymentWithCard
                refRate={referenceRate}
            />

        </PaymentCard >
    )
}

export default PaymentTransaction;