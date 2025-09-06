export const runtime = 'nodejs';

import { notFound } from 'next/navigation';
import { getWorkDetail, getWorkParts } from '@/services/workDetailService';
import NovelDetailTemplate from '@/components/templates/NovelDetailTemplate';

export default async function NovelDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const work = await getWorkDetail(id);
  if (!work) notFound();

  // Fetch chapters
  const chapters = await getWorkParts(id);

  const novelData = {
    id: work.id,
    title: work.title,
    category: work.workType?.type || "Novel",
    releaseDate: new Date(work.created_at).toLocaleDateString(),
    rating: "0", // TODO: Implement rating system
    description: work.description || "",
    coverImage: work.cover || "/images/default-cover.svg",
    genres: work.work_genres ?? [],
    author: work.author?.username || "Unknown",
    publisher: "Lini Aksara",
    chapters: chapters.map((chapter, index) => ({
      id: chapter.id,
      chapterNumber: index + 1,
      title: chapter.title
    }))
  };

  return <NovelDetailTemplate {...novelData} />;
}
