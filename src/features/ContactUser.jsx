import React, { useEffect, useState } from "react";
import api from "../services/Axios";
import { useSelector } from "react-redux";
import { useTranslation } from 'react-i18next';
import TitleCompGen from "../components/TitleComponentGen";
import LoadingCard from "../components/LoardingSpin";
import OwnerAvatar from "../components/OwnerProfil";

const UsersContactsList = () => {

    const { t } = useTranslation();
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState("Tous");
    const [users, setUsers] = useState([]);
    const currentuser = useSelector(state => state.auth.user)

    useEffect(

        () => {

            const apiUsers = async () => {

                try {

                    const othersClients =await api.get('clients/othersClients/')

                    setUsers(othersClients.data?.other_clients)

                } catch (err) {

                } finally {

                    setLoading(false)
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

    const listContactsUsers = filteredUsers?.length > 0

    return (

        <div className="dark:text-white text-gray-800   absolute fixed w-[98dvw] md:w-[80dvw] m-auto sm:rounded-lg pb-6 mb-6  mt-5 pb-[30dvh] overflow-y-auto h-full scrollbor_hidden">

            <TitleCompGen title={t('ParamText.title')} />

            {
                loading ?
                <LoadingCard/>
                :
                <div className="flex flex-col justify-between  h-[75dvh]">
                    {/* Bar d'action */}
                    <div className="flex items-center justify-between flex-wrap md:flex-nowrap space-y-4 md:space-y-0 pb-4 px-4 ">

                        {/* Dropdown de filtre */}
                        <div className="relative ">

                            <button

                                onClick={toggleDropdown}

                                className="inline-flex items-center hover:bg-gray-50 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5"
                            >
                                {statusFilter === "Tous" ? "Filtrer par statut" : statusFilter}

                                <svg className="w-2.5 h-2.5 ms-2.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">

                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />

                                </svg>

                            </button>

                            {isDropdownOpen && (

                                <div className="absolute mt-2 z-10 divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:divide-gray-600 bg-white">

                                    <ul className="py-1 text-sm text-gray-700">

                                        {["Tous", "Online"].map((status) => (

                                            <li key={status}>

                                                <button

                                                    onClick={() => handleStatusFilter(status)}

                                                    className="block w-full text-left px-4 py-2 hover:bg-gray-50"
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

                            <div className="relative">

                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    className="outline-none ring-0 block p-2 ps-10 text-sm border border-blue-50 rounded-full w-80"
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

                    <div className="relative overflow-y-auto h-[80dvh] scrollbor_hidden pb-[20dvh]">

                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 shadow-lg p-1">

                            <thead className="border border-gray-200">

                                <tr>

                                    <th className="px-6 py-3">{t('ParamText.table.name')}</th>

                                    <th className="px-6 py-3">{t('ParamText.table.about')}</th>

                                </tr>

                            </thead>

                            {
                                listContactsUsers ?
                                <tbody className=" w-full">
                                    {
                                        filteredUsers?.map((user, i) => (

                                            (user?.id !== currentuser?.id)
                                                && 
                                                (
                                                    <tr key={i} className="dark:border-gray-700 border-gray-200 hover:bg-gray-50">

                                                        <td className="px-auto py-1 flex items-center space-x-1 whitespace-nowrap p-2">

                                                            <div class="flex items-center gap-2.5">

                                                                <OwnerAvatar owner={user} />

                                                                <div className="font-medium text-heading">

                                                                    <div>{user?.prenom} {user?.nom}</div>

                                                                </div>

                                                            </div>

                                                        </td>

                                                        <td className="px-auto py-1 text-start">{user?.description?.slice(0,30)}...</td>

                                                    </tr>
                                                )
                                            )
                                        )
                                    }
                                </tbody >
                                :
                                <tbody className=" ">

                                    <tr>

                                        <td colSpan="9" className="text-center p-4">
                                            {t('no_contacts')}
                                        </td>

                                    </tr>

                                </tbody>

                            }

                        </table>

                    </div>

                </div>
            }

        </div>
    );
};

export default UsersContactsList;
