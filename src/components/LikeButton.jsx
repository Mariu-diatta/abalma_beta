// components/LikeButton.jsx
import { useState } from "react";
import { toggleLike } from "../services/apiEndpoints";
import { useSelector } from 'react-redux';
import { Heart } from "lucide-react"; // Utilisation de Lucide pour plus de finesse


export default function LikeButton({ contentType, objectId, initialLiked, initialCount}) {
    const [liked, setLiked] = useState(initialLiked);
    const [count, setCount] = useState(initialCount);
    const [loading, setLoading] = useState(false);
    const currentUser = useSelector((state) => state.auth.user);

    const handleClick = async () => {
        if (loading) return;

        // Mise à jour optimiste : on change l'UI avant la réponse serveur
        const prevLiked = liked;
        const prevCount = count;

        setLiked(!liked);
        setCount(liked ? count - 1 : count + 1);
        setLoading(true);

        try {
            const result = await toggleLike(contentType, objectId);
            // On synchronise avec la vraie valeur serveur (au cas où)
            setLiked(result.liked);
            setCount(result.likes_count);
        } catch (err) {
            // Rollback si erreur
            console.log(err)
            setLiked(prevLiked);
            setCount(prevCount);
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleClick}
            disabled={loading || !currentUser} className={ `
            cursor-pointer flex gap-1 items-center
            disabled:cursor-not-allowed
            disabled:text-gray-500 ${liked ? "liked" : " "}`}
        >

            <Heart
                size={20}
                strokeWidth={0.5}
                className={liked ? "text-[#ED4956]" : "text-[#262626]"}
                fill={liked ? "#ED4956" : "none"}
            />{count}

        </button>
    );
}