import { Genre, Work, Part, WorkType } from './works';

export interface WorkDetail extends Work {
    likes?: number;
    price?: number;
    genres?: Genre[];
    workType?: WorkType;
}

export interface MoviePart extends Part {
    content_url?: string;
    duration?: number;
    is_free: boolean;
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
