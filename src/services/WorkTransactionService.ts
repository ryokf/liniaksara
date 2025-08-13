import supabase from "@/config/supabase";
import { WorkTransaction } from "@/types/workTransaction";

export const getWorkTransactions = async (buyerId: string): Promise<WorkTransaction[]> => {
    const { data, error } = await supabase
        .from('work_transactions')
        .select('*, works(*, work_types(*), profiles(*))')
        .eq('buyer_id', buyerId);

    if (error) {
        console.error('Error fetching work transactions:', error);
        throw error;
    }

    return data as WorkTransaction[];
}
