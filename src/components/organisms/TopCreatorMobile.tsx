"use client";

import Image from "next/image";
import Link from "next/link";
import { UserCheck, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getTopCreators } from "@/services/creatorService";

interface Creator {
    id: string;
    name: string;
    username: string;
    photo?: string;
    sales: number;
    worksCount: number;
    isVerified?: boolean;
}

export default function TopCreatorScroll() {
    const [creators, setCreators] = useState<Creator[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTopCreators = async () => {
            try {
                const data = await getTopCreators(10);
                setCreators(data);
            } catch (error) {
                console.error('Failed to fetch top creators:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTopCreators();
    }, []);

    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 mb-4">
            <h2 className="text-xl font-bold mb-4">Creators to Follow</h2>
            
            {/* Scrollable container */}
            <div className="overflow-x-auto flex gap-4 pb-4 scrollbar-hide">
                {loading ? (
                    <div className="flex items-center justify-center w-full py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    </div>
                ) : creators.length === 0 ? (
                    <div className="flex items-center justify-center w-full py-8 text-gray-500">
                        No creators found
                    </div>
                ) : creators.map((creator) => (
                    <div
                        key={creator.id}
                        className="flex-shrink-0 w-[250px] bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
                    >
                        <div className="flex items-start gap-3">
                            {/* Avatar */}
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                                    {creator.photo ? (
                                        <Image
                                            src={creator.photo}
                                            alt={creator.name?.trim() ? `Profile picture of ${creator.name}` : `Profile picture of @${creator.username}`}
                                            width={48}
                                            height={48}
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div
                                            className="w-full h-full bg-primary/20 flex items-center justify-center text-primary text-lg"
                                            role="img"
                                            aria-label={creator.name?.trim() ? `Placeholder avatar for ${creator.name}` : `Placeholder avatar for @${creator.username}`}
                                        >
                                            {creator.name[0]}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1">
                                    <h3 className="font-semibold truncate">
                                        {creator.name}
                                    </h3>
                                    {creator.isVerified && (
                                        <UserCheck className="w-4 h-4 text-primary flex-shrink-0" />
                                    )}
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                    @{creator.username}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                    {creator.sales.toLocaleString()} karya terjual
                                </p>
                            </div>
                        </div>

                        {/* Follow Button */}
                        <Link
                            href={`/profile/${creator.username}`}
                            className="mt-3 block w-full py-2 px-4 text-center text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-full transition"
                        >
                            Follow
                        </Link>
                    </div>
                ))}
                </div>
        </div>
    );
}
