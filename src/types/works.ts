export interface Genre {
    id: number;
    genre: string;
}

export interface WorkType {
    id: number;
    type: string;
    icon?: string;
}

export interface Work {
    id: string;  // UUID
    author_id: string;  // UUID
    author: UserProfile;  // Author's profile
    work_type_id: number;
    title: string;
    description?: string;
    cover?: string;
    is_draft: boolean;
    created_at: string;  // ISO timestamp
    // Optional relations
    genres?: Genre[];
    work_type?: WorkType;
    parts?: Part[];
}

export interface WorkGenre {
    work_id: string;  // UUID
    genre_id: number;
}

export interface Part {
    id: number;
    work_id: string;  // UUID
    title: string;
    part_order: number;
    thumbnail?: string;
    created_at: string;  // ISO timestamp
    // Optional relations for specific part types
    video_part?: VideoPart;
    book_part?: BookPart;
}

export interface VideoPart {
    id: number;
    part_id: number;
    video_url: string;
    duration?: number;  // in seconds
}

export interface BookPart {
    id: number;
    part_id: number;
    content: string;  // Text/HTML for novels, JSON array of image URLs for comics
}
