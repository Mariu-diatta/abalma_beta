import React, {useRef, useState} from 'react';
import { createPortal } from 'react-dom';
import { useNavigate} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch} from 'react-redux';
import { CreateClient} from '../utils';
import { X } from 'lucide-react'; // Pour fermer
import TitleCompGen from '../components/TitleComponentGen';
import InputBox from '../components/InputBoxFloat';
import PhoneInput from '../components/InputPhoneCountry';
import LoadingCard from '../components/LoardingSpin';
import { showMessage } from '../components/AlertMessage';



const RegisterForm = ({ callbackState, onClose}) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
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
            if (onClose) onClose();
            navigate("/", { replace: true });
        }
    };

    // Fermer si clic sur le fond sombre
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget && onClose) onClose();
    };

    return createPortal(
        <div className="scrollbor_hidden fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={handleBackdropClick}>

            <div className="scrollbor_hidden relative w-full max-w-[550px] max-h-[90vh] bg-white dark:bg-dark-2 rounded-3xl shadow-2xl overflow-y-auto animate-in zoom-in-95 duration-300">

                {/* Close Button */}
                <button onClick={onClose} className="absolute top-5 right-5 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors z-10">
                    <X size={22} className="text-gray-400" />
                </button>

                <div className="p-8 md:p-10 scrollbor_hidden">
                    {!loading ? (
                        <section>
                            <div className="mb-8 text-center">
                                <TitleCompGen title={t('register')} />
                                <span className="text-sm text-gray-500 mt-2">
                                    {t("alredyRegister")}{" "}
                                    <button
                                        onClick={() => {
                                             callbackState();
                                             onClose()
                                        }}
                                        className="font-semibold text-blue-600 hover:underline"
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

                                <button type="submit" className="w-full bg-[#1B44C8] hover:bg-[#1536a3] text-white py-3.5 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-[0.98] mt-4">
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