'use client';
import ProfileTemplate from '@/components/templates/ProfileTemplate';
import { getUserProfile } from '@/services/profileService';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type WorkType = 'book' | 'image' | 'video';


const mockWorks = [
    {
        id: "1",
        title: "React Project Practical Tutorial",
        type: "Novel",
        workType: "book" as WorkType,
        thumbnail: "/images/works/novel1.jpg",
        date: "15 september 2024",
        href: "/novel/1"
    },
    {
        id: "2",
        title: "React Project Practical Tutorial",
        type: "Komik",
        workType: "book" as WorkType,
        thumbnail: "/images/works/comic1.jpg",
        date: "15 september 2024",
        href: "/comic/1"
    },
    {
        id: "3",
        title: "Beautiful Landscape",
        type: "Illustration",
        workType: "image" as WorkType,
        thumbnail: "/images/works/art1.jpg",
        date: "15 september 2024",
        href: "/art/1"
    },
    {
        id: "4",
        title: "Adventure Series",
        type: "Series",
        workType: "video" as WorkType,
        thumbnail: "/images/works/video1.jpg",
        date: "15 september 2024",
        href: "/video/1"
    }
];

export default function ProfilePage() {
    const [profile, setProfile] = useState<Awaited<ReturnType<typeof getUserProfile>> | null>(null);
    const [works, setWorks] = useState();

    const { username } = useParams<{ username: string }>();

    const fetchProfile = async () => {
        try {
            const data = await getUserProfile(username);
            setProfile(data);
        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    }

    useEffect(() => {
        fetchProfile();
    }, [username]);

    if (!profile) {
        return <div />;
    }

    return (
        <ProfileTemplate 
            profile={profile}
            works={profile.works.map(work => ({
                id: work.id,
                title: work.title,
                type: work.work_type?.type || "Work",
                workType: work.work_type?.type === "Novel" ? "book" : work.work_type?.type === "Komik" ? "book" : work.work_type?.type === "Illustration" ? "image" : work.work_type?.type === "Series" ? "video" : "book",
                thumbnail: work.cover || "/images/default-cover.jpg",
                date: new Date(work.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
                href: `/${work.work_type?.type?.toLowerCase() || "work"}/${work.id}`
            }))}
        />
    );
}