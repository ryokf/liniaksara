import { PostgrestError } from '@supabase/supabase-js';
import supabase from '@/config/supabase';

interface DeleteWorkResponse {
    success: boolean;
    error?: PostgrestError | Error;
}

export async function deleteWork(workId: string): Promise<DeleteWorkResponse> {
    try {
        // First, get the work data to get the cover path
        const { data: work, error: workFetchError } = await supabase
            .from('works')
            .select('cover')
            .eq('id', workId)
            .single();

        if (workFetchError) throw workFetchError;

        // Delete the cover image if it exists
        if (work?.cover) {
            const { error: storageError } = await supabase
                .storage
                .from('work-cover')
                .remove([work.cover]);

            if (storageError) throw storageError;
        }

        // Then delete all parts associated with the work
        const { error: partsError } = await supabase
            .from('parts')
            .delete()
            .eq('work_id', workId);

        if (partsError) throw partsError;

        // Finally delete the work itself
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