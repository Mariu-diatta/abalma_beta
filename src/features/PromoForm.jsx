import React, { useState } from "react";
import api from "../services/Axios";
import { createPortal } from "react-dom";
import { useTranslation } from 'react-i18next';

const PromoCodeForm = ({ product_id }) => {
    const [code, setCode] = useState("");
    const [discountPercent, setDiscountPercent] = useState("");
    const [discountAmount, setDiscountAmount] = useState("");
    const [expiresAt, setExpiresAt] = useState("");
    const { t } = useTranslation();

    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const createPromo = async () => {
        if (!product_id) {
            alert("Produit manquant");
            return;
        }

        if (!code) {
            setError("Le code est obligatoire");
            return;
        }

        if (!discountPercent && !discountAmount) {
            setError("Ajoute une réduction (pourcentage ou montant)");
            return;
        }

        if (discountPercent && discountAmount) {
            setError("Choisis soit % soit montant fixe");
            return;
        }

        try {
            setLoading(true);
            setError("");

            await api.post("/seller/create-promo/", {
                product:product_id,
                code:code,
                discount_percent: discountPercent || null,
                discount_amount: discountAmount || null,
                expires_at: expiresAt || null,
                active: true
            });

            setShow(false);
            setCode("");
            setDiscountPercent("");
            setDiscountAmount("");
            setExpiresAt("");

            alert("Promo créée !");
        } catch (err) {
            console.log(err)
            setError("Erreur lors de la création");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="blog-modal-root">

            {/* bouton ouverture */}
            <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                onClick={() => setShow(true)}
            >
                {t("add_promo")}
            </button>

            {/* modal */}
            {show && createPortal(
                <div
                    className="blog-overlay"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="blog-modal-title"
                >
                    <div className="blog-panel">
                    <form className="blog-body">

                        {/* fermer */}
                        <button
                            className="absolute top-2 right-3 text-gray-500 hover:text-black"
                            onClick={() => setShow(false)}
                        >
                            ✕
                        </button>

                        <h2 className="text-lg font-semibold mb-4">
                            {t("add_promo")}
                        </h2>

                        {/* CODE */}
                        <input
                            className="blog-input"
                            placeholder="Code promo (ex: WELCOME10)"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                        />

                        {/* % REDUCTION */}
                        <input
                            className="blog-input"
                            placeholder="% réduction"
                            type="number"
                            value={discountPercent}
                            onChange={(e) => setDiscountPercent(e.target.value)}
                        />

                        {/* MONTANT FIXE */}
                        <input
                            className="blog-input"
                            placeholder="Montant réduction (€)"
                            type="number"
                            value={discountAmount}
                            onChange={(e) => setDiscountAmount(e.target.value)}
                        />

                        {/* EXPIRATION */}
                        <input
                            className="blog-input"
                            type="date"
                            value={expiresAt}
                            onChange={(e) => setExpiresAt(e.target.value)}
                        />

                        {/* erreur */}
                        {error && (
                            <p className="text-red-500 text-sm mb-2">{error}</p>
                        )}

                        {/* actions */}
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShow(false)}
                                className="px-4 py-2 bg-gray-200 rounded"
                            >
                                Annuler
                            </button>

                            <button
                                onClick={createPromo}
                                disabled={loading}
                                className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
                            >
                                {loading ? "Création..." : "Créer"}
                            </button>
                        </div>

                        </form>
                    </div>
                </div>, document.body
            )}
        </div>
    );
};

export default PromoCodeForm;