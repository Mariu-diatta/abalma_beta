import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CONSTANTS, convertir, formaterPrix } from '../utils';

const RendrePrixProduitMonnaie = ({ item }) => {

    const { t, i18n } = useTranslation();

    return useMemo(() => {

        if (!item?.price_product) return null;

        const lang = i18n.language || window.localStorage.i18nextLng || CONSTANTS?.FR;

        // 🎯 monnaie de référence selon langue
        const reference = lang === CONSTANTS?.FR ? CONSTANTS?.EUR : CONSTANTS?.USD;

        // 🎯 monnaie produit
        let currency = item?.currency_price;
        if (currency === CONSTANTS?.FRANC) currency = CONSTANTS?.XOF;

        // 💱 conversion vers monnaie de référence
        const convertedValue =
            convertir(currency, reference, item?.price_product) ?? item?.price_product;

        // 💰 format conversion
        const prixConverti = formaterPrix(
            convertedValue,
            reference,
            t,
            i18n.language
        );

        // 💵 format prix original
        const prixOriginal = formaterPrix(
            item.price_product,
            item.currency_price,
            t,
            i18n.language
        );

        // 🔥 même monnaie → afficher seulement conversion
        const sameCurrency = currency === reference;

        // 🔹 helper parsing (conversion uniquement)
        const parsePrice = (prix) => {
            const match = prix.match(/^(\D*)([\d\s.,]+)(.*)$/);
            if (!match) return prix;

            const [, before, numberPart, after] = match;

            let entier = numberPart;
            let decimales = "";
            let separator = "";

            if (numberPart.includes(",")) separator = ",";
            else if (numberPart.includes(".")) separator = ".";

            if (separator) {
                [entier, decimales] = numberPart.split(separator);
            }

            return (
                <>
                    {before && <>{before}</>}
                    <>{entier}</>
                    {decimales && <>{separator}{decimales}</>}
                    {after && <>{after}</>}
                </>
            );
        };

        return (
            <span className="whitespace-nowrap text-blue-700 text-[15px] md:text-[20px] font-bold p-1 flex flex-col items-start">

                {/* 💰 prix converti */}
                <p className="text-green-500 font-bold">{parsePrice(prixConverti)}</p>

                {/* 🔥 si différente monnaie → afficher original */}
                {!sameCurrency && (
                    <p className="text-blue-500 text-sm font-semibold">
                        {prixOriginal}
                    </p>
                )}

            </span>
        );

    }, [
        item?.price_product,
        item?.currency_price,
        i18n.language,
        t
    ]);
};

export default RendrePrixProduitMonnaie;