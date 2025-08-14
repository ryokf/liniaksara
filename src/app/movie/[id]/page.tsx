import { notFound } from 'next/navigation';
import { getWorkDetail, getRelatedWorks, getWorkParts } from '@/services/workDetailService';
import MovieDetailTemplate from '@/components/templates/MovieDetailTemplate';
import { WorkDetail, MoviePart } from '@/types/workDetail';

interface PageProps {
    params: {
        id: string;
    };
}

export default async function MovieDetailPage({ params }: PageProps) {
    const work = await getWorkDetail(params.id);
    if (!work) notFound();

    // Fetch parts and related works in parallel
    const [parts, relatedWorks] = await (Promise.all([
        getWorkParts(params.id),
        getRelatedWorks(work.author.id, params.id)
    ]) as unknown as [MoviePart[], WorkDetail[]]);

    // Sort parts by part order
    const sortedParts = parts.sort((a, b) => a.part_order - b.part_order);

    // Transform data for the template
    const movieData = {
        title: work.title,
        category: 'Movie',
        releaseDate: new Date(work.created_at).toLocaleDateString(),
        rating: '0', // TODO: Implement rating system
        description: work.description || '',
        coverImage: work.cover || '/images/default-cover.svg',
        price: work.price || 0,
        // Adapt to MovieDetailTemplate expected shape: { genres: { genre: string } }
        genres: work.work_genres,
        director: work.author?.username || 'Unknown',
        episodes: sortedParts.map((part) => ({
            id: part.id.toString(),
            partOrder: part.part_order,
            title: part.title,
            thumbnail: part.thumbnail || '/images/default-cover.svg',
            duration: part.duration ? `${Math.floor(part.duration / 60)}m ${part.duration % 60}s` : 'Unknown',
            isFree: part.is_free,
        })),
        relatedWorks: relatedWorks.map((relatedWork) => ({
            id: relatedWork.id,
            title: relatedWork.title,
            cover: relatedWork.cover || '/images/default-cover.svg',
            director: relatedWork.author?.username || 'Unknown',
            type: 'Movie',
            price: relatedWork.price || 0,
        })),
    };

    return <MovieDetailTemplate {...movieData} />;
}
