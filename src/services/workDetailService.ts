import supabase from "@/config/supabase";

interface Genre {
    id: number;
    name: string;
}

interface WorkGenre {
    id: number;
    work_id: string;
    genre_id: number;
    genres: Genre;
}

interface Part {
    id: string;
    work_id: string;
    title: string;
    part_order: number;
    description?: string;
    thumbnail?: string;
    content_url?: string;
    created_at: string;
    updated_at: string;
}

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

// Get work details by ID
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

            console.log('Fetched work detail:', work);

        if (error) throw error;
        return work;
    } catch (error) {
        console.error('Error fetching work detail:', error);
        return null;
    }
};

// Get episodes/chapters for a work
export const getWorkParts = async (workId: string): Promise<Part[]> => {
    try {
        const { data: parts, error } = await supabase
            .from('parts')
            .select('*')
            .eq('work_id', workId)
            .order('part_order', { ascending: true });

        if (error) throw error;
        return parts || [];
    } catch (error) {
        console.error('Error fetching work parts:', error);
        return [];
    }
};

// Get related works by creator
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
