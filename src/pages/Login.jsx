import React, { useEffect, useRef, useState } from 'react';
import { useDispatch,} from 'react-redux';
import InputBox from '../components/InputBoxFloat';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { setCurrentNav } from '../slices/navigateSlice';
import { LoginWithGoogle } from '../firebase';

import { GoogleOAuthProvider } from '@react-oauth/google';
import LoadingCard from '../components/LoardingSpin';
import { loginClient } from '../utils';
import { ButtonSimple } from '../components/Button';
import { useNavigate } from 'react-router-dom'; // 
import { useSelector } from 'react-redux';
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
    const navigate =useNavigate();
    const currentNav = useSelector(state => state.navigate.currentNav);


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

    useEffect(() => {

        if (currentNav === "home") navigate("/", { replace: true })

    }, [currentNav, navigate])


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

            showMessage(dispatch, { Type: "Erreur", Message: e?.response?.data?.detail || e?.response?.data?.error || "Error not found: user not login" });

        } finally {

            setLoading(false)
        }
    };


    return (

        <FormLayout>

            {
                (!loading) ?
                <>
                    <TitleCompGen title={t("login")} />

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

                            <ButtonSimple title="Sign In" />

                        </div>

                    </form>

                    <NavLink
                        to="/forgetPassword"
                        className="whitespace-nowrap mb-2 inline-block  text-sm lg:text-md text-blue-600 hover:text-primary hover:underline dark:text-blue-600"
                        onClick={() => dispatch(setCurrentNav("forgetPassword"))}
                    >

                        {t("forgetPwd")}

                    </NavLink>

                    <p className="text-sm lg:text-md text-base text-blue-600 dark:text-blue-400 flex items-center justify-center gap-2">

                        <span className="whitespace-nowrap pr-0.5">{t("notRegistered")}</span>

                        <NavLink
                            to="/Register"
                            className="whitespace-nowrap text-blue-700 hover:underline text-sm lg:text-md dark:text-blue-300"
                            onClick={() => dispatch(setCurrentNav("/Register"))}
                        >
                            {t("register")}
                        </NavLink>

                    </p>
                </>
                :
                <LoadingCard />
            }

            <p className="mb-6 text-md text-bold text-gray-500 dark:text-dark-7 my-6">
                {t('connect_with')}
            </p>

            <ul className="flex flex-wrap justify-between items-center sm:justify-center lg:flex-nowrap -mx-2 mb-12 gap-6 ">

                <li className="w-full px-2 ">

                    <GoogleOAuthProvider clientId="154955455828-340tuohbjc1c4imb29uqi4hr9l5dm0sv.apps.googleusercontent.com">

                        <LoginWithGoogle />

                    </GoogleOAuthProvider>

                </li>

            </ul>

        </FormLayout>
    );
};


export default LogIn;

