import React, { useState } from "react";
import LoadingCard from "../components/LoardingSpin";
import { canUpdateDelete } from "../utils";
import api from "../services/Axios";

// ─── Icône statut ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
    const config = {
        success: { bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-400" },
        pending: { bg: "bg-amber-50", text: "text-amber-600", dot: "bg-amber-400" },
        failed: { bg: "bg-red-50", text: "text-red-500", dot: "bg-red-400" },
    };
    const s = status?.toLowerCase();
    const style = config[s] ?? { bg: "bg-gray-50", text: "text-gray-500", dot: "bg-gray-400" };

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide whitespace-nowrap ${style.bg} ${style.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
            {status}
        </span>
    );
};

// ─── Ligne de détail ──────────────────────────────────────────────────────────
const DetailRow = ({ label, value }) => (
    <div className="flex items-center justify-between gap-6 py-1.5">
        <span className="text-xs text-gray-400 font-medium uppercase tracking-wide shrink-0">
            {label}
        </span>
        <span className="text-sm text-gray-700 font-medium text-right truncate">
            {value}
        </span>
    </div>
);

// ─── Bouton d'action ──────────────────────────────────────────────────────────
const ActionButton = ({ onClick, disabled, loading, label, variant = "default" }) => {
    if (loading) return <LoadingCard />;

    const styles = {
        default: "border border-gray-200 text-gray-600 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600",
        danger: "border border-gray-200 text-gray-400 hover:bg-red-50 hover:border-red-300 hover:text-red-500",
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
                flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl
                bg-white transition-all duration-200
                disabled:opacity-40 disabled:cursor-not-allowed
                ${styles[variant]}
            `}
        >
            {variant === "danger" && (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                </svg>
            )}
            {label}
        </button>
    );
};

// ─── Composant principal ──────────────────────────────────────────────────────
const TransactionAndSubTransactionCard = ({
    title = "Sous-transaction",
    icon,
    status,
    createdAt,
    code,
    price,
    pk,
    url,
    data,
    setData,
    setDeleted,
    priceLabel,
    showAction,
    isLoading,
    actionLabel,
    onClick,
    actionDisabled,
}) => {
    const [loadingDelete, setLoadingDelete] = useState(false);

    const handleDelete = async () => {
        setLoadingDelete(true);
        try {
            await api.delete(`${url}/${pk}/`, { params: { mode: "sell" } });
            setData(() => data.filter((el) => el?.id !== pk));
            setDeleted(true);
        } catch (err) {
            alert(err?.response?.data?.detail || "Erreur lors de la suppression");
            setDeleted(false);
        } finally {
            setLoadingDelete(false);
        }
    };

    const canDelete = canUpdateDelete?.includes(status);
    const hasActions = canDelete || (showAction && actionLabel);

    return (
        <div className="relative bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden w-full max-w-sm">

            {/* Accent coloré en haut */}
            <div className="h-1 w-full bg-gradient-to-r from-indigo-400 via-violet-400 to-blue-400" />

            <div className="p-5 flex flex-col gap-4">

                {/* ── Header ── */}
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                        {icon && (
                            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 text-indigo-500 shrink-0">
                                {icon}
                            </span>
                        )}
                        <span className="text-sm font-semibold text-gray-800 tracking-tight">
                            {title}
                        </span>
                    </div>
                    <StatusBadge status={status} />
                </div>

                {/* ── Détails ── */}
                <div className="bg-gray-50 rounded-xl px-4 py-1 divide-y divide-gray-100">
                    <DetailRow label="Date" value={createdAt} />
                    <DetailRow label="Code" value={code} />
                    <DetailRow label={priceLabel ?? "Montant"} value={price} />
                </div>

                {/* ── Actions ── */}
                {hasActions && (
                    <div className="flex items-center justify-end gap-2 pt-1">
                        {canDelete && (
                            <ActionButton
                                onClick={handleDelete}
                                loading={loadingDelete}
                                label="Supprimer"
                                variant="danger"
                            />
                        )}
                        {showAction && actionLabel && (
                            <ActionButton
                                onClick={onClick}
                                disabled={actionDisabled}
                                loading={isLoading}
                                label={actionLabel}
                                variant="default"
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TransactionAndSubTransactionCard;