import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import InputBox from './InputBoxFloat';
import { useTranslation } from 'react-i18next';
import api from '../services/Axios';
import LoadingCard from './LoardingSpin';
import { useDispatch, useSelector} from 'react-redux';
import  { showMessage } from './AlertMessage';
import PhoneInput from './InputPhoneCountry';
import { setCurrentNav } from '../slices/navigateSlice';
import { ButtonSimple } from './Button';
import FormLayout from '../layouts/FormLayout';
import TitleCompGen from './TitleComponentGen';


const CreateClient = async (data, func, funcRetournMessage, dispatch) => {

    try {

        const result= await api.post('clients/', data,
            {

                headers: {

                    'Content-Type': 'application/json',

                Accept: 'application/json',
             },

            timeout: 10000, // facultatif : délai d'attente en ms
        })

        func(true)

        funcRetournMessage(dispatch,{Type:'Message', Message:"Reussi"})

        return result

    } catch (error) {

        func(false)

        funcRetournMessage(dispatch, {Type:"Erreur", Message:`Erreur lors de la création du compte ${error?.response?.data?.email[0] || error?.response?.data?.telephone[0]}`})
    }
}

const RegisterForm = () => {

    const dispatch = useDispatch();

    const { t } = useTranslation();

    const [loading, setLoading] = useState(false)

    const navigate = useNavigate();

    const currentNav = useSelector(state => state.navigate.currentNav);

    const componentRef = useRef(null);

    const [form, setForm] = useState({
        "password": "",
        "last_login": null,
        "is_superuser": false,
        "email": "",
        "prenom": "",
        "nom": "",
        "image": null,
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

        if (!form.email || !form.password || !form.confirmPassword) {

            return showMessage(dispatch, {Type:"Erreur", Message:"Tous les champs requis doivent être remplis."})

        }

        if (form.password !== form.confirmPassword) {

            return showMessage(dispatch, { Type: "Erreur", Message: "Les mots de passe ne correspondent pas." });
        }

        setLoading(true)

        try {

            const userData = {
                password: form.password,
                last_login: null,
                is_superuser: false,
                email: form.email,
                prenom: form.prenom,
                nom: form.nom,
                image: null,
                telephone: form.telephone,
                description: "",
                adresse: "",
                is_connected: false,
                is_active: true,
                is_staff: false,
                is_pro: false,
                is_verified: false,
                groups: [],
                user_permissions: []
            };

            const response = await CreateClient(userData, setLoading, showMessage, dispatch);

            if (response) {

                showMessage(dispatch, { Type: "Message", Message: t('user_created')});

                setLoading(false)

                navigate("/login", { replace: true });

            }
            
        } catch (error) {

            setLoading(true)

            showMessage(dispatch, { Type: "Erreur", Message: t('user_created') || error?.response ||error?.request?.response });

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

    if (currentNav === "home") {

        return navigate("/", { replace: true })
    }

    return (

        <FormLayout>

            {
                (!loading)?
                <>
  
                    <TitleCompGen title={t('register')} />

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
                        />

                        <InputBox
                            type="password"
                            name="confirmPassword"
                            placeholder={t('form.confirmPassword')}
                            value={form.confirmPassword}
                            onChange={handleChange}
                        />

                       <div className="mb-10">
                           <ButtonSimple title={t("register")} />
                       </div>

                    </form>

                    <p className="text-sm lg:text-md text-base text-body-color dark:text-dark-6 gap-3">

                        <span>{t("alredyRegister")} </span>

                        <Link
                            to="/login"
                            className="text-sm lg:text-md text-primary hover:underline"
                            onClick={() => dispatch(setCurrentNav("/logIn"))}
                        >
                            {t("login")}
                        </Link>

                    </p>

                    {/* Decorations (optionnels) */}
                    <div className="absolute right-1 top-1" />

                    <div className="absolute bottom-1 left-1" />

                </>
                :
                <LoadingCard />
            } 

        </FormLayout>
    );
};

export default RegisterForm;
