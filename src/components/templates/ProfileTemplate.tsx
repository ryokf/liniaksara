'use client';

import { useState } from 'react';
import Image from 'next/image';
import Navbar from '../molecules/Navbar';
import FilterButton from '../atoms/FilterButton';
import WorkCard from '../molecules/WorkCard';

type WorkType = 'book' | 'image' | 'video';

interface UserProfile {
    name: string;
    bio: string;
    avatar: string;
    worksCount: number;
    followersCount: number;
    followingCount: number;
}

interface Work {
    id: string;
    title: string;
    type: string;
    workType: WorkType;
    thumbnail: string;
    date: string;
    href: string;
}

interface ProfileTemplateProps {
    profile: UserProfile;
    works: Work[];
}

export default function ProfileTemplate({ profile, works }: ProfileTemplateProps) {
    const [activeFilter, setActiveFilter] = useState<WorkType>('book');

    const filteredWorks = works.filter(work => work.workType === activeFilter);

    return (
        <main className="min-h-screen bg-white dark:bg-gray-900 mt-14">
            <Navbar />
            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Profile Section */}
                <div className="flex flex-col items-center text-center space-y-6">
                    {/* Avatar */}
                    <div className="w-32 h-32 rounded-full overflow-hidden relative">
                        <Image
                            src={"https://images.unsplash.com/photo-1752866109925-fa5821c5053d?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
                            alt={profile.name}
                            fill
                            className="object-cover"
                        />
                    </div>

                    {/* User Info */}
                    <div className="space-y-4">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            {profile.name}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 max-w-lg">
                            {profile.bio}
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-8 text-sm">
                        <div className="space-y-1">
                            <p className="font-medium text-gray-900 dark:text-white">{profile.worksCount}</p>
                            <p className="text-gray-600 dark:text-gray-400">Karya</p>
                        </div>
                        <div className="space-y-1">
                            <p className="font-medium text-gray-900 dark:text-white">{profile.followersCount}</p>
                            <p className="text-gray-600 dark:text-gray-400">Pengikut</p>
                        </div>
                        <div className="space-y-1">
                            <p className="font-medium text-gray-900 dark:text-white">{profile.followingCount}</p>
                            <p className="text-gray-600 dark:text-gray-400">Mengikuti</p>
                        </div>
                    </div>

                    {/* Follow Button */}
                    <button className="px-8 py-2.5 rounded-full gradient-bg text-white font-medium hover:opacity-90 transition-opacity">
                        Follow
                    </button>
                </div>

                {/* Filters */}
                <hr className='mt-8 border-t border-gray-200 dark:border-gray-700'/>
                <div className="flex justify-center gap-4 my-4">
                    <FilterButton
                        type="book"
                        isActive={activeFilter === 'book'}
                        onClick={() => setActiveFilter('book')}
                    />
                    <FilterButton
                        type="image"
                        isActive={activeFilter === 'image'}
                        onClick={() => setActiveFilter('image')}
                    />
                    <FilterButton
                        type="video"
                        isActive={activeFilter === 'video'}
                        onClick={() => setActiveFilter('video')}
                    />
                </div>
                <hr className='mb-8 border-t border-gray-200 dark:border-gray-700'/>

                {/* Works Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                    {filteredWorks.map((work) => (
                        <WorkCard
                            key={work.id}
                            {...work}
                        />
                    ))}
                </div>
            </div>
        </main>
    );
}
