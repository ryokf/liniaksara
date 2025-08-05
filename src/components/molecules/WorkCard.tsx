import Image from 'next/image';
import Link from 'next/link';
import Badge from '../atoms/Badge';

interface WorkCardProps {
    id: string;
    title: string;
    type: string;
    thumbnail: string;
    date: string;
    href: string;
}

export default function WorkCard({
    title,
    type,
    thumbnail,
    date,
    href
}: WorkCardProps) {
    return (
        <Link href={href} className="group">
            <div className="space-y-3">
                {/* Thumbnail */}
                <div className="aspect-video relative rounded-xl overflow-hidden">
                    <Image
                        src={thumbnail}
                        alt={title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                    />
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
    );
}
