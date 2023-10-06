import {Video} from "@/components/Container";
import {Dispatch, SetStateAction, useCallback, useEffect, useState} from "react";
import {PiCaretDoubleRightDuotone, PiShuffleAngularBold} from "react-icons/pi";
import YouTube, {YouTubeEvent} from "react-youtube";

interface PlayerProps {
    filteredVideos: Video[]
    setFilteredVideos: Dispatch<SetStateAction<Video[]>>
    shuffleVideos(videos: Video[]): Video[]
}

export default function Player({filteredVideos, setFilteredVideos, shuffleVideos}: PlayerProps) {
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

    const handleShuffleClick = () => {
        setFilteredVideos([...shuffleVideos(filteredVideos)])
    }

    const onPlayerReady = (event: YouTubeEvent) => {
        event.target.playVideo()
    };

    const onPlayerStateChange = (event: YouTubeEvent) => {
        //If video state is not undefined (-1), playing (1), paused (2) or buffering (3) play next video
        if (![-1, 1, 2, 3].includes(event.data)) {
            playNextVideo()
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
                        videoId={currentVideo?.video_id}
                        opts={options}
                        onReady={onPlayerReady}
                        onStateChange={onPlayerStateChange}
                    />
                </div>
            )}
            <div className="flex flex-row justify-between">
                <div onClick={() => handleShuffleClick()} className="border border-fh-primary px-4 py-2 rounded-xl text-fh-primary my-4 inline-flex">Shuffle Videos <PiShuffleAngularBold className="my-auto ml-2" /></div>
                <div onClick={() => playNextVideo()} className="border border-fh-primary px-4 py-2 rounded-xl text-fh-primary my-4 inline-flex">Next Video <PiCaretDoubleRightDuotone className="my-auto ml-2" /></div>
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