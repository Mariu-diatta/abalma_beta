import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { CONSTANTS, payNow } from '../utils';
import PaymentCard from '../components/PaymentTools';
import LoadingCard from '../components/LoardingSpin';
import { showMessage } from '../components/AlertMessage';
import { PaymentWithCard } from '../pages/PaymentWithCard';


const PaymentTransaction = (
    {
        totalPrice,
        referenceRate,  
        setShowPaymentForm
    }
) => {

    const { t } = useTranslation();

    const currentUser = useSelector(state => state.auth.user);

    const dispatch = useDispatch()

    const [loading, setLoading] = useState(false);

    const [loadingPayPal, setLoadingPayPal] = useState(false);

    const { i18n } = useTranslation();

    const lang = i18n.language || window.localStorage.i18nextLng || CONSTANTS?.FR;

    const reference = lang === CONSTANTS?.FR ? CONSTANTS?.EUR : CONSTANTS?.USD

    const forCurrentUser = !currentUser && !currentUser?.is_connected

    if (forCurrentUser) return

    return (

        <PaymentCard >

            <div className="flex flex-col justify-end items-start mb-6">
                {/*<PaymentForm />*/}
                {/*<p className="bg-blue-100 px-1 mt-5">{"Données pour test PayPal"}</p>*/}
                {/*<p>email test PayPal: <strong>{"sb-tedqi46004430@personal.example.com"}</strong></p>*/}
                {/*<p>code test PayPal: <strong>{"2=;6Mw&}"}</strong></p>*/}

                <p className="bg-blue-100 px-1 mt-5">{"Codes de numéro de carte bancaire pour le test:"}</p>
                <p>Code test strip: <strong>{"4242424242424242"}</strong></p>
                <p>Code test strip: <strong>{"4000056655665556"}</strong></p>

            </div>
            {
                !loading ?
                    <button
                        onClick={() => {
                            payNow({
                                email: currentUser?.email,
                                amount: parseFloat(totalPrice),

                            },
                                setLoading,
                                reference,
                                dispatch,
                                showMessage,
                                t,
                                setShowPaymentForm

                            )
                        }}
                        className="rounded-lg h-full text-md py-3 bg-blue-50 w-full my-2 cursor-pointer hover:bg-blue-100"
                    >
                        <p><strong>{t("stripe_pay")}</strong></p>

                    </button>
                    :
                    <LoadingCard />
            }

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