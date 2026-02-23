import supabase from '@/config/supabase';
import { Work } from '@/types/works';
import { WorkTransaction } from '@/types/workTransaction';

export interface DashboardWork extends Pick<Work, 'id' | 'title' | 'cover'> {
    created_at: string;
    work_types: {
        type: string;
    };
}

export interface DashboardTransaction extends Pick<WorkTransaction, 'id' | 'created_at'> {
    works: DashboardWork;
    profiles: {
        username: string;
        photo_url: string;
    };
}

export interface UserStats {
    totalWorks: number;
    totalFollowers: number;
    totalFollowing: number;
    totalViews: number;
    totalLikes: number;
    recentWorks: DashboardWork[];
    recentTransactions: DashboardTransaction[];
}

export async function getUserDashboardStats(userId: string): Promise<UserStats> {
    try {
        // Get total works
        const { count: worksCount } = await supabase
            .from('works')
            .select('*', { count: 'exact', head: true })
            .eq('author_id', userId);

        // Get followers count
        const { count: followersCount } = await supabase
            .from('follows')
            .select('*', { count: 'exact', head: true })
            .eq('following_id', userId);

        // Get following count
        const { count: followingCount } = await supabase
            .from('follows')
            .select('*', { count: 'exact', head: true })
            .eq('follower_id', userId);

        // Get recent works
        const { data: recentWorksRaw } = await supabase
            .from('works')
            .select(`
                id,
                title,
                cover,
                created_at,
                work_types!inner(type)
            `)
            .eq('author_id', userId)
            .order('created_at', { ascending: false })
            .limit(5);

        const recentWorks: DashboardWork[] = recentWorksRaw?.map(work => ({
            id: work.id,
            title: work.title,
            cover: work.cover,
            created_at: work.created_at,
            work_types: {
                type: work.work_types?.[0]?.type || 'Unknown'
            }
        })) || [];

        // Get recent transactions
        const { data: recentTransactionsRaw } = await supabase
            .from('work_transactions')
            .select(`
                id,
                created_at,
                works!inner(
                    id,
                    title,
                    cover,
                    work_types!inner(type)
                ),
                profiles!inner(
                    username,
                    photo_url
                )
            `)
            .eq('seller_id', userId)
            .order('created_at', { ascending: false })
            .limit(5);

        const recentTransactions: DashboardTransaction[] = recentTransactionsRaw?.map(transaction => ({
            id: transaction.id,
            created_at: transaction.created_at,
            works: {
                id: transaction.works?.[0]?.id || '',
                title: transaction.works?.[0]?.title || '',
                cover: transaction.works?.[0]?.cover || '',
                created_at: transaction.created_at,
                work_types: {
                    type: transaction.works?.[0]?.work_types?.[0]?.type || 'Unknown'
                }
            },
            profiles: {
                username: transaction.profiles?.[0]?.username || '',
                photo_url: transaction.profiles?.[0]?.photo_url || ''
            }
        })) || [];

        return {
            totalWorks: worksCount || 0,
            totalFollowers: followersCount || 0,
            totalFollowing: followingCount || 0,
            totalViews: 0, // TODO: Implement view tracking
            totalLikes: 0, // TODO: Implement like system
            recentWorks,
            recentTransactions
        };
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        throw error;
    }
}