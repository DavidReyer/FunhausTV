import {Video} from "@/components/Container";
import {Dispatch, SetStateAction, useCallback, useEffect, useState} from "react";

interface PlayerProps {
    filteredVideos: Video[]
    setFilteredVideos: Dispatch<SetStateAction<Video[]>>
}

export default function Player({filteredVideos, setFilteredVideos}: PlayerProps) {
    const [currentVideo, setCurrentVideo] = useState<Video>()

    const playNextVideo = useCallback(() => {
        const nextVideo = filteredVideos.shift()
        if (nextVideo) {
            setCurrentVideo(nextVideo)
            setFilteredVideos([...filteredVideos, nextVideo])
        }
    }, [filteredVideos, setFilteredVideos]);

    useEffect(() => {
        !currentVideo && playNextVideo()
    }, [currentVideo, playNextVideo]);

    console.log("filtered", filteredVideos)
    console.log("current", currentVideo)

    return (
        <div>
            <h2>Selected Videos:</h2>
            {filteredVideos.length === 0 ? (
                <p>No videos match the selected categories.</p>
            ) : (
                <div>
                    <iframe
                        width="560"
                        height="315"
                        src={`https://www.youtube.com/embed/${currentVideo?.video_id}?autoplay=1`}
                        allowFullScreen
                        onEnded={playNextVideo}
                    ></iframe>
                    <p>{currentVideo?.title}</p>
                </div>
            )}
            <div onClick={() => playNextVideo()}>NEXT!</div>
        </div>
    )
}