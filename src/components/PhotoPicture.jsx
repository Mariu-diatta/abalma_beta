import React, { useRef } from 'react';

const TakePhoto = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const startCamera = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
    };

    const takePhoto = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.drawImage(videoRef.current, 0, 0, 640, 480);
        const imageUrl = canvas.toDataURL('image/png');

        // Télécharger l'image
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = 'photo.png';
        link.click();
    };

    return (
        <div>
            <video ref={videoRef} autoPlay width="640" height="480" />
            <canvas ref={canvasRef} width="640" height="480" style={{ display: 'none' }} />
            <br />
            <button onClick={startCamera}>Démarrer la caméra</button>
            <button onClick={takePhoto}>Prendre une photo</button>
        </div>
    );
};

export default TakePhoto;
