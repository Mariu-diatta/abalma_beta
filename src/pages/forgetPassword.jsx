import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import InputBox from "../components/InputBoxFloat";
import api from "../services/Axios";
import { useParams } from "react-router-dom";
import AttentionAlertMessage, { showMessage } from "../components/AlertMessage";
import { useDispatch} from "react-redux";
import { ButtonSimple } from "../components/Button";
import FormLayout from "../layouts/FormLayout";
import TitleCompGen from "../components/TitleComponentGen";

const LayoutPwdForget = () => {

    const { t } = useTranslation();
    const { uidb64, token } = useParams();
    const [step, setStep] = useState(uidb64 && token ? 2 : 1);
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [countdown, setCountdown] = useState(100);
    const dispatch = useDispatch();

    // Étape 1 : Demande de lien de réinitialisation
    const handleRequestCode = async () => {

        showMessage(dispatch, null)

        if (!email) {

            showMessage(dispatch,{Type:"Erreur", Message:t("form.emailRequired")})

            return;
        }

        try {

            await api.post("/forget_password/request/", { email });

            showMessage(dispatch, { Type: "Message", Message: "Email de reset envoyé à :", email });

            setStep(2);

        } catch (err) {


            showMessage(dispatch, {Type:"Erreur", Message:t('form.resetRequestError')}+err?.response || err?.request?.response || err)

        }
    };

    // Étape 2 : Réinitialisation du mot de passe
    const handleResetPassword = async () => {

        showMessage(dispatch, null)

        if (!newPassword) {

            showMessage(dispatch, { Type: "Erreur", Message: t("form.passwordRequired")})

            return;
        }

        if (!uidb64 || !token) {

            showMessage(dispatch, {Type:"Erreur", Messgae:t("form.invalidLink") || "Lien de réinitialisation invalide."})

            return;
        }

        try {

            await api.post(`/forget_password/reset/${uidb64}/${token}/`, {

                password: newPassword
            });

            showMessage(dispatch, { Type: "Message", Messgae: "Mot de passe réinitialisé." })

            setStep(3);

        } catch (err) {

            showMessage(dispatch, { Type: "Message", Messgae:err?.response || t("form.resetError") })

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

                        <small className="whitespace-nowrap text-xs  text-black-900 dark:text-white">{t(`forgetPswd.step${s}`)}</small>

                    </div>

                </li>

            ))}

        </ol>
    );

    return (
         <FormLayout>

                <TitleCompGen title={t('forgetPswd.title')} />

                <StepIndicator />

                <AttentionAlertMessage/>
     
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


                        <ButtonSimple
                            title={t("forgetPswd.getCode")}
                        />

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

                                <ButtonSimple
                                    title={t("forgetPswd.reset")}
                                />

                            </form>
                        )
                        : 
                        (<p className="text-sm">{t('confirmForgotPassword')}</p>)
                    )
                                
                }

                {step === 3 && (

                    <div className="text-center">

                        <p className="text-lg font-medium text-green-600 dark:text-green-400">
                            {t("forgetPswd.success")}
                        </p>
                                   
                        <p className="mt-4 text-xs  text-gray-700 dark:text-gray-300">
                            {t("forgetPswd.redirectIn")} {Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, "0")}...
                        </p>

                    </div>
                )}


         </FormLayout >
    );
};

export default LayoutPwdForget;
