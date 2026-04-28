import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';

const FormElementFileUpload = ({
    label = "Uploader une image",
    onFileSelect,
    getFile,
    maxSizeMB = 5, // Limite de taille par défaut
    getImage,
    multiple = false, // Ajout d'une prop pour activer multi-upload
    imageLoaded
}) => {
    const [previewUrls, setPreviewUrls] = useState([]);
    const [fileNames, setFileNames] = useState([]);
    const [error, setError] = useState(null);
    const { t } = useTranslation();

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);

        if (files.length === 0) return;

        const validFiles = [];
        const previews = [];
        const names = [];

        for (let file of files) {
            const fileSizeMB = file.size / (1024 * 1024);
            if (fileSizeMB > maxSizeMB) {
                setError(`Le fichier ${file.name} dépasse la taille maximale de ${maxSizeMB} Mo.`);
                continue;
            }
            validFiles.push(file);
            previews.push(URL.createObjectURL(file));
            names.push(file.name);
        }

        if (validFiles.length === 0) {
            setPreviewUrls([]);
            setFileNames([]);
            getFile && getFile(null);
            onFileSelect && onFileSelect(null);
            return;
        }

        setError(null);
        setPreviewUrls(previews);
        setFileNames(names);

        getImage && getImage(previews); // retourne un tableau d’URLs
        getFile && getFile(validFiles); // retourne un tableau de fichiers
        onFileSelect && onFileSelect(validFiles);
    };

    // Nettoyage des URLs après démontage
    useEffect(() => {
        return () => {
            previewUrls.forEach(url => URL.revokeObjectURL(url));
        };
    }, [previewUrls]);

    return (
        <div className="max-w-md px-4 rounded-lg">

            <div className="mb-4">
                <label htmlFor="file-upload" className="block text-sm mb-2">
                    {label} <span className="text-red-500">*</span>
                </label>

                <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    multiple={multiple}
                    onChange={handleImageUpload}
                    className="block w-full text-sm text-gray-700 pb-1
                        file:mr-4 file:py-2 file:px-4
                        file:rounded file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-300 file:text-blue-700
                        hover:file:bg-blue-500
                        dark:file:text-white"
                    required
                />
            </div>

            {fileNames.length > 0 && imageLoaded && !error && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    {t("uploadedFile")} : <strong>{fileNames.join(", ")}</strong>
                </p>
            )}

            {error && (
                <p className="text-sm text-red-600 dark:text-red-400 mb-2">{error}</p>
            )}

            {previewUrls?.length > 0 && imageLoaded && !error && (
                <div className="mt-4 flex gap-2 flex-wrap">
                    {previewUrls?.map((url, idx) => (
                        <img
                            key={idx}
                            src={url}
                            alt={`Aperçu ${idx + 1}`}
                            className="w-32 h-32 rounded border border-gray-300 shadow object-cover"
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default FormElementFileUpload;