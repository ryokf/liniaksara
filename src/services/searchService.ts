import supabase from '@/config/supabase';
import { Work } from '@/types/works';

export async function searchWorks(query: string) {
    if (!query) return [];
    const { data, error } = await supabase
        .from('works')
        .select(`
            *,
            work_type:work_types(*),
            author:author_id(*)
        `)
        .eq('is_draft', false)
        .ilike('title', `%${query}%`);

    if (error) throw error;

    return data.map(work => ({
        ...work,
        author: {
            id: work.author.id,
            email: work.author.email,
            username: work.author.username,
            photo: work.author.photo_url,
        },
        parts_count: work.parts?.[0]?.count || 0
    })) as Work[];
}

// Bisa ditambah filter kategori, genre, dll jika dibutuhkan
