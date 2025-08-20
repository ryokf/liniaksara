import { notFound } from 'next/navigation';
import { getWorkDetail, getRelatedWorks, getWorkParts } from '@/services/workDetailService';
import ComicDetailTemplate from '@/components/templates/ComicDetailTemplate';
import { Part } from '@/types/works';

interface PageProps {
    params: {
        id: string;
    };
}


export default async function ComicDetailPage({ params }: PageProps) {
    const work = await getWorkDetail(params.id);
    if (!work) notFound();

    // Fetch episodes and related works in parallel
    const [parts, relatedWorks] = await Promise.all([
        getWorkParts(params.id),
        getRelatedWorks(work.author.id, params.id)
    ]);

    const chapters = await getWorkParts(params.id);

    const comicData = {
        title: work.title,
        category: work.workType?.type || "Comic",
        releaseDate: new Date(work.created_at).toLocaleDateString(),
        rating: work.rating?.toString() || "0",
        description: work.description,
        coverImage: work.cover || "/images/default-cover.svg",
        genres: work.work_genres ?? [],
        author: work.author.name,
        publisher: work.publisher || "Lini Aksara",
        chapters: chapters.map(chapter => ({
            id: chapter.id,
            workId: work.id,
            type: "comic",
            // chapterNumber: chapter.episode_number,
            title: chapter.title
        })),
        relatedWorks: relatedWorks.map(relatedWork => ({
            id: relatedWork.id,
            title: relatedWork.title,
            cover: relatedWork.cover || "/images/default-cover.svg",
            author: relatedWork.author.name,
            type: relatedWork.workType?.type
        }))
    };

    return <ComicDetailTemplate {...comicData} />;
}
