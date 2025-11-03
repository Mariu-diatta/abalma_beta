import { useState } from "react";
import InputBox from "./InputBoxFloat";
import { useTranslation } from 'react-i18next';

export default function PhoneInput({ form, handleChange, setForm }) {

    const { t } = useTranslation();

    const countries = [
        { name: "Pays", code: "", className: '', disabled:true},
        { name: "France", code: "33", className: '', disabled: false },
        { name: "Sénégal", code: "221", className: '', disabled: false },
        { name: "Gambie", code: "220", className: '', disabled: false },
        { name: "USA", code: "1", className: '', disabled: false },
        { name: "Nigéria", code: "234", className: '', disabled: false },
    ];

    const [selectedCountry, setSelectedCountry] = useState(countries[0]); // Sénégal par défaut

    const handleCountryChange = (country) => {

        setSelectedCountry(country);

        setForm((prev) => ({ ...prev, telephone: country.code })); // réinitialise avec indicatif
    };

    const handleChange_ = (e) => {

        let value = e.target.value;

        // Empêcher la suppression de l’indicatif
        if (!value.startsWith(selectedCountry.code)) {

            value = selectedCountry.code;
        }

        setForm((prev) => ({ ...prev, telephone: value }));

        handleChange(e)
    };

    return (
        <div className="flex gap-1 items-center justify-center">

            {/* Dropdown pays */}
            <select    

                className="fex items-center justify-center rounded-t-lg pb-2.5 pt-5 mb-6 text-sm text-gray-900 bg-gray-50 dark:bg-gray-700 border-0 border-b-2 border-gray-300  dark:text-white dark:border-gray-600 focus:outline-none focus:ring-0 focus:border-blue-600 peer"

                value={selectedCountry.name}

                onChange={(e) =>

                    handleCountryChange(

                        countries.find((c) => c.name === e.target.value)
                    )
                }
            >
                {countries?.map((c) => (

                    <option key={c.name} value={c.name} className={c.className} disabled={c?.disabled}>

                        {c.name}

                    </option>
                ))}

            </select>

            <div className="flex w-full">
                <span

                    className="px-1 fex items-center justify-center rounded-t-lg pb-2.5 pt-5 mb-6 text-sm text-gray-900 bg-gray-50 dark:bg-gray-700 border-0 border-b-2 border-gray-300  dark:text-white dark:border-gray-600 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                >
                    {selectedCountry.code}

                </span>

                {/* InputBox avec indicatif inclus */}
                <InputBox
                    type="tel"
                    name="telephone"
                    placeholder={t("form.phone")}
                    value={form.telephone}
                    onChange={handleChange_}
                />
            </div>

        </div>
    );

}
