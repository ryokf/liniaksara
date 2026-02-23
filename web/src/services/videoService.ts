import supabase from '@/config/supabase';
import { Episode } from '@/types/episode';

export const getVideoEpisodeById = async (episodeId: string): Promise<Episode | null> => {
    try {
        // First get the episode with work details
        const { data: episode, error } = await supabase
            .from('parts')
            .select(`
                *,
                work:work_id (
                    id,
                    title,
                    author_id,
                    work_type_id,
                    is_draft,
                    description
                )
            `)
            .eq('id', episodeId)
            .single();


        if (error) throw error;

        // Then get the next and previous episodes
        if (episode) {
            const { data: siblingParts, error: siblingError } = await supabase
                .from('parts')
                .select('id, part_order')
                .eq('work_id', episode.work_id)
                .order('part_order', { ascending: true });

            if (siblingError) throw siblingError;

            if (siblingParts) {
                // Ensure we compare the same type (ids may be number in DB and string in params)
                const currentIndex = siblingParts.findIndex(p => String(p.id) === String(episodeId));

                if (currentIndex === -1) {
                    console.warn('[getVideoEpisodeById] episodeId not found among siblingParts', { episodeId, siblingParts });
                } else {
                    if (currentIndex > 0) {
                        episode.previous_part_id = siblingParts[currentIndex - 1].id;
                    }
                    if (currentIndex < siblingParts.length - 1) {
                        episode.next_part_id = siblingParts[currentIndex + 1].id;
                    }
                }
            }

            // Don't return if work is draft or not a video type
            // if (episode.work.is_draft || ![3, 4].includes(episode.work.work_type_id)) {
            //     return null;
            // }
        }
        console.log("Fetched episode:", episode);

        return episode;
    } catch (error) {
        console.error('Error fetching episode:', error);
        return null;
    }
};

export const getSeriesEpisodes = async (seriesId: string): Promise<Episode[]> => {
    try {
        const { data: episodes, error } = await supabase
            .from('parts')
            .select(`
                *,
                work:work_id (
                    id,
                    title,
                    author_id,
                    work_type_id,
                    is_draft,
                    description
                )
            `)
            .eq('work_id', seriesId)
            .order('part_order', { ascending: true });

        if (error) throw error;

        // Filter out episodes if work is draft or not a video type
        return episodes.filter(episode =>
            !episode.work.is_draft && [3, 4].includes(episode.work.work_type_id)
        );
    } catch (error) {
        console.error('Error fetching episodes:', error);
        return [];
    }
};
