import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { formaterPrix } from '../utils';



// Rendu memoïsé du prix du produit
const RendrePrixProduitMonnaie = ({item}) => {
    const { t, i18n } = useTranslation();

    return useMemo(() => {
        const prix = item?.price_product; // Valeur par défaut à 0 si undefined
        const monnaie = item?.Currency_price?.toUpperCase() || 'EUR'; // Par défaut EUR
        const prixFormate = formaterPrix(prix, monnaie, t, i18n.language);

        return (
            <span
                className="whitespace-nowrap text-blue-700 dark:text-blue-400 font-semibold text-sm sm:text-base"
                aria-label={`${t('monnaie.prix_label')} ${prixFormate}`}
            >
                {prixFormate}
            </span>
        );
    }, [item?.price_product, item?.Currency_price, t, i18n.language]);
};

export default RendrePrixProduitMonnaie;