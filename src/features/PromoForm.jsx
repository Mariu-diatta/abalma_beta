import React, { useState } from "react";
import api from "../services/Axios";

const PromoCodeForm = ({ product_id }) => {
    const [code, setCode] = useState("");
    const [discountPercent, setDiscountPercent] = useState("");
    const [discountAmount, setDiscountAmount] = useState("");
    const [expiresAt, setExpiresAt] = useState("");

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
        <div>

            {/* bouton ouverture */}
            <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                onClick={() => setShow(true)}
            >
                Ajouter une promo
            </button>

            {/* modal */}
            {show && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-100 h-100">
                    <div className="bg-white rounded-xl p-6 w-96 shadow-lg relative">

                        {/* fermer */}
                        <button
                            className="absolute top-2 right-3 text-gray-500 hover:text-black"
                            onClick={() => setShow(false)}
                        >
                            ✕
                        </button>

                        <h2 className="text-lg font-semibold mb-4">
                            Créer un code promo
                        </h2>

                        {/* CODE */}
                        <input
                            className="w-full border p-2 rounded mb-3"
                            placeholder="Code promo (ex: WELCOME10)"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                        />

                        {/* % REDUCTION */}
                        <input
                            className="w-full border p-2 rounded mb-3"
                            placeholder="% réduction"
                            type="number"
                            value={discountPercent}
                            onChange={(e) => setDiscountPercent(e.target.value)}
                        />

                        {/* MONTANT FIXE */}
                        <input
                            className="w-full border p-2 rounded mb-3"
                            placeholder="Montant réduction (€)"
                            type="number"
                            value={discountAmount}
                            onChange={(e) => setDiscountAmount(e.target.value)}
                        />

                        {/* EXPIRATION */}
                        <input
                            className="w-full border p-2 rounded mb-3"
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

                    </div>
                </div>
            )}
        </div>
    );
};

export default PromoCodeForm;