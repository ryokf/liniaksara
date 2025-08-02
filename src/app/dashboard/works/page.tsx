'use client';

import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import DashboardLayout from '@/components/templates/DashboardLayout';
import FilterButton from '@/components/atoms/FilterButton';
import WorkCard from '@/components/molecules/WorkCard';
import UploadWorkForm from '@/components/molecules/UploadWorkForm';

type WorkType = 'book' | 'image' | 'video';

const mockWorks = [
    {
        id: "1",
        title: "React Project Practical Tutorial",
        type: "Novel",
        workType: "book" as WorkType,
        thumbnail: "/images/works/novel1.jpg",
        date: "15 september 2024",
        href: "/novel/1",
        status: "published"
    },
    {
        id: "2",
        title: "Adventure Begins",
        type: "Komik",
        workType: "book" as WorkType,
        thumbnail: "/images/works/comic1.jpg",
        date: "15 september 2024",
        href: "/comic/1",
        status: "draft"
    }
    // ... more mock data
];

export default function MyWorksPage() {
    const [activeFilter, setActiveFilter] = useState<WorkType>('book');
    const [searchQuery, setSearchQuery] = useState('');
    const [isUploadFormOpen, setIsUploadFormOpen] = useState(false);

    const filteredWorks = mockWorks.filter(work => 
        work.workType === activeFilter &&
        work.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <DashboardLayout activeMenu="/dashboard/works">
            {/* Upload Form Modal */}
            <UploadWorkForm 
                isOpen={isUploadFormOpen}
                onClose={() => setIsUploadFormOpen(false)}
            />

            {/* Header with Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Karya Saya
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Kelola semua karya yang telah Anda buat
                    </p>
                </div>
                
                <button 
                    onClick={() => setIsUploadFormOpen(true)}
                    className="px-4 py-2 rounded-lg gradient-bg text-white font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Buat Karya Baru
                </button>
            </div>

            {/* Search and Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-8">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="Cari karya..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-2 pl-10 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white"
                        />
                        <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    </div>

                    {/* Filter Buttons */}
                    <div className="flex gap-2">
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
                </div>
            </div>

            {/* Works Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredWorks.map((work) => (
                    <WorkCard
                        key={work.id}
                        {...work}
                    />
                ))}
                {filteredWorks.length === 0 && (
                    <div className="col-span-full text-center py-12">
                        <p className="text-gray-500 dark:text-gray-400">
                            Tidak ada karya ditemukan
                        </p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
