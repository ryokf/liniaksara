import Image from 'next/image';
import Link from 'next/link';
import { type } from '../../../node_modules/next/dist/compiled/webpack/bundle5';

interface ComicEpisodeCardProps {
    id: string;
    workId: string;
    type: string;
    chapterNumber?: number;
    title: string;
    thumbnail?: string;
    description?: string;
}

export default function ComicEpisodeCard({
    id,
    workId,
    type,
    chapterNumber,
    title,
    thumbnail,
    description
}: ComicEpisodeCardProps) {
    const imgSrc = thumbnail ?? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMB/axl1r8AAAAASUVORK5CYII=';
    return (
        
        <Link href={`/read/${type}/${workId}/${id}`} className="group">
            <div className="flex gap-6 p-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors">
                {/* Thumbnail */}
                <div className="relative w-32 h-48 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                        src={imgSrc}
                        alt={title}
                        fill
                        className="object-cover"
                    />
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-center">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Chapter {chapterNumber}
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
