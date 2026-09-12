import React, { useState, useMemo, useCallback } from "react";
import PhotoLightbox from "./PhotoLightBox";

// ─── Miniature cliquable qui ouvre PhotoLightbox au clic ───────────────────
//
// Gère tout l'état d'ouverture/fermeture et de navigation en interne :
// le composant parent n'a qu'à afficher <PhotoLightboxTrigger />, sans state
// à gérer lui-même.
//
// Mode image unique :
//    <PhotoLightboxTrigger
//        image={userProfile.image || userProfile?.photo_url}
//        alt="Photo de profil"
//    />
//
// Mode galerie :
//    <PhotoLightboxTrigger
//        photos={post.photos}   // tableau d'objets { image, description } ou de chaînes
//        alt="Photo du post"
//    />
//
// `subject`, `thumbnailClassName` sont optionnels — voir props ci-dessous.
const PhotoLightboxTrigger = ({
    photos,
    image,
    subject,
    alt = "",
    thumbnailClassName = "w-full h-full object-cover cursor-pointer",
}) => {
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(0);

    /**
     * Même normalisation que dans PhotoLightbox, pour connaître :
     * - la source de la miniature à afficher avant ouverture
     * - le nombre total de photos (pour boucler la navigation)
     */
    const normalizedPhotos = useMemo(() => {
        if (image) return [{ image }];
        if (!photos) return [];

        const list = Array.isArray(photos) ? photos : [photos];

        return list
            .filter(Boolean)
            .map((item) => (typeof item === "string" ? { image: item } : item));
    }, [photos, image]);

    const thumbnailSrc = normalizedPhotos[0]?.image;

    const handleOpen = useCallback(() => {
        setIndex(0);
        setOpen(true);
    }, []);

    const handleClose = useCallback(() => {
        setOpen(false);
    }, []);

    /**
     * Navigation circulaire : après la dernière photo on revient à la
     * première, et inversement.
     */
    const handleNavigate = useCallback((direction) => {
        setIndex((current) => {
            const total = normalizedPhotos.length;
            if (total === 0) return current;
            return (current + direction + total) % total;
        });
    }, [normalizedPhotos.length]);

    if (!thumbnailSrc) return null;

    return (
        <>
            <img
                src={thumbnailSrc || ""}
                alt={alt}
                onClick={handleOpen}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") handleOpen();
                }}
                className={thumbnailClassName}
            />

            {open && (
                <PhotoLightbox
                    photos={photos}
                    image={image}
                    index={index}
                    onNavigate={handleNavigate}
                    onClose={handleClose}
                    subject={subject}
                />
            )}
        </>
    );
};

export default PhotoLightboxTrigger;