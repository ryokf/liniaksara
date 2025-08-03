"use client";

import { useParams } from "next/navigation";
import VideoViewer from "@/components/molecules/VideoViewer";
import { useEffect, useState } from "react";

interface Episode {
    id: string;
    title: string;
    videoUrl: string;
    episodeNumber: number;
}

export default function WatchPage() {
    const params = useParams();
    const [episode, setEpisode] = useState<Episode | null>(null);
    const [hasNextEpisode, setHasNextEpisode] = useState(false);
    const [hasPrevEpisode, setHasPrevEpisode] = useState(false);

    useEffect(() => {
        // Di sini Anda akan mengambil data episode dari API
        // Contoh data statis untuk demonstrasi
        const fetchEpisode = async () => {
            try {
                // Ganti dengan panggilan API yang sebenarnya
                const mockEpisode = {
                    id: params.episodeId as string,
                    title: "Series Title",
                    videoUrl: "https://example.com/video.mp4",
                    episodeNumber: 1
                };
                
                setEpisode(mockEpisode);
                // Cek keberadaan episode sebelum/sesudah
                setHasNextEpisode(true); // Sesuaikan dengan logika Anda
                setHasPrevEpisode(false);
            } catch (error) {
                console.error("Error fetching episode:", error);
            }
        };

        fetchEpisode();
    }, [params.episodeId, params.seriesId]);

    const handleNavigateEpisode = (direction: 'prev' | 'next') => {
        // Implementasi navigasi episode
        const currentEpisodeNumber = episode?.episodeNumber || 1;
        const newEpisodeNumber = direction === 'next' 
            ? currentEpisodeNumber + 1 
            : currentEpisodeNumber - 1;
        
        // Redirect ke episode baru
        window.location.href = `/watch/${params.seriesId}/${newEpisodeNumber}`;
    };

    if (!episode) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <VideoViewer
            videoUrl={episode.videoUrl}
            title={episode.title}
            episodeNumber={episode.episodeNumber}
            onNavigateEpisode={handleNavigateEpisode}
            hasNextEpisode={hasNextEpisode}
            hasPrevEpisode={hasPrevEpisode}
        />
    );
}
