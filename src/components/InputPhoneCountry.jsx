import { useState } from "react";
import InputBox from "./InputBoxFloat";
import { useTranslation } from 'react-i18next';

export default function PhoneInput({ form, handleChange, setForm }) {
    const { t } = useTranslation();

    const countries = [
        { name: "Pays", code: "", disabled: true },
        { name: "France", code: "33", disabled: false },
        { name: "Sénégal", code: "221", disabled: false },
        { name: "Gambie", code: "220", disabled: false },
        { name: "USA", code: "1", disabled: false },
        { name: "Nigéria", code: "234", disabled: false },
    ];

    const [selectedCountry, setSelectedCountry] = useState(countries[0]); // par défaut

    const handleCountryChange = (country) => {
        setSelectedCountry(country);
        setForm((prev) => ({ ...prev, telephone: country.code }));
    };

    const handleChange_ = (e) => {
        let value = e.target.value;
        if (!value.startsWith(selectedCountry.code)) {
            value = selectedCountry.code;
        }
        setForm((prev) => ({ ...prev, telephone: value }));
        handleChange(e);
    };

    return (
        <div className="w-auto flex flex-wrap items-center justify-center gap-2 px-2">

            {/* Dropdown pays */}
            <select
                className="text-md border-b-2 pb-2 border-gray-300 dark:border-gray-600 rounded-l-lg px-2 focus:outline-none focus:ring-0 focus:border-blue-600"
                value={selectedCountry.name}
                onChange={(e) =>
                    handleCountryChange(countries.find((c) => c.name === e.target.value))
                }
            >
                {countries.map((c) => (
                    <option key={c.name} value={c.name} disabled={c.disabled} >
                        {c.name}
                    </option>
                ))}
            </select>

            {/* Code pays */}
            {/*<span className="h-12 sm:h-14 px-3 flex items-center justify-center text-md border-b-2 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700">*/}
            {/*    {selectedCountry.code}*/}
            {/*</span>*/}

            {/* Input numéro */}
            <InputBox
                type="tel"
                name="telephone"
                placeholder={t("form.phone")}
                value={form.telephone}
                onChange={handleChange_}
            />

        </div>

    );
}
