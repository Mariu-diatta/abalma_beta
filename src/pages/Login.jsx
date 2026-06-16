import React, { lazy,useState } from "react";
import { createPortal } from "react-dom"; // Import du Portal
import { useDispatch} from 'react-redux';
import { useTranslation } from 'react-i18next';
import { NavLink, useNavigate } from 'react-router-dom';
import { setCurrentNav } from '../slices/navigateSlice';
import { LoginWithGoogle } from '../firebase';
import { GoogleOAuthProvider } from '@react-oauth/google';
import {loginClient } from '../utils';
import { showMessage } from '../components/AlertMessage';
import { X } from "lucide-react"; // Icône pour fermer

const InputBox = lazy(() => import("../components/InputBoxFloat"));
const LoadingCard = lazy(() => import("../components/LoardingSpin"));
const TitleCompGen = lazy(() => import("../components/TitleComponentGen"));

const LogIn = ({ callbackState, onClose }) => {

    // Prop onClose ajoutée
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [pwd, setPwd] = useState("");
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const navigate = useNavigate();

    // -- Logique inchangée --
    const handleSignIn = async () => {

        if (!email || !pwd) {
            showMessage(dispatch, { Type: "Erreur", Message: "Veuillez remplir tous les champs." });
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("email", email);
            formData.append("password", pwd);
            await loginClient(formData, dispatch, setLoading, navigate);
            if (onClose) onClose(); // Fermer le popover après succès

        } catch (e) {
            const errorMessage = e?.response?.data?.detail || e?.response?.data?.error;
            showMessage(dispatch, { Type: "Erreur", Message: errorMessage || "Error" });

        } finally {
            setLoading(false);
        }
    };

    // Fermeture sur clic extérieur
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget && onClose) onClose();
    };

    // Portal vers le body
    return createPortal(

        <div
            className="scrollbor_hidden fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={handleBackdropClick}
        >

            <div className="scrollbor_hidden relative w-full max-w-[550px] max-h-[90vh] bg-white dark:bg-dark-2 rounded-3xl shadow-2xl overflow-y-auto animate-in zoom-in-95 duration-300">

                {/* Bouton Fermer */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors z-10"
                >
                    <X size={20} className="text-gray-500" />
                </button>

                <div className="p-8 md:p-10">

                    {!loading ? (
                        <section>

                            {/* HEADER */}
                            <div className="mb-8 text-center space-y-2">

                                <TitleCompGen title={t("login")} />

                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    <span>{t("notRegistered")}</span>{" "}
                                    <button
                                        onClick={() => {
                                            callbackState();
                                            onClose()
                                        }}
                                        className="font-semibold text-blue-600 hover:underline"
                                    >
                                        {t("register")}
                                    </button>
                                </span>

                            </div>

                            {/* FORM */}
                            <form
                                className="space-y-4"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSignIn();
                                }}
                            >
                                <InputBox
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={t('form.email')}
                                    required
                                />

                                <InputBox
                                    type="password"
                                    name="password"
                                    value={pwd}
                                    onChange={(e) => setPwd(e.target.value)}
                                    placeholder={t('form.password')}
                                    required
                                />

                                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-200 active:scale-95">
                                    {t("login")}
                                </button>

                            </form>

                            <div className="mt-6 text-center">
                                <NavLink
                                    to="/forgetPassword"
                                    onClick={() => {
                                        dispatch(setCurrentNav("forgetPassword"));
                                        if (onClose) onClose();
                                    }}
                                    className="text-xs text-gray-400 hover:text-blue-600 transition"
                                >
                                    {t("forgetPwd")}
                                </NavLink>
                            </div>

                            {/* SEPARATEUR */}
                            <div className="relative my-8">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-100 dark:border-gray-800"></div>
                                </div>
                                <div className="relative text-center text-xs uppercase tracking-widest">
                                    <span className="bg-white dark:bg-dark-2 px-4 text-gray-400">
                                        {t("connect_with")}
                                    </span>
                                </div>
                            </div>

                            {/* GOOGLE */}
                            <div className="flex justify-center">
                                <GoogleOAuthProvider clientId="154955455828-340tuohbjc1c4imb29uqi4hr9l5dm0sv.apps.googleusercontent.com">
                                    <LoginWithGoogle />
                                </GoogleOAuthProvider>
                            </div>

                        </section>
                    ) : (
                        <div className="py-20">
                            <LoadingCard />
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default LogIn;