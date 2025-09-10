'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Navbar from '../molecules/Navbar';
import FilterButton from '../atoms/FilterButton';
import WorkCard from '../molecules/WorkCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faShareAlt, faBookmark, faShare } from '@fortawesome/free-solid-svg-icons';

type WorkType = 'book' | 'image' | 'video';

interface UserProfile {
    username: string;
    bio: string;
    photo_url: string;
    worksCount: number;
    followersCount: number;
    followingCount: number;
}

interface Work {
    id: string;
    title: string;
    type: string;
    workType: 'book' | 'image' | 'video';
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
    const [filteredWorks, setFilteredWorks] = useState<Work[]>(works);
    const [selectedWork, setSelectedWork] = useState<Work | null>(null);

    const filterWorks = useCallback((type: string = 'book') => {
        if (type === 'book') {
            const filtered = works.filter(work => work.type === 'Novel' || work.type === 'Comic');
            setFilteredWorks(filtered);
        } else if (type === 'image') {
            const filtered = works.filter(work => work.type === 'One Page');
            setFilteredWorks(filtered);
        } else if (type === 'video') {
            const filtered = works.filter(work => work.type === 'Series' || work.type === 'Movie');
            setFilteredWorks(filtered);
        } 
    }, [works, setFilteredWorks]);

    useEffect(() => {
        filterWorks();
    }, [filterWorks]);

    const handleFilterClick = (type: WorkType) => {
        setActiveFilter(type);
        filterWorks(type);
    };

    // Lock scroll when modal open
    useEffect(() => {
        if (selectedWork) {
            const prev = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = prev;
            };
        }
    }, [selectedWork]);

    // Close on ESC
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setSelectedWork(null);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [setSelectedWork]);

    return (
        <main className="min-h-screen bg-white dark:bg-gray-900 pt-10">
            <Navbar />
            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Profile Section */}
                <div className="flex flex-col items-center text-center space-y-6">
                    {/* Avatar */}
                    <div className="w-32 h-32 rounded-full overflow-hidden relative">
                        <Image
                            src={profile.photo_url || "/images/default-avatar.svg"}
                            alt={profile.username}
                            fill
                            className="object-cover"
                        />
                    </div>

                    {/* User Info */}
                    <div className="space-y-4">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            {profile.username}
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
                <hr className='mt-8 border-t border-gray-200 dark:border-gray-700' />
                <div className="flex justify-center gap-4 my-4">
                    <FilterButton
                        type="book"
                        isActive={activeFilter === 'book'}
                        onClick={() => handleFilterClick('book')}
                    />
                    <FilterButton
                        type="image"
                        isActive={activeFilter === 'image'}
                        onClick={() => handleFilterClick('image')}
                    />
                    <FilterButton
                        type="video"
                        isActive={activeFilter === 'video'}
                        onClick={() => handleFilterClick('video')}
                    />
                </div>
                <hr className='mb-8 border-t border-gray-200 dark:border-gray-700' />

                {/* Works Grid */}
                {activeFilter === 'image' ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {filteredWorks.map((work) => (
                            <button
                                key={work.id}
                                onClick={() => setSelectedWork(work)}
                                className="aspect-square relative overflow-hidden rounded-lg hover:opacity-90 transition-opacity"
                            >
                                <Image
                                    src={work.thumbnail}
                                    alt={work.title}
                                    fill
                                    className="object-cover"
                                />
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className={`grid grid-cols-1 md:grid-cols-2 ${activeFilter === 'video' ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-6`}>
                        {filteredWorks.map((work) => (
                            <WorkCard
                                key={work.id}
                                {...work}
                            />
                        ))}
                    </div>
                )}

                {selectedWork && (
                    <div className="fixed inset-0 z-[100]">
                        {/* Dark overlay */}
                        <div
                            className="absolute inset-0 bg-black/80"
                            onClick={() => setSelectedWork(null)}
                        />

                        {/* Centered container */}
                        <div className="absolute inset-0 flex items-center justify-center p-4">
                            <div className="bg-white dark:bg-neutral-900 rounded-lg w-full max-w-5xl h-[85vh] grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_400px] overflow-hidden shadow-2xl">
                                {/* Left: Media */}
                                <div className="relative bg-black">
                                    <Image
                                        src={selectedWork.thumbnail}
                                        alt={selectedWork.title}
                                        fill
                                        className="object-contain"
                                        priority
                                    />
                                </div>

                                {/* Right: Side panel */}
                                <div className="flex flex-col h-full">
                                    {/* Header */}
                                    <div className="flex items-center justify-between p-4 border-b border-black/10 dark:border-white/10">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full overflow-hidden relative">
                                                <Image
                                                    src={profile.photo_url || '/images/default-avatar.svg'}
                                                    alt={profile.username}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="text-sm">
                                                <p className="font-semibold text-gray-900 dark:text-white">{profile.username}</p>
                                                <p className="text-gray-500 dark:text-gray-400">{selectedWork.date}</p>
                                            </div>
                                        </div>
                                        <button
                                            aria-label="Tutup"
                                            onClick={() => setSelectedWork(null)}
                                            className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-gray-700 dark:text-gray-200">
                                                <path fillRule="evenodd" d="M6.225 4.811a1 1 0 0 1 1.414 0L12 9.172l4.361-4.361a1 1 0 1 1 1.414 1.414L13.414 10.586l4.361 4.361a1 1 0 0 1-1.414 1.414L12 12l-4.361 4.361a1 1 0 1 1-1.414-1.414l4.361-4.361-4.361-4.361a1 1 0 0 1 0-1.414Z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Body */}
                                    <div className="p-4 text-sm flex-1 overflow-y-auto">
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{selectedWork.title}</h3>
                                        <p className="text-gray-600 dark:text-gray-300">Tipe: {selectedWork.type}</p>
                                    </div>

                                    {/* Footer actions */}
                                    <div className="p-4 border-t border-black/10 dark:border-white/10">
                                        <div className="flex items-center gap-3">
                                            <button className="p-2 rounded-md bg-gray-100 text-gray-900 dark:bg-white/10 dark:text-gray-100 hover:opacity-90" aria-label="Suka">
                                                <FontAwesomeIcon icon={faHeart} className="w-6 h-6" />
                                            </button>
                                            <button className="p-2 rounded-md bg-gray-100 text-gray-900 dark:bg-white/10 dark:text-gray-100 hover:opacity-90" aria-label="Bagikan">
                                                <FontAwesomeIcon icon={faShare} className="w-6 h-6" />
                                            </button>
                                            <button className="p-2 rounded-md bg-gray-100 text-gray-900 dark:bg-white/10 dark:text-gray-100 hover:opacity-90" aria-label="Simpan">
                                                <FontAwesomeIcon icon={faBookmark} className="w-6 h-6" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
