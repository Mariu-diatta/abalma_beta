import { useEffect, useState } from "react";

export default function VideoPlayer({ file }) {
    const [videoUrl, setVideoUrl] = useState(null);

    useEffect(() => {
        if (!file) return;

        const url = URL.createObjectURL(file);
        setVideoUrl(url);

        return () => URL.revokeObjectURL(url);
    }, [file]);

    if (!file) {
        return <p>Aucune vidéo sélectionnée.</p>;
    }

    return (
        <video
            src={videoUrl}
            controls
            height="auto"
            width="auto"
            style={{ borderRadius: 8 }}
        />
    );
}