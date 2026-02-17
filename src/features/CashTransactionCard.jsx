import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import { API_URL_BACKEND, STATUS_FLOW_STYLE, STATUS_FLOW_SUBTRANSACTION, STATUS_FLOW_TRANSACTION, updateStatusTransaction } from "../utils";
import { useDispatch, } from 'react-redux';
import LoadingCard from "../components/LoardingSpin";


const styles = {
    card: {
        borderRadius: "12px",
        background: "#fff",
        padding: "20px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        maxWidth: "100%",
        fontFamily: "Inter, sans-serif",
    },
    header: {
        marginBottom: "8px",
    },
    title: {
        margin: 0,
        fontSize: "16px",
        fontWeight: 600,
    },
    location: {
        fontSize: "13px",
        color: "#6b7280",
    },
    info: {
        fontSize: "14px",
        margin: "12px 0",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
    },
    footer: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    status: {
        padding: "4px 10px",
        borderRadius: "999px",
        fontSize: "12px",
        color: "#fff",
        fontWeight: 500,
    },
    button: {
        border: "none",
        background: "linear-gradient(90deg, #22c55e 0%, #2563eb 100%)",         
        color: "#fff",
        padding: "8px 14px",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "13px",
    },
};


export default function CashTransactionCard({ transaction, moneyCash = "€" }) {

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const [inloadUpdateTransStatus, setInloadUpdateTransStatus] = useState(false);

    return (

        <div style={styles.card}>

            <div style={styles.header}>
                <h3 style={styles.title}>Transaction #{transaction?.code}</h3>
                <span style={styles.location}>{t('paymentMode')}</span>
            </div>

            <div style={styles.info}>

                <div className="flex gap-2">
                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeWidth="1" d="M8 7V6a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-1M3 18v-7a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm8-3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                    </svg>
                    <strong className="flex gap-2"><>{transaction?.price}</><>{moneyCash}</></strong>
                </div>

                <div>📦 {t('quantityNber')}: {transaction?.subproduct_count}</div>

                <div>🕒 {new Date(transaction?.created_at).toLocaleDateString()}</div>

            </div>

            <div style={styles.footer}>

                <span
                    style={{
                        ...styles.status,
                        backgroundColor: STATUS_FLOW_STYLE[STATUS_FLOW_TRANSACTION[transaction?.status]]?.color,
                    }}
                >
                    {STATUS_FLOW_STYLE[STATUS_FLOW_TRANSACTION[transaction?.status]]?.label}

                </span>

                {
                    !inloadUpdateTransStatus?
                    <button
                        className="bg-blue/20 hover:bg-blue-100"
                        onClick={()=>updateStatusTransaction(
                            API_URL_BACKEND?.STATUS_SUB_TRANSACTION,
                            {
                                transaction_id: transaction?.id,
                                new_status:
                                    STATUS_FLOW_SUBTRANSACTION[transaction?.status],
                            },
                            setInloadUpdateTransStatus,
                            dispatch
                        )}
                            disabled={!STATUS_FLOW_SUBTRANSACTION[transaction?.status]}
                        style={{
                            ...styles.button,
                            opacity: STATUS_FLOW_STYLE[STATUS_FLOW_SUBTRANSACTION[transaction?.status]]?.next ? 1 : 0.6,
                        }}
                    >
                        {
                            transaction?.status
                            ? STATUS_FLOW_SUBTRANSACTION[transaction?.status]
                            : "✅"
                        }

                    </button>
                    :
                    <LoadingCard/>
                }

            </div>

        </div>
    );
}
