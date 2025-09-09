"use client";

import { useParams, useRouter } from "next/navigation";
import VideoViewer from "@/components/molecules/VideoViewer";
import { useEffect, useState } from "react";
import { Episode } from "@/types/episode";
import { getVideoEpisodeById } from "@/services/videoService";

export default function WatchPage() {
    const params = useParams();
    const router = useRouter();
    const [episode, setEpisode] = useState<Episode | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEpisode = async () => {
            try {
                if (!params.episodeId) return;
                
                setLoading(true);
                const data = await getVideoEpisodeById(params.episodeId as string);
                console.log("Fetched episode data:", data);
                if (!data) {
                    throw new Error('Episode tidak ditemukan');
                }
                
                // Validasi tipe konten adalah video
                if (![23, 20].includes(data.work?.work_type_id || 0)) {
                    throw new Error('Konten ini bukan video');
                }
                
                setEpisode(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
            } finally {
                setLoading(false);
            }
        };

        fetchEpisode();
    }, [params.episodeId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="loading loading-spinner loading-lg"></div>
            </div>
        );
    }

    if (error || !episode) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="text-error text-2xl mb-4">
                    {error || 'Episode tidak ditemukan'}
                </div>
                <button 
                    className="btn btn-primary"
                    onClick={() => router.back()}
                >
                    Kembali
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black">
            <div className="max-w-7xl mx-auto">
                <div className="mb-4">
                    <VideoViewer episode={episode} />
                </div>
                <div className="bg-base-300 p-4 rounded-lg">
                    <h1 className="text-xl font-bold mb-2">{episode.title || `Episode ${episode.part_order}`}</h1>
                    <p className="text-gray-400">{episode.description}</p>
                </div>
            </div>
        </div>
    );
}
