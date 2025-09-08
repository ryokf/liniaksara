import { useEffect, useState } from 'react';
import { Work } from '@/types/works';
import { WorkTransaction } from '@/types/workTransaction';
import { User } from '@supabase/supabase-js';
import { getPopularWorkByType, getPopularWorks } from '@/services/workServices';
import { getWorkTransactions } from '@/services/WorkTransactionService';
import { getUser } from '@/services/userServices';
import HeroCarousel from '../organisms/HeroCarousel';
import MediaCarousel from '../organisms/MediaCarousel';
import TopCreators from '../organisms/TopCreators';
import MobileFeed from './MobileFeed';
import { getTopCreators, TopCreator } from '@/services/creatorService';

export default function HomeTemplate() {
    const [popularWorks, setPopularWorks] = useState<Work[]>([]);
    const [library, setLibrary] = useState<WorkTransaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [popularNovels, setPopularNovels] = useState<Work[]>([]);
    const [popularMovies, setPopularMovies] = useState<Work[]>([]);
    const [popularComics, setPopularComics] = useState<Work[]>([]);
    const [popularSeries, setPopularSeries] = useState<Work[]>([]);
    const [topCreators, setTopCreators] = useState<TopCreator[]>([]);
    const [user, setUser] = useState<User | null>(null);

    const fetchPopularWorks = async () => {
        try {
            const works = await getPopularWorks();
            setPopularWorks(works);
        } catch (error) {
            console.error("Failed to fetch popular works:", error);
        }
    }

    const fetchUser = async () => {
        const user = await getUser();
        setUser(user || null);
    }

    const fetchPopularNovels = async () => {
        try {
            const novels = await getPopularWorkByType(19);
            setPopularNovels(novels);
        } catch (error) {
            console.error("Failed to fetch popular novels:", error);
        }
    }

    const fetchPopularMovies = async () => {
        try {
            const movies = await getPopularWorkByType(20); // Assuming 20 is the ID for movies
            setPopularMovies(movies);
        } catch (error) {
            console.error("Failed to fetch popular movies:", error);
        }
    }

    const fetchPopularComic = async () => {
        try {
            const comic = await getPopularWorkByType(22); // Assuming 21 is the ID for Comic
            setPopularComics(comic);
        } catch (error) {
            console.error("Failed to fetch popular Comics:", error);
        }
    }

    const fetchPopularSeries = async () => {
        try {
            const series = await getPopularWorkByType(23); // Assuming 23 is the ID for Series
            setPopularSeries(series);
        } catch (error) {
            console.error("Failed to fetch popular Series:", error);
        }
    }

    const fetchWorkTransactions = async (buyerId: string | null | undefined) => {
        try {
            if (!buyerId) throw new Error("Buyer ID is required");
            const library = await getWorkTransactions(buyerId);
            setLibrary(library);
        } catch (error) {
            console.error("Failed to fetch work transactions:", error);
        }
    }

    const fetchTopCreators = async () => {
        try {
            const creators = await getTopCreators();
            setTopCreators(creators);
        } catch (error) {
            console.error("Failed to fetch top creators:", error);
        }
    }

    useEffect(() => {
        fetchPopularComic();
        fetchPopularNovels();
        fetchPopularSeries();
        fetchPopularWorks();
        fetchPopularMovies();
        fetchTopCreators();
        fetchUser();
    }, []);

    useEffect(() => {
        if (user) {
            fetchWorkTransactions(user.id);
        }
    }, [user]);



    const popularWorksAsMediaItems = popularWorks.map(work => ({
        id: work.id,
        title: work.title,
        subtitle: work.work_type?.type || "Work",
        description: work.description || "",
        image: work.cover || "",
        rating: "0"
    }));

    const popularNovelsAsMediaItems = popularNovels.map(novel => ({
        id: novel.id,
        type: novel.work_type?.type || "novel",
        title: novel.title,
        cover: novel.cover || "",
        author_name: novel.profiles?.username || "Anonymous",
        rating: 0,
        episodeCount: 0
    }));

    const popularComicsAsMediaItems = popularComics.map(comic => ({
        id: comic.id,
        type: comic.work_type?.type || "comic",
        title: comic.title,
        cover: comic.cover || "",
        author_name: comic.profiles?.username || "Anonymous",
        rating: 0,
        episodeCount: 0
    }));

    const popularSeriesAsMediaItems = popularSeries.map(series => ({
        id: series.id,
        type: series.work_type?.type || "Series",
        title: series.title,
        cover: series.cover || "",
        author_name: series.profiles?.username || "Anonymous",
        rating: 0,
        episodeCount: 0
    }));

    const popularMovieAsMediaItems = popularMovies.map(movie => ({
        id: movie.id,
        type: movie.work_type?.type || "Movie",
        title: movie.title,
        cover: movie.cover || "",
        author_name: movie.profiles?.username || "Anonymous",
        rating: 0,
        episodeCount: 0
    }));

    // const 

    // Map library items to MediaItemProps
    const libraryAsMediaItems = library.map(l => ({
        id: l.works.id,
        type: l.works.work_types?.type || 'unknown',
        title: l.works.title || 'Untitled',
        cover: l.works.cover || '',
        author_name: l.works.profiles.username || 'Anonymous',
        rating: 0,
        episodeCount: 0
    }));

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 mt-16 sm:mt-0">
            {/* Mobile Feed */}

            {/* Hero Section */}
            <section className="relative">
                <HeroCarousel items={popularWorksAsMediaItems} />
            </section>
            
            {
                libraryAsMediaItems.length > 0 && (
                    <MediaCarousel
                        title="Next in your library"
                        items={libraryAsMediaItems}
                    />
                )
            }
            <MobileFeed />

            {/* Content Sections */}
            <section className="relative pb-12">
                <div className="space-y-8">
                    <div className="hidden sm:block">

                        <MediaCarousel
                            title="Popular Novel or Comics"
                            items={popularNovelsAsMediaItems}
                        />

                        <MediaCarousel
                            title="Popular Comics"
                            items={popularComicsAsMediaItems}
                        />

                        <MediaCarousel
                            title="Popular Movies"
                            items={popularMovieAsMediaItems}
                        />

                        <MediaCarousel
                            title="Popular Series"
                            items={popularSeriesAsMediaItems}
                        />
                    </div>

                    <TopCreators creators={topCreators} />

                    <div className="w-3/5 h-80 gradient-bg mx-auto mt-8 rounded-3xl sm:flex flex-col justify-center items-center hidden">
                        <h1 className='text-white font-bold text-4xl mb-4'>Take LiniAksara With You</h1>
                        <p className='text-white text-xl max-w-xl text-center'>join our newsletter for early access to new stories and community events.</p>
                        <button className='mt-4 px-6 py-2 rounded-full text-xl font-bold text-white bg-white/30 backdrop-blur-md transition-opacity hover:opacity-80'>
                            Subscribe Now
                        </button>
                    </div>

                </div>
            </section>
        </main>
    );
}
