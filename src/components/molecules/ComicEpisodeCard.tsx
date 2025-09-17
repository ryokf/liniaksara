import Image from 'next/image';
import Link from 'next/link';
import PartActionButtons from './PartActionButtons';

interface ComicEpisodeCardProps {
    id: string;
    workId: string;
    type: string;
    part_order?: number;
    title: string;
    thumbnail?: string;
    description?: string;
    is_free?: boolean;
    isAuthor?: boolean;
}

export default function ComicEpisodeCard({
    id,
    workId,
    type,
    part_order,
    title,
    thumbnail,
    description,
    is_free,
    isAuthor
}: ComicEpisodeCardProps) {
    const imgSrc = thumbnail ?? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMB/axl1r8AAAAASUVORK5CYII=';
    
    return (
        <div className="group">
            <div className="flex justify-between items-start p-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors">
                <Link href={`/read/comic/${workId}/${id}`} className="flex gap-6 flex-1">
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
                            Chapter {part_order}
                        </div>
                        <h3 className="font-medium text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                            {title}
                        </h3>
                        {description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                {description}
                            </p>
                        )}
                        {is_free !== undefined && (
                            <div className="mt-2">
                                <span className={`px-3 py-1 text-xs rounded-full ${is_free ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                                    {is_free ? 'Gratis' : 'Premium'}
                                </span>
                            </div>
                        )}
                    </div>
                </Link>

                {/* Action Buttons */}
                {isAuthor && (
                    <div className="ml-4">
                        <PartActionButtons
                            partId={id}
                            workId={workId}
                            type="comic"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
