import React, { useEffect, useRef, useState, lazy} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { showMessage } from './AlertMessage';
import { setCurrentNav } from '../slices/navigateSlice';
import { CreateClient, ENDPOINTS, IMPORTANTS_URLS } from '../utils';

// Lazy load heavier components
const InputBox = lazy(() => import('./InputBoxFloat'));
const LoadingCard = lazy(() => import('./LoardingSpin'));
const PhoneInput = lazy(() => import('./InputPhoneCountry'));
const FormLayout = lazy(() => import('../layouts/FormLayout'));
const TitleCompGen = lazy(() => import('./TitleComponentGen'));


const RegisterForm = () => {

    const dispatch = useDispatch();

    const { t } = useTranslation();

    const [loading, setLoading] = useState(false)

    const navigate = useNavigate();

    const componentRef = useRef(null);

    const currentNav = useSelector(state => state.navigate.currentNav);


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

    useEffect(() => {

        if (currentNav === ENDPOINTS.HOME) {

            return navigate("/", { replace: true })
        }

    }, [currentNav, navigate]);

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
            {!loading ? (
                <section className="mb-12">

                    {/* HEADER */}
                    <div className="mb-8 text-center space-y-2">
                        <TitleCompGen title={t('register')} />

                        <p className="text-sm text-gray-500 dark:text-gray-400 flex justify-center gap-1">
                            <span>{t("alredyRegister")}</span>
                            <Link
                                to={`/${ENDPOINTS.LOGIN}`}
                                onClick={() => dispatch(setCurrentNav(ENDPOINTS.LOGIN))}
                                className="font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition"
                            >
                                {t("login")}
                            </Link>
                        </p>
                    </div>

                    {/* FORM */}
                    <form
                        onSubmit={handleSignUp}
                        ref={componentRef}
                        className="space-y-5 transition-all duration-700 ease-in-out"
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <InputBox
                                type="text"
                                name="nom"
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
                        </div>

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
                            placeholder={t('form.password')}
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
                            {t("register")}

                        </button>

                    </form>

                </section>
            ) : (
                <LoadingCard />
            )}
        </FormLayout>
    );
};

export default RegisterForm;
