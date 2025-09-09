'use client';
import ProfileTemplate from '@/components/templates/ProfileTemplate';
import { getUserProfile } from '@/services/profileService';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type WorkType = 'book' | 'image' | 'video';

export default function ProfilePage() {
    const [profile, setProfile] = useState<Awaited<ReturnType<typeof getUserProfile>> | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { username } = useParams<{ username: string }>();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const data = await getUserProfile(username);
                setProfile(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching profile:', err);
                setError('Terjadi kesalahan saat mengambil data profil');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [username]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="loading loading-spinner loading-lg"></div>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold mb-4">
                    {error || 'Profil tidak ditemukan'}
                </h1>
                <p className="text-gray-500">
                    Pengguna dengan username &quot;{username}&quot; tidak ditemukan
                </p>
            </div>
        );
    }

    const getWorkType = (type: string | undefined): 'book' | 'image' | 'video' => {
        if (!type) return 'image';
        const lowerType = type.toLowerCase();
        if (lowerType === 'novel' || lowerType === 'comic' || lowerType === 'komik') {
            return 'book';
        } else if (lowerType === 'video' || lowerType === 'series') {
            return 'video';
        }
        return 'image';
    };

    return (
        <ProfileTemplate 
            profile={{
                username: profile.username,
                bio: profile.bio || '',
                photo_url: profile.photo_url || '/images/default-avatar.svg',
                worksCount: profile.works.length,
                followersCount: profile.followers_count,
                followingCount: profile.following_count
            }}
            works={profile.works.map(work => ({
                id: work.id,
                title: work.title,
                type: work.work_type?.type || 'Work',
                workType: getWorkType(work.work_type?.type),
                thumbnail: work.cover || '/images/default-cover.svg',
                date: new Date(work.created_at).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }),
                href: `/${work.work_type?.type?.toLowerCase() || 'work'}/${work.id}`
            }))}
        />
    );
}