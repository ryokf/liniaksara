export const runtime = 'nodejs';
import { notFound } from 'next/navigation';
import { getWorkDetail, getRelatedWorks, getWorkParts } from '@/services/workDetailService';
import MovieDetailTemplate from '@/components/templates/MovieDetailTemplate';
import { WorkDetail, MoviePart } from '@/types/workDetail';
import { WorkGenre, Genre } from '@/types/works';

interface PageProps {
    params: {
        id: string;
    };
    searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function MovieDetailPage({ params }: PageProps) {
    const work = await getWorkDetail(params.id);
    if (!work) notFound();

    // Fetch parts and related works in parallel
    const [parts, relatedWorks] = await Promise.all([
        getWorkParts(params.id),
        getRelatedWorks(work.author?.id || '', params.id)
    ]);

    // Transform and sort parts
    const movieParts = parts.map(part => ({
        id: part.id,
        work_id: part.work_id,
        title: part.title,
        thumbnail: part.thumbnail || '',
        is_free: false, // Default value
        part_order: part.part_order || 0, // Default to 0 if not set
        duration: 0, // Default value
        content_url: part.content_url || '', // Use content_url from parts table
        created_at: part.created_at,
        description: part.description || ''
    })) as MoviePart[];
    const sortedParts = movieParts.sort((a, b) => a.part_order - b.part_order);

    // Transform genres
    const genres: WorkGenre[] = work.workType ? [{
        work_id: work.id,
        genre_id: work.workType.id,
        genres: {
            id: work.workType.id,
            genre: work.workType.type
        }
    }] : [];

    // Transform data for the template
    const movieData = {
        title: work.title,
        category: 'Movie',
        releaseDate: new Date(work.created_at).toLocaleDateString(),
        rating: '0', // TODO: Implement rating system
        description: work.description || '',
        coverImage: work.cover || '/images/default-cover.svg',
        price: work.price || 0,
        genres,
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
