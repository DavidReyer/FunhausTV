import Container, {Video} from "@/components/Container";
import {useEffect, useState} from "react";

export default function Home() {
    const [videos, setVideos] = useState<Video[]>([]);

    useEffect(() => {
        fetch('/videos.json')
            .then((response) => response.json())
            .then((data) => {
                setVideos(data);
            })
            .catch((error) => {
                console.error('Error loading videos:', error);
            });
    }, []);

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <Container videos={videos} />
        </main>
    )
}