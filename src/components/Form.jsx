import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import InputBox from './InputBoxFloat';
import { useTranslation } from 'react-i18next';
import LoadingCard from './LoardingSpin';
import { useDispatch} from 'react-redux';
import  { showMessage } from './AlertMessage';
import PhoneInput from './InputPhoneCountry';
import { setCurrentNav } from '../slices/navigateSlice';
import { ButtonSimple } from './Button';
import FormLayout from '../layouts/FormLayout';
import TitleCompGen from './TitleComponentGen';
import { CreateClient, ENDPOINTS, IMPORTANTS_URLS } from '../utils';


const RegisterForm = () => {

    const dispatch = useDispatch();

    const { t } = useTranslation();

    const [loading, setLoading] = useState(false)

    const navigate = useNavigate();

    const componentRef = useRef(null);

    const [form, setForm] = useState({
        "password": "",
        "password1": "",
        "last_login": null,
        "is_superuser": false,
        "email": "",
        "prenom": "",
        "nom": "",
        "image": null,
        "photo_url":null,
        "telephone": "",
        "description": "",
        "adresse": "",
        "is_connected": false,
        "is_active": true,
        "is_staff": false,
        "is_pro": false,
        "is_verified": false,
        "groups": [],
        "user_permissions": []
    });

    const handleChange = (e) => {

        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSignUp = async (e) => {
        e.preventDefault();

        if (!form.email || !form.password || !form.password1) {
            return showMessage(dispatch, { Type: "Erreur", Message: "Tous les champs requis doivent être remplis." });
        }

        if (form.password !== form.password1) {
            return showMessage(dispatch, { Type: "Erreur", Message: "Les mots de passe ne correspondent pas." });
        }

        setLoading(true);

        const userData = {
            password1: form.password1,
            password: form.password,
            email: form.email,
            prenom: form.prenom,
            nom: form.nom,
            telephone: form.telephone,
            adresse: form.adresse,
            is_active: true,
        };

        const response = await CreateClient(userData, setLoading, showMessage, dispatch, t);

        if (response) {
            navigate("/login", { replace: true });
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

        const node = componentRef.current

        if (componentRef.current) {
            observer.observe(componentRef.current);
        }
        // Nettoyage de l'observateur lors du démontage
        return () => {

            if (node) {

                node.removeEventListener('scroll', () => {console.log(node)});
            }
        };
    }, []);


    useEffect(
        () => {
            const currentUrl = window.location.href;
            if (currentUrl === IMPORTANTS_URLS?.REGISTER || currentUrl === IMPORTANTS_URLS?.REGISTERS) {
                dispatch(setCurrentNav(ENDPOINTS.REGISTER))
            }

        }, [dispatch]
    )


    return (

        <FormLayout>

            {
                (!loading)?
                <section>
  
                    <div className="py-7">

                        <TitleCompGen title={t('register')} />

                        <div className="text-sm lg:text-md text-base text-body-color dark:text-dark-6 gap-3">

                            <span>{t("alredyRegister")} </span>

                            <Link
                                to="/login"
                                className="text-sm lg:text-md text-primary hover:underline"
                                onClick={() => dispatch(setCurrentNav("login"))}
                            >
                                {t("login")}
                            </Link>

                        </div>

                    </div>

                    <form 
                        onSubmit={handleSignUp} ref={componentRef}
                        className="translate-y-0 transition-all duration-1000 ease-in-out mb-3"
                    >

                        <InputBox
                            type="text"
                            name={"nom"}
                            placeholder={t('form.lastName')}
                            value={form.nom}
                            onChange={handleChange}
                        />

                        <InputBox
                            type="text"
                            name="prenom"
                            placeholder={t('form.firstName')}
                            value={form.prenom}
                            onChange={handleChange}
                        />

                        <InputBox
                            type="email"
                            name="email"
                            placeholder={t('form.email')}
                            value={form.email}
                            onChange={handleChange}
                        />


                        <PhoneInput form={form} handleChange={handleChange} setForm={setForm} />

                        <InputBox
                            type="password"
                            name="password"
                            placeholder="Mot de passe"
                            value={form.password}
                            onChange={handleChange}
                            autoComplete="new-password"
                        />

                        <InputBox
                            type="password"
                            name="password1"
                            placeholder={t('form.confirmPassword')}
                            value={form.password1}
                            onChange={handleChange}
                            autoComplete="off"

                        />

                       <div className="mb-10">

                            <ButtonSimple

                                className="w-auto flex items-center m-auto cursor-pointer rounded-full border border-blue-100  px-5 py-2 text-base  text-white-900 transition hover:bg-gradient-to-br hover:from-purple-100 px-2 "

                                title={t("register")}
                            />

                       </div>

                    </form>

                    {/* Decorations (optionnels) */}
                    <div className="absolute right-1 top-1" />

                    <div className="absolute bottom-1 left-1" />

                </section>
                :
                <LoadingCard />
            } 

        </FormLayout>
    );
};

export default RegisterForm;
