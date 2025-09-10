import supabase from '@/config/supabase';
import { Work } from '@/types/works';

export async function getUserWorks(userId: string): Promise<Work[]> {
    const { data, error } = await supabase
        .from('works')
        .select(`
            *,
            work_type:work_types(*),
            author:profiles(*)
        `)
        .eq('author_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching user works:', error);
        throw error;
    }

    return data || [];
}
