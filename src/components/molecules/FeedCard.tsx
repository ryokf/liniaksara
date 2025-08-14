"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Heart, MessageCircle, Share } from "lucide-react";
import { Work } from "@/types/works";

export default function FeedCard({ work }: { work: Work }) {
    const router = useRouter();



    return (
        <div className="bg-whitedark:bg-gray-900 border-b dark:border-gray-800">
            {/* Header */}
            <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                        {work.author?.photo_url ? (
                            <Image
                                src={work.author.photo_url}
                                alt={work.author.username || ""}
                                width={32}
                                height={32}
                                className="object-cover w-full h-full"
                            />
                        ) : (
                            <div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary">
                                {work.author?.username?.[0] || "U"}
                            </div>
                        )}
                    </div>
                    <div>
                        <Link href={`/profile/${work.author_id}`} className="font-medium text-sm hover:underline">
                            {work.author?.username || "Unknown Author"}
                        </Link>
                    </div>
                </div>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                    <MoreHorizontal className="w-5 h-5" />
                </button>
            </div>

            {/* Content/Cover */}
            <div 
                className="aspect-[4/5] relative bg-gray-100 dark:bg-gray-800 cursor-pointer"
                onClick={() => router.push(`/${work.work_type?.type}/${work.id}`)}
            >
                {work.cover ? (
                    <Image
                        src={work.cover}
                        alt={work.title}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Cover
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-4">
                        <button className="hover:text-red-500">
                            <Heart className="w-6 h-6" />
                        </button>
                        <button className="hover:text-primary">
                            <MessageCircle className="w-6 h-6" />
                        </button>
                        <button className="hover:text-primary">
                            <Share className="w-6 h-6" />
                        </button>
                    </div>
                    {/* <button className="hover:text-primary">
                        <BookmarkSimple className="w-6 h-6" />
                    </button> */}
                </div>

                {/* Title & Description */}
                <div className="space-y-1">
                    <h3 className="font-semibold">{work.title}</h3>
                    {work.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                            {work.description}
                        </p>
                    )}
                    <div className="text-xs text-gray-500">
                        {work.parts?.length || 0} parts • {new Date(work.created_at).toLocaleDateString()}
                    </div>
                </div>
            </div>
        </div>
    );
}
