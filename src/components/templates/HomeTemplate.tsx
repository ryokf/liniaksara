import { useEffect, useState } from 'react';
import { Work } from '@/types/works';
import { WorkTransaction } from '@/types/workTransaction';
import { User } from '@supabase/supabase-js';
import { getPopularBooks, getPopularVideos, getPopularWorks } from '@/services/workServices';
import { getWorkTransactions } from '@/services/WorkTransactionService';
import { getUser } from '@/services/userServices';
import { featuredContent } from '@/constants/featured';
import HeroCarousel from '../organisms/HeroCarousel';
import MediaCarousel from '../organisms/MediaCarousel';
import TopCreators from '../organisms/TopCreators';
import MobileFeed from './MobileFeed';
import { getTopCreators, TopCreator } from '@/services/creatorService';

export default function HomeTemplate() {
    const [popularWorks, setPopularWorks] = useState<Work[]>([]);
    const [library, setLibrary] = useState<WorkTransaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [popularBooks, setPopularBooks] = useState<Work[]>([]);
    const [popularVideos, setPopularVideos] = useState<Work[]>([]);
    const [topCreators, setTopCreators] = useState<TopCreator[]>([]);
    const [user, setUser] = useState<User | null>(null);

    const fetchPopularWorks = async () => {
        try {
            const works = await getPopularWorks();
            setPopularWorks(works);
            console.log("Popular works fetched:", works);
        } catch (error) {
            console.error("Failed to fetch popular works:", error);
        }
    }

    const fetchUser = async () => {
        const user = await getUser();
        setUser(user || null);
        console.log("User fetched:", user?.id);
    }

    const fetchPopularBooks = async () => {
        try {
            const books = await getPopularBooks();
            setPopularBooks(books);
            console.log("Popular books fetched:", books);
        } catch (error) {
            console.error("Failed to fetch popular books:", error);
        }
    }

    const fetchPopularVideos = async () => {
        try {
            const videos = await getPopularVideos();
            setPopularVideos(videos);
            console.log("Popular videos fetched:", videos);
        } catch (error) {
            console.error("Failed to fetch popular videos:", error);
        }
    }

    const fetchWorkTransactions = async (buyerId: string | null | undefined) => {
        try {
            if (!buyerId) throw new Error("Buyer ID is required");
            const library = await getWorkTransactions(buyerId);
            setLibrary(library);
            console.log("Work transactions fetched:", library);
        } catch (error) {
            console.error("Failed to fetch work transactions:", error);
        }
    }

    const fetchTopCreators = async () => {
        try {
            const creators = await getTopCreators();
            setTopCreators(creators);
            console.log("Top creators fetched:", creators);
        } catch (error) {
            console.error("Failed to fetch top creators:", error);
        }
    }

    useEffect(() => {
        fetchPopularBooks();
        fetchPopularWorks();
        fetchPopularVideos();
        fetchTopCreators();
        fetchUser();
    }, []);

    useEffect(() => {
        if (user) {
            fetchWorkTransactions(user.id);
        }
    }, [user]);

    console.log("Top creators:", topCreators);

    const popularWorksAsMediaItems = popularWorks.map(work => ({
        id: work.id,
        title: work.title,
        subtitle: work.work_type?.type || "Work", 
        description: work.description || "",
        image: work.cover || "",
        rating: "0"
    }));

    const popularBooksAsMediaItems = popularBooks.map(book => ({
        id: book.id,
        type: book.work_type?.type || "Book",
        title: book.title,
        cover: book.cover || "",
        author_name: book.profiles?.username || "Anonymous",
        rating: 0,
        episodeCount: 0
    }));

    
    const popularVideosAsMediaItems = popularVideos.map(video => ({
        id: video.id,
        type: video.work_type?.type || "Video",
        title: video.title,
        cover: video.cover || "",
        author_name: video.profiles?.username || "Anonymous",
        rating: 0,
        episodeCount: 0
    }));

    console.log("Popular videos as media items:", popularVideosAsMediaItems);
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
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 mt-16">
            {/* Mobile Feed */}

            {/* Hero Section */}
            <section className="relative">
                <HeroCarousel items={popularWorksAsMediaItems} />
            </section>
            <MobileFeed />

            {/* Content Sections */}
            <section className="relative pb-12">
                <div className="space-y-8">
                    <div className="hidden sm:block">
                        {
                            libraryAsMediaItems.length > 0 && (
                                <MediaCarousel
                                    title="Next in your library"
                                    items={libraryAsMediaItems}
                                />
                            )
                        }

                        <MediaCarousel
                        title="Popular Novel or Comics"
                        items={popularBooksAsMediaItems}
                        />
                        
                        <MediaCarousel
                        title="Popular Movies or Shows"
                        items={popularVideosAsMediaItems}
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
