import { useEffect, useState } from 'react'
import api from '../services/Axios'
import CashTransactionCard from './CashTransactionCard'
import { useTranslation } from "react-i18next";
import { TitleCompGenLitle } from '../components/TitleComponentGen';


const CashTransaction = () => {

    const [transactionsCashOwner, setTransactionsCashOwner] = useState()

    const { t } = useTranslation();

    useEffect(

        () => {
            const cashsTrans = async () => {

                try {

                    const trans = await api.get("/cashtransaction")

                    setTransactionsCashOwner(trans?.data)

                } catch (err) {

                    console.log("erreur pour lister les transaction:::", err)

                }

            }
            cashsTrans()
        },[]
    )

    return (

        <div className="py-4 w-full mx-0 px-1 md:px-5">

            <nav className="flex items-center gap-2 m-2">

                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeWidth="1" d="M8 7V6a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-1M3 18v-7a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm8-3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                </svg>

                <TitleCompGenLitle title={t("paymentMode")}/>

            </nav>

            <main>
                {
                    transactionsCashOwner?.map(

                        item => {

                            return <CashTransactionCard
                                        transaction={item}
                                    />

                        }
                    )
                }

            </main>
        </div>
    )
}

export default CashTransaction;

