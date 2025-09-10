'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Loader2 } from 'lucide-react';
import DashboardLayout from '@/components/templates/DashboardLayout';
import WorkCard from '@/components/molecules/WorkCard';
import UploadWorkForm from '@/components/molecules/UploadWorkForm';
import { getUserWorks } from '@/services/myWorkService';
import { useAuth } from '@/contexts/AuthContext';
import { Work } from '@/types/works';

export default function MyWorksPage() {
    const { userLogin } = useAuth();
    const [works, setWorks] = useState<Work[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isUploadFormOpen, setIsUploadFormOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    const filteredWorks = works.filter((work) =>
        work.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus size={20} />
                        <span>Tambah Karya</span>
                    </button>
                </div>

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
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        {searchQuery ? 'No works found matching your search.' : 'No works yet. Create your first work!'}
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
