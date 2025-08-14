import Image from 'next/image';
import Link from 'next/link';
import { Clock, Play } from 'lucide-react';
import Badge from '../atoms/Badge';

interface MovieEpisodeCardProps {
    id: string;
    episodeNumber: number;
    title: string;
    thumbnail: string;
    duration: string;
    isFree: boolean;
}

export default function MovieEpisodeCard({
    id,
    episodeNumber,
    title,
    thumbnail,
    duration,
    isFree
}: MovieEpisodeCardProps) {
    return (
        <Link href={`/watch/${id}`} className="group">
            <div className="flex gap-6 p-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors">
                {/* Thumbnail */}
                <div className="relative w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                        src={thumbnail}
                        alt={title}
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Play className="w-12 h-12 text-white" fill="currentColor" />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-center">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Episode {episodeNumber}
                    </div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                        {title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{duration}</span>
                        </div>
                        <Badge variant={isFree ? "primary" : "secondary"}>
                            {isFree ? "Free" : "Premium"}
                        </Badge>
                    </div>
                </div>
            </div>
        </Link>
    );
}
