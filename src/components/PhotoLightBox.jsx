import React, { useEffect, useMemo, useCallback } from "react";
import {
    X,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

// ─── Lightbox plein écran pour afficher une ou plusieurs photos ────────────
//
// Deux modes d'utilisation :
//
// 1. Galerie multi-photos (comportement d'origine) :
//    <PhotoLightbox
//        photos={[{ image: "url1" }, { image: "url2" }]}
//        index={index}
//        onNavigate={handleNavigate}
//        onClose={handleClose}
//    />
//
// 2. Image unique — plus besoin de tableau, d'index, ni de onNavigate :
//    <PhotoLightbox
//        image={userProfile.image || userProfile?.photo_url}
//        onClose={handleClose}
//    />
//
// `photos` accepte aussi bien un tableau d'objets ({ image, description }),
// qu'un tableau de simples chaînes d'URL, pour rester tolérant.
//
// `subject` (optionnel) affiche en haut plan la photo de l'objet auquel
// appartiennent ces images — profil (avatar rond) ou produit (vignette
// carrée).
// subject = {
//     image: "url de la photo",
//     name: "Nom affiché",
//     subtitle: "texte secondaire optionnel",
//     variant: "circle" | "square"
// }
const PhotoLightbox = ({
    photos,
    image,
    index = 0,
    onClose,
    onNavigate,
    subject,
}) => {

    /**
     * Normalise l'entrée en un tableau unique d'objets { image, description }
     * quel que soit le format fourni :
     * - `image` seule (mode image unique)
     * - `photos` en tableau de chaînes d'URL
     * - `photos` en tableau d'objets { image, ... } (comportement d'origine)
     */
    const normalizedPhotos = useMemo(() => {
        if (image) {
            return [{ image }];
        }

        if (!photos) return [];

        const list = Array.isArray(photos) ? photos : [photos];

        return list
            .filter(Boolean)
            .map((item) =>
                typeof item === "string" ? { image: item } : item
            );
    }, [photos, image]);

    const isGallery = normalizedPhotos.length > 1;

    // En mode image unique (pas de navigation), onNavigate est optionnel :
    // on lui substitue un no-op pour ne jamais planter si on l'appelle quand
    // même (ex. flèches clavier laissées actives par erreur côté parent).
    // useCallback évite de recréer une nouvelle fonction à chaque rendu quand
    // onNavigate n'est pas fourni, ce qui ferait sinon changer la dépendance
    // du useEffect ci-dessous en permanence.
    const handleNavigate = useCallback(
        (direction) => {
            onNavigate?.(direction);
        },
        [onNavigate]
    );

    useEffect(() => {
        const handler = (e) => {
            if (e.key === "Escape") onClose();
            if (isGallery && e.key === "ArrowRight") handleNavigate(1);
            if (isGallery && e.key === "ArrowLeft") handleNavigate(-1);
        };
        document.addEventListener("keydown", handler);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", handler);
            document.body.style.overflow = "";
        };
    }, [onClose, handleNavigate, isGallery]);

    const photo = normalizedPhotos[index] ?? normalizedPhotos[0];
    if (!photo) return null;

    const subjectShapeClass =
        subject?.variant === "square" ? "rounded-lg" : "rounded-full";

    return (
        <div
            className="fixed inset-0 bg-white/90 z-99999 flex items-center justify-center"
            role="dialog"
            aria-modal="true"
            onClick={onClose}
        >
            {/* ─── Bandeau "objet en haut plan" (profil / produit) ─── */}
            {subject && (
                <div
                    className="absolute top-4 left-4 flex items-center gap-3 bg-black/40 backdrop-blur-sm rounded-full pr-4 pl-2 py-2 max-w-[70vw]"
                    onClick={(e) => e.stopPropagation()}
                >
                    {subject.image && (
                        <img
                            src={subject.image}
                            alt={subject.name || ""}
                            className={`w-9 h-9 object-cover flex-shrink-0 border border-white/50 ${subjectShapeClass}`}
                        />
                    )}
                    <div className="min-w-0">
                        {subject.name && (
                            <p className="text-white text-sm font-medium truncate">
                                {subject.name}
                            </p>
                        )}
                        {subject.subtitle && (
                            <p className="text-white/70 text-xs truncate">
                                {subject.subtitle}
                            </p>
                        )}
                    </div>
                </div>
            )}

            <button
                type="button"
                onClick={onClose}
                aria-label="Fermer"
                className="absolute top-4 right-4 text-white"
            >
                <X size={28} />
            </button>

            {isGallery && (
                <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleNavigate(-1); }}
                    aria-label="Photo précédente"
                    className="absolute left-4 text-white"
                >
                    <ChevronLeft size={32} />
                </button>
            )}

            <img
                src={photo.image}
                alt={photo.description || ""}
                onClick={(e) => e.stopPropagation()}
                className="max-h-[90vh] max-w-[90vw] object-contain"
            />

            {isGallery && (
                <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleNavigate(1); }}
                    aria-label="Photo suivante"
                    className="absolute right-4 text-white"
                >
                    <ChevronRight size={32} />
                </button>
            )}

            {isGallery && (
                <span className="absolute bottom-4 text-white text-sm">
                    {index + 1} / {normalizedPhotos.length}
                </span>
            )}
        </div>
    );
};

export default PhotoLightbox;