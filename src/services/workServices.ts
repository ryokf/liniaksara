import supabase from '@/config/supabase';
import { Work } from '@/types/works';

export const getLatestWorks = async (limit: number = 10): Promise<Work[]> => {
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

export const getLatestOnePageWorks = async () => {
    const {data, error} = await supabase
        .from('works')
        .select(`
            *,
            author:author_id(*)
        `)
        .eq('work_type_id', 21)
        .order('created_at', { ascending: false })

    if (error) {
        throw new Error(`Failed to fetch latest works: ${error.message}`);
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

export const getPopularWorks = async (): Promise<Work[]> => {
    try {
        const { data, error } = await supabase
            .from('works')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(4);

        if (error) throw error;

        return data as Work[];
    } catch (error) {
        console.error('Error fetching popular works:', error);
        throw error;
    }
}

export const getPopularWorkByType = async (typeId: number): Promise<Work[]> => {
    try {
        const { data, error } = await supabase
            .from('works')
            .select('*')
            .eq('work_type_id', typeId)
            .order('created_at', { ascending: false })
            .limit(10);

        if (error) throw error;

        return data as Work[];
    } catch (error) {
        console.error('Error fetching popular works by type:', error);
        throw error;
    }
}
