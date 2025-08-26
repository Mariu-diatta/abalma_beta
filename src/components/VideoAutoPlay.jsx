import { useEffect, useRef } from "react";

/**
 * AutoPlayVideo
 * - Joue quand la vidéo est (suffisamment) visible à l'écran
 * - Met en pause quand elle sort du viewport
 * - Compatible mobile (muted + playsInline)
 */
export default function AutoPlayVideo({
    src,
    poster,
    className,
    threshold = 0.6,   // % de surface visible pour déclencher
    rootMargin = "0px",
    loop = true,
    preload = "metadata",
}) {
    const videoRef = useRef(null);

    useEffect(() => {
        const el = videoRef.current;
        if (!el) return;

        // Sécurité: forcer les conditions d’autoplay
        el.muted = true;
        el.playsInline = true;

        let cleanupScrollFallback;

        // 1) Méthode moderne: IntersectionObserver
        if ("IntersectionObserver" in window) {
            const io = new IntersectionObserver(
                (entries) => {
                    entries.forEach(async (entry) => {
                        // Assez visible ? On joue, sinon on met en pause
                        if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
                            try {
                                await el.play();
                            } catch {
                                // Certains navigateurs peuvent encore bloquer, on ignore l’erreur
                            }
                        } else {
                            el.pause();
                        }
                    });
                },
                { root: null, rootMargin, threshold: buildThresholdList(threshold) }
            );
            io.observe(el);
            return () => io.disconnect();
        }

        // 2) Fallback anciens navigateurs: on écoute le scroll
        const onScroll = () => {
            const rect = el.getBoundingClientRect();
            const vpH = window.innerHeight || document.documentElement.clientHeight;
            const visiblePx = Math.max(
                0,
                Math.min(rect.bottom, vpH) - Math.max(rect.top, 0)
            );
            const ratio = visiblePx / Math.max(1, rect.height);
            if (ratio >= threshold) {
                el.play().catch(() => { });
            } else {
                el.pause();
            }
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        cleanupScrollFallback = () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
        };
        return cleanupScrollFallback;
    }, [threshold, rootMargin]);

    return (
        <video
            ref={videoRef}
            className={className}
            src={src}
            poster={poster}
            preload={preload}
            loop={loop}
            // Important pour iOS/Android
            muted
            playsInline
            // Optionnel: si tu veux autoriser l’utilisateur à reprendre la main
            controls={false}
        />
    );
}

// Helper: créer une liste de thresholds pour des déclenchements fiables
function buildThresholdList(target) {
    // Exemple: si threshold=0.6 → [0, 0.1, 0.2, ..., 0.9, 1]
    const steps = 10;
    const list = [];
    for (let i = 0; i <= steps; i++) list.push(i / steps);
    // On s'assure que le threshold demandé est inclus
    if (!list.includes(target)) list.push(target);
    return list.sort((a, b) => a - b);
}
