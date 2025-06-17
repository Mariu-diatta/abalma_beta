import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import HomeLayout from '../layouts/HomeLayout';
import { useNavigate } from 'react-router-dom';
import InputBox from '../components/InputBoxFloat';
import { signInWithGoogle, signInWithFacebook, signInWithTwitter } from '../firebase';

import api from '../services/Axios';
import { login, getFirebaseToken, updateUserData, updateUserToken } from '../slices/authSlice';
import AttentionAlertMesage, { showMessage } from '../components/AlertMessage';

// Fonction de login avec l'API
const loginClient = async (data, dispatch, setMessageError) => {

    try {
        const response = await api.post('login/', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });

        if (response?.data) {
            dispatch(updateUserToken(response?.data));
            localStorage.setItem("token", response?.data?.access)
            localStorage.setItem("refresh", response?.data?.refresh)
            return response.data;
        }

    } catch (error) {
        console.log('Erreur lors de la connexion', error?.response);
        const message = error?.response?.data?.detail || "Erreur inconnue.";
        setMessageError(message);
        showMessage(dispatch, message);
        throw error;
    }
};

const Signin = () => {


    const [email, setEmail] = useState("");
    const [pwd, setPwd] = useState("");
;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [messageError, setMessageError] = useState("")
    const userConnected = useSelector((state) => state.auth.isAuthenticated);
    const firebaseToken = useSelector((state) => state.auth.firebaseToken);

    const messageAlert = useSelector((state) => state.navigate.messageAlert);

    const emailRef = useRef(null);

    useEffect(() => {
        // Petite pause pour laisser le navigateur autofill
        setTimeout(() => {
            if (emailRef.current) {
                const value = emailRef.current.value;
                if (value) setEmail(value);
            }
        }, 500); // 500ms pour laisser le navigateur compléter
    }, [])

    const handleGoogleLogin = async () => {
        try {
            const user = await signInWithGoogle();
            dispatch(login(user));
            dispatch(getFirebaseToken(user?.accessToken));
            navigate("/account", { replace: true });
        } catch (error) {
            showMessage(dispatch, "Erreur de connexion Google");
        }
    };

    const handleTwitter = async () => {
        try {
            const user = await signInWithTwitter();
            dispatch(login(user));
            navigate("/account", { replace: true });
        } catch (error) {
            showMessage(dispatch, "Erreur de connexion Twitter");
        }
    };

    const handleFacebookLogin = async () => {
        try {
            const user = await signInWithFacebook();
            dispatch(login(user));
            navigate("/account", { replace: true });
        } catch (error) {
            showMessage(dispatch, "Erreur de connexion Facebook");
        }
    };

    const handleSignIn = async () => {

        if (!email || !pwd) {

            showMessage(dispatch, "Veuillez remplir tous les champs.");

            return;

        } else {

            setEmail(email)
        }


        try {

            const formData = new FormData();

            formData.append("email", email);

            formData.append("password", pwd);

            const userData = await loginClient(formData, dispatch, setMessageError);

            await api.get(`/clients/?email=${email}`).then(

                resp => {

                    console.log("USER DATA USER ", resp)

                    const dataUser = resp?.data[0]

                    if (dataUser){

                        dispatch(updateUserData(dataUser));

                        dispatch(login(dataUser));

                        return navigate("/account", { replace: true });

                    }

                 
                }

            ).catch(

                err=>console.log("ERROR DATA", err)
            )

        } catch (error) {

            showMessage(dispatch, "Erreur de connexion. Vérifie ton email et mot de passe.");
        }
    };


    return (
        <section className="bg-gray-1 py-20 dark:bg-dark lg:py-[120px]">

            <div className="container mx-auto">

                <div className="-mx-4 flex flex-wrap">

                    <div className="w-full px-4">

                        <div className="relative mx-auto max-w-[525px] overflow-hidden rounded-lg bg-white px-10 py-16 text-center dark:bg-dark-2 sm:px-12 md:px-[60px]">

                            <h1 className="mb-10 text-2xl font-bold text-dark dark:text-white">
                                Connectez-vous!
                            </h1>

                            <form onSubmit={(e) => { e.preventDefault(); handleSignIn(); }}>

                                <InputBox
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email"
                                    required
                                />

                                <InputBox
                                    type="password"
                                    name="password"
                                    value={pwd}
                                    onChange={(e) => setPwd(e.target.value)}
                                    placeholder="Password"
                                    ref={emailRef}
                                    required
                                />

                                <div className="mb-10">
                                    <input
                                        type="submit"
                                        value="Sign In"
                                        className="w-full cursor-pointer rounded-md border border-blue-600 bg-blue-600 px-5 py-3 text-base font-medium text-white transition hover:bg-blue-700"
                                    />
                                </div>

                            </form>

                            <p className="mb-6 text-base text-secondary-color dark:text-dark-7">
                                Connect With
                            </p>

                            <ul className="-mx-2 mb-12 flex justify-between">
                                <li className="w-full px-2">

                                    <button
                                        onClick={handleFacebookLogin}
                                        className="flex h-11 w-full items-center justify-center rounded-md bg-[#4064AC] hover:bg-opacity-90">
                                        {/* Facebook SVG */}
                                    </button>

                                </li>

                                <li className="w-full px-2">
                                    <button
                                        onClick={handleTwitter}
                                        className="flex h-11 w-full items-center justify-center rounded-md bg-[#1C9CEA] hover:bg-opacity-90">
                                        {/* Twitter SVG */}
                                    </button>
                                </li>

                                <li className="w-full px-2">
                                    <button
                                        onClick={handleGoogleLogin}
                                        className="flex h-11 w-full items-center justify-center rounded-md bg-[#D64937] hover:bg-opacity-90">
                                        {/* Google SVG */}
                                    </button>
                                </li>

                            </ul>

                            <a href="/#" className="mb-2 inline-block text-base text-dark hover:text-primary hover:underline dark:text-white">
                                Mot de passe oublié ?
                            </a>

                            <p className="text-base text-body-color dark:text-dark-6">

                                <span className="pr-0.5">Pas encore inscrit ?</span>

                                <a href="/#" className="text-primary hover:underline">S'inscrire</a>

                            </p>

                            {messageAlert && (

                                <AttentionAlertMesage title="Erreur" content={messageAlert} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const LogIn = () => (
    <HomeLayout>
        <Signin />
    </HomeLayout>
);

export default LogIn;
