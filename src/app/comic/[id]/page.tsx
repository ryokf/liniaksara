import { notFound } from 'next/navigation';
import { getWorkDetail, getRelatedWorks, getWorkParts } from '@/services/workDetailService';
import ComicDetailTemplate from '@/components/templates/ComicDetailTemplate';
import { Part, Genre } from '@/types/works';

type PageProps = {
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

    // Transform genres to match the expected type
    const transformedGenres = work.genres?.map((genre: Genre) => ({
        id: genre.id,
        genre: genre.genre
    })) || [];

    return (
        <ComicDetailTemplate 
            title={work.title || ""}
            category={work.workType?.type || "Comic"}
            releaseDate={new Date(work.created_at).toLocaleDateString()}
            rating="0"
            description={work.description || ""}
            coverImage={work.cover || "/images/default-cover.svg"}
            genres={transformedGenres}
            author={work.author?.username || "Unknown"}
            publisher="Self Published"
            chapters={parts.map(part => ({
                id: part.id,
                workId: part.work_id,
                type: "chapter",
                title: part.title || `Part ${part.part_number || 0}`
            }))}
            relatedWorks={relatedWorks.map(related => ({
                id: related.id,
                title: related.title || "",
                cover: related.cover || "/images/default-cover.svg",
                rating: "0"
            }))}
        />
    );
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
