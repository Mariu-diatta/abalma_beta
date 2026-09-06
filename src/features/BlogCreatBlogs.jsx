import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import api from '../services/Axios';
import { API_ENDPOINTS } from "../services/apiEndpoints";
import { useTranslation } from 'react-i18next';
import { updateContentBlog } from '../slices/cartSlice';
import LoadingCard from '../components/LoardingSpin';
import ButtonCreatBlog from '../components/ButtonBlogCreat';
import { useCallback } from 'react';
import UseVideo from './UseVideo';
import { showMessage } from '../components/AlertMessage';



// ─── Constantes ────────────────────────────────────────────────────────────────
const MAX_PHOTOS = 10;
const MAX_PHOTO_SIZE = 8 * 1024 * 1024; // 8 Mo, aligné sur MAX_PHOTO_SIZE du serializer
const ALLOWED_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// ─── Composant ────────────────────────────────────────────────────────────────
export const ModalFormCreatBlog = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [videoFile, setVideoFile] = useState(null);
    const [images, setImages] = useState([]); // File[]
    const [imagePreviews, setImagePreviews] = useState([]); // object URLs
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const modalRef = useRef(null);
    const inputRef = useRef(null);

    const MAX_MESSAGE = 500;

    const clearImagePreviews = useCallback(() => {
        setImagePreviews((prev) => {
            prev.forEach((url) => URL.revokeObjectURL(url));
            return [];
        });
    }, []);

    const resetForm = useCallback(() => {
        setTitle('');
        setMessage('');
        setError('');
        setSuccess('');
        setImages([]);
        clearImagePreviews();
    }, [clearImagePreviews]);

    const handleClose = useCallback(() => {
        setIsOpen(false);
        resetForm();
    }, [resetForm]);

    // ── Focus auto à l'ouverture ──
    useEffect(() => {
        if (isOpen) setTimeout(() => inputRef.current?.focus(), 50);
    }, [isOpen]);

    // ── Fermeture au clic extérieur ──
    useEffect(() => {
        if (!isOpen) return;
        const handler = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) handleClose();
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [isOpen, handleClose]);

    // ── Fermeture à Escape ──
    useEffect(() => {
        if (!isOpen) return;
        const handler = (e) => { if (e.key === 'Escape') handleClose(); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [isOpen, handleClose]);

    // ── Lock scroll du body quand le modal est ouvert ──
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    // ── Libère les URLs d'aperçu au démontage du composant ──
    useEffect(() => {
        return () => clearImagePreviews();
    }, [clearImagePreviews]);

    const handleOpen = () => {
        resetForm();
        setIsOpen(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleImagesChange = (e) => {
        const files = Array.from(e.target.files || []);
        e.target.value = ''; // permet de re-sélectionner le même fichier plus tard

        if (!files.length) return;

        setError('');

        if (images.length + files.length > MAX_PHOTOS) {
            setError(
                t('blog.too_many_photos', { max: MAX_PHOTOS }) ||
                `Maximum ${MAX_PHOTOS} photos par article.`
            );
            return;
        }

        const validFiles = [];
        for (const file of files) {
            if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
                setError(t('blog.invalid_photo_type') || `Format non supporté : ${file.name}`);
                continue;
            }
            if (file.size > MAX_PHOTO_SIZE) {
                setError(t('blog.photo_too_large') || `${file.name} dépasse 8 Mo.`);
                continue;
            }
            validFiles.push(file);
        }

        if (!validFiles.length) return;

        setImages((prev) => [...prev, ...validFiles]);
        setImagePreviews((prev) => [
            ...prev,
            ...validFiles.map((file) => URL.createObjectURL(file)),
        ]);
    };

    const handleRemoveImage = (index) => {
        setImagePreviews((prev) => {
            URL.revokeObjectURL(prev[index]);
            return prev.filter((_, i) => i !== index);
        });
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!title.trim() || !message.trim()) {
            setError(t('blog.fill_all_fields') || 'Veuillez remplir tous les champs.');
            return;
        }

        setLoading(true);

        try {
            // FormData nécessaire dès qu'on envoie des fichiers (video, images) en
            // plus des champs texte — le backend lit request.FILES.get("video")
            // et request.FILES.getlist("images").
            const formData = new FormData();
            formData.append('title_blog', title);
            formData.append('blog_message', message);

            if (!!videoFile) {
                formData.append('video', videoFile);
                formData.append('video_duration', String(60));
            }

            images.forEach((file) => {
                formData.append('images', file);
            });

            const { data } = await api.post(API_ENDPOINTS.BLOG.CREATE, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            dispatch(updateContentBlog(data));
            setSuccess(t('blog.blog_created') || 'Blog créé avec succès !');
            showMessage(dispatch, {
                Type: "Message",
                Message: t('blog.blog_created')
            });
            resetForm();
            setTimeout(handleClose, 1500);

        } catch (err) {

            const messageError = err?.response?.data?.detail ||
                err?.response?.data?.images ||
                t('blog.error_creating') ||
                'Erreur lors de la création du blog.'
            console.log("erreur::", err)

            setError(
                messageError
            );

            showMessage(dispatch, {
                Type: "Erreur",
                Message: messageError
            });

        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="blog-modal-root overflow-y-auto min-h-[100dvh] py-[2dvh] scrollbar-hidden">

                {/* Bouton déclencheur */}
                <ButtonCreatBlog handleToggleModal={handleOpen} isOpen={isOpen} />

                {/* Modal */}
                {isOpen && (
                    <div
                        className="blog-overlay min-h-[100dvh] py-5"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="blog-modal-title"
                    >
                        <div ref={modalRef} className="blog-panel overflow-y-auto min-h-[100dvh] py-[2dvh] scrollbar-hidden">

                            {/* Header */}
                            <div className="blog-header">
                                <h2 id="blog-modal-title" className="blog-title">
                                    <span className="blog-title-icon">✍</span>
                                    {t('blog.create_blog')}
                                </h2>
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="blog-close-btn"
                                    aria-label={t('blog.close_modal') || 'Fermer'}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Corps */}
                            <form className="blog-body" onSubmit={handleSubmit}>

                                {/* Titre */}
                                <div>
                                    <label htmlFor="blog-title" className="blog-label">
                                        {t('blog.title_pop')}
                                    </label>
                                    <input
                                        id="blog-title"
                                        ref={inputRef}
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="blog-input"
                                        placeholder={t('blog.title_placeholder') || 'Titre du blog'}
                                        required
                                        maxLength={120}
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label htmlFor="blog-message" className="blog-label">
                                        {t('blog.description')}
                                    </label>
                                    <textarea
                                        id="blog-message"
                                        rows="5"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        className="blog-textarea"
                                        placeholder={t('blog.description_placeholder') || 'Contenu du blog…'}
                                        required
                                        maxLength={MAX_MESSAGE}
                                    />
                                    <p className="blog-char-count">{message.length}/{MAX_MESSAGE}</p>
                                </div>

                                {/* Photos (optionnelles, plusieurs possibles) */}
                                <div>
                                    <label htmlFor="blog-images" className="blog-label">
                                        {t('blog.photos_optional') || 'Photos (optionnel)'}
                                    </label>
                                    <input
                                        id="blog-images"
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        multiple
                                        onChange={handleImagesChange}
                                        className="blog-input"
                                        disabled={images.length >= MAX_PHOTOS}
                                    />
                                    <p className="blog-char-count">
                                        {images.length}/{MAX_PHOTOS}
                                    </p>

                                    {imagePreviews.length > 0 && (
                                        <div
                                            style={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                gap: '8px',
                                                marginTop: '10px',
                                            }}
                                        >
                                            {imagePreviews.map((url, index) => (
                                                <div key={url} style={{ position: 'relative' }}>
                                                    <img
                                                        src={url}
                                                        alt={`Aperçu ${index + 1}`}
                                                        style={{
                                                            width: '72px',
                                                            height: '72px',
                                                            objectFit: 'cover',
                                                            borderRadius: '8px',
                                                        }}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveImage(index)}
                                                        aria-label={t('blog.remove_image') || 'Retirer'}
                                                        style={{
                                                            position: 'absolute',
                                                            top: '-6px',
                                                            right: '-6px',
                                                            width: '20px',
                                                            height: '20px',
                                                            borderRadius: '50%',
                                                            border: 'none',
                                                            background: '#000',
                                                            color: '#fff',
                                                            fontSize: '12px',
                                                            lineHeight: '20px',
                                                            cursor: 'pointer',
                                                        }}
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Feedback */}
                                {error && (
                                    <div className="blog-feedback error" role="alert">
                                        <span>⚠️</span> {error}
                                    </div>
                                )}
                                {success && (
                                    <div className="blog-feedback success" role="status">
                                        <span>✅</span> {success}
                                    </div>
                                )}

                                {/* Footer dans le form pour que le submit button fonctionne */}
                                <div className="blog-footer" style={{ margin: '0 -24px -22px', borderRadius: '0 0 20px 20px' }}>
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        className="blog-cancel-btn"
                                    >
                                        {t('blog.cancel')}
                                    </button>

                                    {loading ? (
                                        <LoadingCard />
                                    ) : (
                                        <button
                                            type="submit"
                                            className="blog-submit-btn"
                                            disabled={!title.trim() || !message.trim()}
                                        >
                                            {t('blog.submit')}
                                        </button>
                                    )}
                                </div>

                                {/* Vidéo (optionnelle) */}
                                <div>
                                    {/*<label className="blog-label">*/}
                                    {/*    {t('blog.video_optional') || 'Vidéo (optionnel)'}*/}
                                    {/*</label>*/}
                                    <UseVideo getVideoSelected={setVideoFile} />
                                </div>

                            </form>

                        </div>
                    </div>
                )}
            </div>
        </>
    );
};