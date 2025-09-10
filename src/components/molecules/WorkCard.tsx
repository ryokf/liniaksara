'use client';
import Image from 'next/image';
import Link from 'next/link';
import Badge from '../atoms/Badge';

const resolveThumbnail = (src?: string) => {
  if (!src || typeof src !== 'string') return '/images/default-cover.svg';
  // Allow absolute http(s), data, blob, or root-relative paths
  if (/^(https?:|data:|blob:)/i.test(src) || src.startsWith('/')) return src;
  // Fallback to default placeholder if it's a relative or invalid URL
  return '/images/default-cover.svg';
};

interface WorkCardProps {
    title: string;
    type: string;
    thumbnail: string;
    date: string;
    href: string;
    status?: 'draft' | 'published';
}

export default function WorkCard({
    title,
    type,
    thumbnail,
    date,
    href,
    status
}: WorkCardProps) {
    return (
        <div className="group">
            <Link href={href}>
                <div className="space-y-3">
                    {/* Thumbnail */}
                    <div className={`${type === 'Movie' || type === 'Series' ? 'aspect-video' : 'aspect-[3/4]'} relative rounded-xl overflow-hidden`}>
                        <Image
                            src={resolveThumbnail(thumbnail)}
                            alt={title}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                        />
                        {status && (
                            <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${
                                status === 'draft' 
                                    ? 'bg-yellow-100 text-yellow-800' 
                                    : 'bg-green-100 text-green-800'
                            }`}>
                                {status === 'draft' ? 'Draft' : 'Published'}
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                        <Badge variant="secondary">{type}</Badge>
                        <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                            {title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {date}
                        </p>
                    </div>
                </div>
            </Link>
        </div>
    );
}
