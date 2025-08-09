import { Work } from './works';

export interface Novel extends Work {
    content_type: 'novel';
    book_parts: {
        content: string;  // HTML/Text content
    }[];
}
