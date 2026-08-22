import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { CreateClient } from '../utils';
import { X } from 'lucide-react'; // Pour fermer
import TitleCompGen from '../components/TitleComponentGen';
import InputBox from '../components/InputBoxFloat';
import PhoneInput from '../components/InputPhoneCountry';
import LoadingCard from '../components/LoardingSpin';
import AttentionAlertMessage, { showMessage } from '../components/AlertMessage';



const RegisterForm = ({ callbackState, onClose }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    //const navigate = useNavigate();
    const componentRef = useRef(null);

    const [form, setForm] = useState({
        "password": "", "password1": "", "email": "",
        "prenom": "", "nom": "", "telephone": "", "adresse": "",
        "is_active": true,
    });

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSignUp = async (e) => {
        e.preventDefault();
        if (!form.email || !form.password || !form.password1) {
            return showMessage(dispatch, { Type: "Erreur", Message: "Tous les champs requis doivent être remplis." });
        }
        if (form.password !== form.password1) {
            return showMessage(dispatch, { Type: "Erreur", Message: "Les mots de passe ne correspondent pas." });
        }

        setLoading(true);

        const response = await CreateClient(form, setLoading, showMessage, dispatch, t);

        if (response) {

            showMessage(dispatch, { Type: 'Message', Message: t('creatAccountSucces') });

            if (onClose) onClose();
        }
    };

    // Fermer si clic sur le fond sombre
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget && onClose) onClose();
    };

    return createPortal(

        <div className="scrollbor_hidden fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={handleBackdropClick}>

            <AttentionAlertMessage />

            <div className="scrollbor_hidden relative w-full max-w-[550px] max-h-[98vh] bg-white dark:bg-dark-2 rounded-3xl shadow-2xl ring-1 ring-black/5 overflow-hidden animate-in zoom-in-95 duration-300">

                {/* Liseré décoratif premium (cohérent avec la modale de connexion) */}
                <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 rounded-t-3xl" />

                {/* Close Button */}
                <button onClick={onClose} className="absolute top-5 right-5 p-2 bg-white/80 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full shadow-sm transition-colors z-10">
                    <X size={22} className="text-gray-400" />
                </button>

                <div className="px-8 py-10 md:px-10 md:py-10 scrollbor_hidden overflow-hidden">
                    {!loading ? (
                        <section>
                            <div className="mb-8 text-center">
                                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-200">
                                    <span className="text-white text-lg font-bold">A</span>
                                </div>
                                <TitleCompGen title={t('register')} />
                                <span className="text-sm text-gray-500 mt-2">
                                    {t("alredyRegister")}{" "}
                                    <button
                                        onClick={() => {
                                            callbackState();
                                            onClose()
                                        }}
                                        className="font-semibold text-indigo-600 hover:underline"
                                    >
                                        {t("login")}
                                    </button>
                                </span>
                            </div>

                            <form onSubmit={handleSignUp} ref={componentRef} className="space-y-2 scrollbor_hidden">

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <InputBox type="text" name="nom" placeholder={t('form.lastName')} value={form.nom} onChange={handleChange} />
                                    <InputBox type="text" name="prenom" placeholder={t('form.firstName')} value={form.prenom} onChange={handleChange} />
                                </div>

                                <InputBox type="email" name="email" placeholder={t('form.email')} value={form.email} onChange={handleChange} />

                                <PhoneInput form={form} handleChange={handleChange} setForm={setForm} />

                                <InputBox type="password" name="password" placeholder={t('form.password')} value={form.password} onChange={handleChange} autoComplete="new-password" />

                                <InputBox type="password" name="password1" placeholder={t('form.confirmPassword')} value={form.password1} onChange={handleChange} autoComplete="off" />

                                <button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-[0.98] mt-4">
                                    {t("register")}
                                </button>
                            </form>
                        </section>
                    ) : (
                        <div className="py-12 flex justify-center"><LoadingCard /></div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default RegisterForm;