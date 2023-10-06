import {Video} from "@/components/Container";
import {Dispatch, SetStateAction, useState} from "react";
import Image from "next/image";
import {HiMenuAlt4} from "react-icons/hi";
import {RxCross2} from "react-icons/rx";

interface VideoQueueProps {
    filteredVideos: Video[]
    setFilteredVideos: Dispatch<SetStateAction<Video[]>>
}
export default function VideoQueue({filteredVideos, setFilteredVideos}: VideoQueueProps) {
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number>()

    const onVideoReorder = (startIndex: number, endIndex: number) => {
        const reorderedVideos = [...filteredVideos];
        const [removed] = reorderedVideos.splice(startIndex, 1);
        reorderedVideos.splice(endIndex, 0, removed);
        setFilteredVideos(reorderedVideos);
    };

    const onVideoRemove = (videoIndex: number) => {
        const updatedVideos = [...filteredVideos];
        updatedVideos.splice(videoIndex, 1);
        setFilteredVideos(updatedVideos);
    };

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number, video: Video) => {
        setDraggedIndex(index);
        const dragElement = document.getElementById(`video-card-${video.video_id}`)
        dragElement && e.dataTransfer?.setDragImage(dragElement, 10, 10)
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        e.preventDefault()
        console.log("dragoveridx", index)
    };

    const handleDrop = (index: number) => {
        if (draggedIndex !== null) {
            const newVideos = [...filteredVideos];
            const [removed] = newVideos.splice(draggedIndex, 1);
            newVideos.splice(index, 0, removed);
            onVideoReorder(draggedIndex, index);
        }
    };
    return (
        <div>
            <h2>Playlist</h2>
            <div>
                {filteredVideos.slice(0, 10).map((video, index) => (
                    <div
                        key={video.video_id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, index, video)}
                        onDragEnd={handleDragEnd}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDrop={() => handleDrop(index)}
                        className="flex flex-row"
                    >
                        <div className="cursor-pointer">
                            <HiMenuAlt4 />
                        </div>
                        <VideoCard video={video} />
                        <button onClick={() => onVideoRemove(index)}><RxCross2 /></button>
                    </div>
                ))}
            </div>
        </div>
    )
}

function VideoCard({video}: { video: Video }) {
    return (
        <div className="flex flex-row" id={`video-card-${video.video_id}`}>
            <div className="">
                <Image src={`https://img.youtube.com/vi/${video.video_id}/0.jpg`} width={160} height={90} alt={"Thumb"} />
            </div>

            <p>{video.title}</p>
        </div>
    )
}