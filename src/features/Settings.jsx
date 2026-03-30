import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import api from '../services/Axios';
import { updateTheme } from '../slices/navigateSlice';
import { useTranslation } from 'react-i18next';
import { applyTheme } from '../utils';
import TitleCompGen, { TitleCompGenLitle } from '../components/TitleComponentGen';
import DeleteProfilAccount from './DeleteAccount';
import NotificationToggle from '../components/NotificationToggle';
import ThemeSelector from '../components/Them';
import SubscriptionsPage from '../pages/SubscriptionCard';

/* ─────────────────────────────────────────────
   Nav items for the left sidebar
───────────────────────────────────────────── */
const NAV_ITEMS = [
    { key: 'profile', icon: ProfileIcon, labelKey: 'settingsText.profile' },
    { key: 'preferences', icon: PrefsIcon, labelKey: 'settingsText.preferences' },
    { key: 'payment', icon: CardIcon, labelKey: 'settingsText.paymentMethod' },
    { key: 'subscription', icon: StarIcon, labelKey: 'settingsText.subscription' },
    { key: 'danger', icon: TrashIcon, labelKey: 'settingsText.dangerZone' },
];

/* ─────────────────────────────────────────────
   Tiny inline SVG icon components
───────────────────────────────────────────── */
function ProfileIcon({ active }) {
    const s = active ? '#7F77DD' : 'currentColor';
    return (
        <svg width="18" height="18" fill="none" stroke={s} strokeWidth="1.7" viewBox="0 0 24 24">
            <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
        </svg>
    );
}
function PrefsIcon({ active }) {
    const s = active ? '#7F77DD' : 'currentColor';
    return (
        <svg width="18" height="18" fill="none" stroke={s} strokeWidth="1.7" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
    );
}
function CardIcon({ active }) {
    const s = active ? '#7F77DD' : 'currentColor';
    return (
        <svg width="18" height="18" fill="none" stroke={s} strokeWidth="1.7" viewBox="0 0 24 24">
            <rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
        </svg>
    );
}
function StarIcon({ active }) {
    const s = active ? '#7F77DD' : 'currentColor';
    return (
        <svg width="18" height="18" fill="none" stroke={s} strokeWidth="1.7" viewBox="0 0 24 24">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    );
}
function TrashIcon({ active }) {
    const s = active ? '#E24B4A' : 'currentColor';
    return (
        <svg width="18" height="18" fill="none" stroke={s} strokeWidth="1.7" viewBox="0 0 24 24">
            <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
        </svg>
    );
}
function ChevronRight() {
    return (
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <polyline points="9 18 15 12 9 6" />
        </svg>
    );
}

/* ─────────────────────────────────────────────
   Section wrapper with title
───────────────────────────────────────────── */
function Section({ title, children }) {
    return (
        <div style={{
            background: 'var(--color-background-primary)',
            border: '0.5px solid var(--color-border-tertiary)',
            borderRadius: '16px',
            padding: '1.5rem',
            marginBottom: '1.25rem',
        }}>
            {title && (
                <TitleCompGenLitle title={title} />
            )}
            {children}
        </div>
    );
}

/* ─────────────────────────────────────────────
   Field row (label + input area)
───────────────────────────────────────────── */
function FieldRow({ label, children, hint }) {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: '12px', alignItems: 'start', padding: '10px 0', borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
            <div>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)' }}>{label}</p>
                {hint && <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--color-text-tertiary)' }}>{hint}</p>}
            </div>
            <div>{children}</div>
        </div>
    );
}

/* ─────────────────────────────────────────────
   Primary action button
───────────────────────────────────────────── */
function PrimaryButton({ children, onClick, type = 'button', danger = false, style = {} }) {
    return (
        <button
            type={type}
            onClick={onClick}
            style={{
                background: danger ? '#E24B4A' : '#534AB7',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                padding: '9px 20px',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'opacity 0.15s',
                ...style,
            }}
            onMouseOver={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseOut={e => (e.currentTarget.style.opacity = '1')}
        >
            {children}
        </button>
    );
}

/* ─────────────────────────────────────────────
   Sidebar nav item
───────────────────────────────────────────── */
function NavItem({ label, icon: Icon, active, onClick, danger }) {
    return (
        <button
            className="whitespace-nowrap z-100 bg-white"
            onClick={onClick}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                width: '100%',
                padding: '9px 12px',
                borderRadius: '10px',
                background: active ? '#EEEDFE' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                color: danger ? (active ? '#E24B4A' : 'var(--color-text-secondary)') : (active ? '#534AB7' : 'var(--color-text-secondary)'),
                fontWeight: active ? 500 : 400,
                fontSize: '14px',
                transition: 'background 0.15s',
            }}
            onMouseOver={e => { if (!active) e.currentTarget.style.background = 'var(--color-background-secondary)'; }}
            onMouseOut={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
        >
            <Icon active={active} />
            <span style={{ flex: 1 }}>{label}</span>
            {active && <ChevronRight />}
        </button>
    );
}

/* ─────────────────────────────────────────────
   Inline text input (lightweight)
───────────────────────────────────────────── */
function InlineInput({ id, name, label, type = 'text', value, onChange, disabled, placeholder, maxLength }) {
    return (
        <input
            id={id}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder || label}
            maxLength={maxLength}
            style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '8px 12px',
                fontSize: '14px',
                border: '0.5px solid var(--color-border-secondary)',
                borderRadius: '8px',
                background: disabled ? 'var(--color-background-secondary)' : 'var(--color-background-primary)',
                color: 'var(--color-text-primary)',
                outline: 'none',
            }}
        />
    );
}

/* ─────────────────────────────────────────────
   Toast notification
───────────────────────────────────────────── */
function Toast({ message, onClose }) {
    useEffect(() => {
        const t = setTimeout(onClose, 3000);
        return () => clearTimeout(t);
    }, [onClose]);
    return (
        <div style={{
            position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999,
            background: '#534AB7', color: '#fff',
            padding: '12px 20px', borderRadius: '12px',
            fontSize: '14px', fontWeight: 500,
            boxShadow: '0 4px 20px rgba(83,74,183,0.35)',
        }}>
            {message}
        </div>
    );
}

/* ═════════════════════════════════════════════
   MAIN COMPONENT
═════════════════════════════════════════════ */
const SettingsForm = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const currentUserData = useSelector((state) => state.auth.user);
    const currentUserCompte = useSelector((state) => state.auth.compteUser);

    const [activeSection, setActiveSection] = useState('profile');
    const [toast, setToast] = useState(null);

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        theme: 'light',
        notifications: true,
        cardNumber: '',
        expiry: '',
        cvv: '',
        address: '',
        city: '',
        zip: 0,
        country: '',
    });

    const [cartData, setCartData] = useState({});
    const [previewUrl, setPreviewUrl] = useState(null);

    const showToast = (msg) => setToast(msg);

    const tryRequest = async (requestFn, successMessage) => {
        try {
            await requestFn();
            showToast(successMessage);
        } catch (err) {
            console.warn('Request failed:', err);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleUpdateThem = (e) => {
        e.preventDefault();
        const { value } = e.target;
        setForm((prev) => ({ ...prev, theme: value }));
        dispatch(updateTheme(value));
        applyTheme(value, dispatch);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentUserCompte?.id) { showToast(t('settingsText.noAccountId')); return; }
        await tryRequest(
            () => api.patch(`/comptes/${currentUserCompte?.id}/update_theme/`, {
                theme: form.theme,
                is_notif_active: form.notifications,
            }, { withCredentials: true }),
            t('settingsText.accountSaved')
        );
    };

    const updatePassword = async (e) => {
        e.preventDefault();
        await tryRequest(
            () => api.patch(`/clients/${currentUserData?.id}/`, { password: form.password }),
            t('settingsText.passwordUpdated')
        );
    };

    const GetClientCard = useCallback(async () => {
        if (!currentUserData?.id) return;
        try {
            const resp = await api.get('/cardPaid/');
            const dataCard = resp?.data?.filter((elem) => elem?.client === currentUserData.id);
            setCartData(dataCard[0] ?? null);
        } catch (error) {
            console.error('Erreur carte :', error);
        }
    }, [currentUserData?.id]);

    const handleSubmitCard = async (e) => {
        e.preventDefault();
        if (!currentUserData?.id) return;
        const formData = new FormData();
        formData.append('date_expiration', form.expiry);
        formData.append('number_cvv', form.cvv);
        formData.append('number_card', form.cardNumber);
        formData.append('adresse_pay', form.address);
        formData.append('ville_pay', form.city);
        formData.append('code_postal_pay', form.zip);
        formData.append('pays_pay', form.country);
        formData.append('client', currentUserData.id);
        try {
            await api.post('/cardPaid/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            showToast(t('settingsText.cardSaved'));
        } catch (error) {
            console.error('Erreur enregistrement carte :', error);
        }
    };

    useEffect(() => { if (currentUserData?.id) GetClientCard(); }, [currentUserData?.id, GetClientCard]);
    useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);
    useEffect(() => {
        if (cartData) {
            setForm((prev) => ({
                ...prev,
                cardNumber: cartData?.number_card || '',
                expiry: cartData?.date_expiration || '',
                cvv: cartData?.number_cvv || '',
                address: cartData?.adresse_pay || '',
                city: cartData?.ville_pay || '',
                zip: parseInt(cartData?.code_postal_pay) || '',
                country: cartData?.pays_pay || '',
            }));
        }
    }, [cartData]);

    const initials = currentUserData?.nom
        ? currentUserData.nom.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
        : '?';

    /* ── Layout ── */
    return (
        <>
            {toast && <Toast message={toast} onClose={() => setToast(null)} />}

            <div 

              style={{
                maxWidth: '100%',
                margin: '0 auto',
                padding: '2rem 1rem 2rem',
                fontFamily: 'var(--font-sans)',
            }}>
                {/* Page header */}
                <div style={{ marginBottom: '2rem' }}>
                    <TitleCompGen title={t('settingsText.accountSettings')} />
                    <p style={{ margin: '4px 0 0', fontSize: '14px', color: 'var(--color-text-tertiary)' }}>
                        {t('settingsText.settingsSubtitle', 'Gérez votre compte, vos préférences et votre abonnement.')}
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start'}} className="flex flex-col md:block md:flex-row">

                    {/* ── Sidebar ── */}
                    <aside className="flex md:block overflow-x-auto w-full md:w-[200px] scrollbor_hidden_ z-50 mt-10" style={{
                        flexShrink: 0,
                        background: 'var(--color-background-primary)',
                        border: '0.5px solid var(--color-border-tertiary)',
                        borderRadius: '16px',
                        padding: '10px',
                        position: 'sticky',
                        top: '2rem',
                    }}>
                        {NAV_ITEMS.map(({ key, icon, labelKey }) => (
                            <NavItem
                                key={key}
                                label={t(labelKey, key)}
                                icon={icon}
                                active={activeSection === key}
                                onClick={() => setActiveSection(key)}
                                danger={key === 'danger'}
                            />
                        ))}
                    </aside>

                    {/* ── Content ── */}
                    <main style={{ flex: 1, minWidth: 0 }} className="overflow-x-auto w-full md:w-auto scrollbor_hidden_ ">

                        {/* ── Profile ── */}
                        {activeSection === 'profile' && (
                            <form onSubmit={updatePassword}>
                                <Section title={t('settingsText.profile', 'Profil')}>

                                    {/* Avatar row */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '1.25rem' }}>
                                        {previewUrl || currentUserData?.image ? (
                                            <img
                                                src={previewUrl || currentUserData.image}
                                                alt="Profil"
                                                style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover', border: '2px solid #AFA9EC' }}
                                            />
                                        ) : (
                                            <div style={{
                                                width: 60, height: 60, borderRadius: '50%',
                                                background: '#EEEDFE', display: 'flex', alignItems: 'center',
                                                justifyContent: 'center', fontSize: '20px', fontWeight: 600, color: '#534AB7',
                                            }}>
                                                {initials}
                                            </div>
                                        )}
                                        <div>
                                            <label style={{
                                                display: 'inline-block',
                                                fontSize: '13px', fontWeight: 500,
                                                color: '#534AB7', cursor: 'pointer',
                                                border: '0.5px solid #AFA9EC',
                                                borderRadius: '8px', padding: '5px 12px',
                                            }}>
                                                {t('settingsText.changePhoto', 'Changer la photo')}
                                                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                                            </label>
                                        </div>
                                    </div>

                                    <FieldRow label={t('settingsText.nameLabel', 'Nom')}>
                                        <InlineInput id="name" name="name" label={t('settingsText.nameLabel', 'Nom')}
                                            value={currentUserData?.nom || ''} disabled />
                                    </FieldRow>

                                    <FieldRow label={t('settingsText.emailLabel', 'Adresse e-mail')}>
                                        <InlineInput id="email" name="email" type="email"
                                            label={t('settingsText.emailLabel', 'Adresse e-mail')}
                                            value={currentUserData?.email || ''} disabled />
                                    </FieldRow>

                                    <FieldRow
                                        label={t('settingsText.passwordLabel', 'Mot de passe')}
                                        hint={t('settingsText.passwordHint', 'Min. 8 caractères recommandés')}
                                    >
                                        <InlineInput id="password" name="password" type="password"
                                            label="••••••••" value={form.password} onChange={handleChange} />
                                    </FieldRow>

                                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                                        <PrimaryButton type="submit">
                                            {t('settingsText.changePassword', 'Mettre à jour le mot de passe')}
                                        </PrimaryButton>
                                    </div>
                                </Section>
                            </form>
                        )}

                        {/* ── Preferences ── */}
                        {activeSection === 'preferences' && (
                            <form onSubmit={handleSubmit}>
                                <Section title={t('settingsText.preferences', 'Préférences')}>

                                    <FieldRow label={t('settingsText.theme', 'Thème')}>
                                        <ThemeSelector value={form.theme} onChange={handleUpdateThem} t={t} />
                                    </FieldRow>

                                    <FieldRow
                                        label={t('settingsText.notifications', 'Notifications')}
                                        hint={t('settingsText.notificationsHint', 'Recevoir des alertes par e-mail')}
                                    >
                                        <NotificationToggle checked={form.notifications} onChange={handleChange} t={t} />
                                    </FieldRow>

                                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                                        <PrimaryButton type="submit">
                                            {t('settingsText.save', 'Enregistrer')}
                                        </PrimaryButton>
                                    </div>
                                </Section>
                            </form>
                        )}

                        {/* ── Payment ── */}
                        {activeSection === 'payment' && (
                            <form onSubmit={handleSubmitCard}>
                                <Section title={t('settingsText.cardDetails', 'Carte bancaire')}>
                                    <FieldRow label={t('settingsText.cardNumberLabel', 'Numéro de carte')}>
                                        <InlineInput type="number" id="cardNumber" name="cardNumber"
                                            label={t('settingsText.cardNumberLabel', 'Numéro de carte')}
                                            maxLength={19} value={form.cardNumber} onChange={handleChange} />
                                    </FieldRow>
                                    <FieldRow label={t('settingsText.expiryLabel', 'Date d\'expiration')}>
                                        <div style={{ display: 'flex', gap: '12px' }}>
                                            <InlineInput type="date" id="expiry" name="expiry"
                                                label={t('settingsText.expiryLabel', 'Date d\'expiration')}
                                                value={form.expiry} onChange={handleChange} />
                                            <InlineInput type="number" id="cvv" name="cvv" label="CVV"
                                                maxLength={4} value={form.cvv} onChange={handleChange} />
                                        </div>
                                    </FieldRow>
                                </Section>

                                <Section title={t('settingsText.billingAddress', 'Adresse de facturation')}>
                                    <FieldRow label={t('settingsText.addressLabel', 'Adresse')}>
                                        <InlineInput type="text" id="address" name="address"
                                            label={t('settingsText.addressLabel', 'Adresse')}
                                            value={form.address} onChange={handleChange} />
                                    </FieldRow>
                                    <FieldRow label={t('settingsText.cityLabel', 'Ville')}>
                                        <div style={{ display: 'flex', gap: '12px' }}>
                                            <InlineInput type="text" id="city" name="city"
                                                label={t('settingsText.cityLabel', 'Ville')}
                                                value={form.city} onChange={handleChange} />
                                            <InlineInput type="number" id="zip" name="zip"
                                                label={t('settingsText.zipLabel', 'Code postal')}
                                                value={form.zip} onChange={handleChange} />
                                        </div>
                                    </FieldRow>
                                    <FieldRow label={t('settingsText.countryLabel', 'Pays')}>
                                        <InlineInput type="text" id="country" name="country"
                                            label={t('settingsText.countryLabel', 'Pays')}
                                            value={form.country} onChange={handleChange} />
                                    </FieldRow>

                                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                                        <PrimaryButton type="submit">
                                            {t('settingsText.saveCard', 'Enregistrer la carte')}
                                        </PrimaryButton>
                                    </div>
                                </Section>
                            </form>
                        )}

                        {/* ── Subscription ── */}
                        {activeSection === 'subscription' && (
                                <SubscriptionsPage />
                        )}

                        {/* ── Danger zone ── */}
                        {activeSection === 'danger' && (
                            <Section title={t('settingsText.dangerZone', 'Zone de danger')}>
                                <div style={{
                                    border: '0.5px solid #F09595',
                                    borderRadius: '12px',
                                    padding: '1.25rem',
                                    background: '#FCEBEB',
                                }}>
                                    <p style={{ margin: '0 0 4px', fontWeight: 500, fontSize: '14px', color: '#A32D2D' }}>
                                        {t('settingsText.deleteAccount', 'Supprimer le compte')}
                                    </p>
                                    <p style={{ margin: '0 0 1rem', fontSize: '13px', color: '#A32D2D', opacity: 0.8 }}>
                                        {t('settingsText.deleteAccountWarning', 'Cette action est irréversible. Toutes vos données seront supprimées définitivement.')}
                                    </p>
                                    <DeleteProfilAccount />
                                </div>
                            </Section>
                        )}

                    </main>
                </div>
            </div>
        </>
    );
};

export default SettingsForm;