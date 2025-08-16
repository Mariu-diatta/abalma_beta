import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import InputBox from "../components/InputBoxFloat";
import HomeLayout from "../layouts/HomeLayout";
import api from "../services/Axios";
import { useParams } from "react-router-dom";
import AttentionAlertMessage, { showMessage } from "../components/AlertMessage";
import { useDispatch, useSelector } from "react-redux";

const PwdForget = () => {

    const { t } = useTranslation();
    const { uidb64, token } = useParams();
    const [step, setStep] = useState(uidb64 && token ? 2 : 1);
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [countdown, setCountdown] = useState(100);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();
    const messageAlert = useSelector((state) => state.navigate.messageAlert);

    // Étape 1 : Demande de lien de réinitialisation
    const handleRequestCode = async () => {

        setError("");

        if (!email) {

            alert(t("form.emailRequired"));

            showMessage(dispatch, t("form.emailRequired"))

            return;
        }

        try {

            await api.post("/forget_password/request/", { email });

            console.log("Email de reset envoyé à :", email);

            setStep(2);

        } catch (err) {

            console.error(err);

            setError(t('form.resetRequestError'));

            showMessage(dispatch, t('form.resetRequestError'))

        }
    };

    // Étape 2 : Réinitialisation du mot de passe
    const handleResetPassword = async () => {

        setError("");

        if (!newPassword) {

            alert(t("form.passwordRequired"));

            return;
        }

        if (!uidb64 || !token) {

            setError(t("form.invalidLink") || "Lien de réinitialisation invalide.");

            showMessage(dispatch, t("form.invalidLink"))


            return;
        }

        try {

            await api.post(`/forget_password/reset/${uidb64}/${token}/`, {

                password: newPassword
            });

            console.log("Mot de passe réinitialisé.");

            setStep(3);

        } catch (err) {

            console.error(err);

            setError(t("form.resetError") || "Échec de la réinitialisation du mot de passe.");

            showMessage(dispatch, t("form.resetError"))

        }
    };

    // Redirection automatique après succès
    useEffect(() => {

        if (step === 3) {

            const timer = setInterval(() => {

                setCountdown((prev) => {

                    if (prev <= 1) {

                        clearInterval(timer);

                        window.location.href = "/login";
                    }
                    return prev - 1;
                });

            }, 1000);

            return () => clearInterval(timer);
        }

    }, [step]);

    const StepIndicator = () => (

        <ol className="flex items-center justify-around w-full mb-10">

            {[1, 2, 3].map((s, idx) => (

                <li key={s} className="relative w-full mb-6">

                    <div className="text-sm  flex items-center">

                        <div className={`z-10 flex items-center justify-center w-6 h-6 rounded-full ring-0 ring-white sm:ring-8 shrink-0 
                            ${s <= step ? 'bg-blue-600 text-white' : 'bg-gray-20 dark:bg-gray-700'}`}>

                            <span className={`w-2.5 h-2.5 ${s <= step ? 'bg-white' : 'bg-gray-400'} rounded-full`}></span>

                        </div>

                        {idx < 2 && <div className="text-sm flex w-full bg-gray-200 h-0.5 dark:bg-gray-700"></div>}

                    </div>

                    <div className="mt-3 text-center">

                        <small className="text-sm  text-black-900 dark:text-white">{t(`forgetPswd.step${s}`)}</small>

                    </div>

                </li>

            ))}

        </ol>
    );

    return (
        <section className="bg-gray-1 py-20 dark:bg-dark lg:py-[120px]">

            <div className="container mx-auto">

                <div className="-mx-1 flex flex-wrap justify-center">

                    <div className="w-full max-w-md px-4">

                        <div className="rounded-lg p-8 shadow-lg" style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text)" }}>

                            <h1 className="mb-10 text-2xl font-bold text-dark dark:text-white text-center">
                                {t("forgetPswd.title")}
                            </h1>

                            <StepIndicator />

                            {!!error && (
                                <div className="mb-4 text-red-600 text-sm text-center">{error}</div>
                            )}

                            {error && messageAlert && (

                                <AttentionAlertMessage title="Error" content={messageAlert} />
                            )}

                            {step === 1 && (
                                <form onSubmit={(e) => { e.preventDefault(); handleRequestCode(); }}>
                                    <InputBox
                                        type="email"
                                        name="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder={t("form.email")}
                                        required
                                    />
                                    <div className="mb-10 mt-6">
                                        <input
                                            type="submit"
                                            value={t("forgetPswd.getCode")}
                                            className="w-full cursor-pointer rounded-md border border-blue-600 bg-blue-600 px-5 py-3 text-base font-medium text-white transition hover:bg-blue-700"
                                        />
                                    </div>
                                </form>
                            )}
                            
                            {
                                step === 2 &&
                                (

                                    uidb64 && token ?
                                    (
                                        <form onSubmit={(e) => { e.preventDefault(); handleResetPassword(); }}>
                                            <InputBox
                                                type="password"
                                                name="newPassword"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                placeholder={t("form.newPassword")}
                                                required
                                            />
                                            <div className="mb-10 mt-6">
                                                <input
                                                    type="submit"
                                                    value={t("forgetPswd.reset")}
                                                    className="w-full cursor-pointer rounded-md border border-blue-600 bg-blue-600 px-5 py-3 text-base font-medium text-white transition hover:bg-blue-700"
                                                />
                                            </div>
                                        </form>
                                    )
                                    : 
                                    (<p className="text-sm">Veuillez confimer en clicquant sur le lien envoyé à  votre mail </p>)
                                )
                                
                            }

                            {step === 3 && (
                                <div className="text-center">

                                    <p className="text-lg font-medium text-green-600 dark:text-green-400">
                                        {t("forgetPswd.success")}
                                    </p>

                                    {messageAlert && !error && (

                                        <AttentionAlertMessage title="Success" content={messageAlert} />
                                    )}

                                    <p className="mt-4 text-sm text-gray-700 dark:text-gray-300">
                                        {t("forgetPswd.redirectIn")} {Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, "0")}...
                                    </p>

                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const LayoutPwdForget = () => (
    <HomeLayout>
        <PwdForget />
    </HomeLayout>
);

export default LayoutPwdForget;
