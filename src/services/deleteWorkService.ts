import { PostgrestError } from '@supabase/supabase-js';
import supabase from '@/config/supabase';

interface DeleteWorkResponse {
    success: boolean;
    error?: PostgrestError | Error;
}

export async function deleteWork(workId: string): Promise<DeleteWorkResponse> {
    try {
        // First, delete all parts associated with the work
        const { error: partsError } = await supabase
            .from('parts')
            .delete()
            .eq('work_id', workId);

        if (partsError) throw partsError;

        // Then delete the work itself
        const { error: workError } = await supabase
            .from('works')
            .delete()
            .eq('id', workId);

        if (workError) throw workError;

        return { success: true };
    } catch (error) {
        console.error('Error deleting work:', error);
        return {
            success: false,
            error: error as PostgrestError | Error
        };
    }
}