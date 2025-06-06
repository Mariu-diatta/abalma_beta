import React, { useState } from 'react';
import { useSelector } from 'react-redux';

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

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form data:', form, 'Photo:', profilePhoto);
        alert('Paramètres enregistrés avec succès !');
    };

    return (
        <div className="w-full flex justify-center px-4 py-8 ">

            <form
                onSubmit={handleSubmit}

                className="w-auto bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 space-y-6 "
            >
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Paramètres du compte</h2>

                {/* 📷 Photo de profil */}
                <div className="flex items-center gap-4">
                    {currentUserData?.image? (
                        <img src={currentUserData?.image} alt="Profil" className="w-16 h-16 rounded-full object-cover" />
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

                {/* 👤 Nom */}
                <FloatingInput
                    id="name"
                    name="name"
                    label={currentUserData?.nom}
                    value={form.name}
                    onChange={handleChange}
                />

                {/* 📧 Email */}
                <FloatingInput
                    id="email"
                    name="email"
                    label="Adresse email"
                    type="email"
                    value={currentUserData?.email}
                    onChange={handleChange}
                />

                {/* 🔒 Mot de passe */}
                <FloatingInput
                    id="password"
                    name="password"
                    label="Mot de passe"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                />

                {/* 🌙 Thème */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Thème :</label>
                    <select
                        name="theme"
                        value={form.theme}
                        onChange={handleChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 p-2.5"
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

                {/* 💳 Paiement */}
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mt-4">Méthode de paiement</h3>

                <FloatingInput
                    id="cardNumber"
                    name="cardNumber"
                    label="Numéro de carte"
                    maxLength={19}
                    value={form.cardNumber}
                    onChange={handleChange}
                />

                <div className="flex gap-4">
                    <FloatingInput
                        id="expiry"
                        name="expiry"
                        label="Exp. MM/AA"
                        maxLength={5}
                        value={form.expiry}
                        onChange={handleChange}
                        wrapperClass="w-1/2"
                    />
                    <FloatingInput
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
                    id="address"
                    name="address"
                    label="Adresse"
                    value={currentUserData?.addresse}
                    onChange={handleChange}
                />

                <div className="flex gap-4">
                    <FloatingInput
                        id="city"
                        name="city"
                        label="Ville"
                        value={form.city}
                        onChange={handleChange}
                        wrapperClass="w-1/2"
                    />
                    <FloatingInput
                        id="zip"
                        name="zip"
                        label="Code postal"
                        value={form.zip}
                        onChange={handleChange}
                        wrapperClass="w-1/2"
                    />
                </div>

                <FloatingInput
                    id="country"
                    name="country"
                    label="Pays"
                    value={form.country}
                    onChange={handleChange}
                />

                {/* ✅ Bouton submit */}
                <button
                    type="submit"
                    className="w-full py-2 px-4 mt-4 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Enregistrer les paramètres
                </button>
            </form>
        </div>
    );
};

// 🔁 Sous-composant pour champ flottant
const FloatingInput = ({ id, name, label, type = 'text', value, onChange, maxLength, wrapperClass = '' }) => (
    <div className={`relative ${wrapperClass}`}>
        <input
            type={type}
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            placeholder=" "
            maxLength={maxLength}
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
