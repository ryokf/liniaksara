"use client";

import { use, useEffect, useState } from "react";
import supabase from "@/config/supabase";
import PDFViewer from '../../../../../components/molecules/PDFViewer';

async function resolvePdfUrl(raw: string): Promise<string> {
    // If already an absolute URL, just use it
    if (/^https?:\/\//i.test(raw)) return raw;

    // Interpret `bucket:path` or fallback to env bucket
    let bucket: string | undefined;
    let path: string | undefined;

    if (raw.includes(':')) {
        const [b, ...rest] = raw.split(':');
        bucket = b;
        path = rest.join(':');
    } else {
        bucket = process.env.NEXT_PUBLIC_SUPABASE_PDF_BUCKET;
        path = raw;
    }

    if (!bucket || !path) {
        throw new Error('PDF Storage bucket or path is missing. Provide `bucket:path` or set NEXT_PUBLIC_SUPABASE_PDF_BUCKET.');
    }

    // Try public URL first (works if bucket/object is public)
    const pub = supabase.storage.from(bucket).getPublicUrl(path);
    if (pub?.data?.publicUrl) {
        return pub.data.publicUrl;
    }

    // Otherwise, create a signed URL (works for private buckets)
    const { data: signed, error: signErr } = await supabase
        .storage
        .from(bucket)
        .createSignedUrl(path, 60 * 60); // 1 hour

    if (signed?.signedUrl) return signed.signedUrl;

    // Fallback: download the file and create an object URL (keeps URL local, avoids CORS completely)
    const { data: file, error: dlErr } = await supabase
        .storage
        .from(bucket)
        .download(path);

    if (dlErr) throw (signErr || dlErr);
    return URL.createObjectURL(file);
}


interface Part {
    id: string;
    work_id: string;
    title: string;
    part_order: number;
    content_url: string;
    is_free: boolean;
}

interface WorkType {
    id: number;
    type: string;
}

interface Work {
    id: string;
    title: string;
    work_type: WorkType;
}

interface WorkResponse {
    id: string;
    title: string;
    work_type: WorkType;
}

function isValidWorkResponse(data: any): data is WorkResponse {
    return (
        typeof data === 'object' &&
        typeof data.id === 'string' &&
        typeof data.title === 'string' &&
        typeof data.work_type === 'object' &&
        typeof data.work_type.id === 'number' &&
        typeof data.work_type.type === 'string'
    );
}

export default function ReadPage({
    params
}: {
    params: Promise<{ type: string; workId: string; chapterId: string }>
}) {
    const { type, workId, chapterId } = use(params);

    const [chapter, setChapter] = useState<Part | null>(null);
    const [work, setWork] = useState<Work | null>(null);
    const [hasNextChapter, setHasNextChapter] = useState(false);
    const [hasPrevChapter, setHasPrevChapter] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch work details and validate its type
                const { data: workData, error: workError } = await supabase
                    .from('works')
                    .select(`
                        id,
                        title,
                        work_type:work_type_id!inner (
                            id,
                            type
                        )
                    `)
                    .eq('id', workId)
                    .single();

                if (workError || !workData) { setError("NOT_FOUND"); return; }
                console.log('Chapter:', chapterId, 'Work:', workId);

                // Verify work type matches the URL
                if (workData.work_type?.type?.toLowerCase() !== type) { setError("NOT_FOUND"); return; }

                setWork(workData);

                // Fetch current chapter
                const { data: partData, error: partError } = await supabase
                    .from('parts')
                    .select('*')
                    .eq('id', chapterId)
                    .eq('work_id', workId)
                    .single();

                console.log('Part Data:', partData);


                if (partError) throw partError;
                if (!partData) { setError("NOT_FOUND"); return; }

                setChapter(partData);

                try {
                    const resolved = await resolvePdfUrl(partData.content_url);
                    setPdfUrl(resolved);
                } catch (e) {
                    console.error('Failed to resolve PDF URL:', e);
                    setError('FETCH_ERROR');
                }

                // Check for adjacent chapters
                const { data: adjacentParts, error: adjacentError } = await supabase
                    .from('parts')
                    .select('part_order')
                    .eq('work_id', workId)
                    .order('part_order');

                if (!adjacentError && adjacentParts) {
                    const currentIndex = adjacentParts.findIndex(p => p.part_order === partData.part_order);
                    setHasPrevChapter(currentIndex > 0);
                    setHasNextChapter(currentIndex < adjacentParts.length - 1);
                }

            } catch (error) {
                console.error('Error fetching data:', error);
                setError("FETCH_ERROR");
            }
        };

        fetchData();
    }, [workId, chapterId, type]);

    const handleNavigateChapter = async (direction: 'prev' | 'next') => {
        if (!chapter) return;
        try {
            // Get ordered list of chapters for this work
            const { data: parts, error } = await supabase
                .from('parts')
                .select('id, part_order')
                .eq('work_id', workId)
                .order('part_order', { ascending: true });

            if (error || !parts) throw error;

            const currentIndex = parts.findIndex(p => p.part_order === chapter.part_order);
            if (currentIndex === -1) return;

            const target = direction === 'next' ? parts[currentIndex + 1] : parts[currentIndex - 1];
            if (!target) return;

            // Navigate to the adjacent chapter
            window.location.href = `/read/${type}/${workId}/${target.id}`;
        } catch (err) {
            console.error(`Error navigating to ${direction} chapter:`, err);
        }
    };

    if (error) {
        console.error('Error:', error);
        return (
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-gray-600 dark:text-gray-400">
                    {error === "NOT_FOUND" ? "Halaman tidak ditemukan." : "Terjadi kesalahan saat memuat data."}
                </div>
            </div>
        );
    }

    if (!chapter || !work || !pdfUrl) {
        return (
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-gray-600 dark:text-gray-400">Loading...</div>
            </div>
        );
    }

    if (!chapter.content_url) {
        return (
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-gray-600 dark:text-gray-400">Content not available</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
            <div className="h-14 flex items-center justify-between px-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
                <button
                    onClick={() => handleNavigateChapter('prev')}
                    disabled={!hasPrevChapter}
                    className="px-3 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300 dark:border-gray-700"
                    aria-disabled={!hasPrevChapter}
                >
                    ‹ Prev
                </button>
                <div className="text-sm sm:text-base font-medium text-gray-800 dark:text-gray-200 truncate">
                    {work.title} — Bab {chapter.part_order}
                </div>
                <button
                    onClick={() => handleNavigateChapter('next')}
                    disabled={!hasNextChapter}
                    className="px-3 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300 dark:border-gray-700"
                    aria-disabled={!hasNextChapter}
                >
                    Next ›
                </button>
            </div>
            {/* <iframe
                title={`${work.title} — Bab ${chapter.part_order}`}
                src={pdfUrl}
                className="w-full flex-1"
                style={{ height: 'calc(100vh - 56px)', border: 'none' }}
            /> */}
            <PDFViewer url={pdfUrl} title={`${work.title} — Bab ${chapter.part_order}`} chapterNumber={chapter.part_order} onNavigateChapter={handleNavigateChapter} hasNextChapter={hasNextChapter} hasPrevChapter={hasPrevChapter} />
        </div>
    );
}
