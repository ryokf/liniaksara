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

export const createTransaction = async (buyerId: string, workId: string) => {
    const { data, error } = await supabase
        .from('work_transactions')
        .insert({
            buyer_id: buyerId,
            work_id: workId,
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating transaction:', error);
        throw error;
    }

    return data as WorkTransaction;
}

export const checkTransactionExists = async (buyerId: string, workId: string): Promise<boolean> => {
    const { data, error } = await supabase
        .from('work_transactions')
        .select('*', { count: 'exact', head: true })
        .eq('buyer_id', buyerId)
        .eq('work_id', workId);

    if (error) {
        console.error('Error checking transaction existence:', error);
        throw error;
    }

    return (data?.length || 0) > 0;
}
