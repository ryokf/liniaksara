import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface ChapterItemProps {
    id: string;
    chapterNumber: number;
    title: string;
}

export default function ChapterItem({ id, chapterNumber, title }: ChapterItemProps) {
    return (
        <Link 
            href={`/read/${id}`}
            className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-gray-800 hover:shadow-lg dark:hover:shadow-primary/5 transition-all hover:-translate-y-0.5 group"
        >
            <div className="flex items-center gap-4">
                <span className="text-gray-900 dark:text-white font-medium">
                    Bab {chapterNumber} :
                </span>
                <span className="text-gray-600 dark:text-gray-300">
                    {title}
                </span>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
        </Link>
    );
}
