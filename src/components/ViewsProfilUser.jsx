import { useTranslation } from 'react-i18next';
import api from '../services/Axios';

const ViewsProfil = ({ clientId }) => {
    const { t } = useTranslation();

    const handleView = () => {
        recordView(clientId);
    };

    return (
        <button
            type="button"
            className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-xs px-3 py-1.5 dark:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none dark:focus:ring-blue-900"
            onClick={handleView}
        >
            {t('follow')}
        </button>
    );
};

export default ViewsProfil;

const recordView = async (clientId) => {
    try {
        const response = await api.get(`/approfile-view/${clientId}/`, {
            withCredentials: true, // pour envoyer les cookies de session
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log('Vue enregistrée :', response.data?.message || 'Succès');
    } catch (error) {
        const message =
            error.response?.data?.error ||
            error.message ||
            'Erreur inconnue';

        console.error('Erreur lors de l’enregistrement de la vue :', message);
    }
};
