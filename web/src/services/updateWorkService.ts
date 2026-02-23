import { PostgrestError } from '@supabase/supabase-js';
import supabase from '@/config/supabase';

interface UpdateWorkResponse {
    success: boolean;
    error?: PostgrestError | Error;
}

interface UpdateWorkData {
    title: string;
    description?: string;
    cover?: string | File;
    is_draft?: boolean;
    price?: number;
    work_type_id?: number;
}

export async function updateWork(workId: string | number, data: UpdateWorkData): Promise<UpdateWorkResponse> {
    try {
        // Handle cover: accept either URL string or File and upload to Supabase Storage when File
        let coverUrl: string | undefined;
        if (data.cover instanceof File) {
            const ext = data.cover.name.split('.').pop() || 'jpg';
            const fileName = `cover_${workId}_${Date.now()}.${ext}`;
            const filePath = `work-cover/${fileName}`;

            const { error: uploadError } = await supabase
                .storage
                .from('work-cover')
                .upload(filePath, data.cover, { upsert: true, contentType: data.cover.type });
            if (uploadError) throw uploadError;

            const { data: publicData } = supabase
                .storage
                .from('work-cover')
                .getPublicUrl(filePath);
            coverUrl = publicData?.publicUrl;
        } else if (typeof data.cover === 'string') {
            coverUrl = data.cover;
        }

        const payload: Record<string, unknown> = {
            title: data.title,
            ...(data.description !== undefined && { description: data.description }),
            ...(coverUrl !== undefined && { cover: coverUrl }),
            ...(data.is_draft !== undefined && { is_draft: data.is_draft }),
            ...(data.price !== undefined && { price: data.price }),
            ...(data.work_type_id !== undefined && { work_type_id: data.work_type_id }),
            updated_at: new Date().toISOString()
        };
        const { error } = await supabase
            .from('works')
            .update(payload)
            .eq('id', workId);

        if (error) throw error;

        return { success: true };
    } catch (error) {
        console.error('Error updating work:', error);
        return {
            success: false,
            error: error as PostgrestError | Error
        };
    }
}