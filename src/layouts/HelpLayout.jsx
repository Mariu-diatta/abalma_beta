import React, { useEffect, useState } from "react";
import { messages } from "../utils";
import { useTranslation } from 'react-i18next';
import api from "../services/Axios";
import LoadingCard from "../components/LoardingSpin";
import { useDispatch, useSelector } from "react-redux";
import { showMessage } from "../components/AlertMessage";

// ─── HelpPage ─────────────────────────────────────────────────────────────────
const HelpPage = () => {
    const { t } = useTranslation();
    const [problemType, setProblemType] = useState("");
    const [description, setDescription] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const currentUser = useSelector((state) => state.auth.user);
    const isFormInvalid = !problemType || !description.trim() || !currentUser;

    const resetForm = () => {
        setSubmitted((prev) => !prev);
        setProblemType("");
        setDescription("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isFormInvalid) { alert(t("alertSuccesMessageFormHelp.text3")); return; }
        setLoading(true);
        try {
            await api.post("help/messages/", { title: problemType, content: description });
            resetForm();
        } catch (err) {
            console.error("Erreur de données", err);
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <>
                <div className="help-page" style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#eef2ff 0%,#f5f3ff 50%,#ede9fe 100%)', padding: '40px 16px' }}>
                    <div className="success-card">
                        <button
                            onClick={resetForm}
                            style={{ position: 'absolute', top: 14, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: '1.2rem', lineHeight: 1 }}
                        >✕</button>
                        <div style={{ fontSize: '2.8rem', marginBottom: 12 }}>✅</div>
                        <h2 style={{ fontFamily: 'Sora,sans-serif', fontSize: '1.25rem', fontWeight: 700, color: '#312e81', marginBottom: 8 }}>
                            {t("alertSuccesMessageFormHelp.text1")}
                        </h2>
                        <p style={{ color: '#6b7280', fontSize: '.9rem', lineHeight: 1.6 }}>
                            {t("alertSuccesMessageFormHelp.text2")}
                        </p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <div
                className="help-page scrollbor_hidden"
                style={{
                    minHeight: '100vh',
                    background: '',
                    padding: '32px 16px 80px',
                }}
            >
                {/*linear-gradient(135deg,#eef2ff 0%,#f5f3ff 50%,#ede9fe 10%)*/}
                {/* ── Hero header ── */}
                <div className="anim-fade-up" style={{ display: 'flex', alignItems: 'center', gap: 16, maxWidth: 760, margin: '0 auto 36px', flexWrap: 'wrap' }}>
                    <HeroIllustration />
                    <div>
                        <p style={{ fontFamily: 'Sora,sans-serif', fontSize: '.75rem', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: '#6366f1', marginBottom: 4 }}>
                            Centre d'aide
                        </p>
                        <h1 style={{ fontFamily: 'Sora,sans-serif', fontSize: 'clamp(1.4rem,4vw,2rem)', fontWeight: 700, color: '#1e1b4b', lineHeight: 1.2, margin: 0 }}>
                            Support &amp; Aide
                        </h1>
                        <p style={{ color: '#6b7280', fontSize: '.9rem', marginTop: 6, lineHeight: 1.5, maxWidth: 340 }}>
                            Une question ? Un problème ? Notre équipe est là pour vous.
                        </p>
                    </div>
                </div>

                {/* ── Grid ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, maxWidth: 900, margin: '0 auto' }}>

                    {/* Col gauche */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                        {/* Formulaire signalement */}
                        <form
                            onSubmit={handleSubmit}
                            className="glass-card anim-fade-up delay-1"
                            style={{ padding: '28px 24px' }}
                        >
                            <p className="section-title">🛠 {t('Déclarer un problème')}</p>

                            <div style={{ marginBottom: 18 }}>
                                <label className="field-label">{t('Choisir un type de problème')}</label>
                                <select
                                    value={problemType}
                                    onChange={(e) => setProblemType(e.target.value)}
                                    className="field-input"
                                    style={{ appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236366f1' strokeWidth='1.8' fill='none' strokeLinecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center', paddingRight: 36 }}
                                >
                                    <option value="">{t('helpPage.problemType.select')}</option>
                                    <option value="connexion">{t('helpPage.problemType.connexion')}</option>
                                    <option value="paiement">{t('helpPage.problemType.paiement')}</option>
                                    <option value="bug">{t('helpPage.problemType.bug')}</option>
                                    <option value="autre">{t('helpPage.problemType.autre')}</option>
                                </select>
                            </div>

                            <div style={{ marginBottom: 22 }}>
                                <label className="field-label">{t('helpPage.problemType.description')} *</label>
                                <textarea
                                    rows="4"
                                    placeholder="Décrivez votre problème..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    maxLength={100}
                                    className="field-input"
                                    style={{ resize: 'none', lineHeight: 1.6 }}
                                />
                                <p style={{ textAlign: 'right', fontSize: '.72rem', color: '#9ca3af', marginTop: 4 }}>
                                    {description.length}/100
                                </p>
                            </div>

                            {loading ? <LoadingCard /> : (
                                <button type="submit" className="btn-primary">
                                    {t('send')}
                                </button>
                            )}
                        </form>

                        {/* Témoignages */}
                        <TestmonyList />
                    </div>

                    {/* Col droite — FAQ */}
                    <div className="anim-fade-up delay-2">
                        <MessagesListWithPopover />
                    </div>
                </div>
            </div>
        </>
    );
};

export default HelpPage;


// ─── FAQ / Messages ───────────────────────────────────────────────────────────
export const MessagesListWithPopover = () => {
    const [activeIndex, setActiveIndex] = useState(null);
    const { t } = useTranslation();

    return (
        <div>
            <p className="section-title">💬 {t('helpPage.currentMessages.index')}</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {messages(t)?.map((item, index) => (
                    <li key={index} className="faq-item">
                        <button
                            className="faq-btn"
                            onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                        >
                            <span>{item.text}</span>
                            <ChevronIcon open={activeIndex === index} />
                        </button>
                        {activeIndex === index && (
                            <div className="faq-answer">{item.advice}</div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};


// ─── Témoignages ──────────────────────────────────────────────────────────────
function TestmonyList() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);
    const [content, setContent] = useState("");
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [justClicked, setJustClicked] = useState(null);

    useEffect(() => {
        api.get("content/testmony/")
            .then((res) => setItems(res.data))
            .catch((err) => console.warn(err?.messages));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            api.post("/content/testmony/", { content, number_stars: rating })
                .then((res) => res.data)
                .then((newItem) => {
                    setItems([newItem, ...items]);
                    setContent("");
                    setRating(0);
                    showMessage(dispatch, { Type: "Success", Message: "✔️" });
                });
        } catch (error) {
            console.error("Erreur loadind :", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStarClick = (star) => {
        setRating(star);
        setJustClicked(star);
        setTimeout(() => setJustClicked(null), 300);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="glass-card anim-fade-up delay-3"
            style={{ padding: '24px 22px' }}
        >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <p className="section-title" style={{ margin: 0 }}>⭐ {t('Donnez votre avis')}</p>
                <span className="badge-count">{items.length}</span>
            </div>

            {/* Étoiles */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
                {[1, 2, 3, 4, 5].map((star) => {
                    const filled = star <= (hover || rating);
                    return (
                        <svg
                            key={star}
                            className={`star-svg ${justClicked === star ? 'active' : ''}`}
                            onClick={() => handleStarClick(star)}
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(0)}
                            width="26" height="26"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M11.083 5.104c.35-.8 1.485-.8 1.834 0l1.752 4.022a1 1 0 0 0 .84.597l4.463.342c.9.069 1.255 1.2.556 1.771l-3.33 2.723a1 1 0 0 0-.337 1.016l1.03 4.119c.214.858-.71 1.552-1.474 1.106l-3.913-2.281a1 1 0 0 0-1.008 0L7.583 20.8c-.764.446-1.688-.248-1.474-1.106l1.03-4.119A1 1 0 0 0 6.8 14.56l-3.33-2.723c-.698-.571-.342-1.702.557-1.771l4.462-.342a1 1 0 0 0 .84-.597l1.753-4.022Z"
                                fill={filled ? '#f59e0b' : '#e5e7eb'}
                                stroke={filled ? '#f59e0b' : '#d1d5db'}
                                strokeWidth=".5"
                                style={{ transition: 'fill .15s, stroke .15s' }}
                            />
                        </svg>
                    );
                })}
            </div>

            <div style={{ marginBottom: 16 }}>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Écris ton témoignage..."
                    className="field-input"
                    style={{ resize: 'none', lineHeight: 1.6 }}
                    rows="2"
                    maxLength={100}
                    required
                />
                <p style={{ textAlign: 'right', fontSize: '.72rem', color: '#9ca3af', marginTop: 4 }}>
                    {content.length}/100
                </p>
            </div>

            {loading ? <LoadingCard /> : (
                <button type="submit" className="btn-primary">{t('send')}</button>
            )}
        </form>
    );
}


// ─── Micro-composants ─────────────────────────────────────────────────────────

const ChevronIcon = ({ open }) => (
    <svg
        width="18" height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0, transition: 'transform .25s', transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}
    >
        <path stroke="#6366f1" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m9 5 7 7-7 7" />
    </svg>
);

const HeroIllustration = () => (
    <svg width="100" height="80" viewBox="0 0 674 447" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
        <path fillRule="evenodd" clipRule="evenodd" d="M529.768 447C564.466 400.375 585 342.586 585 280C585 125.36 459.64 0 305 0C150.36 0 25 125.36 25 280C25 342.586 45.5338 400.375 80.2318 447H529.768Z" fill="#d6e2fb" />
        <path fillRule="evenodd" clipRule="evenodd" d="M391.661 191.786C411.954 187.568 427.842 175.37 432.511 157.945C439.944 130.205 416.13 99.7215 379.321 89.8585C342.512 79.9955 306.646 94.4879 299.213 122.228C291.78 149.968 315.594 180.452 352.404 190.315C358.044 191.826 363.662 192.766 369.159 193.173L378.717 209.727C379.503 211.09 381.482 211.052 382.217 209.661L391.661 191.786Z" fill="#6366f1" />
        <path fillRule="evenodd" clipRule="evenodd" d="M388.063 132.577C388.769 133.426 388.654 134.687 387.805 135.393L355.411 162.366L345.439 142.195C344.949 141.205 345.355 140.005 346.345 139.516C347.335 139.026 348.535 139.432 349.024 140.422L356.749 156.047L385.246 132.32C386.095 131.613 387.356 131.728 388.063 132.577Z" fill="white" />
        <path d="M203 386.3L11.3 384.1L353 293.1H544L203 386.3Z" fill="#c8d8fa" />
        <path d="M203 384H10V447H203V384Z" fill="#d6e2fb" />
        <path d="M203 384L546 292.5V447H203V384Z" fill="#c8d8fa" />
    </svg>
);