import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { formaterPrix } from '../utils';

const RendrePrixProduitMonnaie = ({ item }) => {
  const { t, i18n } = useTranslation();

  return useMemo(() => {
    if (!item?.price_product) return null;

    const prixFormate = formaterPrix(
      item.price_product,
      item.currency_price,
      t,
      i18n.language
    );

    // 🔹 Séparer symbole et nombre automatiquement
    const match = prixFormate.match(/^(\D*)([\d\s.,]+)(.*)$/);

    if (!match) return prixFormate;

    const [, before, numberPart, after] = match;

    // 🔹 Trouver séparateur décimal
    let entier = numberPart;
    let decimales = "";
    let separator = "";

    if (numberPart.includes(",")) separator = ",";
    else if (numberPart.includes(".")) separator = ".";

    if (separator) {
      [entier, decimales] = numberPart.split(separator);
    }

    return (
      <span className="whitespace-nowrap text-blue-700 text-sm sm:text-base font-bold p-1">
        
        {/* symbole avant */}
        {before && <span>{before}</span>}

        {/* entier */}
        <span>{entier}</span>

        {/* décimales */}
        {decimales && (
          <span className="text-[12px] align-center">
            {separator}{decimales}
          </span>
        )}

        {/* symbole après */}
        {after && <span>{after}</span>}

      </span>
    );
  }, [item?.price_product, item?.currency_price, t, i18n.language]);
};

export default RendrePrixProduitMonnaie;