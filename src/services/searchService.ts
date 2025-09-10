import supabase from '@/config/supabase';
import { Work } from '@/types/works';
import { PostgrestError } from '@supabase/supabase-js';

export type SearchType = 'works' | 'users';

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

export interface SearchResults {
    works: Work[];
    users: SearchUser[];
    type: SearchType;
}

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

            console.log('Search query:', query);
            console.log('Supabase response data:', data);
            console.log('Supabase response error:', error);
            
            // .eq('is_draft', false)

        if (error) {
            console.error('Error searching works:', error);
            throw new Error(`Failed to search works: ${error.message}`);
        }
        
        return data || [];
    } catch (err) {
        console.error('Error in searchWorks:', err);
        throw err;
    }
}

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
            // .limit(20);

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
        throw err;
    }
}

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
