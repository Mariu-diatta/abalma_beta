import React from 'react'
import { useTranslation } from 'react-i18next';
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { setCurrentNav } from '../slices/navigateSlice';


const ProButtonUi = () => {

    const { t } = useTranslation();

    const currentUser = useSelector(state => state.auth.user)

    const dispatch = useDispatch();

    let navigate = useNavigate();

    if (currentUser?.is_pro) return

    return (

        <>
            <ul className="pt-4 mt-4 space-y-2  border-t border-gray-200 dark:border-gray-700 cursor-pointer">

                <li>
                    <span className="flex items-center p-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group rounded-lg">

                        <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 17 20">

                            <path d="M7.958 19.393a7.7 7.7 0 0 1-6.715-3.439c-2.868-4.832 0-9.376.944-10.654l.091-.122a3.286 3.286 0 0 0 .765-3.288A1 1 0 0 1 4.6.8c.133.1.313.212.525.347A10.451 10.451 0 0 1 10.6 9.3c.5-1.06.772-2.213.8-3.385a1 1 0 0 1 1.592-.758c1.636 1.205 4.638 6.081 2.019 10.441a8.177 8.177 0 0 1-7.053 3.795Z" />

                        </svg>

                        <button
                            className="ms-3 "
                            onClick={
                                () => {
                                    alert(t("NO_SERVICE_PRO"));
                                    dispatch(setCurrentNav("user_profil"))
                                    navigate("/user_profil/")
                                }
                            }
                        >
                            {t('AccountPage.upgrade')}
                        </button>

                    </span>
                </li>

            </ul>
        </>
    )
}

export default ProButtonUi;