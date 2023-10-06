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
        <main className="min-h-screen p-12 pt-6 bg-fh-background">
            <h1 className="text-fh-primary text-3xl pb-6">Funhaus TV</h1>
            <Container videos={videos} />
        </main>
    )
}