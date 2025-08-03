"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    Search,
    Filter,
    ChevronDown,
    Star,
    Clock,
    TrendingUp,
    ArrowUpDown,
    X,
} from 'lucide-react';
import Navbar from '@/components/molecules/Navbar';

interface Work {
    id: string;
    title: string;
    type: 'novel' | 'comic' | 'video';
    coverImage: string;
    author: string;
    rating: number;
    totalRatings: number;
    status: 'ongoing' | 'completed' | 'hiatus';
    tags: string[];
    lastUpdated: string;
    viewCount: number;
}

type SortOption = 'latest' | 'popular' | 'rating' | 'title';
type StatusFilter = 'all' | 'ongoing' | 'completed' | 'hiatus';
type TypeFilter = 'all' | 'novel' | 'comic' | 'video';

export default function SearchResults() {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<SortOption>('latest');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [showFilters, setShowFilters] = useState(false);

    // Contoh data
    const mockWorks: Work[] = [
        {
            id: '1',
            title: 'Judul Karya 1',
            type: 'novel',
            coverImage: '/placeholder.jpg',
            author: 'Penulis 1',
            rating: 4.5,
            totalRatings: 1200,
            status: 'ongoing',
            tags: ['Action', 'Adventure'],
            lastUpdated: '2025-08-01',
            viewCount: 15000
        },
        // Tambahkan lebih banyak data contoh sesuai kebutuhan
    ];

    const allTags = ['Action', 'Adventure', 'Romance', 'Fantasy', 'Sci-fi', 'Horror', 'Drama', 'Comedy'];

    const toggleTag = (tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
    };

    const getSortLabel = (sort: SortOption): string => {
        switch (sort) {
            case 'latest': return 'Terbaru';
            case 'popular': return 'Terpopuler';
            case 'rating': return 'Rating Tertinggi';
            case 'title': return 'Judul A-Z';
            default: return '';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
            <Navbar></Navbar>
            {/* Search Bar */}
            <div className="shadow-sm">
                <div className="max-w-full mx-auto px-2 sm:px-4 lg:px-6 py-4">
                    <div className="flex items-center gap-4">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                placeholder="Cari judul, penulis, atau tag..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-2 pl-10 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary dark:bg-gray-700 dark:text-white outline-none transition"
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition flex items-center gap-2"
                        >
                            <Filter size={18} />
                            Filter
                        </button>
                    </div>

                    {/* Filters Panel */}
                    {showFilters && (
                        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-4">
                            {/* Type & Status Filters */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                                        Tipe Konten
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {(['all', 'novel', 'comic', 'video'] as TypeFilter[]).map(type => (
                                            <button
                                                key={type}
                                                onClick={() => setTypeFilter(type)}
                                                className={`px-3 py-1 text-sm rounded-full ${
                                                    typeFilter === type
                                                        ? 'bg-primary text-white'
                                                        : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-500'
                                                } transition`}
                                            >
                                                {type === 'all' ? 'Semua' : type.charAt(0).toUpperCase() + type.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                                        Status
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {(['all', 'ongoing', 'completed', 'hiatus'] as StatusFilter[]).map(status => (
                                            <button
                                                key={status}
                                                onClick={() => setStatusFilter(status)}
                                                className={`px-3 py-1 text-sm rounded-full ${
                                                    statusFilter === status
                                                        ? 'bg-primary text-white'
                                                        : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-500'
                                                } transition`}
                                            >
                                                {status === 'all' ? 'Semua' : status.charAt(0).toUpperCase() + status.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Tags */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                                    Genre/Tag
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {allTags.map(tag => (
                                        <button
                                            key={tag}
                                            onClick={() => toggleTag(tag)}
                                            className={`px-3 py-1 text-sm rounded-full ${
                                                selectedTags.includes(tag)
                                                    ? 'bg-primary text-white'
                                                    : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-500'
                                            } transition`}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Sort Options */}
                    <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                Urutkan:
                            </span>
                            <div className="relative">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                                    className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 pr-8 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary cursor-pointer"
                                >
                                    {(['latest', 'popular', 'rating', 'title'] as SortOption[]).map(option => (
                                        <option key={option} value={option}>
                                            {getSortLabel(option)}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            {mockWorks.length} hasil
                        </div>
                    </div>
                </div>
            </div>

            {/* Results Grid */}
            <div className="max-w-full mx-auto px-2 sm:px-4 lg:px-6 py-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                    {mockWorks.map(work => (
                        <Link 
                            key={work.id} 
                            href={`/${work.type}/${work.id}`}
                            className="group bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
                        >
                            <div className="relative aspect-[2/3]">
                                <Image
                                    src={work.coverImage}
                                    alt={work.title}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute top-2 right-2 px-2 py-1 text-xs font-medium bg-black/50 text-white rounded">
                                    {work.type.toUpperCase()}
                                </div>
                                {work.status !== 'completed' && (
                                    <div className="absolute bottom-2 left-2 px-2 py-1 text-xs font-medium bg-primary text-white rounded">
                                        {work.status === 'ongoing' ? 'On Going' : 'Hiatus'}
                                    </div>
                                )}
                            </div>
                            <div className="p-3">
                                <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 group-hover:text-primary transition">
                                    {work.title}
                                </h3>
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    {work.author}
                                </p>
                                <div className="mt-2 flex items-center gap-1">
                                    <Star size={14} className="text-yellow-400 fill-current" />
                                    <span className="text-xs text-gray-600 dark:text-gray-300">
                                        {work.rating.toFixed(1)}
                                    </span>
                                    <span className="text-xs text-gray-400 dark:text-gray-500">
                                        ({work.totalRatings.toLocaleString()})
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
