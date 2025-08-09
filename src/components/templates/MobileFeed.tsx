"use client";

import { useEffect, useState } from "react";
import FeedCard from "@/components/molecules/FeedCard";
import TopCreatorScroll from "@/components/organisms/TopCreatorMobile";
import { Work } from "@/types/works";
import { getLatestOnePageWorks, getLatestWorks } from "@/services/works";

export default function MobileFeed() {
    const [works, setWorks] = useState<Work[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchWorks = async () => {
        try {
            const latestWorks = await getLatestOnePageWorks();
            console.log(latestWorks);
            setWorks(latestWorks);
        } catch (error) {
            console.error("Failed to fetch works:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWorks();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="sm:hidden">
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
                {works.map((work) => (
                    <FeedCard key={work.id} work={work} />
                ))}
            </div>
            <TopCreatorScroll />
        </div>
    );
}
