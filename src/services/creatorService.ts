import supabase from '@/config/supabase';

// Interfaces yang sesuai dengan struktur database
export interface Profile {
    id: string;
    username: string;
    name: string;
    photo?: string;
    isVerified?: boolean;
}

export interface TopCreator extends Profile {
    sales: number;
    worksCount: number;
}

interface CreatorStats {
    author_id: string;
    name: string;
    username: string;
    avatar_url: string | null;
    total_sales: number;
    works_count: number;
}

export async function getTopCreators(limit: number = 10): Promise<TopCreator[]> {
    try {
        // Get top creators using our stored procedure
        const { data, error } = await supabase
            .rpc('get_top_creators', { limit_count: limit }) as { 
                data: CreatorStats[], 
                error: Error | null 
            };

        if (error) throw error;
        if (!data?.length) return [];

        // Map the results to our TopCreator interface
        return data.map(creator => ({
            id: creator.author_id,
            name: creator.name,
            username: creator.username,
            photo: creator.avatar_url || undefined,
            worksCount: Number(creator.works_count),
            sales: Number(creator.total_sales),
            isVerified: creator.works_count > 0 // Verifikasi jika sudah punya karya
        }));

    } catch (error) {
        console.error('Error fetching top creators:', error);
        return []; // Return empty array instead of throwing error
    }
}
