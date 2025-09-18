import supabase from '@/config/supabase';
import { Work } from '@/types/works';
import { PostgrestError } from '@supabase/supabase-js';

/**
 * Constants
 */
const DEFAULT_SEARCH_LIMIT = 20;

/**
 * Types of search that can be performed
 */
export type SearchType = 'works' | 'users';

/**
 * Interface representing a user in search results
 */
export interface SearchUser {
    id: string;
    username: string;
    full_name?: string;
    photo_url?: string;
    works?: Array<{
        id: string;
        title: string;
        cover?: string;
        work_type?: {
            id: string;
            name: string;
        };
    }>;
}

/**
 * Interface representing combined search results
 */
export interface SearchResults {
    works: Work[];
    users: SearchUser[];
    type: SearchType;
}

/**
 * Search for works by title
 * @param query - The search query string
 * @returns Promise resolving to an array of Work objects
 */
export async function searchWorks(query: string): Promise<Work[]> {
    if (!query) return [];
    
    try {
        const { data, error } = await supabase
            .from('works')
            .select(`
                *,
                work_type:work_types!work_type_id(*),
                author:profiles!author_id(
                    id,
                    username,
                    photo_url
                )
            `)
            .ilike('title', `%${query}%`)
            // .eq('is_draft', false)

        if (error) {
            console.error('Error searching works:', error);
            throw new Error(`Failed to search works: ${error.message}`);
        }
        
        return data || [];
    } catch (err) {
        console.error('Error in searchWorks:', err);
        throw new Error(`Unexpected error searching works: ${err instanceof Error ? err.message : String(err)}`);
    }
}

/**
 * Search for users by username
 * @param query - The search query string
 * @returns Promise resolving to an array of SearchUser objects
 */
export async function searchUsers(query: string): Promise<SearchUser[]> {
    if (!query) return [];
    
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select(`
                id,
                username,
                photo_url
            `)
            .ilike('username', `%${query}%`)
            .limit(DEFAULT_SEARCH_LIMIT);

        if (error) {
            console.error('Error searching users:', error);
            throw new Error(`Failed to search users: ${error.message}`);
        }
        
        const transformedData = data?.map(user => ({
            id: user.id,
            username: user.username,
            full_name: user.username,
            photo_url: user.photo_url,
        })) || [];

        return transformedData;
    } catch (err) {
        console.error('Error in searchUsers:', err);
        throw new Error(`Unexpected error searching users: ${err instanceof Error ? err.message : String(err)}`);
    }
}

/**
 * Perform a search for works or users
 * @param query - The search query string
 * @param type - The type of search to perform (works or users)
 * @returns Promise resolving to SearchResults object
 */
export async function search(query: string, type: SearchType = 'works'): Promise<SearchResults> {
    if (!query) return { works: [], users: [], type };

    try {
        if (type === 'works') {
            const works = await searchWorks(query);
            return { works, users: [], type };
        } else {
            const users = await searchUsers(query);
            return { works: [], users, type };
        }
    } catch (error) {
        console.error('Search error:', error);
        const message = error instanceof Error ? error.message : 'Unknown error occurred';
        throw new Error(`Failed to perform search: ${message}`);
    }
}
