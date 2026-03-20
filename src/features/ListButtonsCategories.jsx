import React from 'react';
import { menuItems } from "../components/MenuItem";
import { useTranslation } from 'react-i18next';
import  { TitleCompGenLitle } from '../components/TitleComponentGen';

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

                            className={`
                                flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-normal whitespace-nowrap
                                transition-all duration-200 border-none bg z-2 border-0 mx-1 md:mx-3
                                ${activateButtonCategory?.toLowerCase() === cat.replace("_", "").toLowerCase()
                                ? " bg-gradient-to-l from-red-50 to-gray-200 text-white  ring-0 "
                                : " text-blue-100 border border-blue-50 hover:bg-gray-100 hover:text-white hover:shadow-sm"
                                }
                            `}
                        >
                            <span className="flex flex-col gap-2 items-center gap-1 bg-none">
                                {menuItems(t).find(item => item.name === cat)?.photo}
                                <span className="h-3 shadow-md rounded-xl h-8 pb-7 px-2">
                                    <TitleCompGenLitle title={cat.replace("_", " ")}/>
                                </span>
                            </span>

                        </button>

                    ))
                }

            </section>
    )
}

export default ListButtonsCategories;
