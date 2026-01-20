import React from 'react';
import { menuItems } from "../components/MenuItem";
import { useTranslation } from 'react-i18next';

const ListButtonsCategories = (
    {
        categories,
        setProductSpecificHandler,
        setActiveCategory,
        setActivateButtonCategory,
        activateButtonCategory
    }) => {

    const { t } = useTranslation();

    return (

            <section className="flex py-2 gap-5 bg-none">

                {
                    categories?.map((cat) => (

                        <button

                            key={cat}

                            onMouseOver={() => setProductSpecificHandler(cat.replace("_", ""))}

                            onClick={() => {
                                const label = cat.replace("_", " ");
                                setActiveCategory(label);
                                setActivateButtonCategory(label);
                            }}

                            style={{
                                backgroundColor: "var(--color-bg)",
                                color: "var(--color-text)",
                            }}

                            className={`
                                flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-normal whitespace-nowrap
                                transition-all duration-200 border z-2 border-0 shadow-sm mx-1 md:mx-3
                                ${activateButtonCategory?.toLowerCase() === cat.replace("_", "").toLowerCase()
                                ? " bg-gradient-to-br from-purple-50 to-blue-100 text-white shadow-md ring-0 "
                                : " bg-gray-100 text-blue-100 border border-blue-50 hover:bg-blue-100 hover:text-white hover:shadow-sm"
                                }
                            `}
                        >
                            <span className="flex items-center gap-1 bg-none">

                                <span>{cat.replace("_", " ")}</span>

                                {menuItems(t).find(item => item?.name === cat.replace("_", " "))?.svg}

                            </span>

                        </button>

                    ))
                }

            </section>
    )
}

export default ListButtonsCategories;
