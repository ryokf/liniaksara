import EpisodeCard from '../molecules/EpisodeCard';

interface Episode {
    id: string;
    seasonNumber: number;
    episodeNumber: number;
    title: string;
    thumbnail: string;
    duration: string;
    description: string;
}

interface SeasonSectionProps {
    seasonNumber: number;
    episodes: Episode[];
}

export default function SeasonSection({ seasonNumber, episodes }: SeasonSectionProps) {
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Season {seasonNumber}
            </h2>
            <div className="space-y-4">
                {episodes.map((episode) => (
                    <EpisodeCard
                        key={episode.id}
                        {...episode}
                    />
                ))}
            </div>
        </div>
    );
}
