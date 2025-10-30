import React from 'react'
import { useTranslation } from 'react-i18next';

const ProfilPictureView = ({ currentUser, message, children }) => {

    const { t } = useTranslation();

    return (

        <div className="flex flex-col items-center justify-center max-h-[75dvh] min-h-[75dvh] text-center text-gray-500 text-lg">

            <img
                alt=""
                src={currentUser?.image || currentUser?.photo_url}
                title={currentUser?.description}
                className="h-30 w-30 rounded-full object-cover cursor-pointer ring-1 ring-gray-300 hover:ring-blue-500 transition mb-4"
            />

            <div className="w-full h-px bg-gray-100" />

            <p className="mb-1">{message || t('TableRecap.noProducts')}</p>

            {
                children
            }

        </div>
    )
}

export default ProfilPictureView;