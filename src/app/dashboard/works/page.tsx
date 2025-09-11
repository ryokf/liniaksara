'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Plus, Search, Loader2 } from 'lucide-react';
import DashboardLayout from '@/components/templates/DashboardLayout';
import WorkCard from '@/components/molecules/WorkCard';
import UploadWorkForm from '@/components/molecules/UploadWorkForm';
import FilterDropdown from '@/components/molecules/FilterDropdown';
import { getUserWorks } from '@/services/myWorkService';
import { useAuth } from '@/contexts/AuthContext';
import { Work } from '@/types/works';

type SortOption = 'newest' | 'oldest' | 'title-asc' | 'title-desc';
type StatusFilter = 'all' | 'published' | 'draft';
type TypeFilter = 'all' | 'novel' | 'comic' | 'movie';

export default function MyWorksPage() {
    const { userLogin } = useAuth();
    const [works, setWorks] = useState<Work[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isUploadFormOpen, setIsUploadFormOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filtering and sorting states
    const [sortBy, setSortBy] = useState<SortOption>('newest');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');

    const loadWorks = useCallback(async () => {
        if (!userLogin) return;
        try {
            setIsLoading(true);
            const userWorks = await getUserWorks(userLogin.id);
            setWorks(userWorks);
            setError(null);
        } catch (err) {
            console.error('Error loading works:', err);
            setError('Failed to load your works. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    }, [userLogin]);

    useEffect(() => {
        loadWorks();
    }, [loadWorks]);

    // Filter and sort options
    const sortOptions = [
        { label: 'Terbaru', value: 'newest' },
        { label: 'Terlama', value: 'oldest' },
        { label: 'Judul (A-Z)', value: 'title-asc' },
        { label: 'Judul (Z-A)', value: 'title-desc' },
    ];

    const statusOptions = [
        { label: 'Semua Status', value: 'all' },
        { label: 'Dipublikasi', value: 'published' },
        { label: 'Draft', value: 'draft' },
    ];

    const typeOptions = [
        { label: 'Semua Tipe', value: 'all' },
        { label: 'Novel', value: 'novel' },
        { label: 'Komik', value: 'comic' },
        { label: 'Film', value: 'movie' },
        { label: 'One Page', value: 'one page' },
        { label: 'Series', value: 'series' }
    ];

    const filteredWorks = useMemo(() => {
        return works
            // Apply search filter
            .filter((work) => {
                console.log(work);
                const matchesSearch = work.title.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesStatus = statusFilter === 'all' 
                    ? true 
                    : statusFilter === 'published' 
                        ? !work.is_draft 
                        : work.is_draft;
                const matchesType = typeFilter === 'all'
                    ? true
                    : work.work_type?.type?.toLowerCase() === typeFilter;
                
                return matchesSearch && matchesStatus && matchesType;
            })
            // Apply sorting
            .sort((a, b) => {
                switch (sortBy) {
                    case 'newest':
                        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                    case 'oldest':
                        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
                    case 'title-asc':
                        return a.title.localeCompare(b.title);
                    case 'title-desc':
                        return b.title.localeCompare(a.title);
                    default:
                        return 0;
                }
            });
    }, [works, searchQuery, statusFilter, typeFilter, sortBy]);

    const getWorkLink = (work: Work) => {
        switch (work.work_type?.type?.toLowerCase()) {
            case 'novel':
                return `/novel/${work.id}`;
            case 'comic':
                return `/comic/${work.id}`;
            case 'movie':
                return `/movie/${work.id}`;
            default:
                return '#';
        }
    };

    const getWorkType = (work: Work) => {
        return work.work_type?.type || 'Unknown';
    };

    return (
        <DashboardLayout activeMenu="/dashboard/works">
            <div className="min-h-screen p-6 space-y-6">
                {/* Header with Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Karya Saya</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Kelola semua karya yang telah Anda buat
                        </p>
                    </div>
                    <button
                        onClick={() => setIsUploadFormOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 gradient-bg text-white rounded-lg hover:opacity-90 transition-opacity"
                    >
                        <Plus size={20} />
                        <span>Tambah Karya</span>
                    </button>
                </div>

                {/* Search and Filters */}
                <div className="space-y-4">
                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Cari karya..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
                        />
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-4">
                        <FilterDropdown
                            label="Urutkan"
                            options={sortOptions}
                            value={sortBy}
                            onChange={(value) => setSortBy(value as SortOption)}
                        />
                        <FilterDropdown
                            label="Status"
                            options={statusOptions}
                            value={statusFilter}
                            onChange={(value) => setStatusFilter(value as StatusFilter)}
                        />
                        <FilterDropdown
                            label="Tipe"
                            options={typeOptions}
                            value={typeFilter}
                            onChange={(value) => setTypeFilter(value as TypeFilter)}
                        />
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )}

                {/* Works Grid */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-8">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                ) : filteredWorks.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredWorks.map((work) => (
                            <WorkCard
                                key={work.id}
                                href={getWorkLink(work)}
                                title={work.title}
                                type={getWorkType(work)}
                                thumbnail={work.cover || '/images/default-cover.svg'}
                                date={new Date(work.created_at).toLocaleDateString()}
                                status={work.is_draft ? 'draft' : 'published'}
                                className='aspect-square'
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        {searchQuery || statusFilter !== 'all' || typeFilter !== 'all'
                            ? 'Tidak ditemukan karya yang sesuai dengan filter.'
                            : 'Belum ada karya. Buat karya pertama Anda!'}
                    </div>
                )}
            </div>

            <UploadWorkForm
                isOpen={isUploadFormOpen}
                onClose={() => setIsUploadFormOpen(false)}
                onSuccess={loadWorks}
            />
        </DashboardLayout>
    );
}
