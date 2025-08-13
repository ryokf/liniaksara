import { WorkType } from "./works";

export interface WorkTransaction {
    id: string;
    work_id: string;
    buyer_id: string;
    created_at: string;
    works: {
        id: string;
        title: string;
        cover: string;
        description: string;
        work_types: WorkType;
        profiles: {
            username: string;
            photo_url: string;
        };
    };

}
