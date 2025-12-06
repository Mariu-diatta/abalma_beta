import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { formaterPrix } from '../utils';



// Rendu memoïsé du prix du produit
const RendrePrixProduitMonnaie = ({ item }) => {

    const { t, i18n } = useTranslation();

    return useMemo(() => {
        //const currentLang = i18n.language;
        const prix = item?.price_product; // Valeur par défaut à 0 si undefined
        const monnaie = item?.currency_price?.toUpperCase() || 'EUR'; // Par défaut EUR
        const prixFormate = formaterPrix(prix, monnaie, t, i18n.language);
        const space = item?.currency_price === "DOLLAR" ?",":","
        const prixFormat =  !(item?.currency_price === "DOLLAR")?
                            (
                                (item?.currency_price === "EURO") ?
                                "€"
                                :
                                "XOF"
                            )
                            :
                            "$";

        return (

            <span
                className="whitespace-nowrap text-blue-700 dark:text-blue-400 font-semibold text-sm sm:text-base"
                aria-label={(prixFormat === "$") ? `XOF` : prixFormat}
            >
                {
                    (item?.currency_price === "DOLLAR") ?
                    <span>
                            <span>{prixFormate.split(space)[0]}</span>.
                            <span className="text-[12px]"> {prixFormate.split(space)[1]}</span >
                     </span>
                    :
                    <span>
                            <span>{prixFormate.split(space)[0]}</span>,
                            <span className="text-[12px]"> {prixFormate.split(space)[1]}</span >
                    </span >
                }

            </span>
        );

    }, [item?.price_product, t, i18n.language, item?.currency_price]);
};

export default RendrePrixProduitMonnaie;