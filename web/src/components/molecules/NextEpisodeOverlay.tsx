import { useRouter } from 'next/navigation';
import { Play } from 'lucide-react';
import Link from 'next/link';

interface NextEpisodeOverlayProps {
    nextEpisodeId?: string;
    workId?: string;
    title?: string;
    thumbnailUrl?: string;
    onDismiss: () => void;
}

export default function NextEpisodeOverlay({
    nextEpisodeId,
    workId,
    title = 'Episode Selanjutnya',
    thumbnailUrl,
    onDismiss
}: NextEpisodeOverlayProps) {

    if (!nextEpisodeId || !workId) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center w-screen h-screen">
            {/* Backdrop with blur effect */}
            <div className="absolute inset-0 bg-base-300/95 backdrop-blur-sm bg-gradient-to-b from-[#84A6E2]/50 to-[#84E2DC]/50" />

            {/* Content */}
            <div className="relative max-w-md w-full mx-4">
                <div className="rounded-2xl p-8 bg-black/10 backdrop-blur-lg border border-white/20 shadow-lg">
                    <div className="text-center mb-8">
                        <h3 className="text-xl font-bold text-base-content mb-2">Episode Selesai</h3>
                        <p className="text-base-content/70">{title}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link
                            href={`/watch/${workId}/${nextEpisodeId}`}
                            className="btn btn-primary flex items-center gap-2 py-2 px-4 rounded-2xl"
                        >
                            <Play size={20} fill="currentColor" />
                            Episode Selanjutnya
                        </Link>
                        
                        <button
                            onClick={onDismiss}
                            className="btn btn-ghost"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
