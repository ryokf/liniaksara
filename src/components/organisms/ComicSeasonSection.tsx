import ComicEpisodeCard from '../molecules/ComicEpisodeCard';

interface ComicEpisode {
    id: string;
    chapterNumber: number;
    title: string;
    thumbnail: string;
    description: string;
}

interface ComicSeasonSectionProps {
    seasonNumber: number;
    episodes: ComicEpisode[];
}

export default function ComicSeasonSection({ seasonNumber, episodes }: ComicSeasonSectionProps) {
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Season {seasonNumber}
            </h2>
            <div className="space-y-4">
                {episodes.map((episode) => (
                    <ComicEpisodeCard
                        key={episode.id}
                        {...episode}
                    />
                ))}
            </div>
        </div>
    );
}
