"use client";

import Image from "next/image";
import Link from "next/link";
import { UserCheck } from "lucide-react";

interface Creator {
    id: string;
    name: string;
    username: string;
    photo?: string;
    followers: number;
    isVerified?: boolean;
}

export default function TopCreatorScroll() {
    // Mock data - nanti bisa diganti dengan data dari API
    const creators: Creator[] = [
        {
            id: "1",
            name: "Tere Liye",
            username: "tereliye",
            photo: "/creators/tere.jpg",
            followers: 15000,
            isVerified: true
        },
        {
            id: "2",
            name: "Dee Lestari",
            username: "deelestari",
            photo: "/creators/dee.jpg",
            followers: 12000,
            isVerified: true
        },
        {
            id: "3",
            name: "Andrea Hirata",
            username: "andreahirata",
            photo: "/creators/andrea.jpg",
            followers: 10000,
            isVerified: true
        },
        // Tambahkan creator lainnya...
    ];

    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 mb-4">
            <h2 className="text-xl font-bold mb-4">Creators to Follow</h2>
            
            {/* Scrollable container */}
            <div className="overflow-x-auto flex gap-4 pb-4 scrollbar-hide">
                {creators.map((creator) => (
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
                                            alt={creator.name}
                                            width={48}
                                            height={48}
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary text-lg">
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
                                    {creator.followers.toLocaleString()} followers
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
