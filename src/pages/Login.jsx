import React, { useEffect, useRef, useState } from 'react';
import { useDispatch,} from 'react-redux';
import InputBox from '../components/InputBoxFloat';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { setCurrentNav } from '../slices/navigateSlice';
import { LoginWithGoogle } from '../firebase';

import { GoogleOAuthProvider } from '@react-oauth/google';
import LoadingCard from '../components/LoardingSpin';
import { ENDPOINTS,  IMPORTANTS_URLS,  loginClient } from '../utils';
import { ButtonSimple } from '../components/Button';
import { useNavigate } from 'react-router-dom'; // 
//import { useSelector } from 'react-redux';
import FormLayout from '../layouts/FormLayout';
import { showMessage } from '../components/AlertMessage';
import TitleCompGen from '../components/TitleComponentGen';


const LogIn = () => {

    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState("");
    const [pwd, setPwd] = useState("");
    const dispatch = useDispatch();
    const emailRef = useRef(null);
    const { t } = useTranslation();
    const componentRef = useRef(null);
    const navigate = useNavigate();
    //const currentNav = useSelector(state => state.navigate.currentNav);

    const handleSignIn = async () => {

        if (!email || !pwd) {

            showMessage(dispatch, { Type: "Erreur", Message: "Veuillez remplir tous les champs." });

            return;

        } else {

            setEmail(email)
        }

        setLoading(true)

        try {

            const formData = new FormData();

            formData.append("email", email);

            formData.append("password", pwd);

            await loginClient(formData, dispatch, setLoading, navigate);

        } catch (e) {

            const errorMessage = e?.response?.data?.detail || e?.response?.data?.error;
            showMessage(dispatch, { Type: "Erreur", Message: errorMessage || "Error not found: user not login" });
            dispatch(setCurrentNav(ENDPOINTS.LOGIN))

        } finally {

            setLoading(false)
        }
    };

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

    //useEffect(() => {

    //    if (currentNav === ENDPOINTS.HOME) {

    //        return navigate("/home", { replace: true })
    //    }

    //}, [currentNav, navigate]);

    useEffect(
        () => {
            const currentUrl = window.location.href;
            if (currentUrl === IMPORTANTS_URLS?.LOGIN || currentUrl === IMPORTANTS_URLS?.LOGINS) {
                dispatch(setCurrentNav(ENDPOINTS.LOGIN))
            }

        },[dispatch]
    )

    return (

        <FormLayout>

            {
                (!loading) ?
                <section>

                        <div className="py-7">

                            <TitleCompGen title={t("login")} />

                            <p className="text-sm lg:text-md text-base text-blue-600 dark:text-blue-400 flex items-center justify-center gap-2">

                                <span className="whitespace-nowrap pr-0.5">{t("notRegistered")}</span>

                                <NavLink
                                    to={`/${ENDPOINTS.REGISTER}`}
                                    className="whitespace-nowrap text-blue-800 hover:underline text-sm lg:text-md dark:text-blue-300"
                                    onClick={() => dispatch(setCurrentNav(ENDPOINTS.REGISTER))}
                                >
                                    {t("register")}

                                </NavLink>

                            </p>
                        </div>

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
                                autoComplete="email"
                                required
                            />

                            <InputBox
                                type="password"
                                name="password"
                                value={pwd}
                                onChange={(e) => setPwd(e.target.value)}
                                placeholder={t('form.password')}
                                ref={emailRef}
                                autoComplete="current-password"
                                required
                            />


                            <div className="mb-10">

                                <ButtonSimple

                                    className="w-auto flex items-center m-auto cursor-pointer rounded-full border border-blue-100  px-5 py-2 text-base  text-white-900 transition hover:bg-gradient-to-br hover:from-purple-100 px-2 "

                                    title={t("login")}
                                />

                            </div>

                        </form>

                        <NavLink
                            to="/forgetPassword"
                            className="whitespace-nowrap mb-2 inline-block  text-sm lg:text-md text-blue-600 hover:text-primary hover:underline dark:text-blue-600"
                            onClick={() => dispatch(setCurrentNav("forgetPassword"))}
                        >
                            {t("forgetPwd")}

                        </NavLink>

                </section>
                :
                <LoadingCard />
            }

            <section>

                <p className="mb-6 text-md text-bold text-gray-500 dark:text-dark-7 my-6">
                    {t('connect_with')}
                </p>

            </section>
            
            <section>

                <ul className="flex flex-wrap justify-between items-center sm:justify-center lg:flex-nowrap -mx-2 mb-12 w-full">

                    <li className="w-full">

                        <GoogleOAuthProvider clientId="154955455828-340tuohbjc1c4imb29uqi4hr9l5dm0sv.apps.googleusercontent.com">

                            <LoginWithGoogle />

                        </GoogleOAuthProvider>

                    </li>

                </ul>

            </section >

        </FormLayout>
    );
};


export default LogIn;

