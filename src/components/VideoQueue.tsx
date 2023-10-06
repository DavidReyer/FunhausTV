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
        dragElement && e.dataTransfer?.setDragImage(dragElement, 10, 75)
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        e.preventDefault()
        dragOverIndex !== index && setDragOverIndex(index)
    };

    const handleDrop = (index: number) => {
        if (draggedIndex !== null) {
            const newVideos = [...filteredVideos];
            const [removed] = newVideos.splice(draggedIndex, 1);
            newVideos.splice(index, 0, removed);
            onVideoReorder(draggedIndex, index);
            setDragOverIndex(undefined)
        }
    };
    return (
        <div className="right-0 max-h-full px-4 ">
            <h2 className="text-xl mb-4">Up next:</h2>
            <div className="overflow-scroll space-y-4">
                {filteredVideos.slice(0, 8).map((video, index) => (
                    <div
                        key={video.video_id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, index, video)}
                        onDragEnd={handleDragEnd}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDrop={() => handleDrop(index)}
                        className={`flex flex-row border-fh-primary cursor-grab ${dragOverIndex === index && "border-b-2 pb-2 mb-2"}`}
                    >
                        <HiMenuAlt4 className="w-8 h-8 my-auto hover:text-fh-primary" />
                        <VideoCard video={video} />
                        <button onClick={() => onVideoRemove(index)}><RxCross2 className="w-5 h-5 cursor-pointer my-auto hover:text-red-500" /></button>
                    </div>
                ))}
            </div>
        </div>
    )
}

function VideoCard({video}: { video: Video }) {
    return (
        <div className="flex flex-row" id={`video-card-${video.video_id}`}>
            <div className="w-28 h-16 relative">
                <Image src={`https://img.youtube.com/vi/${video.video_id}/0.jpg`} alt={"Thumb"} fill className="object-cover rounded-xl" />
            </div>
            <p className="w-72 text-sm p-2">{video.title}</p>
        </div>
    )
}