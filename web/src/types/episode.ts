export interface Episode {
    id: string;
    work_id: string;
    title?: string;
    description?: string;
    part_order: number;
    content_url: string;
    thumbnail_url?: string;
    duration?: number;
    is_free: boolean;
    created_at: string;
    updated_at?: string;
    work?: {
        title: string;
        author_id: string;
        work_type_id: number;
        is_draft: boolean;
    };
    previous_part_id?: string;
    next_part_id?: string;
}
