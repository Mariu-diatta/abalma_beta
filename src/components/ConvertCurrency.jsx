import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { formaterPrix } from '../utils';



// Rendu memoïsé du prix du produit
const RendrePrixProduitMonnaie = ({ item }) => {
    const { t, i18n } = useTranslation();

    return useMemo(() => {
        const prix = item?.price_product; // Valeur par défaut à 0 si undefined
        const monnaie = item?.currency_price?.toUpperCase() || 'EUR'; // Par défaut EUR
        const prixFormate = formaterPrix(prix, monnaie, t, i18n.language);
        const prixFormat = (item?.currency_price === "DOLLAR") ?
                            (
                                (item?.currency_price === "EURO") ?
                                "€"
                                :
                                "FCFA"
                            )
                            :
                            "$";

        return (

            <span
                className="whitespace-nowrap text-blue-700 dark:text-blue-400 font-semibold text-sm sm:text-base"
                aria-label={(prixFormat === "$") ? `${t('monnaie.prix_label')}` : prixFormat}
            >
                {prixFormate}

            </span>
        );

    }, [item?.price_product, t, i18n.language, item?.currency_price]);
};

export default RendrePrixProduitMonnaie;