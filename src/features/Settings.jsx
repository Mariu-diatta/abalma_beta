import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import api from '../services/Axios';
import { updateTheme } from '../slices/navigateSlice';
import { useTranslation } from 'react-i18next';
import DeleteProfilAccount from '../components/DeleteAccount';
import { applyTheme } from '../utils';

const SettingsForm = () => {

    const { t } = useTranslation();

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

    const [previewUrl, setPreviewUrl] = useState(null);

    const currentUserData = useSelector((state) => state.auth.user);

    const currentUserCompte = useSelector((state) => state.auth.compteUser);

    const [cartData, setCartData] = useState({});

    const dispatch = useDispatch()

    const tryRequest = async (requestFn, successMessage) => {

        try {

            await requestFn();

            alert(successMessage);

        } catch (err) {

            console.warn("Request failed:", err);
        }
    };

    const handleChange = ({ target }) => {

        const { name, value, type, checked } = target;

        setForm((prev) => ({

            ...prev,

            [name]: type === 'checkbox' ? checked : value,
        }));

        dispatch(updateTheme(value))

        applyTheme(value, dispatch)
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
            () => api.patch(`/comptes/${currentUserCompte.id}/`,
                {
                    theme: form.theme,
                    is_notif_active: form.notifications,
                }
            ), t('settingsText.accountSaved'))

    };

    const updatePassword = async (e) => {

        e.preventDefault();

        await tryRequest(

            () => api.patch(`/clients/${currentUserData?.id}/`,
                {
                    password: form.password,
                }
            ), t('settingsText.passwordUpdated'))

    }

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

        if (currentUserData?.id) {

            GetClientCard();
        }

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

    }, [cartData])

    return (

        <div className="w-auto flex flex-col lg:flex-row justify-center items-start gap-2 px-2 py-8 style-bg">

            <div
                className="w-full  dark:bg-gray-800 shadow-md rounded-lg p-6 space-y-6"
            >
                <h2 className="ms-2 font-extrabold text-gray-500 dark:text-gray-400">{t("settingsText.accountSettings")}</h2>

                {/*Paramètres du compte*/}
                <form

                    onSubmit={(e) => updatePassword(e)}

                    className="w-auto  dark:bg-gray-800 shadow-md rounded-lg p-6 space-y-3"
                >
                    {/* 📷 Photo de profil */}
                    <div className="flex items-center gap-4">

                        {
                            currentUserData?.image ?
                                (

                                    <img
                                        src={currentUserData.image}
                                        alt="Profil"
                                        className="w-16 h-16 rounded-full object-cover"
                                    />

                                )
                                :
                                (
                                    <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center text-gray-500">
                                        ?
                                    </div>
                                )
                        }

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="text-sm text-gray-700 dark:text-gray-300"
                        />

                    </div>

                    <FloatingInput
                        id="name"
                        name="name"
                        label={currentUserData?.nom || t('settingsText.nameLabel')}
                        value={form.name}
                        onChange={handleChange}
                        disabled={true}
                    />

                    <FloatingInput
                        id="email"
                        name="email"
                        label={t('settingsText.emailLabel')}
                        type="email"
                        value={currentUserData?.email || form.email}
                        onChange={handleChange}
                        disabled={true}
                    />

                    <FloatingInput
                        id="password"
                        name="password"
                        label={t('settingsText.passwordLabel')}
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                    />

                    <button
                        type="submit"
                        className="w-full py-2 px-4 mt-4 text-sm  text-white bg-blue-100 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {t('settingsText.changePassword')}

                    </button>

                </form>

                {/*Thème*/}
                <form

                    onSubmit={(e) => handleSubmit(e)}

                    className="w-auto  dark:bg-gray-800 shadow-md rounded-lg p-6 space-y-6"
                >
                    {/* 🌙 Thème */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">

                        <label className="ms-2 font-extrabold text-gray-500 dark:text-gray-400">{t('settingsText.theme')}</label>

                        <select
                            name="theme"
                            value={form.theme}
                            onChange={handleChange}
                            className="style-bg border-0 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 p-2.5 "
                        >
                            <option value="light">{t('settingsText.themeLight')}</option>

                            <option value="dark">{t('settingsText.themeDark')}</option>

                        </select>

                    </div>

                    {/* 🔔 Notifications */}
                    <div className="flex items-center">

                        <input
                            id="notifications"
                            type="checkbox"
                            name="notifications"
                            checked={form.notifications}
                            onChange={handleChange}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                        />

                        <label htmlFor="notifications" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">

                            {t('settingsText.notifications')}

                        </label>

                    </div>

                    <button

                        type="submit"

                        className="w-full py-2 px-4 mt-4 text-sm  text-white bg-blue-100 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        notifications

                    </button>

                </form>
                <DeleteProfilAccount /> 
            </div>
            
            {/*Mode de paiement*/}
            <form
                onSubmit={(e) => handleSubmitCard(e)}
                className="w-full dark:bg-gray-800 shadow-md rounded-lg p-6 space-y-6"
            >

                {/* 💳 Paiement */}
                <h3 className="ms-2 font-extrabold text-gray-500 dark:text-gray-400">{t("settingsText.paymentMethod")}</h3>

                <FloatingInput
                    type="number"
                    id="cardNumber"
                    name="cardNumber"
                    label={t('settingsText.cardNumberLabel')}
                    maxLength={19}
                    value={form.cardNumber || cartData?.number_card}
                    onChange={handleChange}
                />

                <div className="flex gap-4">

                    <FloatingInput
                        type="date"
                        id="expiry"
                        name="expiry"
                        label={t('settingsText.expiryLabel')}
                        maxLength={5}
                        value={form.expiry}
                        onChange={handleChange}
                        wrapperClass="w-1/2"
                    />

                    <FloatingInput
                        type="number"
                        id="cvv"
                        name="cvv"
                        label="CVV"
                        maxLength={4}
                        value={form.cvv || cartData?.number_cvv}
                        onChange={handleChange}
                        wrapperClass="w-1/2"
                    />

                </div>

                {/* 🧾 Adresse de facturation */}
                <h3 className="text-lg  text-gray-800 dark:text-white mt-4">{t('settingsText.billingAddress')}</h3>

                <FloatingInput
                    type="text"
                    id="address"
                    name="address"
                    label={t('settingsText.addressLabel')}
                    value={form.address || cartData?.adresse_pay}
                    onChange={handleChange}
                />

                <div className="flex gap-4">

                    <FloatingInput
                        type="text"
                        id="city"
                        name="city"
                        label={t('settingsText.cityLabel')}
                        value={form.city || cartData?.ville_pay}
                        onChange={handleChange}
                        wrapperClass="w-1/2"
                    />

                    <FloatingInput
                        type="number"
                        id="zip"
                        name="zip"
                        label={t('settingsText.zipLabel')}
                        value={form.zip || parseInt(cartData?.code_postal_pay)}
                        onChange={handleChange}
                        wrapperClass="w-1/2"
                    />

                </div>

                <FloatingInput
                    type="text"
                    id="country"
                    name="country"
                    label={t('settingsText.countryLabel')}
                    value={form.country || cartData?.pays_pay}
                    onChange={handleChange}
                />

                <button
                    type="submit"
                    className="w-full py-2 px-4 mt-4 text-sm  text-white bg-blue-100 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {t('settingsText.saveCard')}

                </button>

            </form>

        </div>
    );
};

// 🔁 Composant d'entrée personnalisé
const FloatingInput = ({ id, name, label, type = 'text', value, onChange, maxLength, wrapperClass = '', disabled }) => (

    <div className={`relative ${wrapperClass}`}>

        <input
            type={type}
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            placeholder=" "
            maxLength={maxLength}
            disabled={disabled || false}
            className="peer block w-full px-2.5 pt-5 pb-2.5 text-sm text-gray-900 bg-gray-50 dark:bg-gray-700 border-0 border-b-2 border-gray-300 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-0 focus:border-blue-600"
        />

        <label

            htmlFor={id}

            className="absolute text-sm text-gray-500 dark:text-gray-400 top-4 left-2.5 transition-all scale-75 -translate-y-4 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:scale-75 peer-focus:-translate-y-4"
        >
            {label}

        </label>

    </div>
);

export default SettingsForm;

