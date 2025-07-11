import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import HomeLayout from '../layouts/HomeLayout';
import { useNavigate } from 'react-router-dom';
import InputBox from '../components/InputBoxFloat';
//import { signInWithGoogle, signInWithFacebook, signInWithTwitter } from '../firebase';
//getFirebaseToken, 
import api from '../services/Axios';
import { login, updateUserData, updateUserToken } from '../slices/authSlice';
import AttentionAlertMesage, { showMessage } from '../components/AlertMessage';
import { useTranslation } from 'react-i18next';
import { Outlet, NavLink } from 'react-router-dom';


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

    const [email, setEmail] = useState("");
    const [pwd, setPwd] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const messageAlert = useSelector((state) => state.navigate.messageAlert);
    const emailRef = useRef(null);
    const { t } = useTranslation();


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

                        return navigate("/UserLayout", { replace: true });

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

                        <div style={{
                            backgroundColor: "var(--color-bg)",
                            color: "var(--color-text)"
                        }} className="relative mx-auto max-w-[525px] overflow-hidden rounded-lg bg-white px-10 py-16 text-center dark:bg-dark-2 sm:px-12 md:px-[60px]">

                            <>
                                <h1 className="mb-10 text-2xl font-bold text-dark dark:text-white">
                                    {t("connecTitle")}
                                </h1>

                                <form onSubmit={(e) => { e.preventDefault(); handleSignIn(); }}>

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

                                <NavLink to="/forgetPassword"  className="mb-2 inline-block text-base text-dark hover:text-primary hover:underline dark:text-white">

                                    {t("forgetPwd")}

                                </NavLink>

                                <p className="text-base text-body-color dark:text-dark-6 flex items-center justify-center gap-2">

                                    <span className="pr-0.5">{t("notRegistered")}</span>

                                    <NavLink to="/Register" className="text-gray-800 hover:underline">{t("register")}</NavLink>

                                </p>
                            </>

                            {/*<p className="mb-6 text-base text-secondary-color dark:text-dark-7">*/}
                            {/*    Connect With*/}
                            {/*</p>*/}

                            {/*<ul className="-mx-2 mb-12 flex justify-between">*/}
                            {/*    <li className="w-full px-2">*/}

                            {/*        <button*/}
                            {/*            onClick={handleFacebookLogin}*/}
                            {/*            className="flex h-11 w-full items-center justify-center rounded-md bg-[#4064AC] hover:bg-opacity-90">*/}
                            {/*            */}{/* Facebook SVG */}
                            {/*        </button>*/}

                            {/*    </li>*/}

                            {/*    <li className="w-full px-2">*/}
                            {/*        <button*/}
                            {/*            onClick={handleTwitter}*/}
                            {/*            className="flex h-11 w-full items-center justify-center rounded-md bg-[#1C9CEA] hover:bg-opacity-90">*/}
                            {/*            */}{/* Twitter SVG */}
                            {/*        </button>*/}
                            {/*    </li>*/}

                            {/*    <li className="w-full px-2">*/}
                            {/*        <button*/}
                            {/*            onClick={handleGoogleLogin}*/}
                            {/*            className="flex h-11 w-full items-center justify-center rounded-md bg-[#D64937] hover:bg-opacity-90">*/}
                            {/*            */}{/* Google SVG */}
                            {/*        </button>*/}
                            {/*    </li>*/}

                            {/*</ul>*/}

                         

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

        <Signin />

    </HomeLayout>
);

export default LogIn;

