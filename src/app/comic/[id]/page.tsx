export const runtime = 'nodejs';
import { notFound } from 'next/navigation';
import { getWorkDetail, getRelatedWorks, getWorkParts } from '@/services/workDetailService';
import ComicDetailTemplate from '@/components/templates/ComicDetailTemplate';
import { Part, WorkType, WorkGenre } from '@/types/works';
import { WorkDetail } from '@/types/workDetail';

interface ChapterData {
    id: string;
    workId: string;
    type: string;
    title: string;
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
        title: part.title
    }));

    // Transform related works
    const transformedRelatedWorks: RelatedWorkData[] = relatedWorks.map(related => ({
        id: related.id,
        title: related.title || "",
        cover: related.cover || "/images/default-cover.svg",
        rating: "0"
    }));

    // Use workType property for genre information
    const genres = work.workType ? [{
        work_id: work.id,
        genre_id: work.workType.id,
        genres: {
            id: work.workType.id,
            genre: work.workType.type
        }
    }] : [];

    const templateProps = {
        id: work.id,
        title: work.title,
        category: work.workType?.type || "Comic",
        releaseDate: new Date(work.created_at).toLocaleDateString(),
        rating: "0",
        description: work.description || "",
        coverImage: work.cover || "/images/default-cover.svg",
        genres,
        author: work.author?.username || "Unknown",
        authorId: work.author?.id || "",
        publisher: "Self Published",
        chapters,
        relatedWorks: transformedRelatedWorks
    };

    return <ComicDetailTemplate {...templateProps} />;
}
