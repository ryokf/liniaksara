import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import PartActionButtons from './PartActionButtons';

interface ChapterItemProps {
    id: string;
    workId: string;
    type: 'novel' | 'comic';
    chapterNumber: number;
    title: string;
    isAuthor?: boolean;
    onEdit?: () => void;
}

export default function ChapterItem({ id, workId, type, chapterNumber, title, isAuthor, onEdit }: ChapterItemProps) {
    return (
        <div className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-gray-800 hover:shadow-lg dark:hover:shadow-primary/5 transition-all group">
            <Link 
                href={`/read/${type}/${workId}/${id}`}
                className="flex-1"
            >
                <div className="flex items-center gap-4">
                    <span className="text-gray-900 dark:text-white font-medium">
                        Bab {chapterNumber} :
                    </span>
                    <span className="text-gray-600 dark:text-gray-300">
                        {title}
                    </span>
                </div>
            </Link>

            <div className="flex items-center gap-4">
                {isAuthor && (
                    <PartActionButtons
                        partId={id}
                        workId={workId}
                        type={type}
                        onEditClick={onEdit}
                    />
                )}
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
            </div>
        </div>
    );
}
