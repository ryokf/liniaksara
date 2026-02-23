export const runtime = 'nodejs';
import { notFound } from 'next/navigation';
import { getWorkDetail, getRelatedWorks, getWorkParts } from '@/services/workDetailService';
import { WorkDetail, MoviePart } from '@/types/workDetail';
import { WorkGenre } from '@/types/works';
import WorkDetailTemplate from '@/components/templates/WorkDetailTemplate';

export default async function MovieDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const work = await getWorkDetail(id);
    if (!work) notFound();

    // Fetch parts and related works in parallel
    const [parts, relatedWorks] = await Promise.all([
        getWorkParts(id),
        getRelatedWorks(work.author?.id || '', id)
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
    const genres = work.work_genres?.map(wg => ({
        work_id: wg.work_id,
        genre_id: wg.genre_id,
        genres: {
            id: wg.genres?.id || 0,
            genre: wg.genres?.genre || ''  // Convert 'name' to 'genre'
        }
    })) || [];


    // Transform data for the template
    const movieData = {
        id: work.id,
        title: work.title,
        category: 'Movie',
        releaseDate: new Date(work.created_at).toLocaleDateString(),
        rating: '0', // TODO: Implement rating system
        description: work.description || '',
        coverImage: work.cover || '/images/default-cover.svg',
        price: work.price || 0,
        genres,
        author: work.author?.username || 'Unknown',
        authorId: work.author?.id || '',
        publisher: 'Self Published',
        chapters: sortedParts.map((part) => ({
            id: part.id.toString(),
            workId: part.work_id,
            type: "movie",
            part_order: part.part_order,
            title: part.title,
            thumbnail: part.thumbnail || '/images/default-cover.svg',
            is_free: part.is_free,
        })),
    };

    return <WorkDetailTemplate {...movieData} />;
}
