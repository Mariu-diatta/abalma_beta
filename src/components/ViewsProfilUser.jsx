import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useState } from 'react';
import { isAlreadyFollowed, recordFollowUser, recordUnfollowUser } from '../utils';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserData } from '../slices/authSlice';
import { addUser } from '../slices/chatSlice';

const FollowProfilUser = ({ clientId }) => {

    const { t } = useTranslation();

    const [followStatus, setFollowStatus] = useState(null); // Renommé pour plus de clarté

    const [hasJustFollowed, setHasJustFollowed] = useState(false);

    const [hasJustUnFollowed, setHasJustUnFollowed] = useState(false);

    const [isLoading, setIsLoading] = useState(true);

    const currentSelectedUser = useSelector(state => state.chat.userSlected)

    const currentUser = useSelector(state => state.auth.user)

    const dispatch = useDispatch()

    const updateSelectedUserFollower = (isFollow=true) => {

        const operation = isFollow ? (currentSelectedUser?.total_followers + 1) : (currentSelectedUser?.total_followers - 1)

        dispatch(addUser({ ...currentSelectedUser, total_followers: operation }))
    }

    const updateSelectedUserFollowing = (isFollowing=false) => {

        const operation = isFollowing ? (currentUser?.total_followings + 1) : (currentUser?.total_followings - 1)
        const updateCurrentUser = { ...currentUser, total_followings: operation }
        console.log("updat ViewsProfilUser", updateCurrentUser)
        dispatch(updateUserData(updateCurrentUser))
    }

    const updateFollowStatus = useCallback(

        () => {

            if (!clientId) return;

            isAlreadyFollowed(clientId, setFollowStatus, setIsLoading)
        },

        [clientId]

    )

    useEffect(() => {

        updateFollowStatus()

    }, [updateFollowStatus]);

    const handleFollowClick = () => {

        recordFollowUser(clientId);

        setHasJustFollowed(true);

        setHasJustUnFollowed(false);

        updateSelectedUserFollower()

        updateSelectedUserFollowing(true)

    };

    const handleUnFollowClick = () => {

        recordUnfollowUser(clientId);

        setHasJustUnFollowed(true);

        setHasJustFollowed(false);

        updateSelectedUserFollower(false)

        updateSelectedUserFollowing(false)

    };

    return (

      <>

        {
            !isLoading ?
            <>
               { 
                    (!hasJustUnFollowed && (hasJustFollowed || followStatus?.is_following)) ?
                    (

                    <button

                        className="flex items-center text-sm bg-red-300 px-3 rounded-full hover:bg-red-400 cursor-pointer"

                        title="unfollow"

                        onClick={handleUnFollowClick}
                    >
                        <svg
                            className="w-6 h-6 text-gray-800 dark:text-white"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1"
                                d="M5 11.917 9.724 16.5 19 7.5"
                            />
                        </svg>

                        <span className="ml-2 whitespace-nowrap">{t('followed')}</span>

                    </button>

                ) : (

                    <button
                        type="button"
                        className="flex items-center text-sm bg-blue-300 px-3 rounded-full hover:bg-blue-400 cursor-pointer"
                        onClick={handleFollowClick}
                    >
                        <svg
                            className="w-6 h-6 text-gray-800 dark:text-white"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1"
                                d="M5 11.917 9.724 16.5 19 7.5"
                            />
                        </svg>
                        {t('follow')}
                    </button>
                )}
            </>
            :
            null
        }

      </>
    )

};

export default FollowProfilUser;
