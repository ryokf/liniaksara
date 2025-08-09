import { Work } from './works';

export interface Comic extends Work {
    content_type: 'comic';
    book_parts: {
        content: string[];  // Array of image URLs
    }[];
}
