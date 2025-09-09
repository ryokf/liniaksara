'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { searchWorks } from '@/services/searchService';
import MediaCard from '@/components/molecules/MediaCard';
import { Work } from '@/types/works';
import  Navbar  from '@/components/molecules/Navbar';

export default function SearchPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
    const [results, setResults] = useState<Work[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchResults = async () => {
            if (!query) return;
            
            setLoading(true);
            setError(null);
            
            try {
                const data = await searchWorks(query);
                setResults(data);
            } catch (err) {
                setError('Terjadi kesalahan saat mencari karya');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        
        fetchResults();
    }, [query]);
            return (
                <>
                <Navbar></Navbar>
        <div className="container mx-auto px-4 py-8 mt-20">
            <h1 className="text-2xl font-bold mb-4">
                Hasil Pencarian untuk &quot;{query}&quot;
            </h1>

            {loading && (
                <div className="flex justify-center items-center min-h-[200px]">
                    <div className="loading loading-spinner loading-lg"></div>
                </div>
            )}

            {error && (
                <div className="alert alert-error">
                    {error}
                </div>
            )}

            {!loading && !error && results.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-500">
                        Tidak ada hasil yang ditemukan untuk &quot;{query}&quot;
                    </p>
                </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {results.map((work) => (
                    <MediaCard
                    key={work.id}
                    id={work.id}
                    title={work.title}
                    cover={work.cover || '/images/default-cover.svg'}
                    type={work.work_type?.type || 'unknown'}
                    author_name={work.author?.username|| 'Unknown'}
                    />
                ))}
            </div>
        </div>
                </>
    );
        // Tambahkan lebih banyak data contoh sesuai kebutuhan
    return (
        <div className="container mx-auto px-4 py-8 mt-20">
            <h1 className="text-2xl font-bold mb-4">
                Hasil Pencarian untuk &quot;{query}&quot;
            </h1>

            {loading && (
                <div className="flex justify-center items-center min-h-[200px]">
                    <div className="loading loading-spinner loading-lg"></div>
                </div>
            )}

            {error && (
                <div className="alert alert-error">
                    {error}
                </div>
            )}

            {!loading && !error && results.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-500">
                        Tidak ada hasil yang ditemukan untuk &quot;{query}&quot;
                    </p>
                </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {results.map((work) => (
                    <MediaCard
                        key={work.id}
                        id={work.id}
                        title={work.title}
                        cover={work.cover || '/images/default-cover.svg'}
                        type={work.work_type?.type || 'unknown'}
                        author_name={work.profiles?.username || work.author?.username || 'Unknown'}
                    />
                ))}
            </div>
        </div>
    );
}
