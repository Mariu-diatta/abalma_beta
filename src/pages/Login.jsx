import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import HomeLayout from '../layouts/HomeLayout';
import { useNavigate } from 'react-router-dom';
import InputBox from '../components/InputBoxFloat';
import api from '../services/Axios';
import { login, updateUserData, updateUserToken } from '../slices/authSlice';
import AttentionAlertMesage, { showMessage } from '../components/AlertMessage';
import { useTranslation } from 'react-i18next';
import { Outlet, NavLink } from 'react-router-dom';
import { setCurrentNav } from '../slices/navigateSlice';
import { LoginWithGoogle} from '../firebase';

import { GoogleOAuthProvider } from '@react-oauth/google';
import SuspenseCallback from '../components/SuspensCallback';
import LoadingCard from '../components/LoardingSpin';




// Fonction de login avec l'API
const loginClient = async (data, dispatch) => {

    try {


        localStorage.removeItem("refresh");

        localStorage.removeItem("token");

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

        console.log('Erreur lors de la connexion', error || error?.response);
        const message = error?.response?.data?.detail || "Erreur inconnue.";
        showMessage(dispatch, message);
        throw error;
    }
};

const Signin = () => {

    const [loading, setLoading]=useState(false)
    const [email, setEmail] = useState("");
    const [pwd, setPwd] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const messageAlert = useSelector((state) => state.navigate.messageAlert);
    const emailRef = useRef(null);
    const { t } = useTranslation();

    const componentRef = useRef(null);


    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("animate-in");
                        entry.target.classList.remove("animate-out");
                    } else {
                        entry.target.classList.add("animate-out");
                        entry.target.classList.remove("animate-in");
                    }
                });
            },
            { threshold: 0.05 } // Déclenche quand 10% du composant est visible
        );

        if (componentRef.current) {
            observer.observe(componentRef.current);
        }
        // Nettoyage de l'observateur lors du démontage
        return () => {
            if (componentRef.current) {
                observer.unobserve(componentRef.current);
            }
        };
    }, []);

    useEffect(() => {

        // Petite pause pour laisser le navigateur autofill
        setTimeout(() => {

            if (emailRef.current) {

                const value = emailRef.current.value;

                if (value) setEmail(value);
            }

        }, 500); // 500ms pour laisser le navigateur compléter

    }, [])

    //const handleGoogleLogin = async () => {

    //    try {

    //        const user = await signInWithGoogle();

    //        dispatch(login(user));

    //        dispatch(getFirebaseToken(user?.accessToken));

    //        navigate("/account", { replace: true });

    //    } catch (error) {

    //        showMessage(dispatch, "Erreur de connexion Google");
    //    }
    //};

    //const handleTwitter = async () => {
    //    try {
    //        const user = await signInWithTwitter();
    //        dispatch(login(user));
    //        navigate("/account", { replace: true });
    //    } catch (error) {
    //        showMessage(dispatch, "Erreur de connexion Twitter");
    //    }
    //};

    //const handleFacebookLogin = async () => {
    //    try {
    //        const user = await signInWithFacebook();
    //        dispatch(login(user));
    //        navigate("/account", { replace: true });
    //    } catch (error) {
    //        showMessage(dispatch, "Erreur de connexion Facebook");
    //    }
    //};

    const handleSignIn = async () => {

        if (!email || !pwd) {

            showMessage(dispatch, "Veuillez remplir tous les champs.");

            return;

        } else {

            setEmail(email)
        }


        setLoading(true)

        try {

            const formData = new FormData();

            formData.append("email", email);

            formData.append("password", pwd);

            await loginClient(formData, dispatch);

            await api.get(`/clients/?email=${email}`).then(

                resp => {

                    console.log("USER DATA USER ", resp)

                    const dataUser = resp?.data[0]

                    if (dataUser){

                        dispatch(updateUserData(dataUser));

                        dispatch(login(dataUser));

                        dispatch(setCurrentNav("account_home"));

                        setLoading(false)

                        return navigate("/account_home", { replace: true });

                    }

                 
                }

            ).catch(

                err => {

                    console.log("ERROR DATA", err);

                    setLoading(false)
                }

            )

        } catch (error) {

            showMessage(dispatch, "Hops!!!... Erreur de connexion. Vérifiez votre email et/ou mot de passe.");

            setLoading(false)
        }
    };

    return (

        <section className="bg-gray-1 py-20 dark:bg-dark lg:py-[120px] bg_home">

            <div className="container mx-auto">

                <div className="-mx-4 flex flex-wrap">

                    <div className="w-full px-4">

                        <div
                            style={
                                {
                                    backgroundColor: "var(--color-bg)",
                                    color: "var(--color-text)"
                                }
                            }
                            className="shadow-lg relative mx-auto max-w-[525px] overflow-hidden rounded-lg px-10 py-4 text-center dark:bg-dark-2 sm:px-12 md:px-[60px] "
                        >

                            {
                                (!loading)?
                                <>
                                    <h1 className="text-2xl font-extrabold text-gray-500 dark:text-white px-4 pt-4 pb-4">

                                        {t("login")}

                                    </h1>

                                        <form
                                            className="translate-y-0 transition-all duration-1000 ease-in-out"
                                            onSubmit={(e) => { e.preventDefault(); handleSignIn(); }}
                                            ref={componentRef}
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

                                    <NavLink to="/forgetPassword"  className="mb-2 inline-block  text-sm lg:text-md text-blue-600 hover:text-primary hover:underline dark:text-blue-600">

                                        {t("forgetPwd")}

                                    </NavLink>

                                    <p className="text-sm lg:text-md text-base text-blue-600 dark:text-blue-400 flex items-center justify-center gap-2">
                                        <span className="pr-0.5">{t("notRegistered")}</span>
                                        <NavLink
                                            to="/Register"
                                            className="text-blue-700 hover:underline text-sm lg:text-md dark:text-blue-300"
                                        >
                                            {t("register")}
                                        </NavLink>
                                    </p>
                                </>
                                :
                                <LoadingCard/>
                            }

                            <p className="mb-6 text-md text-bold text-gray-500 dark:text-dark-7 my-6">
                                {t('connect_with')}
                            </p>

                            <ul className="flex flex-wrap justify-between items-center sm:justify-center lg:flex-nowrap -mx-2 mb-12 gap-6">

                                {/*<li className="flex justify-end items-center w-full px-2">*/}

                                {/*    <button*/}

                                {/*        onClick={()=>alert("Hops!... Ce service n'est pas encore disponible.") }*/}

                                {/*        className="cursor-pointer flex h-10 w-full items-center justify-center rounded-md border border-gray-200hover:bg-opacity-90">*/}

                                {/*        <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">*/}

                                {/*            <path fillRule="evenodd" d="M13.135 6H15V3h-1.865a4.147 4.147 0 0 0-4.142 4.142V9H7v3h2v9.938h3V12h2.021l.592-3H12V6.591A.6.6 0 0 1 12.592 6h.543Z" clipRule="evenodd" />*/}

                                {/*        </svg>*/}

                                {/*    </button>*/}

                                {/*</li>*/}

                                {/*<li className="w-full px-2">*/}

                                {/*    */}{/*<button*/}
                                     
                                {/*    */}{/*    className="flex h-11 w-full items-center justify-center rounded-md bg-[#1C9CEA] hover:bg-opacity-90">*/}

                                {/*    */}{/*    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">*/}
                                {/*    */}{/*        <path fill-rule="evenodd" d="M22 5.892a8.178 8.178 0 0 1-2.355.635 4.074 4.074 0 0 0 1.8-2.235 8.343 8.343 0 0 1-2.605.981A4.13 4.13 0 0 0 15.85 4a4.068 4.068 0 0 0-4.1 4.038c0 .31.035.618.105.919A11.705 11.705 0 0 1 3.4 4.734a4.006 4.006 0 0 0 1.268 5.392 4.165 4.165 0 0 1-1.859-.5v.05A4.057 4.057 0 0 0 6.1 13.635a4.192 4.192 0 0 1-1.856.07 4.108 4.108 0 0 0 3.831 2.807A8.36 8.36 0 0 1 2 18.184 11.732 11.732 0 0 0 8.291 20 11.502 11.502 0 0 0 19.964 8.5c0-.177 0-.349-.012-.523A8.143 8.143 0 0 0 22 5.892Z" clip-rule="evenodd" />*/}
                                {/*    */}{/*    </svg>*/}

                                {/*    */}{/*</button>*/}

                                {/*</li>*/}

                                <li className="w-full px-2">

                                    {/*<button*/}

                                    {/*    onClick={() => LoginWithGoogle()}*/}

                                    {/*    className="cursor-pointer flex h-11 w-full items-center justify-center rounded-md bg-[#D64937] hover:bg-opacity-90">*/}

                                    {/*    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">*/}
                                    {/*        <path fill-rule="evenodd" d="M12.037 21.998a10.313 10.313 0 0 1-7.168-3.049 9.888 9.888 0 0 1-2.868-7.118 9.947 9.947 0 0 1 3.064-6.949A10.37 10.37 0 0 1 12.212 2h.176a9.935 9.935 0 0 1 6.614 2.564L16.457 6.88a6.187 6.187 0 0 0-4.131-1.566 6.9 6.9 0 0 0-4.794 1.913 6.618 6.618 0 0 0-2.045 4.657 6.608 6.608 0 0 0 1.882 4.723 6.891 6.891 0 0 0 4.725 2.07h.143c1.41.072 2.8-.354 3.917-1.2a5.77 5.77 0 0 0 2.172-3.41l.043-.117H12.22v-3.41h9.678c.075.617.109 1.238.1 1.859-.099 5.741-4.017 9.6-9.746 9.6l-.215-.002Z" clip-rule="evenodd" />*/}
                                    {/*    </svg>*/}

                                    {/*</button>*/}

                                    <GoogleOAuthProvider clientId="154955455828-340tuohbjc1c4imb29uqi4hr9l5dm0sv.apps.googleusercontent.com">
                                        <LoginWithGoogle />
                                    </GoogleOAuthProvider>
                                </li>

                            </ul>

                            {messageAlert && (

                                <AttentionAlertMesage title="Erreur" content={messageAlert} />
                            )}

                        </div>

                    </div>

                </div>

            </div>

            <Outlet/>

        </section>
    );
};

const LogIn = () => (

    <HomeLayout>

        <SuspenseCallback>

            <Signin/>

        </SuspenseCallback>

    </HomeLayout>
);

export default LogIn;

