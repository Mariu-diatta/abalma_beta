import React from 'react'
import { useNavigate } from "react-router";
import { ENDPOINTS } from '../utils';
import { useTranslation } from 'react-i18next';
import { useDispatch} from 'react-redux';
import { setCurrentNav } from '../slices/navigateSlice';


const PayCancel = () => {

    const { t } = useTranslation();

    let navigate = useNavigate();

    const dispatch = useDispatch()


    return (

        <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">

            <h1 className="text-2xl font-bold text-green-600 mb-2">
                {t("payment_text.cancel")}
            </h1>

            <button
                onClick={(e) => {
                    e.preventDefault();
                    dispatch(setCurrentNav(ENDPOINTS?.PAYMENT))
                    navigate(`/${ENDPOINTS?.PAYMENT}`)
                }}
                className="mt-6 inline-block bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-medium"
            >
                {t("payment_text.btn_back_to_dashbord")}
            </button>
        </div>
    )
}

export default PayCancel;