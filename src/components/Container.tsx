
import { useState } from 'react';
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

    return (
        <div className="flex flex-row">
            <CategoryAndTagFilter videos={videos} setFilteredVideos={setFilteredVideos} />
            <Player filteredVideos={filteredVideos} setFilteredVideos={setFilteredVideos} />
            <VideoQueue filteredVideos={filteredVideos} setFilteredVideos={setFilteredVideos} />
        </div>
    );
};
