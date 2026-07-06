import React from 'react'
import { useTranslation } from 'react-i18next';
import LoadingCard from './LoardingSpin';

const UpdateUserToPro = ({ handleUpgradeToPro, handleFileChange, sedingProofDoc, setIsProFormVisible }) => {

    const { t } = useTranslation();

    return (

        <form

            onSubmit={handleUpgradeToPro}

            className="verflow-x-auto mt-6 w-auto flex flex-col items-center gap-4 p-1 rounded-lg shadow-lg"
        >
            <label className="text-sm">{t('hintProofDoc')}</label>

            <div className="flex items-center gap-2">

                <svg
                    className="w-6 h-6 text-gray-800 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke="currentColor"
                        strokeLinejoin="round"
                        strokeWidth="1"
                        d="M10 3v4a1 1 0 0 1-1 1H5m14-4v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1Z"
                    />

                </svg>

                <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.png,.jpeg"
                    required
                    className="border border-gray-300 rounded-full p-2 text-sm cursor-pointer w-full"
                />

            </div>

            <div className="flex gap-2">

                {
                    (!sedingProofDoc) ?
                        <button
                            type="submit"
                            className="rounded-full bg-green-300 text-white px-4 py-2 hover:bg-green-400 text-sm"
                        >
                            {t('ProfilText.envoyerJustificatif')}

                        </button>
                        :
                        <LoadingCard />
                }

                <button
                    type="button"
                    onClick={() => setIsProFormVisible(false)}
                    className="h-8 w-1/2 md:w-auto rounded-full bg-red-300 text-white px-4 py-2 hover:bg-red-400 text-sm"
                >
                    {t('ProfilText.annuler')}

                </button>

            </div>

        </form>
    )
}

export default UpdateUserToPro;