"use client";

import { useEffect, useState } from "react";
import FeedCard from "@/components/molecules/FeedCard";
import TopCreatorScroll from "@/components/organisms/TopCreatorMobile";
import { Work } from "@/types/works";
import { getLatestOnePageWorks, getLatestWorks } from "@/services/workServices";
import { getUser } from "@/services/userServices";
import { getWorkTransactions } from "@/services/WorkTransactionService";
import { User } from "@supabase/supabase-js";
import MediaCarousel from "../organisms/MediaCarousel";
import { WorkTransaction } from "@/types/workTransaction";

export default function MobileFeed() {
    const [works, setWorks] = useState<Work[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [library, setLibrary] = useState<WorkTransaction[]>([]);

    const fetchWorks = async () => {
        try {
            const latestWorks = await getLatestOnePageWorks();

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

    
    const fetchUser = async () => {
        const user = await getUser();
        setUser(user || null);

    }
    
    useEffect(() => {
        fetchUser();
    }, []);
    
    useEffect(() => {
        if (user) {
            fetchWorkTransactions(user.id);
        }
    }, [user]);
    
    const fetchWorkTransactions = async (buyerId: string | null | undefined) => {
        try {
            if (!buyerId) throw new Error("Buyer ID is required");
            const library = await getWorkTransactions(buyerId);
            setLibrary(library);

        } catch (error) {
            console.error("Failed to fetch work transactions:", error);
        }
    }
    
    const libraryAsMediaItems = library.map(l => ({
        id: l.id,
        type: l.works.work_types.type,
        title: l.works.title,
        cover: l.works.cover,
        author_name: l.works.profiles.username,
        rating: 13, // TODO: Implement rating system
        episodeCount: 0,
    }));


    
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="sm:hidden">
            {/* <MediaCarousel
                title="Next in your library"
                items={libraryAsMediaItems}
            /> */}
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
                {works.map((work) => (
                    <FeedCard key={work.id} work={work} />
                ))}
            </div>
            <TopCreatorScroll />
        </div>
    );
}
