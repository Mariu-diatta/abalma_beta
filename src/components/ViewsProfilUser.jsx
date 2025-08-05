import { useTranslation } from 'react-i18next';
import api from '../services/Axios';
import { useEffect, useState } from 'react';

const ViewsProfil = ({ clientId }) => {

    const { t } = useTranslation();

    const [isFollow, setIsFollow] = useState(null)


    const [isLoading, setIsLoading] = useState(true)

    useEffect(

        () => {

            isAlreadyFollowed(clientId, setIsFollow, setIsLoading)

        }, [clientId]
    )


    const handleView = () => {

        recordView(clientId);
    };

    return (

        <>
            {
                !isLoading &&
                <>
                {
                    (isFollow?.is_following) ?
                    <div className="flex items-center text-sm">
                        <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M5 11.917 9.724 16.5 19 7.5" />
                        </svg>

                        <>{t('followed')}</>
                    </div>
                    :
                    <button

                        type="button"

                        className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-xs px-3 py-1.5 dark:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none dark:focus:ring-blue-900"

                        onClick={handleView}
                    >
                        {t('follow')}

                    </button>
                }
                </>
            }
        </>
    );
};

export default ViewsProfil;

const recordView = async (clientId) => {

    try {

        const response = await api.post(`/clients/${clientId}/follow/`, {

            withCredentials: true, // pour envoyer les cookies de session

            headers: {

                'Content-Type': 'application/json',
            },
        });

        console.log('Vue enregistrée :', response.data || response.data?.message || 'Succès');

    } catch (error) {

        const message =

            error.response?.data?.error ||

            error.message ||

            'Erreur inconnue';

         console.error('Erreur lors de l’enregistrement de la vue :', message);
    }
};


const isAlreadyFollowed = async (clientId, setIsFollow, setIsLoading) => {


    try {

        const response = await api.get(`/clients/${clientId}/alreadyFollow/`, {

            withCredentials: true, // pour envoyer les cookies de session

            headers: {

                'Content-Type': 'application/json',
            },
        });

        setIsFollow(response.data)

        console.log('Already followed :', response.data || response.data?.message || 'Succès');

    } catch (error) {

        const message =

            error.response?.data?.error ||

            error.message ||

            'Erreur inconnue';

        console.error('Erreur lors de l’enregistrement de la vue :', message);

    } finally {

        setIsLoading(false)
    }
};