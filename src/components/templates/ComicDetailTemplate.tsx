import Image from 'next/image';
import { Bookmark, Play, Star } from 'lucide-react';
import Badge from '../atoms/Badge';
import InfoSection from '../molecules/InfoSection';
import Navbar from '../molecules/Navbar';
import ComicEpisodeCard from '../molecules/ComicEpisodeCard';
import { WorkGenre } from '@/types/works';

interface ComicDetailTemplateProps {
    title: string;
    category: string;
    releaseDate: string;
    rating: string;
    description: string;
    coverImage: string;
    genres: WorkGenre[];
    author: string;
    publisher: string;
    relatedWorks?: Array<{
        id: string;
        title: string;
        cover: string;
        rating: string;
    }>;
    chapters: Array<{
        id: string;
        workId: string;
        type: string;
        chapterNumber?: number;
        title: string;
        thumbnail?: string;
        description?: string;
    }>;
}

export default function ComicDetailTemplate({
    title,
    category,
    releaseDate,
    rating,
    description,
    coverImage,
    genres,
    author,
    publisher,
    chapters
}: ComicDetailTemplateProps) {
    return (
        <main className="min-h-screen bg-white dark:bg-gray-900">
            <Navbar />
            {/* Hero Section */}
            <div
                className="w-full md:py-32 relative bg-cover bg-center"
                style={{ backgroundImage: `url(${coverImage})` }}
            >
                <div className="absolute inset-0 bg-black opacity-80"></div>
                <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Left: Cover Image */}
                        <div className="w-full md:w-80 aspect-[3/4] relative rounded-2xl overflow-hidden flex-shrink-0">
                            <Image
                                src={coverImage}
                                alt={title}
                                fill
                                className="object-cover"
                            />
                        </div>

                        {/* Right: Content */}
                        <div className="flex-1 flex flex-col justify-center space-y-6">
                            {/* Category Badge */}
                            <div>
                                <Badge variant="primary">{category}</Badge>
                            </div>

                            {/* Title */}
                            <h1 className="text-4xl font-bold text-white">
                                {title}
                            </h1>

                            {/* Meta Info */}
                            <div className="flex items-center gap-4 text-gray-300 text-sm">
                                <span>{releaseDate}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                                    {rating}
                                </span>
                            </div>

                            {/* Description */}
                            <p className="text-gray-300 leading-relaxed">
                                {description}
                            </p>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-4 pt-4">
                                <button className="px-8 py-3 rounded-full gradient-bg text-white font-medium hover:opacity-90 transition-opacity flex items-center gap-2">
                                    <Play className="w-5 h-5" fill="currentColor" />
                                    Baca Sekarang
                                </button>
                                <button className="px-8 py-3 rounded-full bg-white/10 text-white font-medium hover:bg-white/20 transition-colors flex items-center gap-2">
                                    <Bookmark className="w-5 h-5" />
                                    Tambah ke List
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Details Section */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Column: Description & Episodes */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Episodes */}
                        <div className="space-y-8">
                            {chapters.map((chapter) => (
                                <ComicEpisodeCard key={chapter.id} {...chapter} />
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Additional Info */}
                    <div>
                        <div className="sticky top-24 space-y-8 bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl">
                            {/* Genres */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                                    Genres
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {genres.map((genre) => (
                                        <Badge key={genre?.genres?.genre} variant="secondary">
                                            {genre?.genres?.genre}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {/* Additional Info */}
                            <div className="space-y-6">
                                <InfoSection label="Author" value={author} />
                                <InfoSection label="Publisher" value={publisher} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
