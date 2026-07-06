import { useEffect, useState } from "react";
import CountrySelect from "../components/CountrySelect";
import { COUNTRIES } from "../utils";

const styles = {
    card: {
        background: "linear-gradient(145deg, #ffffff, #f9fafb)",
        border: "1px solid #e5e7eb",
        borderRadius: "18px",
        padding: "18px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.04)",
        transition: "all 0.25s ease",
        maxWidth: "420px",
    },

    top: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "12px",
    },

    label: {
        fontSize: "13px",
        color: "#6b7280",
        marginBottom: "4px",
    },

    valueRow: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
    },

    value: {
        fontSize: "16px",
        fontWeight: "600",
        color: "#111827",
    },

    badge: {
        fontSize: "11px",
        padding: "2px 8px",
        borderRadius: "999px",
        background: "#eef2ff",
        color: "#4f46e5",
        fontWeight: "600",
    },

    editingText: {
        fontSize: "13px",
        color: "#f59e0b",
    },

    editBtn: {
        padding: "6px 12px",
        borderRadius: "10px",
        border: "1px solid #e5e7eb",
        background: "#fff",
        cursor: "pointer",
        fontSize: "13px",
        fontWeight: "500",
        transition: "0.2s",
    },

    editBox: {
        marginTop: "12px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
    },

    input: {
        padding: "10px 12px",
        borderRadius: "12px",
        border: "1px solid #d1d5db",
        outline: "none",
        fontSize: "14px",
        letterSpacing: "1px",
    },

    actions: {
        display: "flex",
        gap: "10px",
        justifyContent: "flex-end",
    },

    cancelBtn: {
        padding: "8px 12px",
        borderRadius: "10px",
        border: "1px solid #e5e7eb",
        background: "#f9fafb",
        cursor: "pointer",
    },

    saveBtn: {
        padding: "8px 14px",
        borderRadius: "10px",
        border: "none",
        background: "#111827",
        color: "#fff",
        cursor: "pointer",
        fontWeight: "600",
    },
};

export default function CountryField({ value, onSave, disabled = false, t }) {
    const [editing, setEditing] = useState(false);
    const [country, setCountry] = useState(value || "");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setCountry(value || "");
    }, [value]);

    const handleSave = async () => {
        setLoading(true);
        try {
            await onSave(country);
            setEditing(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.card}>
            {/* HEADER */}
            <div style={styles.top}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={styles.label}>{t("settingsText.countryResidence")}</span>

                    {!editing ? (
                        <div style={styles.valueRow}>
                            <span style={styles.value}>
                                {COUNTRIES[value]?.name || "Non renseigné"}
                            </span>

                            {value && (
                                <span style={styles.badge}>ISO</span>
                            )}
                        </div>
                    ) : (
                        <span style={styles.editingText}>{t("loading")}</span>
                    )}
                </div>

                {!disabled && !editing && (
                    <button style={styles.editBtn} onClick={() => setEditing(true)}>
                        {t("settingsText.edit")}
                    </button>
                )}
            </div>

            {/* EDIT */}
            {editing && (
                <div style={styles.editBox}>

                    <CountrySelect
                        value={country}
                        onChange={setCountry}
                        t={t}
                    />

                    <div style={styles.actions}>
                        <button
                            style={styles.cancelBtn}
                            onClick={() => setEditing(false)}
                        >
                            {t("ProfilText.annuler")}
                        </button>

                        <button
                            style={styles.saveBtn}
                            onClick={handleSave}
                            disabled={loading}
                        >
                            {loading ? "..." : t("settingsText.save")}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}