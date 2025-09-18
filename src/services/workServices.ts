import supabase from '@/config/supabase';
import { Work } from '@/types/works';

/**
 * Constants for query limits
 */
const DEFAULT_LIMIT = 10;
const POPULAR_WORKS_LIMIT = 4;

/**
 * Fetches the latest works with author information and parts count
 * @param limit - Maximum number of works to return
 * @returns Promise resolving to an array of Work objects
 */
export const getLatestWorks = async (limit: number = DEFAULT_LIMIT): Promise<Work[]> => {
    const { data, error } = await supabase
        .from('works')
        .select(`
            *,
            work_type:work_types(*),
            author:author_id(
                id,
                email,
                user_metadata
            ),
            parts(count)
        `)
        .eq('is_draft', false)
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Error fetching latest works:', error);
        throw new Error(`Failed to fetch latest works: ${error.message}`);
    }

    return data.map(work => ({
        ...work,
        author: {
            id: work.author.id,
            email: work.author.email,
            displayName: work.author.user_metadata?.full_name,
            photo: work.author.user_metadata?.picture,
        },
        parts_count: work.parts?.[0]?.count || 0
    })) as Work[];
}

/**
 * Fetches the latest one-page works with author information
 * @returns Promise resolving to an array of Work objects
 */
export const getLatestOnePageWorks = async (): Promise<Work[]> => {
    const {data, error} = await supabase
        .from('works')
        .select(`
            *,
            author:author_id(*)
        `)
        .eq('work_type_id', 21)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching latest one-page works:', error);
        throw new Error(`Failed to fetch latest one-page works: ${error.message}`);
    }

    return data.map(work => ({
        ...work,
        author: {
            id: work.author.id,
            email: work.author.email,
            username: work.author.username,
            photo_url: work.author.photo_url,
        },
        parts_count: work.parts?.[0]?.count || 0
    })) as Work[];
}

/**
 * Fetches popular works based on creation date
 * @returns Promise resolving to an array of Work objects
 */
export const getPopularWorks = async (): Promise<Work[]> => {
    const { data, error } = await supabase
        .from('works')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(POPULAR_WORKS_LIMIT);

    if (error) {
        console.error('Error fetching popular works:', error);
        throw new Error(`Failed to fetch popular works: ${error.message}`);
    }

    return data as Work[];
}

/**
 * Fetches popular works by type
 * @param typeId - The work type ID to filter by
 * @returns Promise resolving to an array of Work objects
 */
export const getPopularWorkByType = async (typeId: number): Promise<Work[]> => {
    const { data, error } = await supabase
        .from('works')
        .select('*, work_types(*), profiles(*)')
        .eq('work_type_id', typeId)
        .order('created_at', { ascending: false })
        .limit(DEFAULT_LIMIT);

    if (error) {
        console.error('Error fetching popular works by type:', error);
        throw new Error(`Failed to fetch popular works by type: ${error.message}`);
    }

    return data as Work[];
}
