import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import api from '../services/Axios';
import { updateUserData } from '../slices/authSlice';
import  AttentionAlertMessage, { showMessage } from '../components/AlertMessage';
import { useTranslation } from 'react-i18next';
import LoadingCard from './LoardingSpin';



//validation code pour la création d'un compte fournisseur
const GetValidateUserFournisseur = ({ isCurrentUser }) => {

    const { t } = useTranslation();

    const [loading, setLoading] = useState(true);

    const [code, setCode] = useState('');

    const [error, setError] = useState('');

    const [verified, setVerified] = useState(false);

    const profileData = useSelector((state) => state.auth.user);

    const dispatch = useDispatch();

    const handleCodeChange = (e) => {

        setCode(e.target.value);

        setError('');
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

            await api.get('set-csrf/');

            await api.get(`codes_validation/${code}/validation-fournisseur/`)

            await api.post('fournisseurs/validation-fournisseur/', formData)
 

            const updateUser = { ...profileData, "is_verified": true }

            dispatch(updateUserData(updateUser))

            setVerified(true)

        } catch (e) {

            showMessage(dispatch, { Type: "Erreur", Message: e?.response?.data?.detail ||  e?.response || e?.request?.response|| e});

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
                                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                                        ? "bg-blue-600 hover:bg-blue-700"
                                        : "bg-gray-400 cursor-not-allowed"
                                    }`
                                }
                            >
                                {t('ProfilText.validate')}

                            </button>

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