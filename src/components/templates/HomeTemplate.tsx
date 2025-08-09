import { featuredContent } from '@/constants/featured';
import HeroCarousel from '../organisms/HeroCarousel';
import MediaCarousel from '../organisms/MediaCarousel';
import TopCreators from '../organisms/TopCreators';
import MobileFeed from './MobileFeed';
import { useEffect, useState } from 'react';
import { Comic } from '@/types/comic';
import { getLatestComics } from '@/services/comicService';
import { Work } from '@/types/works';
// import { latestComics, latestNovels, latestMovies } from '@/constants/media';
import TopCreatorScroll from '../organisms/TopCreatorMobile';

export default function HomeTemplate() {
    const [popularWorks, setPopularWorks] = useState<Work[]>([]); // Placeholder for popular works
    const [latestComics, setLatestComics] = useState<Comic[]>([]);
    // const [latestNovels, setLatestNovels] = useState<any[]>([]);
    // const [latestMovies, setLatestMovies] = useState<any[]>([]);

    const fetchComics = async () => {
        try {
            const comics = await getLatestComics(6);
            setLatestComics(comics);
        } catch (error) {
            console.error("Failed to fetch comics:", error);
        }
    }

    const fetchPopularWorks = async () => {
        try {
            const { getPopularWorks } = await import('@/services/WorkService');
            const works = await getPopularWorks();
            setPopularWorks(works);
            console.log("Popular works fetched:", works);
        } catch (error) {
            console.error("Failed to fetch popular works:", error);
        }
    }

    useEffect(() => {
        fetchComics();
        fetchPopularWorks();
    }, []);

    // Map Comic[] to MediaItemProps[]
    const latestComicsAsMediaItems = latestComics.map(comic => ({
        id: comic.id,
        type: comic.work_type?.type || 'comic',
        title: comic.title,
        cover: comic.cover,
        author_name: comic.author.username,
        rating: 0, // TODO: Implement rating system
        episodeCount: comic.parts?.length || 0,
    }));

    const popularWorksAsMediaItems = popularWorks.map(work => ({
        id: work.id,
        title: work.title,
        subtitle: "Popular Movie", // Shorten description for subtitle
        description: work.description ?? "",
        image: work.cover ?? "",
        rating: "13+"
    }));

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Mobile Feed */}
            <MobileFeed />

            {/* Hero Section */}
            <section className="relative">
                <HeroCarousel items={popularWorksAsMediaItems} />
            </section>

            {/* Content Sections */}
            <section className="relative pb-12">
                <div className="space-y-8">
                    <div className="hidden sm:block">
                        {/* <MediaCarousel
                        title="Next Watch or Read"
                        items={latestWorksAsMediaItems}
                        /> */}

                        <MediaCarousel
                            title="Latest Comics"
                            items={latestComicsAsMediaItems}
                        />

                        {/* <MediaCarousel
                        title="Latest Novels"
                        items={latestNovels}
                        />
                        
                        <MediaCarousel
                        title="Latest Movies"
                        items={latestMovies}
                        /> */}
                    </div>

                    <TopCreators />
                    <TopCreatorScroll></TopCreatorScroll>

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
