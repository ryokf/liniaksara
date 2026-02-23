interface UserProfile {
    id: string;  // UUID
    username: string;
    email: string;
    photo_url?: string;
    updated_at: string;  // ISO timestamp
}
