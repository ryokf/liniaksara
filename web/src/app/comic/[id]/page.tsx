export const runtime = 'nodejs';
import { notFound } from 'next/navigation';
import { getWorkDetail, getRelatedWorks, getWorkParts } from '@/services/workDetailService';
import WorkDetailTemplate from '@/components/templates/WorkDetailTemplate';

interface ChapterData {
    id: string;
    workId: string;
    type: string;
    part_order: number;
    title: string;
    thumbnail?: string;
    is_free: boolean;
}

interface RelatedWorkData {
    id: string;
    title: string;
    cover: string;
    rating: string;
}

export default async function ComicDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const work = await getWorkDetail(id);
    if (!work) notFound();

    // Fetch episodes and related works in parallel
    const [parts, relatedWorks] = await Promise.all([
        getWorkParts(id),
        getRelatedWorks(work.author?.id || '', id)
    ]);

    // Transform parts to chapters
    const chapters: ChapterData[] = parts.map(part => ({
        id: String(part.id),
        workId: part.work_id,
        type: "comic",
        part_order: part.part_order || 0,
        title: part.title,
        thumbnail: part.thumbnail || '/images/default-cover.svg',
        is_free: part.is_free || false
    }));

    // Transform related works
    const transformedRelatedWorks: RelatedWorkData[] = relatedWorks.map(related => ({
        id: related.id,
        title: related.title || "",
        cover: related.cover || "/images/default-cover.svg",
        rating: "0"
    }));

    // Use workType property for genre information
    const genres = work.work_genres?.map(wg => ({
        work_id: wg.work_id,
        genre_id: wg.genre_id,
        genres: {
            id: wg.genres?.id || 0,
            genre: wg.genres?.genre || ''  // Convert 'name' to 'genre'
        }
    })) || [];


    const templateProps = {
        id: work.id,
        title: work.title,
        category: work.workType?.type || "Comic",
        releaseDate: new Date(work.created_at).toLocaleDateString(),
        rating: "0",
        price: work.price?.toString() || "0",
        description: work.description || "",
        coverImage: work.cover || "/images/default-cover.svg",
        genres,
        author: work.author?.username || "Unknown",
        authorId: work.author?.id || "",
        publisher: "Self Published",
        chapters: chapters.map((chapter, index) => ({
            id: chapter.id,
            workId: id,
            type: "Comic",
            part_order: index + 1,
            title: chapter.title,
            is_free: chapter.is_free || false
        }))
    };

    return <WorkDetailTemplate {...templateProps} />;
}
