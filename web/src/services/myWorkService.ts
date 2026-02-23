import supabase from '@/config/supabase';
import { Work } from '@/types/works';

interface GetUserWorksResult {
    works: Work[];
    count: number;
}

export async function getUserWorks(
    userId: string,
    page: number = 1,
    limit: number = 10
): Promise<GetUserWorksResult> {
    // Calculate the range start for pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // Get total count first
    const { count, error: countError } = await supabase
        .from('works')
        .select('*', { count: 'exact', head: true })
        .eq('author_id', userId);

    if (countError) {
        console.error('Error getting total count:', countError);
        throw countError;
    }

    // Get paginated data
    const { data, error } = await supabase
        .from('works')
        .select(`
            *,
            work_type:work_types(*),
            author:profiles(*)
        `)
        .eq('author_id', userId)
        .order('created_at', { ascending: false })
        .range(from, to);

    if (error) {
        console.error('Error fetching user works:', error);
        throw error;
    }

    return {
        works: data || [],
        count: count || 0
    };
}
