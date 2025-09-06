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

interface PageProps {
    params: {
        id: string;
    };
    searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function ComicDetailPage({ params }: PageProps) {
    const work = await getWorkDetail(params.id);
    if (!work) notFound();

    // Fetch episodes and related works in parallel
    const [parts, relatedWorks] = await Promise.all([
        getWorkParts(params.id),
        getRelatedWorks(work.author?.id || '', params.id)
    ]);

    // Transform parts to chapters
    const chapters: ChapterData[] = parts.map(part => ({
        id: String(part.id),
        workId: part.work_id,
        type: "chapter",
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
        title: work.title,
        category: work.workType?.type || "Comic",
        releaseDate: new Date(work.created_at).toLocaleDateString(),
        rating: "0",
        description: work.description || "",
        coverImage: work.cover || "/images/default-cover.svg",
        genres,
        author: work.author?.username || "Unknown",
        publisher: "Self Published",
        chapters,
        relatedWorks: transformedRelatedWorks
    };

    return <ComicDetailTemplate {...templateProps} />;
}
