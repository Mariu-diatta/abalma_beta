import React from 'react'
import { useTranslation } from 'react-i18next';

const NumberFollowFollowed = ({ profil}) => {

    const { t } = useTranslation();

    return (

        <ul className="flex gap-6 text-sm">

            <li className="flex gap-1  bg-green-200 px-2 rounded-full">

                <span className="font-semibold text-gray-900 dark:text-white">{profil?.total_followers}</span> <p>{t('following')} </p>

            </li>

            <li className="flex gap-1 bg-green-200 px-2 rounded-full">

                <span className="font-semibold text-gray-900 dark:text-white">{profil?.total_followings}</span> <p>{t('followers')}</p>

            </li>



        </ul>
    )
}

export default NumberFollowFollowed;