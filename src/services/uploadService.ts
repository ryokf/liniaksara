import supabase from '@/config/supabase';
import { Work, Part } from '@/types/works';

export async function uploadWork(
    workData: {
        title: string;
        description: string;
        workTypeId: number;
        authorId: string;
        cover?: File;
        isDraft?: boolean;
    },
    content?: File
) {
    try {
        // 1. Upload cover image if provided
        let coverUrl = null;
        if (workData.cover) {
            const { data: coverData, error: coverError } = await supabase.storage
                .from('work-cover')
                .upload(`${workData.authorId}/${Date.now()}-${workData.cover.name}`, workData.cover);

            if (coverError) throw coverError;
            coverUrl = coverData.path;
        }

        // 2. Create work entry
        const { data: work, error: workError } = await supabase
            .from('works')
            .insert({
                title: workData.title,
                description: workData.description,
                work_type_id: workData.workTypeId,
                author_id: workData.authorId,
                cover: "https://ktmvcsnuvbvqytahrcli.supabase.co/storage/v1/object/public/work-cover/" + coverUrl,
                is_draft: workData.isDraft ?? true
            })
            .select()
            .single();

        if (workError) throw workError;

        // 3. Upload content file if provided and create part
        if (content) {
            let contentUrl = null;
            const { data: contentData, error: contentError } = await supabase.storage
                .from('contents')
                .upload(`${workData.authorId}/${work.id}/${Date.now()}-${content.name}`, content);

            if (contentError) throw contentError;
            contentUrl = contentData.path;

            // Create first part
            const { error: partError } = await supabase
                .from('parts')
                .insert({
                    work_id: work.id,
                    title: 'Chapter 1',
                    part_order: 1,
                    content_url: contentUrl
                });

            if (partError) throw partError;
        }

        return work;
    } catch (error) {
        console.error('Error uploading work:', error);
        throw error;
    }
}

export async function getWorkTypes() {
    const { data, error } = await supabase
        .from('work_types')
        .select('*');

    if (error) throw error;
    return data;
}
