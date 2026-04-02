import React, { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import {
    API_URL_BACKEND,
    STATUS_FLOW_STYLE,
    STATUS_FLOW_SUBTRANSACTION,
    STATUS_FLOW_TRANSACTION,
    updateStatusTransaction,
} from "../utils";
import LoadingCard from "../components/LoardingSpin";


// ─── Icône wallet ──────────────────────────────────────────────────────────────
const WalletIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path stroke="currentColor" strokeLinecap="round" strokeWidth="1.8"
            d="M8 7V6a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-1M3 18v-7a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm8-3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
    </svg>
);

// ─── Ligne d'info ─────────────────────────────────────────────────────────────
const InfoRow = ({ icon, label, value }) => (
    <div className="ctc-row">
        <span className="ctc-row-icon" aria-hidden="true">{icon}</span>
        <span className="ctc-row-label">{label}</span>
        <span className="ctc-row-value">{value}</span>
    </div>
);

// ─── Composant principal ──────────────────────────────────────────────────────
export default function CashTransactionCard({ transaction, setSearchTransactionByCode }) {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [isUpdating, setIsUpdating] = useState(false);

    // Données dérivées
    const currency = transaction?.items?.[0]?.product?.currency_price ?? '';
    const statusKey = STATUS_FLOW_TRANSACTION[transaction?.status];
    const statusInfo = STATUS_FLOW_STYLE[statusKey];
    const nextStatus = STATUS_FLOW_SUBTRANSACTION[transaction?.status];
    const canAdvance = !!nextStatus;
    const formattedDate = transaction?.created_at
        ? new Date(transaction.created_at).toLocaleDateString()
        : '—';

    // ── Mise à jour du statut ──
    const handleStatusUpdate = useCallback(async () => {
        if (!canAdvance) return;
        try {
            const resp = await updateStatusTransaction(
                API_URL_BACKEND?.STATUS_SUB_TRANSACTION,
                { sub_transaction_id: transaction?.id, new_status: nextStatus },
                setIsUpdating,
                dispatch
            );
            setSearchTransactionByCode((prev) =>
                prev.map((el) =>
                    el.id === transaction?.id ? { ...el, status: resp?.new_status } : el
                )
            );
        } catch (err) {
            console.error('Erreur mise à jour statut :', err);
        }
    }, [canAdvance, nextStatus, transaction?.id, setSearchTransactionByCode, dispatch]);

    return (
        <>
            <article className="ctc-card" aria-label={`Transaction #${transaction?.code}`}>

                {/* Header */}
                <div className="ctc-header">
                    <h3 className="ctc-title">{t('paymentMode')}</h3>
                    <span className="ctc-code">#{transaction?.code}</span>
                </div>

                {/* Infos */}
                <div className="ctc-rows">
                    <InfoRow
                        icon={<WalletIcon />}
                        label={t('price') || 'Montant'}
                        value={`${transaction?.price ?? '—'} ${currency}`}
                    />
                    <InfoRow
                        icon="📦"
                        label={t('quantityNber') || 'Quantité'}
                        value={transaction?.subproduct_count ?? '—'}
                    />
                    <InfoRow
                        icon="🕒"
                        label={t('date') || 'Date'}
                        value={formattedDate}
                    />
                </div>

                <div className="ctc-divider" />

                {/* Footer : statut + action */}
                <div className="ctc-footer">
                    {statusInfo && (
                        <span
                            className="ctc-badge"
                            style={{ backgroundColor: statusInfo.color }}
                            aria-label={`Statut : ${statusInfo.label}`}
                        >
                            <span className="ctc-badge-dot" />
                            {statusInfo.label}
                        </span>
                    )}

                    {isUpdating ? (
                        <LoadingCard />
                    ) : (
                        <button
                            type="button"
                            className="ctc-action-btn"
                            onClick={handleStatusUpdate}
                            disabled={!canAdvance}
                            aria-label={canAdvance ? `Passer au statut : ${nextStatus}` : 'Aucune action disponible'}
                            title={canAdvance ? nextStatus : 'Statut final'}
                        >
                            {canAdvance ? nextStatus : '✅'}
                        </button>
                    )}
                </div>

            </article>
        </>
    );
}