import { useEffect, useState } from "react";
import VideoUploader from "../components/videoUploader";
import VideoPlayer from "../components/VideoPlayer";

export default function UseVideo({ getVideoSelected }) {
    const [video, setVideo] = useState(null);

    useEffect(() => {
            getVideoSelected(video)
    }, [video, getVideoSelected]
    )

    return (
        <div style={{ padding: 20 }}>

            <VideoUploader onVideoSelected={setVideo} />

            <br />

            <VideoPlayer file={video} />
        </div>
    );
}