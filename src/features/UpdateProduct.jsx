import React, { useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import api from "../services/Axios";
import AttentionAlertMesage, { showMessage } from "../components/AlertMessage";
import { addMessageNotif } from "../slices/chatSlice";
import LoadingCard from "../components/LoardingSpin";
//import { ButtonSimple } from "../components/Button";
//import TitleCompGen from "../components/TitleComponentGen";
import FormElementFileUpload from "./FormFile";
import InputBox from "../components/InputBoxFloat";
import { ENDPOINTS, LIST_CATEGORIES_KEYS, PAYEMENTMODE, availableColors, availableSizes, socialLinks } from "../utils";
import { NavLink } from "react-router-dom";
import { setCurrentNav } from "../slices/navigateSlice";
import LocationSearchPopover from "./LocationSearch";
import { FaDollarSign, FaBoxes, FaTruck, FaTag, FaCheckCircle, FaTimesCircle, FaEdit, FaTrash } from "react-icons/fa";

// ─── Styles globaux ───────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

  .ap-root * { font-family: 'Outfit', sans-serif; }
  .ap-mono    { font-family: 'DM Mono', monospace; }

  @keyframes ap-slide-in {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes ap-fade {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes ap-check-pop {
    0%   { transform: scale(0.6); opacity: 0; }
    60%  { transform: scale(1.25); }
    100% { transform: scale(1);   opacity: 1; }
  }

  .ap-section   { animation: ap-slide-in .35s ease both; }
  .ap-fade      { animation: ap-fade .25s ease both; }
  .ap-check-pop { animation: ap-check-pop .3s ease both; }

  /* Stepper */
  .ap-stepper { display: flex; align-items: center; gap: 0; margin-bottom: 32px; }
  .ap-step-dot {
    width: 32px; height: 32px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: .78rem; font-weight: 700;
    transition: background .25s, box-shadow .25s, transform .2s;
    flex-shrink: 0;
  }
  .ap-step-dot.done {
    background: #10b981; color: #fff;
    box-shadow: 0 0 0 4px rgba(16,185,129,.18);
  }
  .ap-step-dot.active {
    background: #f97316; color: #fff;
    box-shadow: 0 0 0 6px rgba(249,115,22,.2);
    transform: scale(1.12);
  }
  .ap-step-dot.pending { background: #f1f5f9; color: #94a3b8; }
  .ap-step-line {
    flex: 1; height: 2px;
    background: linear-gradient(to right, #10b981, #e2e8f0);
    min-width: 12px;
  }
  .ap-step-line.pending { background: #e2e8f0; }

  /* Card formulaire */
  .ap-card {
    background: rgba(255,255,255,.88);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255,255,255,.9);
    border-radius: 20px;
    box-shadow: 0 8px 40px rgba(15,23,42,.08), 0 1px 0 rgba(255,255,255,.8) inset;
    padding: 28px 24px;
  }

  /* Section title */
  .ap-section-title {
    font-size: .72rem;
    font-weight: 700;
    letter-spacing: .1em;
    text-transform: uppercase;
    color: #f97316;
    margin-bottom: 18px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .ap-section-title::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(to right, rgba(249,115,22,.3), transparent);
  }

  /* Field */
  .ap-field { margin-bottom: 16px; }
  .ap-label {
    display: block;
    font-size: .75rem; font-weight: 600;
    letter-spacing: .05em;
    color: #64748b;
    margin-bottom: 6px;
    text-transform: uppercase;
  }
  .ap-input, .ap-select, .ap-textarea {
    width: 100%;
    padding: 11px 14px;
    border-radius: 12px;
    border: 1.5px solid #e2e8f0;
    background: #f8fafc;
    font-family: 'Outfit', sans-serif;
    font-size: .92rem;
    color: #0f172a;
    outline: none;
    transition: border-color .2s, box-shadow .2s, background .2s;
    box-sizing: border-box;
  }
  .ap-input:focus, .ap-select:focus, .ap-textarea:focus {
    border-color: #f97316;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(249,115,22,.12);
  }
  .ap-select {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23f97316' stroke-width='1.8' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
    padding-right: 36px;
    cursor: pointer;
  }
  .ap-textarea { resize: none; line-height: 1.6; }
  .ap-char-count {
    text-align: right;
    font-size: .7rem;
    color: #94a3b8;
    margin-top: 4px;
  }

  /* Bouton primaire */
  .ap-btn-primary {
    background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
    color: #fff;
    font-family: 'Outfit', sans-serif;
    font-weight: 600;
    font-size: .9rem;
    border-radius: 12px;
    padding: 11px 24px;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: transform .15s, box-shadow .15s, filter .15s;
    box-shadow: 0 4px 16px rgba(249,115,22,.35);
  }
  .ap-btn-primary:hover  { filter: brightness(1.07); transform: translateY(-1px); box-shadow: 0 6px 22px rgba(249,115,22,.45); }
  .ap-btn-primary:active { transform: scale(.97); }

  /* Bouton next */
  .ap-btn-next {
    margin-top: 20px;
    background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
    border: 1.5px solid #e2e8f0;
    border-radius: 10px;
    padding: 8px 20px;
    font-weight: 600;
    font-size: .85rem;
    color: #475569;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: background .2s, border-color .2s, transform .15s;
  }
  .ap-btn-next:hover { background: #e2e8f0; border-color: #f97316; color: #f97316; transform: translateX(2px); }

  /* Sélecteurs couleur / taille */
  .ap-opt-color {
    width: 24px; height: 24px;
    border-radius: 50%;
    border: 2px solid #e2e8f0;
    cursor: pointer;
    transition: transform .15s, border-color .15s, box-shadow .15s;
  }
  .ap-opt-color:hover { transform: scale(1.15); }
  .ap-opt-color.selected { border-color: #10b981; box-shadow: 0 0 0 3px rgba(16,185,129,.2); transform: scale(1.15); }
  .ap-opt-size {
    padding: 4px 12px;
    border-radius: 999px;
    border: 1.5px solid #e2e8f0;
    font-size: .8rem; font-weight: 600;
    cursor: pointer;
    background: #f8fafc; color: #475569;
    transition: all .15s;
  }
  .ap-opt-size:hover { border-color: #f97316; color: #f97316; }
  .ap-opt-size.selected { background: #f97316; border-color: #f97316; color: #fff; }

  /* Variant image card */
  .ap-variant-card {
    display: flex;
    gap: 14px;
    padding: 12px;
    border-radius: 14px;
    border: 1.5px solid #f1f5f9;
    background: #f8fafc;
    transition: box-shadow .2s;
  }
  .ap-variant-card:hover { box-shadow: 0 4px 16px rgba(15,23,42,.07); }

  /* Résumé produit */
  .ap-summary-card {
    background: linear-gradient(145deg, #fff 0%, #fafafa 100%);
    border: 1.5px solid #f1f5f9;
    border-radius: 20px;
    padding: 28px;
    box-shadow: 0 8px 40px rgba(15,23,42,.08);
    max-width: 760px;
    margin: 0 auto;
  }
  .ap-summary-field {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    background: #f8fafc;
    border: 1px solid #f1f5f9;
    border-radius: 12px;
    padding: 12px 14px;
    transition: box-shadow .2s;
  }
  .ap-summary-field:hover { box-shadow: 0 2px 10px rgba(15,23,42,.06); }

  /* Social row */
  .ap-social-row {
    display: flex;
    align-items: center;
    gap: 10px;
    background: #f8fafc;
    border-radius: 12px;
    border: 1.5px solid #e2e8f0;
    padding: 4px 12px 4px 12px;
    transition: border-color .2s;
  }
  .ap-social-row:focus-within { border-color: #f97316; }
  .ap-social-row .ap-input { border: none; background: transparent; padding-left: 0; box-shadow: none; }
  .ap-social-row .ap-input:focus { box-shadow: none; }

  /* Vérification requise */
  .ap-verify-banner {
    display: flex;
    align-items: center;
    gap: 10px;
    background: #fff7ed;
    border: 1.5px solid #fed7aa;
    border-radius: 12px;
    padding: 10px 14px;
    font-size: .875rem;
    color: #c2410c;
    margin-bottom: 16px;
  }
`;

// ─── Constantes ───────────────────────────────────────────────────────────────
const INITIAL_PRODUCT = {
    code_reference: "", name_product: "", description_product: "",
    categorie_product: null, operation_product: null,
    price_product: null, discount_price: null, currency_price: null,
    promotion: false, quantity_product: 1, is_available: false,
    delivery: null, shipping_price: null, adress: "",
    date_emprunt: null, date_fin_emprunt: null, type_choice: null,
    payment_method: null, social_links: null, is_active: false,
    is_verified: false, commission_percentage: null, images: [], variants: [],
};

//const STEPS = ["Infos", "Détails", "Paiement", "Livraison"];

const STEP_ICONS = ["📦", "🖼", "💳", "🚚"];

// ─── Micro-composants ─────────────────────────────────────────────────────────

const NextArrow = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
    </svg>
);

const SectionTitle = ({ icon, text }) => (
    <div className="ap-section-title">
        <span>{icon}</span> {text}
    </div>
);

const Field = ({ label, children }) => (
    <div className="ap-field">
        {label && <label className="ap-label">{label}</label>}
        {children}
    </div>
);

// ─── Stepper ──────────────────────────────────────────────────────────────────
const Stepper = ({ current, total }) => (
    <div className="ap-stepper">
        {Array.from({ length: total }).map((_, i) => {
            const state = i + 1 < current ? "done" : i + 1 === current ? "active" : "pending";
            return (
                <React.Fragment key={i}>
                    <div className={`ap-step-dot ${state}`}>
                        {state === "done" ? "✓" : i + 1}
                    </div>
                    {i < total - 1 && <div className={`ap-step-line ${i + 2 > current ? "pending" : ""}`} />}
                </React.Fragment>
            );
        })}
    </div>
);

// ─── Sélecteur d'options ──────────────────────────────────────────────────────
const OptionSelector = ({ options, selectedOption, onSelect, isColor }) => (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", padding: "4px 0" }}>
        {options.map((opt) => {
            const isSelected = selectedOption === opt;
            if (isColor) {
                return (
                    <button
                        key={opt}
                        type="button"
                        title={opt}
                        onClick={() => onSelect(opt)}
                        className={`ap-opt-color ${isSelected ? "selected" : ""}`}
                        style={{ backgroundColor: opt }}
                    />
                );
            }
            return (
                <button
                    key={opt}
                    type="button"
                    onClick={() => onSelect(opt)}
                    className={`ap-opt-size ${isSelected ? "selected" : ""}`}
                >
                    {opt}
                </button>
            );
        })}
    </div>
);

// ─── Variant image ────────────────────────────────────────────────────────────
const ImageVariantCard = ({ imgIndex, imageVariants, setImageVariants }) => {
    const img = imageVariants[imgIndex];

    const updateVariant = useCallback((key, value) => {
        setImageVariants((prev) => {
            const updated = [...prev];
            updated[imgIndex] = { ...updated[imgIndex], [key]: value };
            return updated;
        });
    }, [imgIndex, setImageVariants]);

    const removeVariant = () =>
        setImageVariants((prev) => prev.filter((_, i) => i !== imgIndex));

    return (
        <div className="ap-variant-card ap-section">
            <div style={{ position: "relative", flexShrink: 0 }}>
                <img
                    src={img.preview}
                    alt="preview"
                    style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 10, border: "1.5px solid #e2e8f0" }}
                />
                <button
                    type="button"
                    onClick={removeVariant}
                    style={{
                        position: "absolute", top: -6, right: -6,
                        width: 20, height: 20, borderRadius: "50%",
                        background: "#ef4444", color: "#fff", border: "2px solid #fff",
                        cursor: "pointer", fontSize: ".7rem", fontWeight: 700,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        lineHeight: 1,
                    }}
                >×</button>
            </div>
            <div style={{ flex: 1 }}>
                <div style={{ marginBottom: 6 }}>
                    <span className="ap-label">Couleur</span>
                    <OptionSelector options={availableColors} selectedOption={img.color} onSelect={(v) => updateVariant("color", v)} isColor />
                </div>
                <div>
                    <span className="ap-label">Taille</span>
                    <OptionSelector options={availableSizes} selectedOption={img.size} onSelect={(v) => updateVariant("size", v)} />
                </div>
            </div>
        </div>
    );
};

// ─── Composant principal ──────────────────────────────────────────────────────
const AddUploadProduct = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const bottomRef = useRef(null);

    const user = useSelector((state) => state.auth.user);
    const [isProductAdded, setIsProductAdded] = useState(false);
    const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
    const [currentSection, setCurrentSection] = useState(1);
    const [imageVariants, setImageVariants] = useState([]);
    const [imageLoaded, setImageLoaded] = useState(null);
    const [dataProduct, setDataProduct] = useState(INITIAL_PRODUCT);

    const isUserVerified = user?.is_fournisseur && user?.is_verified;
    const isLoanOptionSelected = dataProduct.operation_product === "PRETER";

    const notify = (type, msg) => showMessage(dispatch, { Type: type, Message: msg });

    const getAdress = (newAdress) =>
        setDataProduct((prev) => ({ ...prev, adress: newAdress }));

    const onChangeClick = (e) => {
        const { name, value } = e.target;
        setDataProduct((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileSelect = (files) => {
        const newImages = Array.from(files).map((file) => ({
            file,
            preview: URL.createObjectURL(file),
            color: null,
            size: null,
        }));
        setImageVariants((prev) => [...prev, ...newImages]);
    };

    const nextSection = () => {
        setCurrentSection((prev) => prev + 1);
        requestAnimationFrame(() => {
            setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
        });
    };

    const formatToISOString = (datetimeStr) => {
        if (!datetimeStr) return null;
        const date = new Date(datetimeStr);
        return isNaN(date.getTime()) ? null : date.toISOString();
    };

    const validateProduct = () => {
        if (!dataProduct.name_product) return "Nom du produit obligatoire";
        if (dataProduct.price_product === null || dataProduct.price_product === "") return "Prix obligatoire";
        if (dataProduct.currency_price === null) return "Devise obligatoire";
        if (dataProduct.categorie_product === "") return "Catégorie obligatoire";
        if (dataProduct.adress === "") return "Adresse obligatoire";
        if (dataProduct.operation_product === "") return "Type d'opération obligatoire";
        if (!dataProduct.payment_method === "") return "Mode de paiement obligatoire";
        for (const img of imageVariants) {
            if (!img.color || !img.size) return "Chaque image doit avoir une couleur et une taille";
        }
        return null;
    };

    const saveDataForSubmitForm = (e) => {
        e.preventDefault();
        const error = validateProduct();
        if (error) { notify("Erreur", error); return; }
        setIsProductAdded(true);
    };

    const submitForm = async (e) => {
        e.preventDefault();
        const error = validateProduct();
        if (error) { notify("Erreur", error); return; }

        setIsLoadingSubmit(true);
        try {
            const formData = new FormData();
            const social_links = {};
            ["link_facebook", "link_instagramme", "link_tiktok", "link_twitter"].forEach((key) => {
                if (dataProduct[key]) social_links[key.replace("link_", "")] = dataProduct[key];
            });

            const variantsToSend = imageVariants.map((img) => {
                formData.append("variant_images", img.file);
                return { color: img.color, size: img.size };
            });

            Object.entries(dataProduct).forEach(([key, value]) => {
                if (!socialLinks.includes(key)) formData.append(key, value ?? "");
            });

            formData.append("price_product", Number(dataProduct?.price_product));
            formData.append("social_links", JSON.stringify(social_links));
            formData.append("variants", JSON.stringify(variantsToSend));

            if (isLoanOptionSelected) {
                formData.append("date_emprunt", formatToISOString(dataProduct.date_emprunt));
                formData.append("date_fin_emprunt", formatToISOString(dataProduct.date_fin_emprunt));
            }

            const category = await api.post("/categories/", { name: dataProduct.categorie_product });
            formData.set("categorie_product", category?.data?.slug);

            await api.post("/produits/", formData, { headers: { "Content-Type": "multipart/form-data" } });

            notify("Message", "Produit créé avec succès !");
            dispatch(addMessageNotif(`Produit ${dataProduct?.code_reference} créé`));

            setDataProduct(INITIAL_PRODUCT);
            setImageVariants([]);
            setIsProductAdded(false);
        } catch (err) {
            console.error(err);
            notify("Erreur", "Erreur lors de la création du produit");
        } finally {
            setIsLoadingSubmit(false);
        }
    };

    const handleEditProduct = () => {
        setCurrentSection(5);
        setDataProduct({ ...dataProduct });
        setIsProductAdded(false);
        setIsLoadingSubmit(false);
    };

    const handleDeleteProduct = () => {
        setDataProduct({ ...INITIAL_PRODUCT });
        setIsProductAdded(false);
        setCurrentSection(1);
        setImageVariants([]);
        setIsLoadingSubmit(false);
    };

    const handleSubmitNew = (e) => {
        submitForm(e);
        if (!isLoadingSubmit) {
            setIsLoadingSubmit(false);
            setIsProductAdded(false);
            setImageVariants([]);
        }
    };

    // ── Rendu ──
    return (
        <>
            <style>{styles}</style>

            <div
                className="ap-root"
                style={{
                    minHeight: "100vh",
                    background: "",
                    padding: "32px 16px 80px",
                }}
            >
                {/* Titre */}
                {/*linear-gradient(160deg, #fff7ed 0%, #fff 40%, #fef3c7 100%)*/}
                {!isProductAdded && (
                    <div className="ap-fade" style={{ maxWidth: 560, margin: "0 auto 24px", textAlign: "center" }}>
                        {/*<p style={{*/}
                        {/*    fontFamily: "'Outfit',sans-serif", fontSize: ".72rem", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase",*/}
                        {/*    color: "#f97316", marginBottom: 4*/}
                        {/*}}>*/}
                        {/*    Marketplace*/}
                        {/*</p>*/}
                        <h1 style={{ fontFamily: "'Outfit',sans-serif", fontSize: "clamp(1.4rem,4vw,1.9rem)", fontWeight: 700, color: "#0f172a", margin: "0 0 8px" }}>
                            {t("add_product.add_or_update_product")}
                        </h1>
                        {!isUserVerified && (
                            <div className="ap-verify-banner" style={{ maxWidth: 400, margin: "12px auto 0" }}>
                                <span>⚠️</span>
                                <NavLink
                                    to={`/${ENDPOINTS.USER_PROFIL}`}
                                    style={{ color: "#c2410c", textDecoration: "underline", fontWeight: 600 }}
                                    onClick={() => dispatch(setCurrentNav(ENDPOINTS.USER_PROFIL))}
                                >
                                    {t("verifyAccount")}
                                </NavLink>
                            </div>
                        )}
                    </div>
                )}

                {isProductAdded && (
                    <div className="ap-fade" style={{ maxWidth: 560, margin: "0 auto 24px", textAlign: "center" }}>
                        <h1 style={{ fontFamily: "'Outfit',sans-serif", fontSize: "1.6rem", fontWeight: 700, color: "#0f172a" }}>
                            {t("product_summary")}
                        </h1>
                    </div>
                )}

                <div style={{ marginBottom: 16, maxWidth: 560, margin: "0 auto 16px" }}>
                    <AttentionAlertMesage />
                </div>

                {isProductAdded ? (
                    <ProductSummary
                        isLoading={isLoadingSubmit}
                        product={dataProduct}
                        t={t}
                        onEdit={handleEditProduct}
                        onDelete={handleDeleteProduct}
                        onAddNew={handleSubmitNew}
                    >
                        {imageLoaded && (
                            <img src={imageLoaded} alt="aperçu" style={{ width: 160, height: 160, objectFit: "cover", borderRadius: 14, border: "2px solid #e2e8f0" }} />
                        )}
                    </ProductSummary>
                ) : (
                    <div
                        className="ap-card"
                        style={{ maxWidth: 560, margin: "0 auto" }}
                    >
                        {/* Stepper */}
                        <Stepper current={currentSection} total={4} />

                        <form
                            onSubmit={saveDataForSubmitForm}
                            style={{ opacity: isUserVerified ? 1 : .5, pointerEvents: isUserVerified ? "auto" : "none" }}
                        >
                            {/* ── Section 1 : Infos ── */}
                            {currentSection >= 1 && (
                                <div className="ap-section">
                                    <SectionTitle icon={STEP_ICONS[0]} text={t("add_product.informations")} />

                                    <Field label="Nom du produit">
                                        <InputBox type="text" id="name_product" name="name_product" value={dataProduct?.name_product} onChange={onChangeClick} placeholder="Nom du produit" required className="ap-input" />
                                    </Field>

                                    <Field label={t("price")}>
                                        <InputBox type="number" min="0" id="price_product" name="price_product" value={dataProduct?.price_product} onChange={onChangeClick} placeholder={t("price")} required className="ap-input" />
                                    </Field>

                                    <Field label={t("add_product.select_currency")}>
                                        <select required id="currency_price" name="currency_price" value={dataProduct?.currency_price ?? ""} onChange={onChangeClick} className="ap-select">
                                            <option value="" disabled>{t("add_product.select_currency")}</option>
                                            <option value="EURO">{t("add_product.euro")}</option>
                                            <option value="DOLLAR">{t("add_product.dollar")}</option>
                                            <option value="FRANC">{t("add_product.franc")}</option>
                                        </select>
                                    </Field>

                                    {currentSection < 2 && (
                                        <button type="button" onClick={nextSection} className="ap-btn-next">
                                            Suivant <NextArrow />
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* ── Section 2 : Détails ── */}
                            {currentSection >= 2 && (
                                <div className="ap-section" style={{ marginTop: 24 }}>
                                    <SectionTitle icon={STEP_ICONS[1]} text={t("add_product.details")} />

                                    <Field label={t("add_product.select_category")}>
                                        <select required id="categorie_product" name="categorie_product" value={dataProduct.categorie_product ?? ""} onChange={(e) => setDataProduct((p) => ({ ...p, categorie_product: e.target.value }))} className="ap-select">
                                            <option value="" disabled>{t("add_product.select_category")}</option>
                                            {LIST_CATEGORIES_KEYS?.map((value, idx) => (
                                                <option key={idx} value={value}>{t(`add_product.categories.${value}`)}</option>
                                            ))}
                                        </select>
                                    </Field>

                                    <Field label={t("add_product.ChooseImage")}>
                                        <FormElementFileUpload label={t("add_product.ChooseImage")} getFile={handleFileSelect} getImage={setImageLoaded} multiple />
                                    </Field>

                                    {imageVariants.length > 0 && (
                                        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
                                            {imageVariants.map((_, idx) => (
                                                <ImageVariantCard key={idx} imgIndex={idx} imageVariants={imageVariants} setImageVariants={setImageVariants} />
                                            ))}
                                        </div>
                                    )}

                                    <Field label="Description">
                                        <textarea
                                            id="description_product"
                                            name="description_product"
                                            value={dataProduct?.description_product}
                                            onChange={onChangeClick}
                                            rows="4"
                                            className="ap-textarea"
                                            placeholder="Description du produit entre 20 et 100 caractères..."
                                            required minLength={20} maxLength={100}
                                        />
                                        <p className="ap-char-count">{dataProduct?.description_product?.length ?? 0}/100</p>
                                    </Field>

                                    {currentSection < 3 && (
                                        <button type="button" onClick={nextSection} className="ap-btn-next">
                                            Suivant <NextArrow />
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* ── Section 3 : Paiement ── */}
                            {currentSection >= 3 && (
                                <div className="ap-section" style={{ marginTop: 24 }}>
                                    <SectionTitle icon={STEP_ICONS[2]} text={t("add_product.paimement_infos")} />

                                    <Field label={t("add_product.select_operation")}>
                                        <select required id="operation_product" name="operation_product" value={dataProduct.operation_product ?? ""} onChange={onChangeClick} className="ap-select">
                                            <option value="" disabled>{t("add_product.select_operation")}</option>
                                            <option value="PRETER">{t("add_product.PRETER")}</option>
                                            <option value="VENDRE">{t("add_product.VENDRE")}</option>
                                        </select>
                                    </Field>

                                    {isLoanOptionSelected && (
                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                                            <Field label="Début emprunt">
                                                <InputBox type="datetime-local" id="date_emprunt" name="date_emprunt" value={dataProduct.date_emprunt} onChange={onChangeClick} className="ap-input" />
                                            </Field>
                                            <Field label="Fin emprunt">
                                                <InputBox type="datetime-local" id="date_fin_emprunt" name="date_fin_emprunt" value={dataProduct.date_fin_emprunt} onChange={onChangeClick} className="ap-input" />
                                            </Field>
                                        </div>
                                    )}

                                    <Field label={t("payment_mode")}>
                                        <select required id="payment_method" name="payment_method" value={dataProduct.payment_method ?? ""} onChange={onChangeClick} className="ap-select">
                                            <option value="" disabled>{t("payment_mode")}</option>
                                            <option value={PAYEMENTMODE[0]}>{t("CASH")}</option>
                                            <option value={PAYEMENTMODE[1]}>{t("CARD")}</option>
                                            <option value={PAYEMENTMODE[2]}>{t("MOBILE")}</option>
                                        </select>
                                    </Field>

                                    {currentSection < 4 && (
                                        <button type="button" onClick={nextSection} className="ap-btn-next">
                                            Suivant <NextArrow />
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* ── Section 4 : Livraison & Liens ── */}
                            {currentSection >= 4 && (
                                <div className="ap-section" style={{ marginTop: 24 }}>
                                    <SectionTitle icon={STEP_ICONS[3]} text={t("add_product.informations_livraison")} />

                                    <Field label="Mode de livraison">
                                        <select required id="delivery" name="delivery" value={dataProduct?.delivery ?? ""} onChange={onChangeClick} className="ap-select">
                                            <option value="FREE">{t("add_product.FREE")}</option>
                                            <option value="DELPAID">{t("add_product.DELPAID")}</option>
                                        </select>
                                    </Field>

                                    <Field label="Adresse">
                                        <LocationSearchPopover setLocationSearch={getAdress} />
                                    </Field>

                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                                        <Field label="Prix livraison">
                                            <InputBox type="number" name="shipping_price" min="0" value={dataProduct.shipping_price} onChange={onChangeClick} placeholder="0.00" className="ap-input" />
                                        </Field>
                                        <Field label={t("add_product.quantity")}>
                                            <InputBox type="number" id="quantity_product" name="quantity_product" value={dataProduct?.quantity_product} onChange={onChangeClick} min="1" placeholder="1" className="ap-input" />
                                        </Field>
                                    </div>

                                    {/* Liens sociaux */}
                                    <SectionTitle icon="🔗" text={t("Links")} />
                                    {[
                                        { name: "link_twitter", label: "Twitter", icon: "𝕏" },
                                        { name: "link_facebook", label: "Facebook", icon: "f" },
                                        { name: "link_instagramme", label: "Instagram", icon: "◎" },
                                        { name: "link_tictoc", label: t("TicToc"), icon: "♪" },
                                    ].map(({ name, label, icon }) => (
                                        <div key={name} className="ap-social-row" style={{ marginBottom: 10 }}>
                                            <span style={{ fontSize: ".9rem", fontWeight: 700, color: "#64748b", width: 20, textAlign: "center", flexShrink: 0 }}>{icon}</span>
                                            <InputBox
                                                placeholder={label}
                                                type="url"
                                                id={name}
                                                name={name}
                                                value={dataProduct?.[name] ?? ""}
                                                onChange={onChangeClick}
                                                className="ap-input"
                                            />
                                        </div>
                                    ))}

                                    <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
                                        {isLoadingSubmit ? <LoadingCard /> : (
                                            <button type="submit" className="ap-btn-primary">
                                                Vérifier le produit ✦
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div ref={bottomRef} />
                        </form>
                    </div>
                )}
            </div>
        </>
    );
};

export default AddUploadProduct;


// ─── Champ de résumé ─────────────────────────────────────────────────────────
const ProductField = ({ icon, label, value, isLong }) => {
    if (!value) return null;
    return (
        <div className="ap-summary-field">
            {icon && <div style={{ fontSize: "1.1rem", flexShrink: 0 }}>{icon}</div>}
            <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: ".72rem", fontWeight: 600, letterSpacing: ".05em", textTransform: "uppercase", color: "#94a3b8", marginBottom: 2 }}>
                    {label}
                </p>
                <div style={isLong ? { maxHeight: 80, overflowY: "auto", fontSize: ".9rem", color: "#0f172a" } : { fontSize: ".9rem", color: "#0f172a", fontWeight: 500 }}>
                    {value}
                </div>
            </div>
        </div>
    );
};


// ─── Résumé produit ───────────────────────────────────────────────────────────
const ProductSummary = ({ product, onEdit, onDelete, onAddNew, t, isLoading, children }) => {
    if (!product) return null;

    const fields = [
        { icon: <FaDollarSign style={{ color: "#f59e0b" }} />, label: t("price"), value: `${product.price_product} ${product.currency_price ?? ""}` },
        { icon: <FaBoxes style={{ color: "#3b82f6" }} />, label: t("quantity"), value: product.quantity_product },
        { icon: <FaTruck style={{ color: "#64748b" }} />, label: t("shipping_price"), value: product.shipping_price ? `${product.shipping_price} ${product.currency_price ?? ""}` : null },
        { icon: <FaTag style={{ color: "#a855f7" }} />, label: t("category"), value: product.categorie_product },
        {
            icon: product.is_available ? <FaCheckCircle style={{ color: "#10b981" }} /> : <FaTimesCircle style={{ color: "#ef4444" }} />,
            label: t("availability"), value: product.is_available ? t("yes") : t("no"),
        },
        { icon: product.promotion ? <FaTag style={{ color: "#ec4899" }} /> : null, label: t("promotion"), value: product.promotion ? t("yes") : t("no") },
    ].filter((f) => f.value);

    return (
        <div className="ap-summary-card ap-fade">

            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
                <div>
                    <p style={{ fontSize: ".72rem", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "#f97316", marginBottom: 4 }}>
                        Résumé
                    </p>
                    <h2 style={{ fontFamily: "'Outfit',sans-serif", fontSize: "1.4rem", fontWeight: 700, color: "#0f172a", margin: 0 }}>
                        {product.name_product}
                    </h2>
                </div>
                {product.promotion && (
                    <span style={{ background: "linear-gradient(135deg,#ec4899,#f43f5e)", color: "#fff", padding: "4px 14px", borderRadius: 999, fontSize: ".78rem", fontWeight: 700 }}>
                        {t("promotion")}
                    </span>
                )}
            </div>

            {/* Image */}
            {children && <div style={{ marginBottom: 20 }}>{children}</div>}

            {/* Description */}
            <ProductField label={t("description")} value={product.description_product} isLong />

            {/* Grid de champs */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 10, marginTop: 14 }}>
                {fields.map((f, i) => (
                    <ProductField key={i} icon={f.icon} label={f.label} value={f.value} />
                ))}
            </div>

            {/* Actions */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 24, justifyContent: "flex-end" }}>

                <button
                    onClick={onEdit}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 18px", borderRadius: 10, border: "1.5px solid #bbf7d0", background: "#f0fdf4", color: "#15803d", fontWeight: 600, cursor: "pointer", fontSize: ".87rem", transition: "background .15s" }}
                >
                    <FaEdit /> {t("edit")}
                </button>

                <button
                    onClick={onDelete}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 18px", borderRadius: 10, border: "1.5px solid #fecaca", background: "#fef2f2", color: "#b91c1c", fontWeight: 600, cursor: "pointer", fontSize: ".87rem", transition: "background .15s" }}
                >
                    <FaTrash /> {t("delete")}
                </button>

                {isLoading ? <LoadingCard /> : (
                    <button
                        type="button"
                        onClick={onAddNew}
                        className="ap-btn-primary"
                    >
                        {t("submit")} ✦
                    </button>
                )}
            </div>

        </div>
    );
};