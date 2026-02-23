'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { search, SearchType, SearchResults } from '@/services/searchService';
import MediaCard from '@/components/molecules/MediaCard';
import Link from 'next/link';
import Image from 'next/image';
import { Work } from '@/types/works';
import Navbar from '@/components/molecules/Navbar';
import CreatorCard from '@/components/molecules/CreatorCard';

function SearchContent() {
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
            {query && (
                <div className="max-w-7xl mx-auto px-6 mt-20">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-2xl font-bold">
                            Hasil Pencarian untuk &quot;{query}&quot;
                        </h1>
                    </div>
                    <div className="flex my-4 text-sm">
                        <button
                            onClick={() => {
                                const params = new URLSearchParams(window.location.search);
                                params.set('type', 'works');
                                window.location.search = params.toString();
                            }}
                            className={`px-3 py-2 rounded-full transition-all ${
                                type === 'works'
                                ? 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
                                : 'bg-primary text-white'
                            }`}
                        >
                            Karya{type === 'works' && results.works.length > 0 ? ` (${results.works.length})` : ''}
                        </button>
                        <button
                            onClick={() => {
                                const params = new URLSearchParams(window.location.search);
                                params.set('type', 'users');
                                window.location.search = params.toString();
                            }}
                            className={`px-3 py-2 rounded-full transition-all ${
                                type === 'users'
                                ? 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
                                    : 'bg-primary text-white'
                            }`}
                        >
                            Pengguna{type === 'users' && results.users.length > 0 ? ` (${results.users.length})` : ''}
                        </button>
                    </div>
                    <hr className='border-t border-gray-200 dark:border-gray-700 mb-6' />
                </div>
            )}
            {query == '' && (
                <div className="max-w-screen mx-auto px-4 py-8 mt-20">
                    <h1 className="text-2xl font-bold mb-4">Cari Karya atau Pengguna</h1>
                    <form action="/search" method="get" className="grid grid-cols-3 gap-2 max-w-screen">
                        <input
                            type="text"
                            name="q"
                            placeholder="Masukkan kata kunci..."
                            className="flex-1 px-4 py-2 border rounded-lg col-span-2"
                        />
                        {/* <select
                            name="type"
                            defaultValue="works"
                            className="px-4 py-2 border rounded-lg"
                        >
                            <option value="works">Karya</option>
                            <option value="users">Pengguna</option>
                        </select> */}
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                        >
                            Cari
                        </button>
                    </form>
                </div>
            )}
            {query && (
                <div className="container mx-auto px-4 py-8 mt-10 md:mt-20 max-w-6xl">

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
                                    imageUrl={user.photo_url || '/images/default-avatar.svg'}
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
            )}
        </>
    );
}

export default function SearchPage() {
    return (
        <>
            <Navbar />
            <Suspense
                fallback={
                    <div className="max-w-7xl mx-auto px-6 mt-20">
                        <div className="loading loading-spinner loading-lg" />
                    </div>
                }
            >
                <SearchContent />
            </Suspense>
        </>
    );
}
