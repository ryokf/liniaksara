import Image from 'next/image';
import Link from 'next/link';

interface EpisodeCardProps {
    id: string;
    seasonNumber: number;
    episodeNumber: number;
    title: string;
    thumbnail: string;
    duration: string;
    description: string;
}

export default function EpisodeCard({
    id,
    seasonNumber,
    episodeNumber,
    title,
    thumbnail,
    duration,
    description
}: EpisodeCardProps) {
    return (
        <Link href={`/watch/${id}`} className="group">
            <div className="flex gap-4 p-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors">
                {/* Thumbnail */}
                <div className="relative w-48 h-28 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                        src={thumbnail}
                        alt={title}
                        fill
                        className="object-cover"
                    />
                    <div className="absolute bottom-2 right-2 px-2 py-1 text-xs font-medium bg-black/70 text-white rounded">
                        {duration}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        S{seasonNumber} E{episodeNumber}
                    </div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                        {title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {description}
                    </p>
                </div>
            </div>
        </Link>
    );
}
