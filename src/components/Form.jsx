import React from 'react';
import InputBox from './InputBoxFloat';


const  RegisterForm = () => {
    return (
        <section className="bg-gray-1 py-20 dark:bg-dark lg:py-[120px]">
            <div className="container mx-auto">
                <div className="-mx-4 flex flex-wrap">
                    <div className="w-full px-4">
                        <div className="relative mx-auto max-w-[525px] overflow-hidden rounded-lg bg-white px-10 py-16 text-center dark:bg-dark-2 sm:px-12 md:px-[60px]">
                            <h1 className="mb-10 text-center md:mb-16">
                                <span className="text-2xl font-bold text-dark dark:text-white">
                                    Inscrivez-vous!
                                </span>
                            </h1>
                            <form>
                                <InputBox type="text" name="name" placeholder="Nom complet" />
                                <InputBox type="email" name="email" placeholder="Email" />
                                <InputBox type="password" name="password" placeholder="Mot de passe" />
                                <InputBox type="password" name="confirmPassword" placeholder="Confirmez le mot de passe" />
                                <div className="mb-10">
                                    <input
                                        type="submit"
                                        value="S'inscrire"
                                        className="w-full cursor-pointer rounded-md border border-blue-600 bg-blue-600 px-5 py-3 text-base font-medium text-white transition hover:bg-blue-700"
                                    />
                                </div>
                            </form>

                            <p className="text-base text-body-color dark:text-dark-6">
                                <span className="pr-0.5">Deja inscrit ?</span>
                                <a href="/login" className="text-primary hover:underline">
                                    Se connecter
                                </a>
                            </p>

                            <div className="absolute right-1 top-1">{/* Decorations */}</div>
                            <div className="absolute bottom-1 left-1">{/* Decorations */}</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};


export default RegisterForm;

