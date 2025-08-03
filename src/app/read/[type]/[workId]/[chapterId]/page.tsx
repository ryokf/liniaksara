"use client";

import { useParams } from "next/navigation";
import ChapterViewer from "@/components/molecules/ChapterViewer";
import { useEffect, useState } from "react";

interface Chapter {
    id: string;
    title: string;
    content: string | string[]; // string untuk novel, string[] untuk comic
    chapterNumber: number;
    type: 'novel' | 'comic';
}

export default function ReadPage() {
    const params = useParams();
    const [chapter, setChapter] = useState<Chapter | null>(null);
    const [hasNextChapter, setHasNextChapter] = useState(false);
    const [hasPrevChapter, setHasPrevChapter] = useState(false);

    useEffect(() => {
        // Di sini Anda akan mengambil data chapter dari API
        const fetchChapter = async () => {
            try {
                // Ganti dengan panggilan API yang sebenarnya
                const mockChapter = {
                    id: params.chapterId as string,
                    title: "Judul Karya",
                    content: params.type === 'novel' 
                        ? "<p>Ini adalah konten novel...</p>"
                        : ["/sample-page-1.jpg", "/sample-page-2.jpg"],
                    chapterNumber: 1,
                    type: params.type as 'novel' | 'comic'
                };
                
                setChapter(mockChapter);
                // Cek keberadaan chapter sebelum/sesudah
                setHasNextChapter(true); // Sesuaikan dengan logika Anda
                setHasPrevChapter(false);
            } catch (error) {
                console.error("Error fetching chapter:", error);
            }
        };

        fetchChapter();
    }, [params.chapterId, params.workId, params.type]);

    const handleNavigateChapter = (direction: 'prev' | 'next') => {
        // Implementasi navigasi chapter
        const currentChapterNumber = chapter?.chapterNumber || 1;
        const newChapterNumber = direction === 'next' 
            ? currentChapterNumber + 1 
            : currentChapterNumber - 1;
        
        // Redirect ke chapter baru
        window.location.href = `/read/${params.type}/${params.workId}/${newChapterNumber}`;
    };

    if (!chapter) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <ChapterViewer
            type={chapter.type}
            title={chapter.title}
            chapterNumber={chapter.chapterNumber}
            content={chapter.content}
            onNavigateChapter={handleNavigateChapter}
            hasNextChapter={hasNextChapter}
            hasPrevChapter={hasPrevChapter}
        />
    );
}
