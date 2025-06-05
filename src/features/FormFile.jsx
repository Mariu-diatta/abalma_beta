import React, { useState, useEffect } from "react";

const FormElementFileUpload = ({
    label = "Uploader une image",
    onFileSelect,
    getFile,
    maxSizeMB = 5 // Limite de taille par défaut
}) => {
    const [previewUrl, setPreviewUrl] = useState(null);
    const [fileName, setFileName] = useState(null);
    const [error, setError] = useState(null);

    const handleImageUpload = (e) => {

        const file = e.target.files[0];

        if (!file) return;

        // Vérifie la taille du fichier
        const fileSizeMB = file.size / (1024 * 1024);

        if (fileSizeMB > maxSizeMB) {

            setError(`Le fichier dépasse la taille maximale de ${maxSizeMB} Mo.`);

            setPreviewUrl(null);

            setFileName(null);

            getFile(null);

            return;
        }

        setError(null); // Clear errors

        const url = URL.createObjectURL(file);

        setPreviewUrl(url);

        setFileName(file.name);

        getFile && getFile(file);

        onFileSelect && onFileSelect(file);
    };

    // Nettoyage de l’URL après démontage
    useEffect(() => {

        return () => {

            if (previewUrl) {

                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    return (
        <div className="max-w-md p-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
            <div className="mb-4">
                <label
                    htmlFor="file-upload"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
                >
                    {label}
                </label>

                <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="block w-full text-sm text-gray-700 dark:text-gray-300
                        file:mr-4 file:py-2 file:px-4
                        file:rounded file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100
                        dark:file:bg-gray-700 dark:file:text-white"
                />
            </div>

            {fileName && !error && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Fichier sélectionné : <strong>{fileName}</strong>
                </p>
            )}

            {error && (
                <p className="text-sm text-red-600 dark:text-red-400 mb-2">
                    {error}
                </p>
            )}

            {previewUrl && !error && (
                <div className="mt-4">
                    <img
                        src={previewUrl}
                        alt="Aperçu de l'image sélectionnée"
                        className="w-32 h-32 rounded border border-gray-300 shadow object-cover"
                    />
                </div>
            )}
        </div>
    );
};

export default FormElementFileUpload;
