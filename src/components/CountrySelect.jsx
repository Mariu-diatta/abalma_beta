import { COUNTRIES } from "../utils";

export default function CountrySelect({ value, onChange,t }) {
    return (
        <select
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            value={value}
            onChange={(e) => onChange(e.target.value)}
        >
            <option value="">-- {t("settingsText.countryResidence")}--</option>

            {Object.values(COUNTRIES).map((country) => (
                <option key={country.code} value={country.code}>
                    {country.name}
                </option>
            ))}
        </select>
    );
}