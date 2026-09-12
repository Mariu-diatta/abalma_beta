import React, { useState, useCallback } from "react";
import { Share2, Facebook, Twitter, MessageCircle, Send, Copy, Check } from "lucide-react";

/**
 * Bouton de partage.
 *
 * - Sur mobile / navigateurs compatibles : utilise l'API Web Share native
 *   (navigator.share) → ouvre le menu de partage natif du téléphone
 *   (WhatsApp, Instagram, SMS, Mail, etc. — tout ce que l'utilisateur a installé).
 * - Sinon (desktop, navigateurs non compatibles) : affiche un petit menu
 *   avec des liens de partage directs vers chaque réseau + copie du lien.
 *
 * Props :
 *  - url    : l'URL de la page à partager (ex. la page produit)
 *  - title  : le titre à partager (ex. nom du produit)
 *  - text   : un texte optionnel (ex. description courte)
 */
const ShareButton = ({ url, title, text = "" }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    /**
     * Détecte si l'API Web Share native est disponible.
     * C'est le cas sur la plupart des navigateurs mobiles (Chrome Android,
     * Safari iOS) mais rarement sur desktop.
     */
    const supportsNativeShare =
        typeof navigator !== "undefined" && !!navigator.share;

    /**
     * Déclenche le partage natif du système d'exploitation.
     * shareData est reconstruit ici, à l'intérieur du callback, pour ne
     * dépendre que de url/title/text (des primitives stables) plutôt que
     * d'un objet recréé à chaque rendu.
     */
    const handleNativeShare = useCallback(async () => {
        const shareData = { title, text, url };
        try {
            await navigator.share(shareData);
        } catch (err) {
            // L'utilisateur a annulé le partage, ou erreur silencieuse — pas grave
            if (err?.name !== "AbortError") {
                console.error("Erreur de partage :", err);
            }
        }
    }, [url, title, text]);

    /**
     * Copie le lien dans le presse-papiers (fallback universel)
     */
    const handleCopyLink = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Impossible de copier le lien :", err);
        }
    }, [url]);

    /**
     * Ouvre le bouton principal : natif si dispo, sinon ouvre le menu de fallback
     */
    const handleMainClick = () => {
        if (supportsNativeShare) {
            handleNativeShare();
        } else {
            setMenuOpen((open) => !open);
        }
    };

    // Liens de partage classiques par réseau (fallback desktop)
    const encodedUrl = encodeURIComponent(url);
    const encodedText = encodeURIComponent(text || title);

    const shareLinks = [
        {
            name: "Facebook",
            icon: Facebook,
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        },
        {
            name: "Twitter / X",
            icon: Twitter,
            href: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
        },
        {
            name: "WhatsApp",
            icon: MessageCircle,
            href: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
        },
        {
            name: "Telegram",
            icon: Send,
            href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
        },
    ];

    return (
        <div className="relative inline-block">
            <button
                onClick={handleMainClick}
                aria-label="Partager"
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white shadow-sm hover:shadow-md transition"
            >
                <Share2 className="w-4 h-4" />
                <span className="text-sm font-medium">Partager</span>
            </button>

            {/* Menu de fallback — uniquement si l'API native n'est pas dispo */}
            {menuOpen && !supportsNativeShare && (
                <div className="absolute top-full mt-2 right-0 bg-white rounded-xl shadow-lg border border-gray-100 p-2 z-50 min-w-[180px]">
                    {shareLinks.map(({ name, icon: Icon, href }) => (
                        <a
                            key={name}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-sm text-gray-700"
                            onClick={() => setMenuOpen(false)}
                        >
                            <Icon className="w-4 h-4" />
                            {name}
                        </a>
                    ))}

                    <button
                        onClick={handleCopyLink}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-sm text-gray-700"
                    >
                        {copied ? (
                            <Check className="w-4 h-4 text-green-600" />
                        ) : (
                            <Copy className="w-4 h-4" />
                        )}
                        {copied ? "Lien copié !" : "Copier le lien"}
                    </button>
                </div>
            )}
        </div>
    );
};

export default ShareButton;