const PrintNumberStars = ({ productNbViews, t }) => {

    const count = Number(productNbViews) || 0;

    return (
        <div className="flex items-center">
            <p className="inline-flex items-center whitespace-nowrap text-xs font-medium text-indigo-600 rounded-full bg-indigo-100 px-2 py-1">
                {count} {t("reviews")}
            </p>
        </div>
    );
};

export default PrintNumberStars;