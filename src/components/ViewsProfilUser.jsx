import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { isAlreadyFollowed, recordView } from '../utils';

const FollowProfilUser = ({ clientId }) => {

    const { t } = useTranslation();

    const [isFollow, setIsFollow] = useState(null)

    const [follow, setFollow] = useState(false)

    const [isLoading, setIsLoading] = useState(true)

    useEffect(

        () => {

            isAlreadyFollowed(clientId, setIsFollow, setIsLoading)

        }, [clientId]
    )


    const handleView = () => {

        recordView(clientId);

        setFollow(true)
    };

    return (

        <>
            {
                !isLoading && !follow &&
                <>
                {
                    (isFollow?.is_following) ?
                    <div className="flex items-center text-sm bg-blue-300 px-3 rounded-full">
                        <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M5 11.917 9.724 16.5 19 7.5" />
                        </svg>

                        <>{t('followed')}</>
                    </div>
                    :
                    <button

                        type="button"

                        className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 w-1/2 lg:w-auto rounded-full"

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

export default FollowProfilUser;



