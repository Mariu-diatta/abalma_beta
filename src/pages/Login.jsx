import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import HomeLayout from '../layouts/HomeLayout';
import { useNavigate } from 'react-router-dom';
import InputBox from '../components/InputBoxFloat';
import { signInWithGoogle, signInWithFacebook, signInWithTwitter, signInWithEmailPswd } from '../firebase';

import api from '../services/Axios';
import { login, getFirebaseToken } from '../slices/authSlice';
import AttentionAlertMesage, { showMessage } from '../components/AlertMessage';



//Fonction pour les message
const loginClient = async (data, dispatch, setMessageError) => {

    try {
        const response = await api.post('token/', data);

        const { access, refresh } = response.data;

        localStorage.setItem("token", access);

        localStorage.setItem("refresh", refresh);

        console.log("DONNEE DU BACKEND", response)

        //const user=JSON.parse(localStorage.getItem("USER"))

        //const compte = await api.post('/comptes/', user)

        //console.log("MON COMPTE", compte)

        if (access && refresh) {

            return response.data; // renvoyer les donn�es utiles ici
        }
    } catch (error) {

        console.error('Erreur lors de la connexion', error?.response?.data?.detail);

        setMessageError(error?.response?.data?.detail)

        showMessage(dispatch, error?.response?.data?.detail);

        throw error;
    }
};


const Signin = () => {

    const [email, setEmail] = useState("")

    const [setMessageError, messageError] = useState("")

    const [pwd, setPwd] = useState("")

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const userConnected = useSelector((state) => state.auth.isAuthenticated)

    const firebaseToken = useSelector((state) => state.auth.firebaseToken)

    const messageAlert = useSelector((state) => state.navigate.messageAlert)

    const handleGoogleLogin = async () => {

        try {
            const user = await signInWithGoogle();
            //console.log("Connect� avec Google:", user);
            dispatch(login(user))
            //localStorage.setItem("config", user)
            dispatch(getFirebaseToken(user?.accessToken))
            navigate("/account", { replace: true });
            
        } catch (error) {
            alert("Erreur de connexion Google");
            showMessage(dispatch,"Erreur de connexion Google");
        }

        console.log("TOKEN ACCESS FIREBASE", firebaseToken)
    };

    const handleTwitter = async () => {

        try {
            const user = await signInWithTwitter ();
            console.log("Connect� avec TWTe:", user);
            navigate("/account", { replace: true });
        } catch (error) {
            alert("Erreur de connexion TWTe");
            showMessage(dispatch,"Erreur de connexion TWTe");

        }
    };

    const handleFacebookLogin = async () => {
        try {
            const user = await signInWithFacebook();
            console.log("Connect� avec Fbook:", user);
            navigate("/account", { replace: true });
        } catch (error) {
            alert("Erreur de connexion Fbook");
            showMessage(dispatch,"Erreur de connexion Fbook");
        }
    };

    const handleSignIn = async () => {
        try {
            const formData = new FormData();
            formData.append("email", email);
            formData.append("password", pwd);

            const userData = await loginClient(formData, dispatch, setMessageError);

            console.log("userData:", userData);

            if (userData) {
                dispatch(login(userData)); // met � jour Redux avec les donn�es utilisateur
                navigate("/account", { replace: true }); // redirection
            }
        } catch (error) {
            //alert("Erreur de connexion. V�rifie ton email et mot de passe.");
            showMessage(dispatch,"Erreur de connexion. V�rifie ton email et mot de passe.");
            console.log("MESSAGE DU CONTENU", messageAlert)
            //console.error(error);
        }
    };

    useEffect(() => {
        if (userConnected) {
            navigate("/account", { replace: true });
        }
    }, [userConnected, navigate]);


    return (
        <section className="bg-gray-1 py-20 dark:bg-dark lg:py-[120px]">
            <div className="container mx-auto">
                <div className="-mx-4 flex flex-wrap">
                    <div className="w-full px-4">
                        <div className="relative mx-auto max-w-[525px] overflow-hidden rounded-lg bg-white px-10 py-16 text-center dark:bg-dark-2 sm:px-12 md:px-[60px]">
                            <h1 className="mb-10 text-center md:mb-16">
                                <span className="text-2xl font-bold text-dark dark:text-white">
                                    Connectez-vous!
                                </span>
                            </h1>

                            <form onSubmit={(e) => { e.preventDefault();  handleSignIn()}}>

                                <InputBox
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email"
                                />

                                <InputBox
                                    type="password"
                                    name="password"
                                    value={pwd}
                                    onChange={(e) => setPwd(e.target.value)}
                                    placeholder="Password"
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
                                {/* Facebook */}
                                <li className="w-full px-2">
                                    <button
                                        onClick={handleFacebookLogin}
                                        className="flex h-11 w-full items-center justify-center rounded-md bg-[#4064AC] hover:bg-opacity-90">
                                        <svg
                                            width="10"
                                            height="20"
                                            viewBox="0 0 10 20"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M9.29878 8H7.74898H7.19548V7.35484V5.35484V4.70968H7.74898H8.91133C9.21575 4.70968 9.46483 4.45161 9.46483 4.06452V0.645161C9.46483 0.290323 9.24343 0 8.91133 0H6.89106C4.70474 0 3.18262 1.80645 3.18262 4.48387V7.29032V7.93548H2.62912H0.747223C0.359774 7.93548 0 8.29032 0 8.80645V11.129C0 11.5806 0.304424 12 0.747223 12H2.57377H3.12727V12.6452V19.129C3.12727 19.5806 3.43169 20 3.87449 20H6.47593C6.64198 20 6.78036 19.9032 6.89106 19.7742C7.00176 19.6452 7.08478 19.4194 7.08478 19.2258V12.6774V12.0323H7.66596H8.91133C9.2711 12.0323 9.54785 11.7742 9.6032 11.3871V11.3548V11.3226L9.99065 9.09677C10.0183 8.87097 9.99065 8.6129 9.8246 8.35484C9.76925 8.19355 9.52018 8.03226 9.29878 8Z"
                                                fill="white"
                                            />
                                        </svg>
                                    </button>
                                </li>

                                {/* Twitter */}
                                <li className="w-full px-2">
                                    <button
                                        onClick={handleTwitter}
                                        className="flex h-11 w-full items-center justify-center rounded-md bg-[#1C9CEA] hover:bg-opacity-90">
                                        <svg
                                            width="22"
                                            height="16"
                                            viewBox="0 0 22 16"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M19.5516 2.75538L20.9 1.25245C21.2903 0.845401 21.3968 0.53229 21.4323 0.375734C20.3677 0.939335 19.3742 1.1272 18.7355 1.1272H18.4871L18.3452 1.00196C17.4935 0.344423 16.429 0 15.2935 0C12.8097 0 10.8581 1.81605 10.8581 3.91389C10.8581 4.03914 10.8581 4.22701 10.8935 4.35225L11 4.97847L10.2548 4.94716C5.7129 4.82192 1.9871 1.37769 1.38387 0.782779C0.390323 2.34834 0.958064 3.85127 1.56129 4.79061L2.76774 6.54403L0.851613 5.6047C0.887097 6.91977 1.45484 7.95303 2.55484 8.7045L3.5129 9.33072L2.55484 9.67515C3.15806 11.272 4.50645 11.9296 5.5 12.18L6.8129 12.4932L5.57097 13.2446C3.58387 14.4971 1.1 14.4031 0 14.3092C2.23548 15.6869 4.89677 16 6.74194 16C8.12581 16 9.15484 15.8748 9.40322 15.7808C19.3387 13.7143 19.8 5.8865 19.8 4.32094V4.10176L20.0129 3.97652C21.2194 2.97456 21.7161 2.44227 22 2.12916C21.8935 2.16047 21.7516 2.22309 21.6097 2.2544L19.5516 2.75538Z"
                                                fill="white"
                                            />
                                        </svg>
                                    </button>
                                </li>

                                {/* Google */}
                                <li className="w-full px-2">
                                    <button
                                        onClick={handleGoogleLogin}
                                        className="flex h-11 w-full items-center justify-center rounded-md bg-[#D64937] hover:bg-opacity-90"
                                    >
                                        <svg
                                            width="18"
                                            height="18"
                                            viewBox="0 0 18 18"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M17.8477 8.17132H9.29628V10.643H15.4342C15.1065 14.0743 12.2461 15.5574 9.47506 15.5574C5.95916 15.5574 2.8306 12.8821 2.8306 9.01461C2.8306 5.29251 5.81018 2.47185 9.47506 2.47185C12.2759 2.47185 13.9742 4.24567 13.9742 4.24567L15.7024 2.47185C15.7024 2.47185 13.3783 0.000145544 9.35587 0.000145544C4.05223 -0.0289334 0 4.30383 0 8.98553C0 13.5218 3.81386 18 9.44526 18C14.4212 18 17.9967 14.7141 17.9967 9.79974C18.0264 8.78198 17.8477 8.17132 17.8477 8.17132Z"
                                                fill="white"
                                            />
                                        </svg>
                                    </button>
                                </li>
                            </ul>

                            <a href="/#" className="mb-2 inline-block text-base text-dark hover:text-primary hover:underline dark:text-white">
                                Forget Password?
                            </a>
                            <p className="text-base text-body-color dark:text-dark-6">
                                <span className="pr-0.5">Not a member yet?</span>
                                <a href="/#" className="text-primary hover:underline">
                                    Sign Up
                                </a>
                            </p>
                            {messageAlert && <AttentionAlertMesage title="Error" content={messageAlert}  />}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const LogIn = () => {
    return (
        <HomeLayout>
            <Signin />
        </HomeLayout>
    );
};

export default LogIn;
