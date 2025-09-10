import { Star } from 'lucide-react';
import CreatorCard from '../molecules/CreatorCard';
import { TopCreator } from '@/services/creatorService';

interface TopCreatorsProps {
    creators: TopCreator[];
}

export default function TopCreators({ creators }: TopCreatorsProps) {
    return (
        <section className="py-16 sm:block hidden">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="flex items-center gap-2 mb-8">
                    <Star className="w-8 h-8 text-yellow-400" fill="currentColor" />
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                        Top Creators of the Month
                    </h2>
                </div>

                {/* Grid of Creator Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {creators.map((creator, index) => (
                        <CreatorCard
                            key={creator.id}
                            id={creator.id}
                            name={creator.username}
                            description={`${creator.sales} karya terjual`}
                            imageUrl={creator.photo || '/images/default-avatar.svg'}
                            worksCount={creator.worksCount}
                            rank={index + 1}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
