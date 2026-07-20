import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
    FiVideo,
    FiUpload,
    FiTrash2,
    FiRefreshCw,
    FiX,
    FiCheck,
    FiSquare,
    FiCircle,
    FiDownload,
} from "react-icons/fi";
import useVideoProcessor from "./VideoProcessor";

const MAX_RECORD_SECONDS = 60; // aligné sur la limite affichée "Durée maximale : 1 minute"
const MAX_VIDEO_SIZE_BYTES = 20 * 1024 * 1024; // 20 Mo

export default function VideoUploader({ onVideoSelected }) {
    const inputRef = useRef(null);
    const liveVideoRef = useRef(null);

    const streamRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);
    const recordTimerRef = useRef(null);

    const [open, setOpen] = useState(false);
    const [video, setVideo] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [recordSeconds, setRecordSeconds] = useState(0);

    const { processVideo, processing } = useVideoProcessor();

    const formatSize = (bytes) => {
        if (bytes < 1024 * 1024)
            return `${(bytes / 1024).toFixed(1)} KB`;

        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const formatDuration = (seconds) => {
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);

        return `${min} min ${sec < 10 ? "0" : ""}${sec} s`;
    };

    // ── Pipeline commun "fichier vidéo brut -> compressé/optimisé -> prêt"
    // (identique à ce que faisait handleChange avant, juste extrait pour
    // être réutilisé par l'enregistrement webcam sans rien dupliquer)
    const finalizeVideoFile = (file) => {

        const url = URL.createObjectURL(file);

        const videoElement = document.createElement("video");

        videoElement.preload = "metadata";


        videoElement.onloadedmetadata = async () => {


            URL.revokeObjectURL(url);


            // Si la vidéo respecte déjà les limites (≤ 60s et ≤ 20 Mo), inutile
            // de la découper/recompresser : on garde le fichier original tel quel.
            const isAlreadyOptimal =
                videoElement.duration <= MAX_RECORD_SECONDS &&
                file.size <= MAX_VIDEO_SIZE_BYTES;

            const processedFile = isAlreadyOptimal
                ? file
                : await processVideo(file);


            const processedUrl = URL.createObjectURL(
                processedFile
            );


            const previewVideo =
                document.createElement("video");


            previewVideo.src = processedUrl;


            previewVideo.onloadedmetadata = () => {


                setVideo({

                    file: processedFile,

                    url: processedUrl,

                    duration: previewVideo.duration

                });


                onVideoSelected(processedFile, previewVideo.duration);

            };

        };


        videoElement.src = url;
    };

    const handleChange = async (e) => {

        const file = e.target.files[0];

        if (!file) return;


        if (!file.type.startsWith("video/")) {
            alert("Veuillez sélectionner une vidéo.");
            return;
        }

        finalizeVideoFile(file);

    };

    const removeVideo = () => {
        if (video) URL.revokeObjectURL(video.url);

        setVideo(null);
        onVideoSelected(null, null);

        if (inputRef.current) inputRef.current.value = "";
    };

    // ── ENREGISTREMENT WEBCAM ──────────────────────────────────────────
    const stopStreamTracks = () => {
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
    };

    const pickSupportedMimeType = () => {
        const candidates = [
            "video/webm;codecs=vp9,opus",
            "video/webm;codecs=vp8,opus",
            "video/webm",
            "video/mp4",
        ];

        return candidates.find(
            (type) => window.MediaRecorder?.isTypeSupported?.(type)
        ) || "video/webm";
    };

    const stopRecording = () => {
        // déclenche recorder.onstop, qui finalise et lance la compression
        mediaRecorderRef.current?.stop();
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });

            streamRef.current = stream;

            chunksRef.current = [];

            const mimeType = pickSupportedMimeType();
            const recorder = new MediaRecorder(stream, { mimeType });
            mediaRecorderRef.current = recorder;

            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            recorder.onstop = () => {
                stopStreamTracks();
                clearInterval(recordTimerRef.current);
                setIsRecording(false);
                setRecordSeconds(0);

                const blob = new Blob(chunksRef.current, { type: mimeType });
                const extension = mimeType.includes("mp4") ? "mp4" : "webm";
                const file = new File(
                    [blob],
                    `enregistrement-${Date.now()}.${extension}`,
                    { type: mimeType }
                );

                // même pipeline de compression/optimisation que pour un upload
                finalizeVideoFile(file);
            };

            recorder.start();
            setIsRecording(true);
            setRecordSeconds(0);

            recordTimerRef.current = setInterval(() => {
                setRecordSeconds((s) => {
                    if (s + 1 >= MAX_RECORD_SECONDS) {
                        stopRecording();
                        return MAX_RECORD_SECONDS;
                    }
                    return s + 1;
                });
            }, 1000);

        } catch (err) {
            alert("Impossible d'accéder à la caméra/micro.");
        }
    };

    const cancelRecording = () => {
        clearInterval(recordTimerRef.current);
        chunksRef.current = [];

        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
            // onstop ne doit pas finaliser une vidéo dans ce cas précis
            mediaRecorderRef.current.onstop = () => {
                stopStreamTracks();
            };
            mediaRecorderRef.current.stop();
        } else {
            stopStreamTracks();
        }

        setIsRecording(false);
        setRecordSeconds(0);
    };

    const closePopover = () => {
        // on ne supprime pas la vidéo déjà sélectionnée en fermant,
        // seulement si l'utilisateur clique explicitement sur "Supprimer"
        if (isRecording) cancelRecording();
        setOpen(false);
    };

    // ⚠️ Le <video> live n'existe dans le DOM que lorsque isRecording=true
    // (rendu conditionnel). On ne peut donc lui assigner le flux caméra
    // qu'APRÈS ce rendu, pas juste après getUserMedia() dans startRecording()
    // (à ce moment-là, liveVideoRef.current vaut encore null).
    useEffect(() => {
        if (isRecording && liveVideoRef.current && streamRef.current) {
            liveVideoRef.current.srcObject = streamRef.current;
            liveVideoRef.current.play().catch(() => { });
        }
    }, [isRecording]);

    return (
        <>
            {/* TRIGGER */}
            <button
                type="button"
                onClick={() => setOpen(true)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium shadow-sm transition-all duration-200 hover:shadow-md active:scale-95 ${video
                    ? "bg-indigo-50 text-indigo-600 border border-indigo-200 hover:bg-indigo-100"
                    : "bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600"
                    }`}
            >
                <FiVideo size={18} />
                {video ? "Modifier la vidéo" : "Ajouter une vidéo"}
            </button>

            {/* POPOVER */}
            {open && createPortal(
                <div
                    className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/50 backdrop-blur-sm px-2"
                    onMouseDown={(e) => e.stopPropagation()}
                >

                    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-5 md:p-6 relative">

                        {/* CLOSE */}
                        <button
                            onClick={closePopover}
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-lg"
                            aria-label="Fermer"
                        >
                            <FiX size={18} />
                        </button>

                        <h2 className="text-lg md:text-xl font-semibold mb-4 border-b border-gray-200 pb-2">
                            Vidéo
                        </h2>

                        <input
                            ref={inputRef}
                            hidden
                            type="file"
                            accept="video/*"
                            onChange={handleChange}
                        />

                        {processing ? (
                            <div className="upload-box">
                                <FiVideo size={45} />

                                <h3>Optimisation de la vidéo...</h3>

                                <p>
                                    Découpage à 1 minute
                                    <br />
                                    Compression en cours
                                </p>
                            </div>
                        ) : isRecording ? (
                            <div className="upload-box">
                                <video
                                    ref={liveVideoRef}
                                    muted
                                    playsInline
                                    className="w-full aspect-video rounded-lg bg-black object-cover"
                                />

                                <p className="mt-3 flex items-center justify-center gap-2 text-sm text-gray-600">
                                    <FiCircle className="text-red-500 animate-pulse" size={10} />
                                    Enregistrement... {recordSeconds}s / {MAX_RECORD_SECONDS}s
                                </p>

                                <div className="flex gap-2 mt-3">
                                    <button
                                        type="button"
                                        className="secondary"
                                        onClick={cancelRecording}
                                    >
                                        Annuler
                                    </button>

                                    <button
                                        type="button"
                                        onClick={stopRecording}
                                        className="flex items-center justify-center gap-2 flex-1 bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-2.5 rounded-xl transition-colors"
                                    >
                                        <FiSquare size={14} />
                                        Arrêter l'enregistrement
                                    </button>
                                </div>
                            </div>
                        ) : !video ? (
                            <div
                                className="upload-box"
                                onClick={() => inputRef.current.click()}
                            >
                                <FiVideo size={45} />

                                <h3>Ajouter une vidéo</h3>

                                <p>
                                    Durée maximale : <b>1 minute</b>
                                    <br />
                                    Taille maximale : <b>20 Mo</b>
                                </p>

                                <div className="flex gap-2 mt-2" onClick={(e) => e.stopPropagation()}>
                                    <button
                                        type="button"
                                        onClick={() => inputRef.current.click()}
                                    >
                                        <FiUpload />
                                        Choisir une vidéo
                                    </button>

                                    <button
                                        type="button"
                                        onClick={startRecording}
                                    >
                                        <FiVideo />
                                        Enregistrer
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="video-card">

                                <div className="video-header">
                                    <FiVideo size={22} />

                                    <div>
                                        <h4>{video.file.name}</h4>

                                        <span>
                                            {formatSize(video.file.size)} •{" "}
                                            {formatDuration(video.duration)}
                                        </span>
                                    </div>
                                </div>

                                <video
                                    src={video.url}
                                    controls
                                    className="preview w-full h-full object-cover bg-white"
                                />

                                <div className="actions">

                                    <button
                                        type="button"
                                        className="secondary"
                                        onClick={() => inputRef.current.click()}
                                    >
                                        <FiRefreshCw />
                                        Changer
                                    </button>

                                    <a
                                        href={video.url}
                                        download={video.file.name || "video.mp4"}
                                        className="secondary flex items-center justify-center gap-2"
                                        title="Enregistrer la vidéo sur cet appareil"
                                    >
                                        <FiDownload />
                                        Télécharger
                                    </a>

                                    <button
                                        type="button"
                                        className="danger"
                                        onClick={removeVideo}
                                    >
                                        <FiTrash2 />
                                        Supprimer
                                    </button>

                                </div>

                                <button
                                    type="button"
                                    onClick={closePopover}
                                    className="w-full mt-4 flex items-center justify-center gap-2 bg-indigo-500 text-white text-sm font-medium py-2.5 rounded-xl hover:bg-indigo-600 transition-colors"
                                >
                                    <FiCheck size={16} />
                                    Valider
                                </button>
                            </div>
                        )}

                    </div>

                </div>,
                document.body
            )}
        </>
    );
}