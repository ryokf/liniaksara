import { Work } from './works';

export interface Video extends Work {
    content_type: 'video';
    video_parts: {
        video_url: string;
        duration: number;
    }[];
}
