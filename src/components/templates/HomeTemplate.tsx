import { featuredContent } from '@/constants/featured';
import HeroCarousel from '../organisms/HeroCarousel';
import MediaCarousel from '../organisms/MediaCarousel';
import TopCreators from '../organisms/TopCreators';
import { latestComics, latestNovels, latestMovies } from '@/constants/media';

export default function HomeTemplate() {
    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Hero Section */}
            <section className="relative">
                <HeroCarousel items={featuredContent} />
            </section>

            {/* Content Sections */}
            <section className="relative pb-12">
                <div className="space-y-8">
                    <MediaCarousel
                        title="Next Watch or Read"
                        items={latestComics}
                    />

                    <MediaCarousel
                        title="Latest Comics"
                        items={latestComics}
                    />

                    <MediaCarousel
                        title="Latest Novels"
                        items={latestNovels}
                    />

                    <MediaCarousel
                        title="Latest Movies"
                        items={latestMovies}
                    />

                    <TopCreators />

                    <div className="w-3/5 h-80 gradient-bg mx-auto mt-8 rounded-3xl flex flex-col justify-center items-center">
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
