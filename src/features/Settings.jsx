import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import api from '../services/Axios';
import { updateTheme } from '../slices/navigateSlice';
import { useTranslation } from 'react-i18next';
import { CONSTANTS, NAV_ITEMS, applyTheme, getMediaUrl } from '../utils';
import TitleCompGen, { TitleCompGenLitle } from '../components/TitleComponentGen';
import DeleteProfilAccount from './DeleteAccount';
import NotificationToggle from '../components/NotificationToggle';
import ThemeSelector from '../components/Them';
import SubscriptionsPage from '../pages/SubscriptionCard';
import AttentionAlertMessage, { showMessage } from '../components/AlertMessage';
import CountryField from './CountryField';
import DeliveryAddressField from './DeliveryAdressField';
import { updateUserData } from '../slices/authSlice';

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
export function PrimaryButton({ children, onClick, type = 'button', danger = false, style = {} }) {
    return (
        <button
            type={type}
            onClick={onClick}
            style={{
                background: danger ? '#E24B4A' : '#6366f1',
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
                color: danger ? (active ? '#E24B4A' : 'var(--color-text-secondary)') : (active ? '#6366f1' : 'var(--color-text-secondary)'),
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
            background: '#6366f1', color: '#fff',
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

    const [address, setAddress] = useState(null);

    const [deliveryAddress, setDeliveryAddress] = useState([]);

    const getAddress = (newAdress) => {
        setAddress(newAdress);
        setDeliveryAddress(prev => [...prev, newAdress])
    }

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

    const [loadingAdress, setLoadingAdress] = useState(false);

    const showToast = (msg) => setToast(msg);



    const tryRequest = async (requestFn, successMessage, calback = () => { }) => {
        try {
            calback(true)
            await requestFn();
            showMessage(dispatch, {
                Type: "Message", Message: successMessage
            });
        } catch (err) {
            console.warn('Request failed:', err);
            showMessage(dispatch, {
                Type: CONSTANTS.ERRREUR, Message: 'Error!'
            });
        } finally {
            calback(false)
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


    const updateDeliveredAdress = async (e) => {
        e.preventDefault();
        await tryRequest(
            () => {
                api.post("delivery-address/", { address: address });
                dispatch(updateUserData({ ...currentUserData, adresse: address }))
            },
            t('Adress addded'),
            setLoadingAdress
        );

    }


    useEffect(() => {

        const getDeliveredAdress = async () => {

            try {

                const res = await api.get("delivery-address/");
                setDeliveryAddress(res.data);

            } catch (err) {

                console.log("Error:::", err)
            }

        };

        getDeliveredAdress()

    }, [address])

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

            <AttentionAlertMessage />

            <div

                style={{
                    maxWidth: '100%',
                    margin: '0 auto',
                    padding: '2rem 1rem 2rem',
                    fontFamily: 'var(--font-sans)',
                }}>
                {/* Page header */}
                <div style={{ marginBottom: '0.5rem' }}>
                    <TitleCompGen title={t('settingsText.accountSettings')} />
                    <p style={{ margin: '1px 0 0', fontSize: '14px', color: 'var(--color-text-tertiary)' }}>
                        {t('settingsText.settingsSubtitle', 'Gérez votre compte, vos préférences et votre abonnement.')}
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }} className="flex flex-col md:block md:flex-row">

                    {/* ── Sidebar ── */}
                    <aside

                        className="flex md:block overflow-x-auto w-full md:w-[200px] scrollbor_hidden_ z-10 mt-10"

                        style={{
                            flexShrink: 0,
                            background: 'var(--color-background-primary)',
                            border: '0.5px solid var(--color-border-tertiary)',
                            borderRadius: '16px',
                            padding: '10px',
                            position: 'sticky',
                            top: '2rem',
                        }}
                    >
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
                        {activeSection === CONSTANTS?.PROFILE && (
                            <>

                                <form onSubmit={updatePassword}>

                                    <Section title={t('settingsText.profile', 'Profil')}>

                                        {/* Avatar row */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '1.25rem' }}>

                                            {previewUrl || currentUserData?.image ? (
                                                <img
                                                    src={getMediaUrl(previewUrl) || getMediaUrl(currentUserData.image)}
                                                    alt="Profil"
                                                    style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover', border: '2px solid #AFA9EC' }}
                                                />
                                            ) : (
                                                <div style={{
                                                    width: 60, height: 60, borderRadius: '50%',
                                                    background: '#EEEDFE', display: 'flex', alignItems: 'center',
                                                    justifyContent: 'center', fontSize: '20px', fontWeight: 600, color: '#6366f1',
                                                }}>
                                                    {initials}
                                                </div>
                                            )}

                                            <div>
                                                <label style={{
                                                    display: 'inline-block',
                                                    fontSize: '13px', fontWeight: 500,
                                                    color: '#6366f1', cursor: 'pointer',
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

                                <CountryField
                                    value={currentUserData?.country}
                                    t={t}
                                    onSave={(newCountry) => {
                                        try {
                                            api.put("/clients/update-country/", { country: newCountry })
                                            dispatch(updateUserData({ ...currentUserData, country: newCountry }))
                                            showToast("Done !!");
                                        } catch (err) {
                                            alert("Error")
                                        }

                                    }
                                    }
                                />

                                <DeliveryAddressField
                                    setDeliveryAddress={setDeliveryAddress}
                                    deliveryAddress={deliveryAddress}
                                    address={address}
                                    onUpdate={updateDeliveredAdress}
                                    onSelect={getAddress}
                                    loading={loadingAdress}
                                    t={t}
                                />
                            </>
                        )}

                        {/* ── Preferences ── */}
                        {activeSection === CONSTANTS?.PREFERENCES && (

                            <form onSubmit={handleSubmit}>

                                <Section title={t('settingsText.preferences')}>

                                    <FieldRow label={t('settingsText.theme')}>
                                        <ThemeSelector value={form.theme} onChange={handleUpdateThem} t={t} />
                                    </FieldRow>

                                    <FieldRow
                                        label={t('settingsText.notifications')}
                                        hint={t('settingsText.notificationsHint')}
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
                        {activeSection === CONSTANTS?.PAYMENT && (

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
                        {activeSection === CONSTANTS?.SUBSCRIPTION && (
                            <SubscriptionsPage />
                        )}

                        {/* ── Danger zone ── */}
                        {activeSection === CONSTANTS?.DANGER && (
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