import React, { useState, useRef, useEffect } from 'react';
import OwnerPopover from './OwnerPopover';

// ─── Utilitaire : hash SHA-256 ────────────────────────────────────────────────
export async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
}

// ─── Icône utilisateur ────────────────────────────────────────────────────────
const UserIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd"
            d="M12 20a7.966 7.966 0 0 1-5.002-1.756l.002.001v-.683c0-1.794 1.492-3.25 3.333-3.25h3.334c1.84 0 3.333 1.456 3.333 3.25v.683A7.966 7.966 0 0 1 12 20ZM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10c0 5.5-4.44 9.963-9.932 10h-.138C6.438 21.962 2 17.5 2 12Zm10-5c-1.84 0-3.333 1.455-3.333 3.25S10.159 13.5 12 13.5c1.84 0 3.333-1.455 3.333-3.25S13.841 7 12 7Z"
        />
    </svg>
);

// ─── Composant ────────────────────────────────────────────────────────────────
const OwnerAvatar = ({ owner }) => {
    const [showPopover, setShowPopover] = useState(false);
    const wrapRef = useRef(null);

    // Fermeture au clic extérieur
    useEffect(() => {
        if (!showPopover) return;
        const handler = (e) => {
            if (wrapRef.current && !wrapRef.current.contains(e.target)) {
                setShowPopover(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [showPopover]);

    // Fermeture à Escape
    useEffect(() => {
        if (!showPopover) return;
        const handler = (e) => { if (e.key === 'Escape') setShowPopover(false); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [showPopover]);

    if (!owner) return null;

    const hasImage = !!(owner?.image || owner?.photo_url);
    const imageSrc = owner?.image || owner?.photo_url;
    const displayName = owner?.nom || 'Utilisateur';
    const toggle = () => setShowPopover((prev) => !prev);

    return (
        <>
            <div className="z-0 oa-wrap" ref={wrapRef}>

                {showPopover && (
                    <OwnerPopover
                        owner={owner}
                        onClose={() => setShowPopover(false)}
                    />
                )}

                {hasImage ? (
                    <img
                        src={imageSrc}
                        alt={displayName}
                        title={displayName}
                        className="oa-img"
                        onClick={toggle}
                        onKeyDown={(e) => e.key === 'Enter' && toggle()}
                        tabIndex={0}
                        role="button"
                        aria-label={`Voir le profil de ${displayName}`}
                        aria-expanded={showPopover}
                    />
                ) : (
                    <div
                        className="oa-svg"
                        title={displayName}
                        onClick={toggle}
                        onKeyDown={(e) => e.key === 'Enter' && toggle()}
                        tabIndex={0}
                        role="button"
                        aria-label={`Voir le profil de ${displayName}`}
                        aria-expanded={showPopover}
                    >
                        <UserIcon />
                    </div>
                )}

                {owner?.is_connected && (
                    <span className="oa-online" aria-label="En ligne" title="En ligne" />
                )}
            </div>
        </>
    );
};

export default OwnerAvatar;