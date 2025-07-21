import React, { useEffect, useState } from "react";
import api from "../services/Axios";
import OwnerAvatar from "./OwnerProfil";
import { useSelector } from "react-redux";
import { useTranslation } from 'react-i18next';

const UsersContactsList = () => {

    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState("Tous");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [users, setUsers] = useState([]);
    const currentuser = useSelector(state => state.auth.user)

    useEffect(

        () => {

            const apiUsers = async () => {

                try {

                    api.get("/clients/").then(

                        resp => {

                            console.log("LES USERs", resp?.data)

                            setUsers(resp?.data)
                        }

                    ).catch(

                        err => console.log("LES USER", err)
                    )

                } catch (err) {

                }
            }

            apiUsers()
        }

        , []
    )

    const handleSearchChange = (e) => setSearchTerm(e.target.value.toLowerCase());

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    const handleStatusFilter = (status) => {

        setStatusFilter(status);

        setIsDropdownOpen(false);
    };

    const filteredUsers = users.filter((user) => {

        const matchesSearch =

            user.nom.toLowerCase().includes(searchTerm) ||

            user.email.toLowerCase().includes(searchTerm);

        const matchesStatus = statusFilter === "Tous" || user?.is_connected;

        return matchesSearch && matchesStatus;
    });

    const isAllSelected = filteredUsers.length > 0 && filteredUsers.every(user => selectedUsers.includes(user.email));

    const toggleSelectAll = () => {

        if (isAllSelected) {

            setSelectedUsers([]);

        } else {

            setSelectedUsers(filteredUsers.map(user => user?.email));
        }
    };

    const toggleSelectOne = (email) => {

        setSelectedUsers(prev =>

            prev.includes(email) ? prev.filter(e => e !== email) : [...prev, email]
        );
    };

    const handleDeleteSelected = () => {

        alert(`Supprimer les utilisateurs : ${selectedUsers.join(", ")}`);
        // logique de suppression à intégrer ici
    };

    return (

        <div className="sm:rounded-lg style-bg h-screen">

            <h2 className="text-2xl font-extrabold text-gray-500 dark:text-white px-4 pt-4 pb-2"> 

                {t('ParamText.title')}

            </h2>

            {/* Bar d'action */}
            <div className="flex items-center justify-between flex-wrap md:flex-nowrap space-y-4 md:space-y-0 pb-4 dark:bg-gray-900 px-4 style-bg">

                {/* Dropdown de filtre */}
                <div className="relative style-bg">

                    <button

                        onClick={toggleDropdown}

                        className="inline-flex items-center text-gray-500  hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                    >
                        {statusFilter === "Tous" ? "Filtrer par statut" : statusFilter}

                        <svg className="w-2.5 h-2.5 ms-2.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">

                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />

                        </svg>

                    </button>

                    {isDropdownOpen && (

                        <div className="absolute mt-2 z-10 divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700 dark:divide-gray-600">

                            <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">

                                {["Tous", "Online"].map((status) => (

                                    <li key={status}>

                                        <button

                                            onClick={() => handleStatusFilter(status)}

                                            className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                        >
                                            {status === "Tous" ? t('ParamText.filterAll') : status}

                                        </button>

                                    </li>
                                ))}

                            </ul>

                        </div>
                    )}
                </div>

                {/* Recherche + Bouton supprimer */}
                <div className="flex items-center gap-4">

                    {selectedUsers.length >= 2 && (

                        <button

                            onClick={handleDeleteSelected}

                            className="text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 rounded-lg px-4 py-2 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-800"
                        >
                            {t('ParamText.alertDelete')}

                        </button>
                    )}

                    <div className="relative">

                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                            placeholder={t('ParamText.searchPlaceholder')}
                        />

                        <div className="absolute inset-y-0 left-0 flex items-center ps-3 pointer-events-none">

                            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">

                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />

                            </svg>

                        </div>
                    </div>

                </div>

            </div>

            {/* Tableau */}
            <table className="w-auto text-sm text-left style-bg shadow-lg ">

                <thead className="text-xs uppercase style-bg">

                    <tr className="style-bg">

                        <th className="p-4">

                            <input
                                type="checkbox"
                                checked={isAllSelected}
                                onChange={toggleSelectAll}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm dark:bg-gray-700 dark:border-gray-600"
                            />

                        </th>

                        <th className="px-6 py-3">{t('ParamText.table.name')}</th>

                        <th className="px-6 py-3">{t('ParamText.table.about')}</th>

                        <th className="px-6 py-3">{t('ParamText.table.delete')}</th>

                    </tr>

                </thead>

                <tbody className="overflow-x-auto">

                    {filteredUsers.map((user, i) => (

                        !(user?.id === currentuser?.id) &&

                        <tr key={i} className="dark:bg-gray-100  hover:bg-gray-50 dark:hover:bg-gray-40 shadow-lg">

                            <td className="p-4">

                                <input

                                    type="checkbox"

                                    checked={selectedUsers.includes(user.email)}

                                    onChange={() => toggleSelectOne(user.email)}

                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm dark:bg-gray-700 dark:border-gray-600"
                                />

                            </td>

                            <td className="px-6 py-4 flex items-center space-x-3 whitespace-nowrap ">

                                <OwnerAvatar owner={user} />

                                <div>

                                    <div className="text-base font-semibold text-gray-900 dark:text-white">{user?.nom}</div>

                                    <div className="font-normal text-gray-500">{user?.email}</div>

                                </div>

                            </td>

                            <td className="px-6 py-4">{user?.description}</td>

                            <td className="px-6 py-4">

                                <svg className="w-6 h-5 text-red-1000 cursor-pointer" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">

                                    <path fillRule="evenodd" d="M8.586 2.586A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4a2 2 0 0 1 .586-1.414ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z" clipRule="evenodd" />

                                </svg>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );
};

export default UsersContactsList;
