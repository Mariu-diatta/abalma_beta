import React, { lazy, useEffect, useRef, useState } from "react";
import { useDispatch,} from 'react-redux';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { setCurrentNav } from '../slices/navigateSlice';
import { LoginWithGoogle } from '../firebase';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { ENDPOINTS,  IMPORTANTS_URLS,  loginClient } from '../utils';
import { useNavigate } from 'react-router-dom'; // 
import { useSelector } from 'react-redux';
import { showMessage } from '../components/AlertMessage';

// Lazy load
const InputBox = lazy(() => import("../components/InputBoxFloat"));
const LoadingCard = lazy(() => import("../components/LoardingSpin"));
const FormLayout = lazy(() => import("../layouts/FormLayout"));
const TitleCompGen = lazy(() => import("../components/TitleComponentGen"));

const LogIn = () => {

    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState("");
    const [pwd, setPwd] = useState("");
    const dispatch = useDispatch();
    const emailRef = useRef(null);
    const { t } = useTranslation();
    const componentRef = useRef(null);
    const navigate = useNavigate();
    const currentNav = useSelector(state => state.navigate.currentNav);

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

    useEffect(() => {

        if (currentNav === ENDPOINTS.HOME) {

            return navigate("/", { replace: true })
        }

    }, [currentNav, navigate]);

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
                    <section className="mb-12">

                        {/* HEADER */}
                        <div className="mb-8 text-center space-y-2">
                            <TitleCompGen title={t("login")} />

                            <p className="text-sm text-gray-500 dark:text-gray-400 flex justify-center gap-1">
                                <span>{t("notRegistered")}</span>

                                <NavLink
                                    to={`/${ENDPOINTS.REGISTER}`}
                                    onClick={() => dispatch(setCurrentNav(ENDPOINTS.REGISTER))}
                                    className="font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition"
                                >
                                    {t("register")}
                                </NavLink>
                            </p>
                        </div>

                        {/* FORM */}
                        <form
                            className="space-y-5 transition-all duration-700 ease-in-out"
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSignIn();
                            }}
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

                            {/* BUTTON */}
                            <button
                                type="submit"
                                className="
                                        w-full py-3 rounded-lg font-medium
                                        bg-gradient-to-r from-blue-400 to-red-200                                        
                                        text-white shadow-md
                                        hover:shadow-lg hover:scale-[1.02]
                                        active:scale-[0.98]
                                        transition-all duration-300
                                      "
                                >
                                {t("login")}
                            </button>
                        </form>

                        {/* FORGOT PASSWORD */}
                        <div className="mt-4 text-center">
                            <NavLink
                                to="/forgetPassword"
                                onClick={() => dispatch(setCurrentNav("forgetPassword"))}
                                className="text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 transition"
                            >
                                {t("forgetPwd")}
                            </NavLink>
                        </div>
                    </section>
                :
                <LoadingCard />
            }


            <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                </div>

                <div className="relative text-center text-sm">
                    <span className="bg-white dark:bg-dark-2 px-3 text-gray-400">
                        {t("connect_with")}
                    </span>
                </div>
            </div>

            <div className="flex justify-center mb-4">
                <GoogleOAuthProvider clientId="154955455828-340tuohbjc1c4imb29uqi4hr9l5dm0sv.apps.googleusercontent.com">
                    <LoginWithGoogle />
                </GoogleOAuthProvider>
            </div>

        </FormLayout>
    );
};


export default LogIn;

