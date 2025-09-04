import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import api from '../services/Axios';
import { updateTheme } from '../slices/navigateSlice';
import { useTranslation } from 'react-i18next';
import DeleteProfilAccount from '../components/DeleteAccount';
import { FloatingInput, NotificationToggle, ThemeSelector, applyTheme } from '../utils';

const SettingsForm = () => {

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const currentUserData = useSelector((state) => state.auth.user);
    const currentUserCompte = useSelector((state) => state.auth.compteUser);

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

    const tryRequest = async (requestFn, successMessage) => {

        try {

            await requestFn();

            alert(successMessage);

        } catch (err) {

            console.warn("Request failed:", err);
        }
    };

    const handleChange = (e) => {

        const { name, value, type, checked } = e.target;

        setForm((prev) => ({

            ...prev,

            [name]: type === 'checkbox' ? checked : value,

        }));
    };

    const handleUpdateThem = (e) => {

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
        if (!currentUserCompte?.id) {
            alert(t('settingsText.noAccountId'));
            return;
        }
        await tryRequest(
            () => api.patch(`/comptes/${currentUserCompte.id}/`, {
                theme: form.theme,
                is_notif_active: form.notifications,
            }),
            t('settingsText.accountSaved')
        );
    };

    const updatePassword = async (e) => {
        e.preventDefault();
        await tryRequest(
            () => api.patch(`/clients/${currentUserData?.id}/`, {
                password: form.password,
            }),
            t('settingsText.passwordUpdated')
        );
    };

    const GetClientCard = useCallback(async () => {

        if (!currentUserData?.id) return;

        try {
            const resp = await api.get("/cardPaid/");
            const dataCard = resp?.data?.filter(elem => elem?.client === currentUserData.id);
            const firstCard = dataCard.length > 0 ? dataCard[0] : null;
            setCartData(firstCard);

        } catch (error) {

            console.error("Erreur lors de la récupération des données de la carte :", error);
        }

    }, [currentUserData?.id]);

    const handleSubmitCard = async (e) => {

        e.preventDefault();

        if (!currentUserData?.id) return;

        const formData = new FormData();
        formData.append("date_expiration", form.expiry);
        formData.append("number_cvv", form.cvv);
        formData.append("number_card", form.cardNumber);
        formData.append("adresse_pay", form.address);
        formData.append("ville_pay", form.city);
        formData.append("code_postal_pay", form.zip);
        formData.append("pays_pay", form.country);
        formData.append("client", currentUserData.id);

        try {

            await api.post("/cardPaid/", formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            alert(t('settingsText.cardSaved'));

        } catch (error) {

            console.error("Erreur lors de l'enregistrement des données :", error);
        }
    };

    useEffect(() => {
        if (currentUserData?.id) GetClientCard();

    }, [currentUserData?.id, GetClientCard]);

    useEffect(() => {

        return () => {

            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };

    }, [previewUrl]);

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

    return (
        <div className="w-auto flex flex-col lg:flex-row justify-center items-start gap-8 px-2 py-1 style-bg">

            <div className="w-full lg:w-full xl:w-full sticky top-0 self-start h-fit max-h-screen overflow-y-auto dark:bg-gray-800  scrollbor_hidden rounded-lg p-1 space-y-6">

                <h2 className="ms-2 font-extrabold text-gray-500 dark:text-gray-400">{t("settingsText.accountSettings")}</h2>

                {/* Compte form */}
                <form onSubmit={updatePassword} className="w-auto dark:bg-gray-800 shadow-md rounded-lg m-0 space-y-3 lg:px-6 py-3">

                    <div className="flex items-center gap-4">
                        {currentUserData?.image ? (
                            <img src={currentUserData.image} alt="Profil" className="w-16 h-16 rounded-full object-cover" />
                        ) : (
                            <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center text-gray-500">?</div>
                        )}
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="text-sm text-gray-700 dark:text-gray-300" />
                    </div>

                    <FloatingInput id="name" name="name" label={currentUserData?.nom || t('settingsText.nameLabel')} value={form.name} onChange={handleChange} disabled />
                    <FloatingInput id="email" name="email" label={t('settingsText.emailLabel')} type="email" value={currentUserData?.email || form.email} onChange={handleChange} disabled />
                    <FloatingInput id="password" name="password" label={t('settingsText.passwordLabel')} type="password" value={form.password} onChange={handleChange} />
                    <button type="submit" className="w-full py-2 px-4 mt-4 text-sm text-white bg-blue-100 hover:bg-blue-700 rounded-md">{t('settingsText.changePassword')}</button>

                </form>

                {/* Préférences */}
                <form onSubmit={handleSubmit} className="w-auto dark:bg-gray-800 shadow-md rounded-lg p-6 space-y-6">

                    <ThemeSelector value={form.theme} onChange={handleUpdateThem} t={t} />

                    <NotificationToggle checked={form.notifications} onChange={handleChange} t={t} />

                    <button type="submit" className="w-full py-2 px-4 mt-4 text-sm text-white bg-blue-100 hover:bg-blue-700 rounded-md">{t('settingsText.save')}</button>

                </form>

                <DeleteProfilAccount />

            </div>

            {/* Paiement */}
            <form onSubmit={handleSubmitCard} className="w-full dark:bg-gray-800 shadow-md rounded-lg p-6 space-y-6">

                <h3 className="ms-2 font-extrabold text-gray-500 dark:text-gray-400">{t("settingsText.paymentMethod")}</h3>

                <FloatingInput type="number" id="cardNumber" name="cardNumber" label={t('settingsText.cardNumberLabel')} maxLength={19} value={form.cardNumber} onChange={handleChange} />

                <div className="flex gap-4">
                    <FloatingInput type="date" id="expiry" name="expiry" label={t('settingsText.expiryLabel')} wrapperClass="w-1/2" value={form.expiry} onChange={handleChange} />
                    <FloatingInput type="number" id="cvv" name="cvv" label="CVV" maxLength={4} wrapperClass="w-1/2" value={form.cvv} onChange={handleChange} />
                </div>

                <h3 className="text-lg text-gray-800 dark:text-white mt-4">{t('settingsText.billingAddress')}</h3>

                <FloatingInput type="text" id="address" name="address" label={t('settingsText.addressLabel')} value={form.address} onChange={handleChange} />

                <div className="flex gap-4">
                    <FloatingInput type="text" id="city" name="city" label={t('settingsText.cityLabel')} wrapperClass="w-1/2" value={form.city} onChange={handleChange} />
                    <FloatingInput type="number" id="zip" name="zip" label={t('settingsText.zipLabel')} wrapperClass="w-1/2" value={form.zip} onChange={handleChange} />
                </div>

                <FloatingInput type="text" id="country" name="country" label={t('settingsText.countryLabel')} value={form.country} onChange={handleChange} />

                <button type="submit" className="w-full py-2 px-4 mt-4 text-sm text-white bg-blue-100 hover:bg-blue-700 rounded-md">{t('settingsText.saveCard')}</button>

            </form>

        </div>
    );
};



export default SettingsForm;
