import React, { useEffect, useState, useMemo, useRef, lazy } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from 'react-i18next';
import { Eye, ImageOff, ShoppingBag, PlayCircle } from "lucide-react"; // Utilisation de Lucide pour plus de finesse
import OwnerAvatar from "./OwnerProfil";
import ScrollingContent from "./ScrollContain";
import { addMessageNotif } from "../slices/chatSlice";
import { addToCart } from "../slices/cartSlice";
import { getMediaUrl } from "../utils";
import LikeButton from "./LikeButton";

const PrintNumberStars = lazy(() => import("./SystemStar"));

const IMAGE_SLIDE_DELAY = 3500; // ms, inchangé par rapport à l'original

const ProductCard = ({ item, isInCart, owner, openModal }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const variantProduct = useMemo(() => item?.variants || [], [item?.variants]);

    // Diaporama : images + vidéo (si présente) à la suite, comme sur la fiche produit.
    const medias = useMemo(() => ([
        ...variantProduct.map(v => ({ type: "image", url: v.image })),
        ...(item?.video ? [{ type: "video", url: item.video }] : []),
    ]), [variantProduct, item?.video]);

    const [mediaIndex, setMediaIndex] = useState(0);
    const [imageError, setImageError] = useState(false);
    const [isLiked, setIsLiked] = useState(false);

    const currentMedia = medias[mediaIndex] || null;
    const videoHalfTimerRef = useRef(null);

    // Si les données du produit changent (autre item recyclé par la liste), on repart du début.
    useEffect(() => {
        setMediaIndex(0);
        setImageError(false);
    }, [item?.id]);

    const goToNextMedia = () => {
        setMediaIndex((prev) => (medias.length ? (prev + 1) % medias.length : 0));
        setImageError(false);
    };

    // Diaporama automatique fluide pour les IMAGES uniquement.
    useEffect(() => {
        if (medias.length <= 1) return;
        if (currentMedia?.type !== "image") return;

        const timer = setTimeout(goToNextMedia, IMAGE_SLIDE_DELAY);

        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mediaIndex, medias.length, currentMedia?.type]);

    // Nettoyage du timer vidéo dès qu'on quitte ce média (changement d'item,
    // avance manuelle, démontage du composant...).
    useEffect(() => {
        return () => clearTimeout(videoHalfTimerRef.current);
    }, [mediaIndex]);

    // La vidéo doit jouer la MOITIÉ de sa durée réelle avant de passer à
    // l'item suivant (30s par défaut si la durée n'est pas encore connue,
    // ce qui correspond à la moitié du max autorisé de 1 minute).
    const handleVideoLoadedMetadata = (e) => {
        const duration = e.target.duration;
        const halfDurationMs =
            Number.isFinite(duration) && duration > 0
                ? (duration / 2) * 1000
                : 30000;

        clearTimeout(videoHalfTimerRef.current);
        videoHalfTimerRef.current = setTimeout(goToNextMedia, halfDurationMs);
    };

    // Filet de sécurité : si la vidéo se termine avant qu'on ait atteint la
    // moitié programmée (ex: fichier plus court que prévu), on avance quand
    // même plutôt que de rester bloqué sur la dernière frame.
    const handleVideoEnded = () => {
        clearTimeout(videoHalfTimerRef.current);
        goToNextMedia();
    };

    const handleAddToCart = (e) => {
        e.stopPropagation(); // Évite d'ouvrir la modal en cliquant sur le panier
        dispatch(addToCart(item));
        dispatch(addMessageNotif(`Produit ${item?.code_reference} ajouté !`));
    };

    const handleToggleLike = (e) => {
        e.stopPropagation();
        setIsLiked((prev) => !prev);
    };

    return (
        <div
            className={`
                group relative flex flex-col bg-white
                rounded-xl border border-[#dbdbdb] overflow-hidden
                transition-all duration-200 hover:border-[#0095F6]/40 h-full w-full md:max-w-[30vw]
                ${isInCart ? "opacity-75 grayscale-[0.5]" : ""}
            `}
        >
            {/* Image & Modal Trigger */}
            <div className="relative group"> {/* Ajout de group pour l'overlay hover */}

                {/* Badge Quantité */}
                {item?.quantity_product > 0 && (

                    <div className="absolute top-3 left-3 z-20">

                        <p className="bg-white/95 text-[10px] font-semibold px-2 py-1 rounded-full text-[#0095F6] border border-[#dbdbdb]">
                            {item.quantity_product} {t("availability")}
                        </p>

                    </div>
                )}

                {/* Indicateur "vidéo en cours" */}
                {currentMedia?.type === "video" && (
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20">
                        <p className="bg-black/60 backdrop-blur text-[10px] font-semibold px-2.5 py-1 rounded-full text-white flex items-center gap-1">
                            <PlayCircle size={11} />
                            {t("video") || "Vidéo"}
                        </p>
                    </div>
                )}

                {/* Like / favori façon Instagram */}
                <span
                    className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full border-0 flex items-center justify-center transition-transform active:scale-90"
                >
                    <LikeButton
                        contentType="product"
                        objectId={item.id}
                        initialLiked={item.is_liked}
                        initialCount={item.likes_count}
                    />

                </span>

                <div
                    onClick={() => openModal(item)}
                    className="
                        relative
                        w-full
                        h-auto
                        aspect-square
                        overflow-hidden
                        cursor-pointer
                        bg-gray-100
                        transition-all
                        duration-300
                        /* ACTIONS POUR CENTRER : */
                        flex
                        items-center
                        justify-center
                    "
                >
                    {/* Image de fond floutée (uniquement pour les médias image) */}
                    {currentMedia?.type === "image" && currentMedia.url && (
                        <div
                            className="absolute inset-0 bg-cover bg-center blur-sm scale-110 opacity-40 transition-transform duration-500"
                            style={{ backgroundImage: `url(${getMediaUrl(currentMedia.url)})` }}
                        />
                    )}

                    {/* Image principale du produit centrée (avec repli si absente/en erreur) */}
                    {currentMedia?.type === "image" && (
                        currentMedia.url && !imageError ? (
                            <img
                                key={mediaIndex}
                                src={getMediaUrl(currentMedia.url)}
                                alt={item?.name_product || "Produit"}
                                loading="lazy"
                                className="
                                    relative
                                    z-10
                                    /* TAILLE INTELLIGENTE : */
                                    max-w-full 
                                    w-auto
                                    h-auto
                                    object-contain /* Important pour ne pas déformer */
                                    transition-transform
                                    duration-300
                                    ease-in-out
                                    group-hover:scale-105
                                "
                                onError={() => setImageError(true)}
                            />
                        ) : (
                            <div className="relative z-10 flex flex-col items-center justify-center gap-2 text-gray-300">
                                <ImageOff size={32} strokeWidth={1.5} />
                                <span className="text-[10px] font-medium">{t("no_image") || "Image indisponible"}</span>
                            </div>
                        )
                    )}

                    {/* Vidéo : joue en boucle silencieuse et déclenche le passage
                        à l'item suivant uniquement quand elle est terminée
                        (onEnded), pas avant — même si elle dure plus longtemps
                        que le délai des images. */}
                    {currentMedia?.type === "video" && currentMedia.url && (
                        <video
                            key={mediaIndex}
                            src={getMediaUrl(currentMedia.url)}
                            autoPlay
                            muted
                            playsInline
                            onLoadedMetadata={handleVideoLoadedMetadata}
                            onEnded={handleVideoEnded}
                            className="
                                relative
                                z-10
                                max-w-full
                                w-auto
                                h-auto
                                object-contain
                                transition-transform
                                duration-300
                                ease-in-out
                                group-hover:scale-105
                            "
                        />
                    )}

                    {/* Overlay Action Rapide */}
                    <div className="absolute inset-x-0 bottom-4 flex justify-center translate-y-12 group-hover:translate-y-0 transition-transform duration-300 z-20 hidden md:flex">
                        <button className="bg-white/95 px-4 py-2 rounded-full border border-[#dbdbdb] text-xs font-semibold flex items-center justify-center gap-2 text-[#262626] hover:bg-[#fafafa]">
                            <Eye size={16} />
                            <span>{t("voir_details")}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Infos Section */}
            <div className="p-3 flex flex-col flex-grow">
                {/* Vendeur & Stars */}
                <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                        <OwnerAvatar owner={owner} />
                        <span className="text-xs font-medium text-[#262626] truncate">
                            {owner?.nom || t("seller") || "Vendeur"}
                        </span>
                    </div>
                    <div className="scale-90 origin-right shrink-0">
                        <PrintNumberStars productNbViews={item?.view_count} t={t} />
                    </div>
                </div>

                {/* Nom & Description */}
                <div className="flex-grow">
                    <h3 className="text-sm font-semibold text-[#262626] line-clamp-1 mb-1">
                        {item?.name_product || "Sans nom"}
                    </h3>
                    <p className="text-[11px] text-[#8e8e8e] line-clamp-2 leading-relaxed mb-3">
                        {item?.description_product?.toLowerCase()}
                    </p>
                </div>

                {/* Prix & Boutons */}
                <div className="flex justify-between items-center">

                    <ScrollingContent item={item} t={t} qut_sold={item?.quantity_product_sold} />

                    <button

                        title="Ajouter au panier"

                        onClick={(e) => handleAddToCart(e)}

                        className="whitespace-nowrap flex flex-row gap-2 cursor-pointer w-8 h-8 rounded-full border border-[#dbdbdb] items-center justify-center hover:border-[#0095F6] hover:text-[#0095F6] transition-colors"
                    >
                        <ShoppingBag size={15} />
                    </button>

                </div>
            </div>
        </div>
    );
};

export default ProductCard;