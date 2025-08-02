import { Star } from 'lucide-react';
import CreatorCard from '../molecules/CreatorCard';

const mockCreators = [
    {
        id: '1',
        name: 'Luna Azki',
        description: 'Writer of introspective novels & magical realism.',
        imageUrl: '/images/creators/creator1.jpg',
        worksCount: 12
    },
    {
        id: '2',
        name: 'Jin Zen',
        description: 'Comic artist blending street culture & fantasy.',
        imageUrl: '/images/creators/creator2.jpg',
        worksCount: 8
    },
    {
        id: '3',
        name: 'Putri Jasmine',
        description: 'Drama screenwriter capturing Southeast Asian life.',
        imageUrl: '/images/creators/creator3.jpg',
        worksCount: 5
    }
];

export default function TopCreators() {
    return (
        <section className="py-16">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="flex items-center gap-2 mb-8">
                    <Star className="w-8 h-8 text-yellow-400" fill="currentColor" />
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                        Featured Creators
                    </h2>
                </div>

                {/* Grid of Creator Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {mockCreators.map((creator) => (
                        <CreatorCard
                            key={creator.id}
                            {...creator}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
