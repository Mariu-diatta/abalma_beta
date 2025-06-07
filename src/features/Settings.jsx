import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../services/Axios';


const SettingsForm = () => {
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
        zip: '',
        country: '',
    });

    const [profilePhoto, setProfilePhoto] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const currentUserData = useSelector((state) => state.auth.user);
    const currentUserCompte = useSelector((state) => state.auth.compteUser);


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({
            ...form,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleImageUpload = (e) => {

        const file = e.target.files[0];

        setProfilePhoto(file);

        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!currentUserCompte?.id) {
            alert("Aucun ID de compte trouvé.");
            return;
        }

        try {
            await api.patch(`/comptes/${currentUserCompte.id}/`, {
                theme: form.theme,
                is_notif_active: form.notifications,
            });

            alert('Paramètres du compte enregistrés avec succès !');
        } catch (error) {
            console.error("Erreur lors de l'enregistrement des données :", error);
            alert("Une erreur est survenue. Vérifie les données ou contacte le support.");
        }
    };

    const updatePassword = async (e) => {

        e.preventDefault();

        if (!currentUserData?.id) return;

        try {

            await api.patch(`/clients/${currentUserData?.id}/`, {
                password: form.password,
            });

            alert('Mot de passe modifié avec succès !');

        } catch (error) {

            console.error("Erreur lors de l'enregistrement des données :", error);
        }

    }


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

            alert('Paramètres de la carte enregistrés avec succès !');

        } catch (error) {

            console.error("Erreur lors de l'enregistrement des données :", error);
        }
    };


    return (

        <div className="w-full flex flex-col lg:flex-row justify-center items-start gap-8 px-4 py-8">

            <form
                onSubmit={updatePassword}
                className="w-auto bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 space-y-6"
            >
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Paramètres du compte</h2>

                {/* 📷 Photo de profil */}
                <div className="flex items-center gap-4">
                    {currentUserData?.image ? (
                        <img
                            src={currentUserData.image}
                            alt="Profil"
                            className="w-16 h-16 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center text-gray-500">
                            ?
                        </div>
                    )}
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
                    label={currentUserData?.nom || "Nom"}
                    value={form.name}
                    onChange={handleChange}
                    disabled={true}
                />

                <FloatingInput
                    id="email"
                    name="email"
                    label="Adresse email"
                    type="email"
                    value={currentUserData?.email || form.email}
                    onChange={handleChange}
                    disabled={true}
                />

                <FloatingInput
                    id="password"
                    name="password"
                    label="Mot de passe"
                    type="password"
                    value={form.password || currentUserData?.password}
                    onChange={handleChange}
                />


                <button
                    type="submit"
                    className="w-full py-2 px-4 mt-4 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Changer de mot de passe

                </button>

            </form>

            <form
                onSubmit={handleSubmit}
                className="w-auto bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 space-y-6"
            >
                {/* 🌙 Thème */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">

                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Thème :</label>

                    <select
                        name="theme"
                        value={form.theme}
                        onChange={handleChange}
                        className="border-0 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 p-2.5"
                    >
                        <option value="light">Clair</option>
                        <option value="dark">Sombre</option>
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
                        Activer les notifications
                    </label>

                </div>

                <button
                    type="submit"
                    className="w-full py-2 px-4 mt-4 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Enregistrer
                </button>

            </form>

            <form
                onSubmit={handleSubmitCard}
                className="w-auto bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 space-y-6"
            >
                {/* 💳 Paiement */}
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mt-4">Méthode de paiement</h3>

                <FloatingInput
                    type="number"
                    id="cardNumber"
                    name="cardNumber"
                    label="Numéro de carte"
                    maxLength={19}
                    value={form.cardNumber}
                    onChange={handleChange}
                />

                <div className="flex gap-4">
                    <FloatingInput
                        type="date"
                        id="expiry"
                        name="expiry"
                        label="Exp. MM/AA"
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
                        value={form.cvv}
                        onChange={handleChange}
                        wrapperClass="w-1/2"
                    />
                </div>

                {/* 🧾 Adresse de facturation */}
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mt-4">Adresse de facturation</h3>

                <FloatingInput
                    type="text"
                    id="address"
                    name="address"
                    label="Adresse"
                    value={form.address}
                    onChange={handleChange}
                />

                <div className="flex gap-4">

                    <FloatingInput
                        type="text"
                        id="city"
                        name="city"
                        label="Ville"
                        value={form.city}
                        onChange={handleChange}
                        wrapperClass="w-1/2"
                    />

                    <FloatingInput
                        type="text"
                        id="zip"
                        name="zip"
                        label="Code postal"
                        value={form.zip}
                        onChange={handleChange}
                        wrapperClass="w-1/2"
                    />

                </div>

                <FloatingInput
                    type="text"
                    id="country"
                    name="country"
                    label="Pays"
                    value={form.country}
                    onChange={handleChange}
                />

                <button
                    type="submit"
                    className="w-full py-2 px-4 mt-4 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Enregistrer la carte
                </button>

            </form>

        </div>
    );
};

// 🔁 Composant d'entrée personnalisé
const FloatingInput = ({ id, name, label, type = 'text', value, onChange, maxLength, wrapperClass = '', disabled}) => (

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
