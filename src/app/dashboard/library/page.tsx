'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getWorkTransactions } from '@/services/WorkTransactionService';
import { WorkTransaction } from '@/types/workTransaction';
import { Loader2 } from 'lucide-react';
import MediaCard from '@/components/molecules/MediaCard';
import DashboardLayout from '@/components/templates/DashboardLayout';

export default function LibraryPage() {
    const { userLogin } = useAuth();
    const [transactions, setTransactions] = useState<WorkTransaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLibrary = async () => {
            if (!userLogin?.id) return;

            try {
                const data = await getWorkTransactions(userLogin.id);
                setTransactions(data);
            } catch (err) {
                setError('Failed to fetch library items');
                console.error('Error fetching library:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchLibrary();
    }, [userLogin?.id]);

    // Convert transactions to media items for the MediaCard component
    const libraryItems = transactions.map(transaction => ({
        id: transaction.works.id,
        type: transaction.works.work_types.type,
        title: transaction.works.title,
        cover: transaction.works.cover,
        author_name: transaction.works.profiles.username,
        // rating: transaction.works.rating || 0,
        // partsCount: transaction.works.parts_count || 0,
        purchased: true
    }));

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <p className="text-red-500">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="text-primary hover:underline"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <DashboardLayout activeMenu="/dashboard/library">
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">My Library</h1>

                {libraryItems.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 dark:text-gray-400">
                            You haven&apos;t purchased any works yet.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {libraryItems.map((item) => (
                            <MediaCard
                                key={item.id}
                                id={item.id}
                                type={item.type}
                                title={item.title}
                                cover={item.cover}
                                author_name={item.author_name}
                                // rating={item.rating}
                                // episodeCount={item.partsCount}
                            />
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}