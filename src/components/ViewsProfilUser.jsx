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
                    (isFollow?.is_following)?
                    <>
                       {t(' followed')}
                    </>
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