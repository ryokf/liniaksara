import { Genre, Work, Part, WorkType } from './works';

export interface WorkDetail extends Work {
    likes?: number;
    price?: number;
    genres?: Genre[];
    workType?: WorkType;
}

export interface MoviePart {
    id: string;
    work_id: string;
    title: string;
    part_order: number;
    thumbnail?: string;
    created_at: string;
    content_url?: string;
    duration?: number;
    is_free: boolean;
    description?: string;
}

export interface Episode {
    id: string;
    title: string;
    thumbnail?: string;
    videoUrl?: string;
    duration?: string;
    isFree: boolean;
    partOrder: number;
}

export interface Chapter {
    id: string;
    title: string;
    chapterNumber: number;
    content?: string;
    isFree: boolean;
}
