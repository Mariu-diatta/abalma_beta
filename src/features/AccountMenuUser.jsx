import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { ENDPOINTS } from '../utils';
import { setCurrentNav } from '../slices/navigateSlice';
import { useNavigate } from 'react-router-dom';
import LoadingCard from '../components/LoardingSpin';
import { useTranslation } from 'react-i18next';


const AccountMenuUser = ({ dropdownOpen, trigger, setDropdownOpen, dropdown, getUserLogOut, loading }) => {

    const currentUser = useSelector(state => state.auth.user);

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const { t } = useTranslation();

    const userImage = (currentUser?.image || currentUser?.photo_url)

    const userConnected = currentUser?.is_connected

    const userEmail = currentUser?.email

    const currentNav = useSelector(state => state.navigate.currentNav);


    return (

        <div className='flex items-center justify-center z-0'>

            {/* Avatar + dropdown */ }
            <button
                ref={trigger}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="hover:bg-gray-50 relative inline-flex items-center justify-center gap-0 rounded-lg  px-1 dark:text-white"
            >
                {
                    userImage ? (

                        <div className="relative flex items-center justify-center rounded-full">

                            <img
                                src={userImage}
                                alt="avatar"
                                title={userEmail}
                                className="h-6.5 w-6.5 rounded-full object-cover cursor-pointer bg-gray-200"
                            />

                            {
                                userConnected && (
                                    <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-[#219653] border border-white dark:border-dark"></span>
                                )
                            }

                        </div>


                    ) : (
                        <div className="relative w-[30px] rounded-full " title={userEmail}>

                            <svg className="w-6 h-8 text-gray-800 dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">

                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.8"
                                    d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0a8.949 8.949 0 0 0 4.951-1.488A3.987 3.987 0 0 0 13 16h-2a3.987 3.987 0 0 0-3.951 3.512A8.948 8.948 0 0 0 12 21Zm3-11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />

                            </svg>

                            {
                                userConnected &&
                                (

                                    <span className="absolute -right-0.5 -top-0.5 block h-[14px] w-[14px] rounded-full border-[2.3px] border-white bg-[#219653] dark:border-dark"></span>
                                )
                            }

                        </div>
                    )}

                <span className={`transition-transform duration-100 px-0 mx-0 ${dropdownOpen ? "-scale-y-100" : ""}`}>

                    <svg className="w-6 h-8 text-gray-800 dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">

                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.8" d="m8 10 4 4 4-4" />

                    </svg>

                </span>

            </button>

            {/* Dropdown menu */ }
            <div
                ref={dropdown}

                onFocus={() => setDropdownOpen(true)}

                onBlur={() => setDropdownOpen(false)}

                className={`bg-gradient-to-l from-red-50 to-gray-200 h-100 border border-gray-100 shadow-lg absolute right-0 top-full me-3 overflow-hidden rounded-lg dark:divide-dark-3 dark:bg-dark-2 ${dropdownOpen ? "block z-100 bg-white/80 " : "hidden"}`}

            >

                <div className="px-4 py-3">

                    <p className="whitespace-nowrap font-semibold">{currentUser?.email}</p>

                </div>

                {
                    [
                        {
                            endPoint: ENDPOINTS?.USER_PROFIL,

                            title: t("profil"),

                            logo: (
                                <svg className="w-[26px] h-[26px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">

                                    <path stroke="currentColor" strokeWidth="1" d="M7 17v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3Zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />

                                </svg>
                            )
                        },

                        {
                            endPoint: ENDPOINTS?.SETTINGS,

                            title: t("param"),

                            logo: (
                                <svg className="w-[26px] h-[26px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">

                                    <path stroke="currentColor" strokeLinecap="square" strokeLinejoin="round" strokeWidth="0.9" d="M10 19H5a1 1 0 0 1-1-1v-1a3 3 0 0 1 3-3h2m10 1a3 3 0 0 1-3 3m3-3a3 3 0 0 0-3-3m3 3h1m-4 3a3 3 0 0 1-3-3m3 3v1m-3-4a3 3 0 0 1 3-3m-3 3h-1m4-3v-1m-2.121 1.879-.707-.707m5.656 5.656-.707-.707m-4.242 0-.707.707m5.656-5.656-.707.707M12 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />

                                </svg>
                            )
                        },

                    ]?.map(

                        elem => <div>

                            <button

                                className={`shadow-sm flex gap-1 w-full items-center justify-between px-4 py-2.5 text-sm text-dark hover:bg-gray-50 dark:text-white ${currentNav === elem.endPoint && "bg-gray-50"}`}

                                onClick={

                                    () => {

                                        navigate(`/${elem.endPoint}`);

                                        dispatch(setCurrentNav(elem.endPoint))
                                    }
                                }
                            >

                                <div className="flex gap-2 items-center">

                                    {elem.logo}

                                    <div className="whitespace-nowrap">{elem.title}</div>

                                </div>

                                <svg className="w-[26px] h-[26px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">

                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m9 5 7 7-7 7" />

                                </svg>

                            </button>

                        </div>
                    )
           
                }

                <div>

                    {
                        !loading ?
                        <button onClick={getUserLogOut} className="shadow-sm flex w-full items-center justify-start gap-2 px-4 py-2.5 text-sm text-dark hover:bg-gray-50 dark:text-white">

                            <svg className="w-[26px] h-[26px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">

                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 12H8m12 0-4 4m4-4-4-4M9 4H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h2" />

                            </svg>

                            {t("logOut")}

                        </button>
                        :
                        <LoadingCard/>
                    }

                </div>

            </div>

        </div>
    )
}

export default AccountMenuUser;