import { useEffect, useState } from 'react'
import api from '../services/Axios'
import CashTransactionCard from './CashTransactionCard'
import { useTranslation } from "react-i18next";
import { TitleCompGenLitle } from '../components/TitleComponentGen';

const CashTransaction = () => {

    const [transactionsCashOwner, setTransactionsCashOwner] = useState([])

    const [searchTransactionByCode, setSearchTransactionByCode] = useState(null)

    const { t } = useTranslation();

    const search =async (code) => {

        try {

            const getTransByCode = await api.get(`/cashtransaction/${code}/`)

            setSearchTransactionByCode(getTransByCode??[])

        } catch {

        }
    }

    useEffect(

        () => {
            setTransactionsCashOwner(searchTransactionByCode)

        }, [searchTransactionByCode]
    )

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

    <div className="overflow-x-auto sm:rounded-lg p-1 dark:text-white text-gray-100">

            {/* TITRE */}
            <nav className="flex items-center gap-2 m-2">

                <TitleCompGenLitle title={t("paymentMode")} />

                <input
                    type="text"
                    placeholder={t("search")}
                    value={searchTransactionByCode}
                    onChange={(e) => {
                        search(e.target.value);
                    }}
                    className="focus:outline-none focus:ring-0 rounded-full border px-3 py-2 border-blue-50 focus:border-blue-50 focus:ring-1 focus:ring-blue-100"
                />

            </nav>

            <main>

                {
                    transactionsCashOwner?.lenght > 0 ?

                    <main className="gap-2">
                        {
                            transactionsCashOwner?.map(

                                item => {

                                    return <CashTransactionCard
                                                transaction={item}
                                                setSearchTransactionByCode={setSearchTransactionByCode}
                                            />

                                }
                            ) ?? <nav></nav>
                        }

                    </main>
                    :
                    <nav className="text-center p-4 mx-auto border border-gray-100 rounded-full w-1/2">{t('no_cash_trans')}</nav>
                }

            </main>

        </div>
    )
}

export default CashTransaction;

