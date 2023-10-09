import {Video} from "@/components/Container";
import {Dispatch, SetStateAction, useCallback, useEffect, useRef, useState} from "react";
import {PiCaretDoubleRightDuotone, PiShuffleAngularBold} from "react-icons/pi";
import YouTube, {YouTubeEvent} from "react-youtube";
import ReactPlayer from "react-player";

interface PlayerProps {
    filteredVideos: Video[]
    setFilteredVideos: Dispatch<SetStateAction<Video[]>>
    shuffleVideos(videos: Video[]): Video[]
}

export default function Player({filteredVideos, setFilteredVideos, shuffleVideos}: PlayerProps) {
    const [currentVideo, setCurrentVideo] = useState<Video>()
    const [playing, setPlaying] = useState<boolean>(false)

    const selectNextVideo = useCallback(() => {
        const nextVideo = filteredVideos.shift()
        if (nextVideo) {
            setCurrentVideo(nextVideo)
            setFilteredVideos([...filteredVideos, nextVideo])
        }
    }, [filteredVideos, setFilteredVideos]);

    useEffect(() => {
        setPlaying(true)
    }, [currentVideo]);

    useEffect(() => {
        !currentVideo && selectNextVideo()
    }, [currentVideo, selectNextVideo]);

    const handleShuffleClick = () => {
        setFilteredVideos([...shuffleVideos(filteredVideos)])
    }

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
                    <ReactPlayer
                        url={`https://www.youtube.com/watch?v=${currentVideo?.video_id}`}
                        id="youtube-player"
                        className="w-full h-full"
                        controls
                        playing={playing}
                        config={{
                            youtube: {
                                playerVars: { autoplay: 1 }
                            }
                        }}
                        onEnded={() => selectNextVideo()}
                        onPause={() => setPlaying(false)}
                        onStart={() => setPlaying(true)}
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