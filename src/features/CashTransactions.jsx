import { useEffect, useState } from 'react'
import api from '../services/Axios'
import CashTransactionCard from './CashTransactionCard'
import { useTranslation } from "react-i18next";
import { TitleCompGenLitle } from '../components/TitleComponentGen';

const CashTransaction = () => {

    const [transactions, setTransactions] = useState([])
    const [searchValue, setSearchValue] = useState("")
    const [loading, setLoading] = useState(false)

    const { t } = useTranslation();

    // 🔍 SEARCH (avec bouton ou enter)
    const search = async () => {
        if (!searchValue) return

        try {
            setLoading(true)
            const res = await api.get(`/cashtransaction/${searchValue}/`)
            setTransactions([res.data]) // tableau pour map
        } catch (err) {
            console.log("Erreur search:", err)
            setTransactions([])
        } finally {
            setLoading(false)
        }
    }

    // 📦 LOAD INITIAL
    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                setLoading(true)
                const res = await api.get("/cashtransaction")
                setTransactions(res.data)
            } catch (err) {
                console.log("Erreur liste:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchTransactions()
    }, [])

    return (
        <div className="overflow-x-auto sm:rounded-lg p-1 dark:text-white text-gray-100">

            {/* TITRE */}
            <nav className="flex items-center gap-2 m-2">

                <TitleCompGenLitle title={t("paymentMode")} />

                <input
                    type="text"
                    placeholder={t("search")}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && search()}
                    className="focus:outline-none rounded-full border px-3 py-2 border-blue-50"
                />

                <button
                    onClick={search}
                    className="px-3 py-2 bg-blue-500 text-white rounded-full"
                >
                    OK
                </button>

            </nav>

            {/* CONTENT */}
            <main>

                {loading && <p className="text-center">Loading...</p>}

                {!loading && transactions.length > 0 ? (
                    <div className="gap-2">
                        {transactions.map(item => (
                            <CashTransactionCard
                                key={item.id}
                                transaction={item}
                            />
                        ))}
                    </div>
                ) : (
                    !loading && (
                        <div className="text-center p-4 mx-auto border rounded-full w-1/2">
                            {t('no_cash_trans')}
                        </div>
                    )
                )}

            </main>

        </div>
    )
}

export default CashTransaction;