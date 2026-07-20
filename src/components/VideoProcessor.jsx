import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import { useRef, useState } from "react";


export default function useVideoProcessor() {

    const ffmpegRef = useRef(null);

    const [processing, setProcessing] = useState(false);


    const loadFFmpeg = async () => {

        if (!ffmpegRef.current) {

            const ffmpeg = new FFmpeg();

            await ffmpeg.load();

            ffmpegRef.current = ffmpeg;
        }

        return ffmpegRef.current;
    };



    const processVideo = async (file) => {

        setProcessing(true);


        const ffmpeg = await loadFFmpeg();


        await ffmpeg.writeFile(
            "input.mp4",
            await fetchFile(file)
        );


        await ffmpeg.exec([
            "-i",
            "input.mp4",

            "-t",
            "60",

            "-vf",
            "scale=720:1280:force_original_aspect_ratio=decrease,pad=720:1280:(ow-iw)/2:(oh-ih)/2",

            "-c:v",
            "libx264",

            "-crf",
            "28",

            "-preset",
            "fast",

            "-c:a",
            "aac",

            "-b:a",
            "128k",

            "output.mp4"
        ]);



        const data = await ffmpeg.readFile(
            "output.mp4"
        );


        const result = new File(
            [data],
            "video.mp4",
            {
                type: "video/mp4"
            }
        );


        setProcessing(false);


        return result;
    };


    return {
        processVideo,
        processing
    };
}