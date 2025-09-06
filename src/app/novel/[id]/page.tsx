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

  // Transform genres to match WorkGenre interface
  const genres = work.work_genres?.map(wg => ({
    work_id: wg.work_id,
    genre_id: wg.genre_id,
    genres: {
      id: wg.genres?.id || 0,
      genre: wg.genres?.name || ''  // Convert 'name' to 'genre'
    }
  })) || [];

  const novelData = {
    id: work.id,
    title: work.title,
    category: work.workType?.type || "Novel",
    releaseDate: new Date(work.created_at).toLocaleDateString(),
    rating: "0", // TODO: Implement rating system
    description: work.description || "",
    coverImage: work.cover || "/images/default-cover.svg",
    genres,
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
