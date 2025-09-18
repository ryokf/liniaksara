import { PostgrestError } from '@supabase/supabase-js';
import supabase from '@/config/supabase';

interface UpdatePartOrderResponse {
    success: boolean;
    error?: PostgrestError | Error;
}

export async function updatePartOrder(
    workId: string,
    updates: Array<{ id: string; part_order: number }>
): Promise<UpdatePartOrderResponse> {
    try {
        // First, fetch all existing parts data
        const { data: existingParts, error: fetchError } = await supabase
            .from('parts')
            .select('*')
            .in('id', updates.map(u => u.id));

        if (fetchError) throw fetchError;
        if (!existingParts) throw new Error('No existing parts found');

        // Create update objects that preserve existing data
        const updateData = updates.map(update => {
            const existingPart = existingParts.find(p => p.id === update.id);
            if (!existingPart) throw new Error(`Part with id ${update.id} not found`);
            
            return {
                ...existingPart,
                part_order: update.part_order,
                updated_at: new Date().toISOString()
            };
        });

        // Perform the update
        const { error } = await supabase
            .from('parts')
            .upsert(updateData);

        if (error) throw error;

        return { success: true };
    } catch (error) {
        console.error('Error updating part order:', error);
        return {
            success: false,
            error: error as PostgrestError | Error
        };
    }
}