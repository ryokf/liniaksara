import supabase from "@/config/supabase";
import { Work } from "@/types/works";

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
