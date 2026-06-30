import React, { useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import api from "../services/Axios";
import AttentionAlertMesage, { showMessage } from "../components/AlertMessage";
import { addMessageNotif } from "../slices/chatSlice";
import LoadingCard from "../components/LoardingSpin";

import FormElementFileUpload from "./FormFile";
import InputBox from "../components/InputBoxFloat";
import { ENDPOINTS, LIST_CATEGORIES_KEYS, PAYEMENTMODE, availableColors, availableSizes, CATEGORY_FIELDS, CONSTANTS } from "../utils";
import { NavLink } from "react-router-dom";
import { setCurrentNav } from "../slices/navigateSlice";
import LocationSearchPopover from "./LocationSearch";
import { FaDollarSign, FaBoxes, FaTruck, FaTag, FaCheckCircle, FaTimesCircle, FaEdit, FaTrash } from "react-icons/fa";
import TitleCompGen from "../components/TitleComponentGen";
import { useEffect } from "react";
import AfficheForm from "./CreatFormPub";

// ─── Constantes ───────────────────────────────────────────────────────────────
const INITIAL_PRODUCT = {
    code_reference: "", name_product: "", description_product: "",
    categorie_product: null, operation_product: null,
    price_product: null, discount_price: null, currency_price: null,
    promotion: false, quantity_product: 1, is_available: false,
    delivery: null, shipping_price: null, address: "",
    date_emprunt: null, date_fin_emprunt: null, type_choice: null,
    payment_method: null, social_links: null, is_active: true,
    is_verified: false, commission_percentage: null, images: [],
    variants: [], "attributes": {}, weight:1.0
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
const OptionSelector = ({ options, selectedOption, onSelect, isColor, t }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    // fermer si clic extérieur
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div style={{ position: "relative", display: "inline-block" }} ref={ref}>

            {/* bouton principal */}
            <button
                type="button"
                onClick={() => setOpen(!open)}
                style={{
                    padding: "6px 10px",
                    border: "1px solid #ccc",
                    borderRadius: 6,
                    background: "#fff",
                    cursor: "pointer",
                }}
            >
                {isColor ? t("couleur") : t("taille")} : {selectedOption || "?"}
            </button>

            {/* popover */}
            {open && (
                <div
                    style={{
                        position: "absolute",
                        top: "110%",
                        left: 0,
                        zIndex: 1000,
                        background: "#fff",
                        border: "1px solid #ddd",
                        borderRadius: 8,
                        padding: 8,
                        display: "flex",
                        gap: 8,
                        flexWrap: "wrap",
                        minWidth: 180,
                        boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                    }}
                >
                    {options.map((opt) => {
                        const isSelected = selectedOption === opt;

                        if (isColor) {
                            return (
                                <button
                                    key={opt}
                                    type="button"
                                    title={opt}
                                    onClick={() => {
                                        onSelect(opt);
                                        setOpen(false);
                                    }}
                                    style={{
                                        width: 26,
                                        height: 26,
                                        borderRadius: "50%",
                                        border: isSelected
                                            ? "2px solid #000"
                                            : "1px solid #ccc",
                                        backgroundColor: opt,
                                        cursor: "pointer",
                                    }}
                                />
                            );
                        }

                        return (
                            <button
                                key={opt}
                                type="button"
                                onClick={() => {
                                    onSelect(opt);
                                    setOpen(false);
                                }}
                                style={{
                                    padding: "6px 10px",
                                    borderRadius: 6,
                                    border: isSelected
                                        ? "2px solid #000"
                                        : "1px solid #ccc",
                                    background: isSelected ? "#f0f0f0" : "#fff",
                                    cursor: "pointer",
                                }}
                            >
                                {opt}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

// ─── Variant image ────────────────────────────────────────────────────────────
const ImageVariantCard = ({ imgIndex, imageVariants, setImageVariants, fieldsRules }) => {

    const img = imageVariants[imgIndex];

    const { t } = useTranslation();

    const updateVariant = useCallback((key, value) => {

        setImageVariants((prev) => {

            const updated = [...prev];

            updated[imgIndex] = { ...updated[imgIndex], [key]: value };

            return updated;

        });

    }, [imgIndex, setImageVariants]);

    const removeVariant = () => setImageVariants((prev) => prev.filter((_, i) => i !== imgIndex));

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

                {
                    !fieldsRules?.color ? null :
                        <div style={{ marginBottom: 6 }}>
                            <span className="ap-label">{t("couleur")}</span>
                            <OptionSelector t={t} options={availableColors} selectedOption={img.color} onSelect={(v) => updateVariant("color", v)} isColor />
                        </div>
                }

                {
                    !fieldsRules?.size ? null :
                        <div>
                            <span className="ap-label">{t("Taille")}</span>
                            <OptionSelector t={t} options={availableSizes} selectedOption={img.size} onSelect={(v) => updateVariant("size", v)} />
                        </div>
                }

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
    const [attributes, setAttributes] = useState({});
    const [openAnnonceForm, setOpenAnnonceForm] = useState(false);
    const isUserVerified = user?.is_fournisseur && user?.is_verified;
    const isLoanOptionSelected = dataProduct.operation_product === "PRETER";


    const [fields, setFields] = useState([])

    const [fieldsRules, setFieldsRules] = useState([])

    const setCategory = (e) => {
        e.preventDefault()
        setDataProduct((p) => ({ ...p, categorie_product: e.target.value }))
        const value = (e.target.value).toLowerCase()
        const selectedFiels = CATEGORY_FIELDS[value]?.fields
        const rulesFields = CATEGORY_FIELDS[value]?.rules
        setFieldsRules(rulesFields)
        setFields(selectedFiels)
    }

    useEffect(() => {

        if (fields?.length > 0) {

            const initialAttributes = {}

            fields.forEach(field => {

                initialAttributes[field.name] = ""
            })

            setAttributes(initialAttributes)
        }

    }, [fields])

    const notify = (type, msg) => showMessage(dispatch, { Type: type, Message: msg });

    const getAddress = (newAddress) => setDataProduct((prev) => ({ ...prev, address: newAddress }));

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

    const validateProduct = (dataProduct, isLoanOptionSelected) => {
        if (!dataProduct?.name_product?.trim())
            return "Nom du produit obligatoire";

        if (dataProduct?.price_product == null || dataProduct.price_product === "")
            return "Prix obligatoire";

        if (!dataProduct?.currency_price)
            return "Devise obligatoire";

        if (!dataProduct?.categorie_product)
            return "Catégorie obligatoire";

        if (!dataProduct?.address?.trim())
            return "Adresse obligatoire";

        if (!dataProduct?.operation_product)
            return "Type d'opération obligatoire";

        if (!dataProduct?.payment_method)
            return "Mode de paiement obligatoire";

        if (dataProduct?.description_product?.length < 20)
            return "Description trop courte (min 20 caractères)";

        if (isLoanOptionSelected) {
            if (!dataProduct?.date_emprunt || !dataProduct?.date_fin_emprunt)
                return "Dates d'emprunt obligatoires";
        }

        return null;
    };


    const buildFormData = ({ dataProduct, imageVariants, attributes }) => {
        const formData = new FormData();

        // 🔐 SOCIAL LINKS SAFE BUILD
        const social_links = {};
        ["link_facebook", "link_instagramme", "link_tiktok", "link_twitter"].forEach((key) => {
            if (dataProduct[key]) {
                social_links[key.replace("link_", "")] = dataProduct[key];
            }
        });

        // 📦 variants metadata + images
        const safeVariants = imageVariants
            .filter(img => img.file)
            .map(img => ({
                color: img.color?.trim() || null,
                size: img.size?.trim() || null,
            }));

        imageVariants
            .filter(img => img.file)
            .forEach(img => {
                formData.append("variant_images", img.file);
            });

        formData.append("variants", JSON.stringify(safeVariants));

        // 🔐 safe append (no undefined)
        Object.entries(dataProduct).forEach(([key, value]) => {
            if (
                value !== undefined &&
                value !== null &&
                key !== "social_links"
            ) {
                formData.append(key, value);
            }
        });

        formData.set("price_product", Number(dataProduct.price_product));
        formData.set("quantity_product", parseInt(dataProduct.quantity_product || 1));

        formData.set("social_links", JSON.stringify(social_links));

        formData.set("attributes", JSON.stringify(attributes || {}));

        return formData;
    };

    const saveDataForSubmitForm = (e) => {
        e.preventDefault();
        const error = validateProduct(dataProduct, isLoanOptionSelected);
        if (error) { notify("Erreur", error); return; }
        setIsProductAdded(true);
    };

    const submitForm = async (e) => {
        e.preventDefault();

        if (imageVariants.length === 0) {
            return notify("Erreur", "Ajoutez au moins une image");
        }

        const error = validateProduct(dataProduct, isLoanOptionSelected);
        if (error) return notify("Erreur", error);

        setIsLoadingSubmit(true);

        try {
            const formData = buildFormData({
                dataProduct,
                imageVariants,
                attributes,
            });

            // catégorie sécurisée (slug backend-friendly)
            const categoryRes = await api.post("/categories/", {
                name: dataProduct.categorie_product,
            });

            formData.set("categorie_product", categoryRes?.data?.slug);

            await api.post("/produits/", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            notify("Message", "Produit créé avec succès !");
            dispatch(addMessageNotif(`Produit créé`));

            // reset propre
            setDataProduct(INITIAL_PRODUCT);
            setImageVariants([]);
            setAttributes({});
            setCurrentSection(1);
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

    // ── Rendu ──
    return (
        <>
            <div
                className="ap-root"
                style={{
                    minHeight: "100vh",
                    background: "",
                    padding: "32px 16px 80px",
                }}
            >

                {!isProductAdded && (

                    <div className="ap-fade" style={{ maxWidth: 560, margin: "0 auto 24px", textAlign: "center" }}>

                        <TitleCompGen title={t("add_product.add_or_update_product")} />

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
                        onAddNew={submitForm}
                    >
                        {imageLoaded && (
                            <img src={imageLoaded} alt="aperçu" style={{ width: 160, height: 160, objectFit: "cover", borderRadius: 14, border: "2px solid #e2e8f0" }} />
                        )}
                        {/*handleSubmitNew*/}
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

                                    <Field label={t("add_product.name_product")}>
                                        <InputBox type="text" id="name_product" name="name_product" value={dataProduct?.name_product} onChange={onChangeClick} placeholder="Nom du produit" required className="ap-input" />
                                    </Field>

                                    <Field label={t("price")}>
                                        <InputBox type="number" min="0" id="price_product" name="price_product" value={dataProduct?.price_product} onChange={onChangeClick} placeholder={t("price")} required className="ap-input" />
                                    </Field>
                                        
                                    <Field label={t("weight")}>
                                         <InputBox type="number" min="0" id="weight" name="weight" value={dataProduct?.weight} onChange={onChangeClick} placeholder={t("weight_g")} required className="ap-input" />
                                    </Field>

                                    <Field label={t("add_product.select_currency")}>
                                        <select required id="currency_price" name="currency_price" value={dataProduct?.currency_price ?? ""} onChange={onChangeClick} className="ap-select">
                                            <option value="" disabled>{t("add_product.select_currency")}</option>
                                            <option value="EUR">{t("add_product.euro")}</option>
                                            <option value="USD">{t("add_product.dollar")}</option>
                                            <option value="FRANC">{t("add_product.franc")}</option>
                                        </select>
                                    </Field>

                                    {currentSection < 2 && (
                                        <button type="button" onClick={nextSection} className="ap-btn-next">
                                            {t("TableRecap.pagination.next")} <NextArrow />
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* ── Section 2 : Détails ── */}
                            {currentSection >= 2 && (
                                <div className="ap-section" style={{ marginTop: 24 }}>

                                    <SectionTitle icon={STEP_ICONS[1]} text={t("add_product.details")} />

                                    <Field label={t("add_product.select_category")}>

                                        <select required id="categorie_product" name="categorie_product" value={dataProduct.categorie_product ?? ""} onChange={(e) => { setCategory(e); handleFileSelect({}); setImageLoaded(null) }} className="ap-select">
                                            <option value="" disabled>{t("add_product.select_category")}</option>
                                            {
                                                LIST_CATEGORIES_KEYS
                                                    ?.filter((value) => value !== CONSTANTS?.ALL)
                                                    .map((value, idx) => (
                                                        <option key={idx} value={value}>
                                                            {t(`add_product.categories.${value}`)}
                                                        </option>
                                                    ))
                                            }
                                        </select>

                                    </Field>

                                    <div className={` ${fields?.length > 0 ? "mb-5 p-2 shadow-md rounded-md" : null}`}>
                                        {
                                            fields?.map((field, key) => (
                                                <div className="relative mb-6 w-auto">
                                                    <input
                                                        id={key}
                                                        key={field?.name}
                                                        name={field.name}
                                                        required={field?.required}
                                                        onChange={e => setAttributes(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                                                        placeholder=" "
                                                        className="
                                                          block w-full px-2.5 pt-5 pb-2.5
                                                          text-black
                                                          bg-white
                                                          border-b
                                                          border-blue-100
                                                          focus:outline-none focus:ring-0
                                                          peer
                                                        "
                                                    />
                                                    <label
                                                        htmlFor={key}
                                                        className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
                                                    >
                                                        {field?.name}
                                                    </label>
                                                </div>
                                            ))
                                        }
                                    </div>

                                    <Field label={t("add_product.ChooseImage")}>
                                        <FormElementFileUpload label={t("add_product.ChooseImage")} getFile={handleFileSelect} getImage={setImageLoaded} imageLoaded={imageLoaded} multiple />
                                    </Field>

                                    {
                                        (imageVariants?.length > 0) && (

                                            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
                                                {
                                                    imageVariants?.map((_, idx) => (

                                                        <ImageVariantCard
                                                            key={idx}
                                                            imgIndex={idx}
                                                            imageVariants={imageVariants}
                                                            setImageVariants={setImageVariants}
                                                            fieldsRules={fieldsRules}
                                                        />
                                                    ))
                                                }
                                            </div>
                                        )
                                    }

                                    <Field label={t("helpPage.problemType.description")}>

                                        <textarea
                                            id="description_product"
                                            name="description_product"
                                            value={dataProduct?.description_product}
                                            onChange={onChangeClick}
                                            rows="4"
                                            className="ap-textarea"
                                            placeholder={t("description_product_input")}
                                            required minLength={20} maxLength={100}
                                        />

                                        <p className="ap-char-count">{dataProduct?.description_product?.length ?? 0}/100</p>

                                    </Field>

                                    {currentSection < 3 && (
                                        <button type="button" onClick={nextSection} className="ap-btn-next">
                                            {t("TableRecap.pagination.next")} <NextArrow />
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
                                            <Field label={t("loan_start_date")}>
                                                <InputBox type="datetime-local" id="date_emprunt" name="date_emprunt" value={dataProduct.date_emprunt} onChange={onChangeClick} className="ap-input" />
                                            </Field>
                                            <Field label={t("loan_end_date")}>
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
                                            {t("TableRecap.pagination.next")} <NextArrow />
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* ── Section 4 : Livraison & Liens ── */}
                            {currentSection >= 4 && (

                                <div className="ap-section" style={{ marginTop: 24 }}>

                                    <SectionTitle icon={STEP_ICONS[3]} text={t("add_product.informations_livraison")} />

                                    <Field label={t("client_support")}>
                                        <select required id="delivery" name="delivery" value={dataProduct?.delivery ?? ""} onChange={onChangeClick} className="ap-select">
                                            <option value="FREE">{t("add_product.FREE")}</option>
                                            <option value="DELPAID">{t("add_product.DELPAID")}</option>
                                        </select>
                                    </Field>

                                    <Field label={t("adress")}>
                                        <LocationSearchPopover setLocationSearch={getAddress} />
                                    </Field>

                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>

                                        <Field label={t("shipping_price")}>
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

                                        {
                                            isLoadingSubmit ?
                                                <LoadingCard /> :
                                                (
                                                    <button type="submit" className="ap-btn-primary">
                                                        {t("text_verify_product")} ✦
                                                    </button>
                                                )
                                        }

                                    </div>

                                </div>
                            )}

                            <div ref={bottomRef} />

                        </form>

                    </div>
                )}


                <button
                    className="
                        fixed
                        overflow-hidden
                        whitespace-nowrap
                        px-6
                        py-3
                        rounded-full
                        font-semibold
                        text-white
                        bg-gradient-to-r
                        from-blue-300
                        via-blue-200
                        to-orange-50
                        shadow-lg
                        shadow-purple-500/30
                        transition-all
                        duration-300
                        hover:scale-105
                        hover:shadow-xl
                        hover:shadow-pink-500/40
                        hover:bg-blue-300
                        active:scale-95
                        group
                    "
                    onClick={() => setOpenAnnonceForm(true)}
                    style={{ opacity: isUserVerified ? 1 : .5, pointerEvents: isUserVerified ? "auto" : "none" }}
                >
                    {/* Effet de brillance */}
                    <span
                        className="
                            absolute
                            inset-0
                            -translate-x-full
                            bg-gradient-to-r
                            from-transparent
                            via-white/30
                            to-transparent
                            group-hover:translate-x-full
                            transition-transform
                            duration-1000
                        "
                    />

                    <span className="relative flex items-center justify-center gap-2">
                        🚀
                        <p>{t('text_annonce')}</p>
                    </span>

                </button>

                <AfficheForm
                    open={openAnnonceForm}
                    onClose={() => setOpenAnnonceForm(false)}
                />

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

                <button
                    type="button"
                    onClick={onAddNew}
                    disabled={isLoading}
                    className="ap-btn-primary flex items-center gap-2 justify-center"
                    style={{ opacity: isLoading ? 0.7 : 1, cursor: isLoading ? "not-allowed" : "pointer" }}
                >
                    {isLoading ? (
                        <span className="flex gap-1">
                            <LoadingCard />
                            <span>Envoi...</span>
                        </span>
                    ) : (
                        <>
                            {t("submit")} ✦
                        </>
                    )}
                </button>

            </div>

        </div>
    );
};