import Link from 'next/link';
import UnsplashImage from '../atoms/UnsplashImage';

export interface MediaItemProps {
    id: string;
    type: string;
    title: string;
    cover?: string;
    author_name?: string;
    rating?: number;
    episodeCount?: number;
}

export default function MediaCard({
    id,
    type,
    title,
    cover,
    author_name,
    rating,
    episodeCount
}: MediaItemProps) {
    return (
        <Link
            href={`/${type}/${id}`}
            className="group relative flex-shrink-0 w-[200px] transition-transform duration-300 hover:scale-105"
        >
            <div className="relative w-full h-[280px] rounded-lg overflow-hidden shadow-md group-hover:shadow-xl transition-shadow duration-300">
                <UnsplashImage
                    query={`${type} ${title}`}
                    alt={title}
                    fill
                    className="object-cover"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            <div className="mt-3 space-y-1">
                <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-primary transition-colors">
                    {title}
                </h3>

                {author_name && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        by {author_name}
                    </p>
                )}

                <div className="flex items-center justify-between text-sm">
                    {rating && (
                        <div className="flex items-center text-yellow-500">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            {rating.toFixed(1)}
                        </div>
                    )}

                    {episodeCount !== undefined && (
                        <span className="text-gray-600 dark:text-gray-400">
                            {episodeCount} {episodeCount === 1 ? 'episode' : 'episodes'}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}
