import Link from 'next/link';
import CreatorAvatar from '../atoms/CreatorAvatar';

interface CreatorCardProps {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    worksCount: number;
    rank: number;
}

export default function CreatorCard({ id, name, description, imageUrl, worksCount, rank }: CreatorCardProps) {
    return (
        <div className="group relative rounded-2xl">
            <div className="absolute top-0 right-0 mt-3 mr-3 ">
                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${rank <= 3 ? ['bg-yellow-400', 'bg-gray-300', 'bg-yellow-700'][rank - 1] : 'bg-gray-500'} text-white font-semibold shadow-md`}>
                    #{rank}
                </span>
            </div>
            <div className="flex flex-col items-center p-6 rounded-2xl bg-white dark:bg-gray-800 transition-all duration-300 hover:shadow-lg dark:hover:shadow-primary/5 hover:-translate-y-1">
                <CreatorAvatar imageUrl={imageUrl} alt={name} />
                
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                    {name}
                </h3>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4 line-clamp-2">
                    {description}
                </p>
                
                <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                    {worksCount} works
                </p>

                <Link 
                    href={`/creator/${id}`}
                    className="px-6 py-2 rounded-full text-sm font-medium text-white gradient-bg transition-opacity hover:opacity-90"
                >
                    View Profile
                </Link>
            </div>
        </div>
    );
}
