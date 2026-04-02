import React, { useCallback, useEffect, useRef, useState } from "react";
import api from "../services/Axios";
import TitleCompGen from "./TitleComponentGen";


// ─── Utilitaires ──────────────────────────────────────────────────────────────
const getItemsPerView = () => {
    if (window.innerWidth >= 1024) return 4;
    if (window.innerWidth >= 768) return 2;
    return 1;
};

const StarIcon = ({ filled }) => (
    <svg className="tc-star" viewBox="0 0 24 24" fill={filled ? '#f59e0b' : '#e2e8f0'}>
        <path d="M12 2l2.9 6.6 7.1.6-5.3 4.6 1.6 7-6.3-3.7-6.3 3.7 1.6-7L2 9.2l7.1-.6L12 2z" />
    </svg>
);

const Avatar = ({ src, name }) => {
    const [imgError, setImgError] = useState(false);
    const initial = name ? name.charAt(0).toUpperCase() : '?';

    if (!src || imgError) {
        return <div className="tc-avatar-fallback">{initial}</div>;
    }
    return (
        <img
            src={src}
            alt={name || 'Avatar'}
            className="tc-avatar"
            loading="lazy"
            onError={() => setImgError(true)}
        />
    );
};

// ─── Composant principal ──────────────────────────────────────────────────────
export default function TestimonialCarousel({
    autoplay = true,
    autoplayInterval = 5000,
}) {
    const [testimonials, setTestimonials] = useState([]);
    const [index, setIndex] = useState(0);
    const [itemsPerView, setItemsPerView] = useState(getItemsPerView);
    const timerRef = useRef(null);

    const length = testimonials.length;
    const maxIndex = Math.max(0, length - itemsPerView);

    // ── Responsive ──
    useEffect(() => {
        const onResize = () => setItemsPerView(getItemsPerView());
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    // Reset index si hors bornes après resize
    useEffect(() => {
        setIndex((prev) => Math.min(prev, maxIndex));
    }, [maxIndex]);

    // ── Fetch ──
    useEffect(() => {
        api.get('/content/testmony/')
            .then(({ data }) => setTestimonials(data || []))
            .catch(console.error);
    }, []);

    // ── Navigation ──
    const goNext = useCallback(() => {
        setIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, [maxIndex]);

    const goPrev = useCallback(() => {
        setIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
    }, [maxIndex]);

    // ── Autoplay ──
    const stopAutoplay = useCallback(() => {
        if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    }, []);

    const startAutoplay = useCallback(() => {
        if (!autoplay || length <= itemsPerView) return;
        stopAutoplay();
        timerRef.current = setInterval(goNext, autoplayInterval);
    }, [autoplay, autoplayInterval, goNext, length, itemsPerView, stopAutoplay]);

    useEffect(() => {
        startAutoplay();
        return stopAutoplay;
    }, [startAutoplay, stopAutoplay]);

    if (!length) return null;

    return (
        <>
            <section className="tc-root tc-section" aria-label="Témoignages clients">

                {/* Header */}
                <div className="tc-header">
                    <TitleCompGen title={"Développent leur activité avec Abalma"} />
                    <p className="tc-subtitle">Ce que nos utilisateurs disent de nous</p>
                </div>

                {/* Slider */}
                <div
                    className="tc-slider-wrap"
                    onMouseEnter={stopAutoplay}
                    onMouseLeave={startAutoplay}
                >
                    <div className="tc-track-outer">
                        <div
                            className="tc-track"
                            style={{ transform: `translateX(-${(index * 100) / itemsPerView}%)` }}
                            aria-live="polite"
                        >
                            {testimonials.map((item, i) => {
                                const stars = Math.min(5, Math.max(0, parseInt(item?.number_stars ?? 0, 10)));
                                const client = item?.client ?? {};
                                const imgSrc = client?.image || client?.photo_url;
                                const fullName = `${client?.prenom || ''} ${client?.nom || ''}`.trim() || 'Utilisateur';

                                return (
                                    <div
                                        key={item?.id ?? i}
                                        className="tc-card"
                                        style={{ width: `${100 / itemsPerView}%` }}
                                        role="group"
                                        aria-label={`Témoignage de ${fullName}`}
                                    >
                                        <div className="tc-card-inner">
                                            {/* Header carte */}
                                            <div className="tc-card-header">
                                                <Avatar src={imgSrc} name={client?.prenom} />
                                                <div>
                                                    <p className="tc-name">{fullName}</p>
                                                    {client?.nom && (
                                                        <p className="tc-handle">@{client.nom.toLowerCase()}</p>
                                                    )}
                                                    {item?.profession && (
                                                        <span className="tc-profession">{item.profession}</span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Étoiles */}
                                            <div className="tc-stars" aria-label={`${stars} étoiles sur 5`}>
                                                {Array.from({ length: 5 }).map((_, idx) => (
                                                    <StarIcon key={idx} filled={idx < stars} />
                                                ))}
                                            </div>

                                            {/* Contenu */}
                                            <div>
                                                <div className="tc-quote-icon" aria-hidden="true">"</div>
                                                <p className="tc-content">{item?.content}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Boutons navigation */}
                    {length > itemsPerView && (
                        <>
                            <button
                                type="button"
                                className="tc-nav-btn prev"
                                onClick={goPrev}
                                aria-label="Témoignage précédent"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="m15 19-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                type="button"
                                className="tc-nav-btn next"
                                onClick={goNext}
                                aria-label="Témoignage suivant"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="m9 5 7 7-7 7" />
                                </svg>
                            </button>
                        </>
                    )}
                </div>

                {/* Dots */}
                {length > 1 && (
                    <div className="tc-dots" role="tablist" aria-label="Navigation des témoignages">
                        {testimonials.map((_, i) => (
                            <button
                                key={i}
                                type="button"
                                role="tab"
                                aria-selected={i === index}
                                aria-label={`Aller au témoignage ${i + 1}`}
                                className={`tc-dot ${i === index ? 'active' : 'inactive'}`}
                                onClick={() => setIndex(i)}
                            />
                        ))}
                    </div>
                )}
            </section>
        </>
    );
}