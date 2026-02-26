import React from 'react'
import { useTranslation } from 'react-i18next';

const NumberFollowFollowed = ({ profil}) => {

    const { t } = useTranslation();

    return (

        <ul className="flex gap-6 text-sm">

            <li className="flex rounded-full gap-1">

                <span className="font-semibold text-gray-900 dark:text-white-900">{profil?.total_followings}</span> <p>{t('following')} </p>

            </li>

            <li className="flex rounded-full gap-1">

                <span className="font-semibold text-gray-900 dark:text-white-900"></span>{profil?.total_followers} <p>{t('followers')}</p>

            </li>



        </ul>
    )
}

export default NumberFollowFollowed;