import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import InputBox from './InputBoxFloat';
import { useTranslation } from 'react-i18next';
import api from '../services/Axios';


const CreateClient = async (data) => {

    try {

        const result= await api.post('clients/', data,
            {

                headers: {

                    'Content-Type': 'application/json',

                Accept: 'application/json',
             },

            timeout: 10000, // facultatif : délai d'attente en ms
        })

        return result

    } catch (error) {

        console.error('Erreur lors de la récupération des clients', error)

        alert('Erreur lors de la récupération des clients', error?.response?.data?.email[0] || error?.response?.data?.telephone[0])
    }
}

const RegisterForm = () => {

    const { t } = useTranslation();

    const navigate = useNavigate();

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

            return alert("Tous les champs requis doivent être remplis.");
        }

        if (form.password !== form.confirmPassword) {

            return alert("Les mots de passe ne correspondent pas.");
        }

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

            const response = await CreateClient(userData);

            console.log("Utilisateur créé :", response);

            if (response) {


                alert("Utilisateur créé avec succès !!!")
           
                navigate("/login", { replace: true });
            }
            
         //console.log("Inscription réussie:", user);
        //    navigate("/account", { replace: true });
        } catch (error) {

            console.error("Erreur:", error.message);

            alert("Erreur d'inscription : ",  error.message);
        }
    };

    return (

        <section className="bg-gray-1 py-2 dark:bg-dark lg:py-[120px]" >

            <div className="container mx-auto">

                <div className="-mx-4 flex flex-wrap">

                    <div className="w-full px-4">

                        <div

                            className="shadow-lg relative mx-auto max-w-[525px] overflow-hidden rounded-lg bg-white px-10 py-4 text-center dark:bg-dark-2 sm:px-12 md:px-[60px]"

                            style={
                                {
                                    backgroundColor: "var(--color-bg)",
                                    color: "var(--color-text)"
                                }
                            }
                        >

                            <h1 className="text-2xl font-extrabold text-gray-500 dark:text-white px-4 pt-4 pb-4">
                                {t('register')}
                            </h1>

                            <form onSubmit={handleSignUp}>

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

                                <InputBox
                                    type="tel"
                                    name="telephone"
                                    placeholder={t('form.phone')}
                                    value={form.telephone}
                                    onChange={handleChange}
                                />

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

                                    <input
                                        type="submit"
                                        value={t("register")}
                                        className="w-full cursor-pointer rounded-md border border-blue-600 bg-blue-600 px-5 py-3 text-base font-medium text-white transition hover:bg-blue-700"
                                    />

                                </div>

                            </form>

                            <p className="text-sm lg:text-md text-base text-body-color dark:text-dark-6">

                                <span>{t("alredyRegister")} </span>

                                <Link to="/login" className="text-sm lg:text-md text-primary hover:underline">
                                    {t("login")}
                                </Link>

                            </p>

                            {/* Decorations (optionnels) */}
                            <div className="absolute right-1 top-1" />

                            <div className="absolute bottom-1 left-1" />

                        </div>

                    </div>

                </div>

            </div>

        </section>
    );
};

export default RegisterForm;
