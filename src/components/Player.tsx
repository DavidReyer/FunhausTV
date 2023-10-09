import {Video} from "@/components/Container";
import {Dispatch, SetStateAction, useCallback, useEffect, useRef, useState} from "react";
import {PiCaretDoubleRightDuotone, PiShuffleAngularBold} from "react-icons/pi";
import YouTube, {YouTubeEvent} from "react-youtube";

interface PlayerProps {
    filteredVideos: Video[]
    setFilteredVideos: Dispatch<SetStateAction<Video[]>>
    shuffleVideos(videos: Video[]): Video[]
}

export default function Player({filteredVideos, setFilteredVideos, shuffleVideos}: PlayerProps) {
    const [currentVideo, setCurrentVideo] = useState<Video>()
    const playerRef = useRef<YouTube>(null);

    const selectNextVideo = useCallback(() => {
        const nextVideo = filteredVideos.shift()
        if (nextVideo) {
            setCurrentVideo(nextVideo)
            setFilteredVideos([...filteredVideos, nextVideo])
        }
    }, [filteredVideos, setFilteredVideos]);

    useEffect(() => {
        const player = playerRef.current
        if (player) {
            player.internalPlayer.cueVideoById(currentVideo)
        }
    }, [currentVideo]);

    useEffect(() => {
        !currentVideo && selectNextVideo()
    }, [currentVideo, selectNextVideo]);

    const handleShuffleClick = () => {
        setFilteredVideos([...shuffleVideos(filteredVideos)])
    }

    const onPlayerReady = (event: YouTubeEvent) => {
        event.target.playVideo()
    };

    const onPlayerStateChange = (event: YouTubeEvent) => {
        if (event.data === 0) {
            selectNextVideo()
        }
        if (event.data === 5) {
            event.target.playVideo()
        }
    };

    const options = {
        height: "100%",
        width: "100%",
        playerVars: {
            autoplay: 1,
        },
    };

    return (
        <div className="grow flex flex-col px-6 pb-20">
            {filteredVideos.length === 0 ? (
                <p>No videos match the selected categories.</p>
            ) : (
                <div className="grow" id="youtubePlayer">
                    <YouTube
                        className="w-full h-full"
                        videoId='mhKOOgRFFlw'
                        ref={playerRef}
                        opts={options}
                        onReady={onPlayerReady}
                        onStateChange={onPlayerStateChange}
                    />
                </div>
            )}
            <div className="flex flex-row justify-between">
                <div onClick={() => handleShuffleClick()} className="border border-fh-primary px-4 py-2 rounded-xl text-fh-primary my-4 inline-flex">Shuffle Videos <PiShuffleAngularBold className="my-auto ml-2" /></div>
                <div onClick={() => selectNextVideo()} className="border border-fh-primary px-4 py-2 rounded-xl text-fh-primary my-4 inline-flex">Next Video <PiCaretDoubleRightDuotone className="my-auto ml-2" /></div>
            </div>
        </div>
    )
}

/*
                    <iframe
                        className="w-full h-full"
                        width="560"
                        height="315"
                        src={`https://www.youtube.com/embed/${currentVideo?.video_id}?autoplay=1`}
                        allowFullScreen
                        onEnded={playNextVideo}
                    ></iframe>
 */