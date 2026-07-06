
import React, { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import api from "../services/Axios";
import { useTranslation } from "react-i18next";

const CATEGORIES = ["event", "promotion", "advertisement", "information", "urgent"];
const AUDIENCES = ["all", "new", "members"];
const HORAIRES = ["all_day", "morning", "afternoon", "evening"];

const Field = ({ label, icon, children }) => (
    <div className="flex flex-col gap-1.5">
        <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
            <i className={`ti ${icon} text-sm`} aria-hidden="true" />
            {label}
        </label>
        {children}
    </div>
);

const inputCls = "w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-900 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all";

const AfficheForm = ({ open, onClose }) => {

    const fileRef = useRef(null);
    const [preview, setPreview] = useState(null);
    const [toast, setToast] = useState(false);
    const [form, setForm] = useState({
        image: null, categorie: "", dateDebut: "", dateFin: "",
        horaire: "", titre: "", description: "", audience: "",
    });
    const [loadind, setLoading] = useState(false);
    const { t } = useTranslation();

    const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

    const handleFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setForm((p) => ({ ...p, image: file }));
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        const data = new FormData();

        data.append("image", form.image);
        data.append("category", form.categorie);
        data.append("audience", form.audience);
        data.append("start_date", form.dateDebut);
        data.append("end_date", form.dateFin);
        data.append("schedule", form.horaire);
        data.append("title", form.titre);
        data.append("description", form.description);

        try {
            await api.post("/advertisements/", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setToast(true)
            onClose(false)
        } catch (err) {
            console.log(err.response?.data);

        } finally {
            setLoading(false)
        }
    };

    const handleReset = () => {
        setForm({
            image: null, categorie: "", dateDebut: "", dateFin: "",
            horaire: "", titre: "", description: "", audience: ""
        });
        setPreview(null);
    };

    useEffect(() => {
        if (!open) return;

        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);

    useEffect(() => {
        if (!open) return;

        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                onClose?.();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [open, onClose]);

    if (!open) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />

            {/* Popover */}
            <div
                className="
                relative
                z-10
                w-full
                max-w-3xl
                mx-4
                max-h-[90vh]
                overflow-y-auto
                animate-in
                fade-in
                zoom-in-95
                duration-200
                scrollbor_hidden
            "
                onClick={(e) => e.stopPropagation()}
            >
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-2xl">
                    <div className="h-1 bg-gradient-to-r from-purple-400 to-indigo-400" />

                    {/* Bouton fermer */}
                    <button
                        onClick={onClose}
                        className="
                        absolute
                        bottom-[12dvh]
                        top-1
                        right-4
                        w-9
                        h-9
                        rounded-full
                        bg-gray-100
                        hover:bg-gray-200
                        transition
                    "
                    >
                        <i className="ti ti-x" />
                    </button>

                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">

                    {/* Upload zone */}
                    <div
                        onClick={() => fileRef.current?.click()}
                        className="border border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer bg-gray-50 hover:border-purple-400 hover:bg-purple-50 transition-all group"
                    >
                        {preview ? (
                            <img src={preview} alt="Aperçu" className="w-full h-36 object-cover rounded-lg" />
                        ) : (
                            <>
                                <i className="ti ti-photo-up text-3xl text-gray-300 group-hover:text-purple-400 transition-colors" aria-hidden="true" />
                                <span className="text-sm text-gray-500">{t("upload_image")}</span>
                                <span className="text-xs text-gray-400">{t("image_formats")}</span>
                            </>
                        )}
                        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Catégorie" icon="ti-tag">
                            <select className={inputCls} value={form.categorie} onChange={set("categorie")} required>
                                <option value="">{t("choose")}</option>
                                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                            </select>
                        </Field>
                        <Field label="Audience cible" icon="ti-users">
                            <select className={inputCls} value={form.audience} onChange={set("audience")}>
                                <option value="">{t("choose")}</option>
                                {AUDIENCES.map((a) => <option key={a}>{a}</option>)}
                            </select>
                        </Field>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <Field label="Disponible du" icon="ti-calendar-event">
                            <input type="date" className={inputCls} value={form.dateDebut} onChange={set("dateDebut")} required />
                        </Field>
                        <Field label="Jusqu'au" icon="ti-calendar-x">
                            <input type="date" className={inputCls} value={form.dateFin} onChange={set("dateFin")} required />
                        </Field>
                            <Field label={t('schedule')} icon="ti-clock">
                            <select className={inputCls} value={form.horaire} onChange={set("horaire")}>
                                {HORAIRES.map((h) => <option key={h}>{h}</option>)}
                            </select>
                        </Field>
                    </div>

                    <Field label={t('poster_title')} icon="ti-writing">
                         <input type="text" className={inputCls} placeholder={t('example_sale')} value={form.titre} onChange={set("titre")} required />
                    </Field>

                        <Field label={t('description')} icon="ti-align-left">
                            <textarea className={`${inputCls} resize-none h-24 leading-relaxed`} placeholder={t('description_placeholder')} value={form.description} onChange={set("description")} />
                    </Field>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <button type="button" onClick={handleReset}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-all">
                            <i className="ti ti-refresh text-sm" aria-hidden="true" /> {t('reset')}
                        </button>
                        <button type="submit"
                            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 active:scale-95 transition-all shadow-sm shadow-purple-200">
                            <i className="ti ti-check text-sm" aria-hidden="true" /> {!loadind ? t('publish_ad'):"Loading..."}
                        </button>
                    </div>

                    {toast && (
                        <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 animate-fade-in">
                            <i className="ti ti-circle-check text-base" aria-hidden="true" />
                            {t('ad_published_success')}
                        </div>
                    )}
                </form>
            </div>
            </div >

        </div>,

        document.body
    );
};

export default AfficheForm;