'use client';

import { Work } from '@/types/works';
import { Calendar, Bookmark } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface WorkListItemProps {
    href: string;
    title: string;
    type: string;
    thumbnail: string;
    date: string;
    status: 'draft' | 'published';
}

export default function WorkListItem({
    href,
    title,
    type,
    thumbnail,
    date,
    status
}: WorkListItemProps) {
    return (
        <Link 
            href={href}
            className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
        >
            <div className="relative w-20 h-20 flex-shrink-0">
                <Image
                    src={thumbnail}
                    alt={title}
                    fill
                    className="object-cover rounded-lg"
                />
            </div>
            <div className="flex-grow min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                    {title}
                </h3>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        <span>{date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Bookmark size={16} />
                        <span>{type}</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                        status === 'published' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                    }`}>
                        {status === 'published' ? 'Dipublikasi' : 'Draft'}
                    </span>
                </div>
            </div>
        </Link>
    );
}
