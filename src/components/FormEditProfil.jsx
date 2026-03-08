import React from 'react'
import InputBox from './InputBoxFloat';
import { useTranslation } from 'react-i18next';
import LoadingCard from './LoardingSpin';


const FormEditProfil = ({ handleSave, handleChange, formData, loadinUpdate, setIsEditing }) => {

    const { t } = useTranslation();

	return (

        <form
            onSubmit={(e) => {
                e.preventDefault();
                handleSave();
            }}
            className="mt-4 space-y-4 sm:w-1/2 shadow-lg p-3 rounded-lg bg-gray-50 "
        >
            <InputBox
                type="text"
                name="nom"
                placeholder={t('ProfilText.nomPlaceholder')}
                value={formData?.nom}
                onChange={handleChange}
            />
            <InputBox
                type="text"
                name="prenom"
                placeholder={t('ProfilText.prenomPlaceholder')}
                value={formData?.prenom}
                onChange={handleChange}
            />
            <InputBox
                type="email"
                name="email"
                placeholder={t('ProfilText.emailPlaceholder')}
                value={formData?.email}
                onChange={handleChange}
            />
            <InputBox
                type="text"
                name="adresse"
                placeholder={t('ProfilText.adressePlaceholder')}
                value={formData?.adresse}
                onChange={handleChange}
            />

            <InputBox
                type="text"
                name="telephone"
                placeholder={t('ProfilText.telephonePlaceholder')}
                value={formData?.telephone}
                onChange={handleChange}
            />

            <textarea
                name="description"
                value={formData?.description}
                onChange={handleChange}
                className="w-full h-24 rounded-lg border border-gray-100 p-2 resize-none focus:ring-2 focus:ring-blue-500 "
                placeholder={t('ProfilText.descriptionPlaceholder')}
            />

            <div className="flex gap-4">

                {
                    loadinUpdate ? (
                        <button
                            type="submit"
                            className="cursor-pointer rounded-full bg-gradient-to-l from-gray-50 to-green-200 text-white px-4 py-2 hover:bg-green-200"
                        >
                            {t('ProfilText.boutons.enregistrer')}
                        </button>
                    ) : (
                        <LoadingCard />
                    )
                }

                <button
                    type="button"
                    className="cursor-pointer rounded-full bg-gradient-to-l from-red-50 to-gray-200 text-white px-4 py-2 hover:bg-red-200"
                    onClick={() => setIsEditing(false)}
                >
                    {t('ProfilText.boutons.annuler')}

                </button>

            </div>

        </form>
	)
}

export default FormEditProfil;