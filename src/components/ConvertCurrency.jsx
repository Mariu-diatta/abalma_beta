import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

// Mapping des symboles monétaires
const symbolesMonnaies = {
    EUR: '€',
    USD: '$',
    XOF: 'CFA', // Franc CFA (Afrique de l'Ouest)
    // XAF: 'CFA', // Franc CFA (Afrique centrale), si nécessaire
    CHF: 'CHF', // Franc suisse, si c'est ce que vous voulez
};


// Configuration des monnaies avec symboles et ordre
const configurationMonnaies = {
    EUR: { symbole: '€', position: 'apres', code: 'EUR' }, // Après en fr-FR
    USD: { symbole: '$', position: 'avant', code: 'USD' }, // Avant en en-US, après en fr-CA
    XOF: { symbole: 'CFA', position: 'apres', code: 'XOF' }, // Après pour franc CFA
    CHF: { symbole: 'CHF', position: 'apres', code: 'CHF' }, // Après en fr-CH
};


// Fonction pour formater le prix avec la monnaie
const formaterPrix = (prix, monnaie, t, locale = 'fr-FR') => {

    console.log("Le monnaie du produit", monnaie)

    if (monnaie === "EURO") {
        monnaie = "EUR"
    } else if (monnaie === "FRANC") {
        monnaie = "XOF"
    } else {
        monnaie = "USD"
    }

    if (!prix || !monnaie || !symbolesMonnaies[monnaie] || !configurationMonnaies[monnaie]) {
        return t('monnaie.inconnue', 'Prix non disponible');
    }
    const config = configurationMonnaies[monnaie]

    try {

        const formatter = new Intl.NumberFormat(locale, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

        const price_format= formatter.format(prix);

        return config.position === 'avant'
            ? `${config.symbole}${price_format}`
            : `${price_format} ${config.symbole}`;

    } catch (error) {

        return `${prix} ${symbolesMonnaies[monnaie] || monnaie}`;
    }
};

// Rendu memoïsé du prix du produit
const RendrePrixProduitMonnaie = ({item}) => {
    const { t, i18n } = useTranslation();

    return useMemo(() => {
        const prix = item?.price_product; // Valeur par défaut à 0 si undefined
        const monnaie = item?.Currency_price?.toUpperCase() || 'EUR'; // Par défaut EUR
        const prixFormate = formaterPrix(prix, monnaie, t, i18n.language);

        return (
            <span
                className="text-blue-700 dark:text-blue-400 font-semibold text-sm sm:text-base"
                aria-label={`${t('monnaie.prix_label')} ${prixFormate}`}
            >
                {prixFormate}
            </span>
        );
    }, [item?.price_product, item?.Currency_price, t, i18n.language]);
};

export default RendrePrixProduitMonnaie;