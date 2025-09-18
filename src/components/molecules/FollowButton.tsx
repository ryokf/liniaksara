import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { followUser, unfollowUser, isFollowing } from '@/services/followService';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

interface FollowButtonProps {
    userId: string;
    onFollowChange?: (isFollowing: boolean) => void;
    className?: string;
}

export default function FollowButton({ userId, onFollowChange, className = '' }: FollowButtonProps) {
    const { userLogin } = useAuth();
    const [loading, setLoading] = useState(false);
    const [following, setFollowing] = useState(false);

    useEffect(() => {
        const checkFollowStatus = async () => {
            if (!userLogin?.id || !userId) return;
            
            try {
                const status = await isFollowing(userLogin.id, userId);
                setFollowing(status);
            } catch (error) {
                console.error('Error checking follow status:', error);
                setFollowing(false);
            }
        };

        checkFollowStatus();
    }, [userLogin?.id, userId]);

    const handleClick = async () => {
        if (!userLogin?.id) {
            toast.error('Silakan login terlebih dahulu');
            return;
        }

        try {
            setLoading(true);
            let success;

            // Optimistic update
            setFollowing(!following);
            if (onFollowChange) onFollowChange(!following);

            if (!following) {
                success = await followUser(userLogin.id, userId);
            } else {
                success = await unfollowUser(userLogin.id, userId);
            }
            
            if (!success) {
                // Revert optimistic update if failed
                setFollowing(following);
                if (onFollowChange) onFollowChange(following);
                toast.error('Gagal mengubah status follow');
            }
            window.location.reload();
            
        } catch (error) {
            console.error('Error toggling follow:', error);
            // Revert optimistic update
            setFollowing(following);
            if (onFollowChange) onFollowChange(following);
            toast.error('Terjadi kesalahan');
        } finally {
            setLoading(false);
        }
    };

    if (userLogin?.id === userId) return null;

    return (
        <button
            onClick={handleClick}
            disabled={loading}
            className={`px-6 py-2 rounded-full ${
                following
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                    : 'gradient-bg text-white hover:opacity-90'
            } font-medium transition-all flex items-center gap-2 ${className}`}
        >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {following ? 'Mengikuti' : 'Ikuti'}
        </button>
    );
}