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
        return [];
    }

    return data || [];
};

/**
 * Fetches works from users that the current user follows
 * @param userId - The ID of the current user
 * @param limit - Maximum number of works to return
 * @returns Promise resolving to an array of Work objects
 */
export const getFollowingWorks = async (userId: string, limit: number = DEFAULT_LIMIT): Promise<Work[]> => {
    if (!userId) {
        console.error('User ID is required to fetch following works');
        return [];
    }

    // First, get the IDs of users we follow
    const { data: followData } = await supabase
        .from('follows')
        .select('following_id')
        .eq('follower_id', userId);

    const followingIds = followData?.map(f => f.following_id) || [];
    
    if (followingIds.length === 0) {
        return [];
    }

    // Then get the works from those users
    const { data, error } = await supabase
        .from('works')
        .select(`
            *,
            work_type:work_types(*),
            author:author_id(
                id,
                username,
                photo_url
            ),
            parts(count)
        `)
        .eq('is_draft', false)
        .in('author_id', followingIds)
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Error fetching works from followed users:', error);
        return [];
    }

    return data || [];
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
        throw new Error(`Failed to fetch latest one-page works: ${error?.message ?? ''}`);
    }

    return (data ?? []).map(work => ({
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

    return (data ?? []) as Work[];
}

/**
 * Fetches popular works by type ID
 * @param typeId - The work type ID to filter by
 * @returns Promise resolving to an array of Work objects
 */
export const getPopularWorkByType = async (typeId: number): Promise<Work[]> => {
    const { data, error } = await supabase
        .from('works')
        .select('*, work_types(*), author:profiles!works_author_id_fkey(*)')
        .eq('work_type_id', typeId)
        .eq('is_draft', false)
        .order('created_at', { ascending: false })
        .limit(DEFAULT_LIMIT);

    if (error) {
        console.error('Error fetching popular works by type:', error);
        throw new Error(`Failed to fetch popular works by type: ${error.message}`);
    }

    return (data ?? []) as Work[];
}

/**
 * Fetches popular works by type name (safer than using ID)
 * @param typeName - The work type name string, e.g. 'Komik', 'Novel', 'Anime'
 * @returns Promise resolving to an array of Work objects
 */
export const getPopularWorksByTypeName = async (typeName: string): Promise<Work[]> => {
    const { data, error } = await supabase
        .from('works')
        .select(`
            *,
            work_type:work_types!works_work_type_id_fkey(*),
            profiles:author_id(*)
        `)
        .eq('work_types.type', typeName)
        .eq('is_draft', false)
        .order('created_at', { ascending: false })
        .limit(DEFAULT_LIMIT);

    if (error) {
        console.error('Error fetching popular works by type name:', error);
        return [];
    }

    return (data ?? []) as Work[];
}

/**
 * Fetches popular works by multiple type names at once
 * @param typeNames - Array of type name strings
 * @returns Promise resolving to an array of Work objects (combined & deduplicated)
 */
export const getPopularWorksByTypeNames = async (typeNames: string[]): Promise<Work[]> => {
    if (!typeNames.length) return [];

    // Get the IDs for the given type names first
    const { data: typeData, error: typeError } = await supabase
        .from('work_types')
        .select('id')
        .in('type', typeNames);

    if (typeError || !typeData?.length) {
        console.error('Error fetching work type IDs:', typeError);
        return [];
    }

    const typeIds = typeData.map(t => t.id);

    const { data, error } = await supabase
        .from('works')
        .select(`
            *,
            work_type:work_types(*),
            profiles:author_id(*)
        `)
        .in('work_type_id', typeIds)
        .eq('is_draft', false)
        .order('likes', { ascending: false })
        .limit(DEFAULT_LIMIT);

    if (error) {
        console.error('Error fetching popular works by type names:', error);
        return [];
    }

    return (data ?? []) as Work[];
}
