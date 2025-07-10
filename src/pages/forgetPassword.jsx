import { useState } from "react";
import { useTranslation } from 'react-i18next';
import InputBox from "../components/InputBoxFloat";
import HomeLayout from "../layouts/HomeLayout";

const PwdForget = () => {
    const [email, setEmail] = useState("");
    const { t } = useTranslation();

    const handleForgetPswd = () => {
        if (!email) {
            alert(t("form.emailRequired"));
            return;
        }

        // Exemple de traitement (à adapter)
        console.log("Demande de réinitialisation pour :", email);
    };

    return (
        <section className="bg-gray-1 py-20 dark:bg-dark lg:py-[120px]">
            <div className="container mx-auto">
                <div className="-mx-4 flex flex-wrap justify-center">
                    <div className="w-full max-w-md px-4">
                        <div
                            className="rounded-lg p-8 shadow-lg"
                            style={{
                                backgroundColor: "var(--color-bg)",
                                color: "var(--color-text)",
                            }}
                        >
                            <h1 className="mb-10 text-2xl font-bold text-dark dark:text-white text-center">

                                {t("forgetPswd.title")}

                            </h1>

                            <form onSubmit={(e) => { e.preventDefault(); handleForgetPswd(); }}>

                                <InputBox
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={t("form.email")}
                                    required
                                />

                                <div className="mb-10 mt-6">

                                    <input
                                        type="submit"
                                        value={t("forgetPswd.getCode")}
                                        className="w-full cursor-pointer rounded-md border border-blue-600 bg-blue-600 px-5 py-3 text-base font-medium text-white transition hover:bg-blue-700"
                                    />

                                </div>

                            </form>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const LayoutPwdForget = () => (

    <HomeLayout>

        <PwdForget />

    </HomeLayout>
);

export default LayoutPwdForget;
