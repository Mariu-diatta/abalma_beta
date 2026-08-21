import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import api from '../services/Axios';
import { API_ENDPOINTS } from "../services/apiEndpoints";
import { updateUserData } from '../slices/authSlice';
import  AttentionAlertMessage, { showMessage } from '../components/AlertMessage';
import { useTranslation } from 'react-i18next';
import LoadingCard from '../components/LoardingSpin';
import { RefreshCw } from 'lucide-react';

// Formate un nombre de secondes en "mm:ss" pour l'affichage du compte à
// rebours avant de pouvoir redemander un nouveau code.
const formatCountdown = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};



//validation code pour la création d'un compte fournisseur
const GetValidateUserFournisseur = ({ isCurrentUser }) => {

    const { t } = useTranslation();

    const [loading, setLoading] = useState(true);

    const [code, setCode] = useState('');

    const [error, setError] = useState('');

    const [verified, setVerified] = useState(false);

    // Demande d'un nouveau code (quand l'actuel n'a pas été validé au
    // bout de 2h, ou a été perdu / jamais reçu).
    const [resendLoading, setResendLoading] = useState(false);

    const [cooldownSeconds, setCooldownSeconds] = useState(0);

    const profileData = useSelector((state) => state.auth.user);

    const dispatch = useDispatch();

    // Décompte du délai avant de pouvoir redemander un nouveau code.
    useEffect(() => {
        if (cooldownSeconds <= 0) return;

        const timer = setInterval(() => {
            setCooldownSeconds((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, [cooldownSeconds]);

    const handleCodeChange = (e) => {

        setCode(e.target.value);

        setError('');
    };

    const handleResendCode = async () => {

        if (resendLoading || cooldownSeconds > 0) return;

        setResendLoading(true);

        try {

            await api.get(API_ENDPOINTS.AUTH.SET_CSRF);

            const response = await api.post(API_ENDPOINTS.SUPPLIER.RESEND_CODE);

            showMessage(dispatch, {
                Type: 'Success',
                Message: response?.data?.detail || t('ProfilText.resendCodeSuccess'),
            });

            setCode('');

            setError('');

        } catch (e) {

            const status = e?.response?.status;

            const remainingSeconds = e?.response?.data?.remaining_seconds;

            if (status === 429 && typeof remainingSeconds === 'number') {

                setCooldownSeconds(remainingSeconds);
            }

            const errorMessage = e?.response?.data?.detail || e?.response || e?.request?.response || e;

            showMessage(dispatch, { Type: "Erreur", Message: errorMessage });

        } finally {

            setResendLoading(false);
        }
    };

    const handleSubmitCode = async (e) => {

        e.preventDefault();

        if (!code || isNaN(code)) {

            setError('Veuillez entrer un code valide.');

            showMessage(dispatch, 'Veuillez entrer un code valide.');

            return;
        }

        setLoading(false)

        // Appel du callback ou d'une API
        try {

            const formData = new FormData()

            formData.append("code_validation", code)

            await api.get(API_ENDPOINTS.AUTH.SET_CSRF);

            const response = await api.get(API_ENDPOINTS.SUPPLIER.VALIDATION_CODE(code))

            if (response?.data?.exists) {

                await api.post(API_ENDPOINTS.SUPPLIER.VALIDATION, formData)

                const updateUser = { ...profileData, "is_verified": true }

                dispatch(updateUserData(updateUser))

                showMessage(dispatch, { Type: "Success", Message: response?.data?.exists });


                setVerified(true)
            }

        } catch (e) {

            const errorMessage = e?.response?.data?.detail || e?.response || e?.request?.response || e

            showMessage(dispatch, { Type: "Erreur", Message: errorMessage });

        } finally {

            setLoading(true)
        }

    };

    return (

        <>
            <AttentionAlertMessage  />
               
            {
                loading ?
                <>
                {
                    (!verified && isCurrentUser) ?

                        <form

                            onSubmit={handleSubmitCode}

                            className="w-full max-w-md mx-auto bg-white rounded-xl p-6 shadow-md space-y-4 shadow-lg"

                            style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text)" }}
                        >
                            <div>

                                <label
                                    htmlFor="code" className="block text-sm font-semibold text-gray-700 mb-1"

                                    style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text)" }}
                                >
                                    {t('ProfilText.confirmCode')}

                                </label>

                                <input
                                    type="number"
                                    name="code"
                                    id="code"
                                    value={code}
                                    onChange={handleCodeChange}
                                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Ex: 123456"
                                    min="0"
                                    autoComplete="one-time-code"
                                    required
                                />

                            </div>

                            {
                                error && (

                                    <p className="text-red-500 text-sm">

                                        {error}

                                    </p>
                                )
                            }

                            <button

                                type="submit"

                                disabled={!code}

                                className={

                                    `w-full py-2 px-4 rounded-md text-white text-sm font-medium transition duration-200
                                ${code
                                        ? "bg-indigo-600 hover:bg-indigo-700"
                                        : "bg-gray-400 cursor-not-allowed"
                                    }`
                                }
                            >
                                {t('ProfilText.validate')}

                            </button>

                            {/* Redemander un code lorsque celui envoyé n'a pas été
                                validé (perdu, jamais reçu, ou expiré après 2h) */}
                            <div className="text-center pt-1">

                                <p className="text-xs text-gray-500 mb-1">
                                    {t('ProfilText.resendCodeQuestion')}
                                </p>

                                <button
                                    type="button"
                                    onClick={handleResendCode}
                                    disabled={resendLoading || cooldownSeconds > 0}
                                    className={
                                        `inline-flex items-center justify-center gap-1.5 text-sm font-medium transition duration-200
                                        ${(resendLoading || cooldownSeconds > 0)
                                            ? "text-gray-400 cursor-not-allowed"
                                            : "text-indigo-600 hover:text-indigo-700 hover:underline"
                                        }`
                                    }
                                >
                                    <RefreshCw
                                        size={14}
                                        className={resendLoading ? "animate-spin" : ""}
                                    />

                                    {resendLoading
                                        ? t('ProfilText.resendCodeSending')
                                        : cooldownSeconds > 0
                                            ? t('ProfilText.resendCodeWait', {
                                                time: formatCountdown(cooldownSeconds),
                                            })
                                            : t('ProfilText.resendCode')
                                    }
                                </button>

                            </div>

                        </form >
                        :
                        <LoadingCard/>
                }
                </>
                :
                <LoadingCard/>
            }
        </>

    )
}

export default GetValidateUserFournisseur;