import supabase from '@/config/supabase';
import { Work } from '@/types/works';

export interface UserProfile {
    id: string;
    username: string;
    full_name?: string;
    bio?: string;
    avatar_url?: string;
    website?: string;
    email?: string;
}

export interface UserProfileWithStats extends UserProfile {
    works: Work[];
    followers_count: number;
    following_count: number;
}

export async function getUserProfile(username: string): Promise<UserProfileWithStats | null> {
    try {
        // Fetch user profile
        console.log('Fetching profile for username:', username);

        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select(`
                *,
                works!author_id(
                    *,
                    work_type:work_types(*)
                )
            `)
            .eq('username', username)
            .single()

        console.log('Fetched profile:', profile);    

        if (profileError) throw profileError;
        if (!profile) return null;

        // Fetch follower count
        // const { count: followersCount, error: followersError } = await supabase
        //     .from('follows')
        //     .select('*', { count: true })
        //     .eq('following_id', profile.id);

        // if (followersError) throw followersError;

        // // Fetch following count
        // const { count: followingCount, error: followingError } = await supabase
        //     .from('follows')
        //     .select('*', { count: true })
        //     .eq('follower_id', profile.id);

        // if (followingError) throw followingError;

        return {
            ...profile,
            works: profile.works || [],
            // followers_count: followersCount || 0,
            // following_count: followingCount || 0
        };
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
}

// export async function isFollowing(followerId: string, followingId: string): Promise<boolean> {
//     try {
//         const { count, error } = await supabase
//             .from('follows')
//             .select('*', { count: true })
//             .eq('follower_id', followerId)
//             .eq('following_id', followingId)
//             .single();

//         if (error) throw error;
//         return count === 1;
//     } catch (error) {
//         console.error('Error checking follow status:', error);
//         throw error;
//     }
// }

// export async function followUser(followerId: string, followingId: string): Promise<void> {
//     try {
//         const { error } = await supabase
//             .from('follows')
//             .insert([
//                 {
//                     follower_id: followerId,
//                     following_id: followingId
//                 }
//             ]);

//         if (error) throw error;
//     } catch (error) {
//         console.error('Error following user:', error);
//         throw error;
//     }
// }

// export async function unfollowUser(followerId: string, followingId: string): Promise<void> {
//     try {
//         const { error } = await supabase
//             .from('follows')
//             .delete()
//             .eq('follower_id', followerId)
//             .eq('following_id', followingId);

//         if (error) throw error;
//     } catch (error) {
//         console.error('Error unfollowing user:', error);
//         throw error;
//     }
// }
