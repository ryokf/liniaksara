'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { search, SearchType, SearchResults } from '@/services/searchService';
import MediaCard from '@/components/molecules/MediaCard';
import Link from 'next/link';
import Image from 'next/image';
import { Work } from '@/types/works';
import Navbar from '@/components/molecules/Navbar';
import CreatorCard from '@/components/molecules/CreatorCard';

export default function SearchPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
    const type = (searchParams.get('type') as SearchType) || 'works';
    const [results, setResults] = useState<SearchResults>({ works: [], users: [], type });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchResults = async () => {
            if (!query) return;
            
            setLoading(true);
            setError(null);
            
            try {
                const data = await search(query, type);
                setResults(data);
            } catch (err) {
                setError('Terjadi kesalahan saat mencari');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        
        fetchResults();
    }, [query, type]);

    return (
        <>
            <Navbar />
            <div className="container mx-auto px-4 py-8 mt-20 max-w-6xl">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold">
                        Hasil Pencarian untuk &quot;{query}&quot;
                    </h1>
    
                </div>

                {loading && (
                    <div className="flex justify-center items-center min-h-[200px]">
                        <div className="loading loading-spinner loading-lg"></div>
                    </div>
                )}

                {!loading && !error && results.type === 'works' && results.works.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-gray-500">Tidak ada karya yang ditemukan</p>
                    </div>
                )}

                {!loading && !error && results.type === 'users' && results.users.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-gray-500">Tidak ada pengguna yang ditemukan</p>
                    </div>
                )}

                {!loading && !error && results.type === 'works' && (
                    <div className=" m-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {results.works.map((work) => (
                            <MediaCard
                                key={work.id}
                                id={work.id}
                                type={work.work_type?.type || 'unknown'}
                                title={work.title}
                                cover={work.cover || undefined}
                                author_name={work.author?.username}
                            />
                        ))}
                    </div>
                )}

                {!loading && !error && results.type === 'users' && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {results.users.map((user) => (
                            <CreatorCard
                                key={user.id}
                                id={user.id}
                                name={user.username}
                                description={user.full_name || ''}
                                imageUrl={user.avatar_url || '/images/default-avatar.svg'}
                                worksCount={user.works?.length || 0}
                                rank={0} // Karena ini hasil pencarian, tidak perlu ranking
                            />
                        ))}
                    </div>
                )}

                {error && (
                    <div className="text-center py-8">
                        <p className="text-red-500">{error}</p>
                    </div>
                )}
            </div>
        </>
    );
}
