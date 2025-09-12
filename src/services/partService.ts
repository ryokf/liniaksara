import supabase from '@/config/supabase';

interface AddPartData {
    title: string;
    part_order: number;
    thumbnail: File | null;
    content_file: File | null;
    is_free: boolean;
    workId: string;
}

export async function addPart(data: AddPartData) {
    try {
        // Upload thumbnail if provided
        let thumbnailUrl = null;
        let contentUrl = null;

        if (data.thumbnail) {
            const fileExt = data.thumbnail.name.split('.').pop();
            const fileName = `${crypto.randomUUID()}.${fileExt}`;
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('works')
                .upload(`thumbnails/${fileName}`, data.thumbnail);

            if (uploadError) throw uploadError;
            
            // Get public URL for the uploaded file
            const { data: publicUrlData } = supabase.storage
                .from('works')
                .getPublicUrl(`thumbnails/${fileName}`);
                
            thumbnailUrl = publicUrlData.publicUrl;
        }

        // Upload content file if provided
        if (data.content_file) {
            const fileExt = data.content_file.name.split('.').pop();
            const fileName = `${crypto.randomUUID()}.${fileExt}`;
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('works')
                .upload(`contents/${fileName}`, data.content_file);

            if (uploadError) throw uploadError;
            
            // Get public URL for the uploaded file
            const { data: publicUrlData } = supabase.storage
                .from('works')
                .getPublicUrl(`contents/${fileName}`);
                
            contentUrl = publicUrlData.publicUrl;
        }

        // Add part to the database
        const { data: partData, error } = await supabase
            .from('parts')
            .insert({
                work_id: data.workId,
                title: data.title,
                part_order: data.part_order,
                thumbnail: thumbnailUrl,
                content_url: contentUrl,
                is_free: data.is_free,
            })
            .select()
            .single();

        if (error) throw error;
        
        return partData;
    } catch (error) {
        console.error('Error adding part:', error);
        throw error;
    }
}

export async function getLastPartOrder(workId: string): Promise<number> {
    try {
        const { data, error } = await supabase
            .from('parts')
            .select('part_order')
            .eq('work_id', workId)
            .order('part_order', { ascending: false })
            .limit(1);
            // .single(); --- IGNORE ---

        if (error) throw error;

        return (data[0]?.part_order || 0) + 1;
    } catch (error) {
        console.error('Error getting last part order:', error);
        return 1; // Return 1 if there are no existing parts
    }
}
