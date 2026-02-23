import supabase from '@/config/supabase';

interface FollowRelation {
    id: string;
    follower_id: string;
    following_id: string;
    created_at: string;
}

interface FollowUser {
    id: string;
    username: string;
    full_name?: string;
    photo_url?: string;
    bio?: string;
}

interface Profile {
    id: string;
    username: string;
    full_name?: string;
    photo_url?: string;
    bio?: string;
}

interface FollowUser {
    id: string;
    username: string;
    full_name?: string;
    photo_url?: string;
    bio?: string;
}

interface DatabaseFollow {
    follower: {
        id: string;
        username: string;
        full_name?: string;
        photo_url?: string;
        bio?: string;
    };
    following: {
        id: string;
        username: string;
        full_name?: string;
        photo_url?: string;
        bio?: string;
    };
}

export async function followUser(followerId: string, followingId: string): Promise<boolean> {
    try {
        console.log(`User ${followerId} is attempting to follow User ${followingId}`);
        const { error } = await supabase
            .from('follows')
            .insert({
                follower_id: followerId,
                following_id: followingId
            });

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error following user:', error);
        return false;
    }
}

export async function unfollowUser(followerId: string, followingId: string): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('follows')
            .delete()
            .eq('follower_id', followerId)
            .eq('following_id', followingId);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error unfollowing user:', error);
        return false;
    }
}

export async function isFollowing(followerId: string, followingId: string): Promise<boolean> {
    if (!followerId || !followingId) {
        console.error('Invalid follower or following ID');
        return false;
    }

    try {
        const { data, error } = await supabase
            .from('follows')
            .select('id')
            .eq('follower_id', followerId)
            .eq('following_id', followingId)
            .single();

        if (error) {
            if (error.code === 'PGRST116') { // No rows returned error
                return false;
            }
            throw error;
        }
        return !!data;
    } catch (error) {
        console.error('Error checking follow status:', error);
        return false;
    }
}

export async function getFollowers(
    userId: string, 
    page: number = 1, 
    limit: number = 10
): Promise<{ users: FollowUser[]; total: number }> {
    try {
        // Get total count
        const { count } = await supabase
            .from('follows')
            .select('*', { count: 'exact', head: true })
            .eq('following_id', userId);

        // Get followers with pagination
        const { data: follows, error } = await supabase
            .from('follows')
            .select(`
                follower:profiles!follows_follower_id_fkey (
                    id,
                    username,
                    full_name,
                    photo_url,
                    bio
                )
            `)
            .eq('following_id', userId)
            .range((page - 1) * limit, page * limit - 1)
            .order('created_at', { ascending: false });

        if (error) throw error;

        const typedFollows = follows as unknown as { follower: Profile }[];
        const followers = typedFollows?.map(f => ({
            id: f.follower.id,
            username: f.follower.username,
            full_name: f.follower.full_name,
            photo_url: f.follower.photo_url,
            bio: f.follower.bio
        })) || [];

        return {
            users: followers,
            total: count || 0
        };
    } catch (error) {
        console.error('Error getting followers:', error);
        return { users: [], total: 0 };
    }
}

export async function getFollowing(
    userId: string,
    page: number = 1,
    limit: number = 10
): Promise<{ users: FollowUser[]; total: number }> {
    try {
        // Get total count
        const { count } = await supabase
            .from('follows')
            .select('*', { count: 'exact', head: true })
            .eq('follower_id', userId);

        // Get following with pagination
        const { data: follows, error } = await supabase
            .from('follows')
            .select(`
                following:profiles!follows_following_id_fkey (
                    id,
                    username,
                    full_name,
                    photo_url,
                    bio
                )
            `)
            .eq('follower_id', userId)
            .range((page - 1) * limit, page * limit - 1)
            .order('created_at', { ascending: false });

        if (error) throw error;

        const typedFollows = follows as unknown as { following: Profile }[];
        const following = typedFollows?.map(f => ({
            id: f.following.id,
            username: f.following.username,
            full_name: f.following.full_name,
            photo_url: f.following.photo_url,
            bio: f.following.bio
        })) || [];

        return {
            users: following,
            total: count || 0
        };
    } catch (error) {
        console.error('Error getting following:', error);
        return { users: [], total: 0 };
    }
}