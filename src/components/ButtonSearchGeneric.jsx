
import React from 'react'


const ButtonSearchGeneric = ({search, setSearch, setPage, t }) => {

    return (

        <input
            type="text"
            placeholder={t("search")}
            value={search}
            onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
            }}
            className="focus:outline-none focus:ring-0 rounded-full border px-3 py-2 border-blue-50 focus:border-blue-50 focus:ring-1 focus:ring-blue-100"
        />
    )
}

export default ButtonSearchGeneric;