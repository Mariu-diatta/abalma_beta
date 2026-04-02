import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import InputBox from "../components/InputBoxFloat";
import api from "../services/Axios";
import { useParams } from "react-router-dom";
import { showMessage } from "../components/AlertMessage";
import { useDispatch } from "react-redux";
import { ENDPOINTS } from "../utils";
import LoadingCard from "../components/LoardingSpin";


// ─── Icônes ───────────────────────────────────────────────────────────────────
const LockIcon = () => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M12 14v3m-5-6V7a5 5 0 0 1 10 0v4M5 11h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1Z" />
    </svg>
);

const InfoIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M12 17v-6m0-4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);

// ─── Stepper ──────────────────────────────────────────────────────────────────
const Stepper = ({ step, labels }) => (
    <div className="fp-stepper" aria-label="Étapes">
        {labels.map((label, i) => {
            const s = i + 1;
            const state = s < step ? 'done' : s === step ? 'active' : 'pending';
            return (
                <div key={s} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    <div className="fp-step">
                        <div className={`fp-step-dot ${state}`}>
                            {state === 'done' ? '✓' : s}
                        </div>
                        <span className={`fp-step-label ${state}`}>{label}</span>
                    </div>
                    {i < labels.length - 1 && (
                        <div className={`fp-step-line ${state === 'done' ? 'done' : ''}`} />
                    )}
                </div>
            );
        })}
    </div>
);

// ─── Composant principal ──────────────────────────────────────────────────────
const LayoutPwdForget = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { uidb64, token } = useParams();

    const [step, setStep] = useState(uidb64 && token ? 2 : 1);
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [countdown, setCountdown] = useState(60);
    const [loadingStep1, setLoadingStep1] = useState(false);
    const [loadingStep2, setLoadingStep2] = useState(false);

    const notify = (type, msg) => showMessage(dispatch, { Type: type, Message: msg });

    // ── Étape 1 : demande de lien ──
    const handleRequestCode = async (e) => {
        e.preventDefault();
        if (!email) { notify('Erreur', t('form.emailRequired')); return; }
        setLoadingStep1(true);
        try {
            await api.post('/forget_password/request/', { email });
            notify('Message', `${t('password.linkSend')} : ${email}`);
            setStep(2);
        } catch (err) {
            notify('Erreur', t('form.resetRequestError'));
        } finally {
            setLoadingStep1(false);
        }
    };

    // ── Étape 2 : nouveau mot de passe ──
    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!newPassword) { notify('Erreur', t('form.passwordRequired')); return; }
        if (!uidb64 || !token) { notify('Erreur', t('form.invalidLink')); return; }
        setLoadingStep2(true);
        try {
            await api.post(`/forget_password/reset/${uidb64}/${token}/`, { password: newPassword });
            setStep(3);
        } catch (err) {
            notify('Erreur', t('form.resetError'));
        } finally {
            setLoadingStep2(false);
        }
    };

    // ── Compte à rebours étape 3 ──
    useEffect(() => {
        if (step !== 3) return;
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    window.location.href = `/${ENDPOINTS.LOGIN}`;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [step]);

    const stepLabels = [
        t('forgetPswd.step1') || 'Email',
        t('forgetPswd.step2') || 'Nouveau mot de passe',
        t('forgetPswd.step3') || 'Terminé',
    ];

    const mins = Math.floor(countdown / 60);
    const secs = String(countdown % 60).padStart(2, '0');

    return (
        <>
            <div className="fp-root fp-wrap">
                <div className="fp-card">

                    {/* Header */}
                    <div className="fp-header">
                        <div className="fp-icon-wrap" aria-hidden="true">
                            <LockIcon />
                        </div>
                        <h1 className="fp-title">{t('forgetPswd.title')}</h1>
                        <p className="fp-subtitle">
                            {step === 1 && (t('forgetPswd.subtitle1') || 'Entrez votre email pour recevoir un lien de réinitialisation.')}
                            {step === 2 && (t('forgetPswd.subtitle2') || 'Choisissez votre nouveau mot de passe.')}
                            {step === 3 && (t('forgetPswd.subtitle3') || 'Votre mot de passe a été réinitialisé !')}
                        </p>
                    </div>

                    {/* Stepper */}
                    <Stepper step={step} labels={stepLabels} />

                    {/* ── Étape 1 ── */}
                    {step === 1 && (
                        <form onSubmit={handleRequestCode} className="fp-animated">
                            <div className="fp-field">
                                <InputBox
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={t('form.email')}
                                    required
                                />
                            </div>
                            {loadingStep1 ? <LoadingCard /> : (
                                <button type="submit" className="fp-btn">
                                    {t('forgetPswd.getCode')}
                                </button>
                            )}
                        </form>
                    )}

                    {/* ── Étape 2 ── */}
                    {step === 2 && (
                        uidb64 && token ? (
                            <form onSubmit={handleResetPassword} className="fp-animated">
                                <div className="fp-field">
                                    <InputBox
                                        type="password"
                                        name="newPassword"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder={t('form.newPassword')}
                                        required
                                    />
                                </div>
                                {loadingStep2 ? <LoadingCard /> : (
                                    <button type="submit" className="fp-btn">
                                        {t('forgetPswd.reset')}
                                    </button>
                                )}
                            </form>
                        ) : (
                            <div className="fp-info-box fp-animated">
                                <span className="fp-info-icon"><InfoIcon /></span>
                                <span>{t('confirmForgotPassword')}</span>
                            </div>
                        )
                    )}

                    {/* ── Étape 3 : succès ── */}
                    {step === 3 && (
                        <div className="fp-success fp-animated">
                            <div className="fp-success-icon">✅</div>
                            <p className="fp-success-title">{t('forgetPswd.success')}</p>
                            <p className="fp-success-sub">{t('forgetPswd.redirectIn')}</p>
                            <div className="fp-countdown">
                                <span>Redirection dans</span>
                                <span className="fp-countdown-num">{mins}:{secs}</span>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </>
    );
};

export default LayoutPwdForget;