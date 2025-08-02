import { Book, Image as ImageIcon, Film } from 'lucide-react';

interface FilterButtonProps {
    type: 'book' | 'image' | 'video';
    isActive: boolean;
    onClick: () => void;
}

export default function FilterButton({ type, isActive, onClick }: FilterButtonProps) {
    const icons = {
        book: Book,
        image: ImageIcon,
        video: Film
    };

    const Icon = icons[type];

    return (
        <button
            onClick={onClick}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all
                ${isActive 
                    ? 'gradient-bg text-white' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
        >
            <Icon className="w-5 h-5" />
        </button>
    );
}
