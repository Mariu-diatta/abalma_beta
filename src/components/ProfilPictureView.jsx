import React from 'react'
import { useTranslation } from 'react-i18next';

const ProfilPictureView = ({ currentUser, message, children }) => {

    const { t } = useTranslation();

    return (

        <div className="flex flex-col items-center justify-center min-h-[300px] text-center text-gray-500 text-lg">

            <img
                alt=""
                src={currentUser?.image}
                title={currentUser?.description}
                className="h-30 w-30 rounded-full object-cover cursor-pointer ring-1 ring-gray-300 hover:ring-blue-500 transition mb-4"
            />

            <div className="w-full h-px bg-gray-300" />

            <p className="mb-1">{message || t('TableRecap.noProducts')}</p>

            {
                children
            }

        </div>
    )
}

export default ProfilPictureView;