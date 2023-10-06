
import {useCallback, useState} from 'react';
import CategoryAndTagFilter from "@/components/CategoryAndTagFilter";
import Player from "@/components/Player";
import VideoQueue from "@/components/VideoQueue";

export interface Video {
    video_id: string;
    title: string;
    category: string;
    tag: string;
    length: string;
}

interface VideoList {
    videos: Video[]
}

export default function Container({videos}: VideoList) {
    const [filteredVideos, setFilteredVideos] = useState<Video[]>([])

    const shuffleVideos = useCallback((videos: Video[]) => {
        return videos.sort(() => Math.random() - 0.5)
    }, [])

    return (
        <div className="flex flex-row text-white w-full">
            <CategoryAndTagFilter videos={videos} setFilteredVideos={setFilteredVideos} shuffleVideos={shuffleVideos} />
            <Player filteredVideos={filteredVideos} setFilteredVideos={setFilteredVideos} shuffleVideos={shuffleVideos} />
            <VideoQueue filteredVideos={filteredVideos} setFilteredVideos={setFilteredVideos} />
        </div>
    );
};
