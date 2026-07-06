import React, { useState } from 'react'
import { useEffect } from 'react';
import { useSelector} from 'react-redux';
import { getDeliveredAdress } from '../services/DataBase';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ENDPOINTS } from '../utils';
import { setCurrentNav } from '../slices/navigateSlice';
import { useTranslation } from 'react-i18next';

const PaymentButtonsLayouts = ({children }) => {

    const currentUser = useSelector(state => state.auth.user);

    const [loading, setLoading] = useState(false)

    const [address, setAddress] = useState(null)

    let navigate = useNavigate();

    const dispatch = useDispatch()

    const { t } = useTranslation();



    useEffect(

        () => {

            getDeliveredAdress(setAddress, setLoading)

        }, []
    )

    if (!currentUser) return null

    else if (!address?.length>0) {

        return (

            <div className="flex flex-col md:flex-row justify-center items-center gap-3 mt-3">
                {!loading ? (
                    <>
                        <p className="ap-verify-banner">
                            {t("noDeliveryAddress")}
                        </p>

                        <button

                            onClick={

                                () => {

                                    navigate(`/${ENDPOINTS?.SETTINGS}`);

                                    dispatch(setCurrentNav(ENDPOINTS?.SETTINGS))

                                }
                            }
                            className="ap-ok"
                        >
                            {t('addAddress')}
                        </button>
                    </>
                ) : (
                   <p>{t("loading")}</p>
                )}
            </div>
        )
    }

    return (

        <>

            {
                !loading ?
                <div className="flex flex-col md:flex-row justify-content items-center gap-3 mt-3">

                    {children}

                </div>
                :
                <>{ t("loading")}</>
            }

        </>
    )
}

export default PaymentButtonsLayouts;