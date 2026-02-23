import supabase from "@/config/supabase";

/**
 * Interfaces for work detail related data
 */

/**
 * Interface representing a genre
 */
interface Genre {
    id: number;
    genre: string;
}

/**
 * Interface representing a work-genre relationship
 */
interface WorkGenre {
    id: number;
    work_id: string;
    genre_id: number;
    genres: Genre;
}

/**
 * Interface representing a part of a work
 */
interface Part {
    id: string;
    work_id: string;
    title: string;
    part_order: number;
    description?: string;
    thumbnail?: string;
    content_url?: string;
    is_free?: boolean;
    created_at: string;
    updated_at: string;
}

/**
 * Interface representing detailed information about a work
 */
export interface WorkDetail {
    id: string;
    title: string;
    description: string;
    cover?: string;
    workType: {
        id: number;
        type: string;
    };
    author: {
        id: string;
        username: string;
        name: string;
        photo_url?: string;
    };
    work_genres?: WorkGenre[];
    parts?: Part[];
    publisher?: string;
    created_at: string;
    updated_at: string;
    price?: number;
    rating?: number;
    totalSales?: number;
    episodeCount?: number;
    // Additional fields for movies
    duration?: string;
    cast?: string;
}

/**
 * Interface representing an episode of a work
 */
export interface Episode {
    id: string;
    work_id: string;
    part_id?: string;
    title: string;
    description?: string;
    season_number?: number;
    episode_number: number;
    thumbnail?: string;
    content_url?: string;
    created_at: string;
    updated_at: string;
}

/**
 * Get detailed information about a work by its ID
 * @param id - The ID of the work to fetch
 * @returns Promise resolving to WorkDetail object or null if not found
 */
export const getWorkDetail = async (id: string): Promise<WorkDetail | null> => {
    try {
        const { data: work, error } = await supabase
            .from('works')
            .select(`
                *,
                workType:work_type_id (id, type),
                author:author_id (
                    id,
                    username,
                    photo_url
                ),
                work_genres(*, genres(*)),
                parts(*)
            `)
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching work detail:', error);
            throw new Error(`Failed to fetch work detail: ${error.message}`);
        }
        
        return work;
    } catch (error) {
        console.error('Error fetching work detail:', error);
        return null;
    }
};

/**
 * Get all parts/chapters for a work
 * @param workId - The ID of the work to fetch parts for
 * @returns Promise resolving to an array of Part objects
 */
export const getWorkParts = async (workId: string): Promise<Part[]> => {
    try {
        const { data: parts, error } = await supabase
            .from('parts')
            .select('*')
            .eq('work_id', workId)
            .order('part_order', { ascending: true });

        if (error) {
            console.error('Error fetching work parts:', error);
            throw new Error(`Failed to fetch work parts: ${error.message}`);
        }
        
        return parts || [];
    } catch (error) {
        console.error('Error fetching work parts:', error);
        return [];
    }
};

/**
 * Get related works by the same creator
 * @param creatorId - The ID of the creator
 * @param excludeWorkId - The ID of the work to exclude from results
 * @returns Promise resolving to an array of WorkDetail objects
 */
export const getRelatedWorks = async (creatorId: string, excludeWorkId: string): Promise<WorkDetail[]> => {
    try {
        const { data: works, error } = await supabase
            .from('works')
            .select(`
                *,
                workType:work_type_id (id, type),
                author:author_id (
                    id,
                    username,
                    photo_url
                )
            `)
            .eq('author_id', creatorId)
            .neq('id', excludeWorkId)
            .limit(4);

        if (error) throw error;
        return works || [];
    } catch (error) {
        console.error('Error fetching related works:', error);
        return [];
    }
};
