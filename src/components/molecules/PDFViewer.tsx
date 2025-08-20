'use client';

import React from 'react';

interface PDFViewerProps {
    url: string;
    title?: string;
    chapterNumber?: number;
    onNavigateChapter?: (direction: 'prev' | 'next') => void;
    hasNextChapter?: boolean;
    hasPrevChapter?: boolean;
}

const PDFViewer: React.FC<PDFViewerProps> = ({
    url,
    title,
    chapterNumber,
    onNavigateChapter,
    hasNextChapter,
    hasPrevChapter,
}) => {

    return (
        <div className="fixed inset-0 w-full h-full bg-white dark:bg-gray-900">
            {/* <div className="h-14 flex items-center justify-between px-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
                <button
                    onClick={() => onNavigateChapter?.('prev')}
                    disabled={!hasPrevChapter}
                    className="px-3 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300 dark:border-gray-700"
                >
                    ‹ Prev
                </button>
                <div className="text-sm sm:text-base font-medium text-gray-800 dark:text-gray-200 truncate">
                    {title} — Bab {chapterNumber}
                </div>
                <button
                    onClick={() => onNavigateChapter?.('next')}
                    disabled={!hasNextChapter}
                    className="px-3 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300 dark:border-gray-700"
                >
                    Next ›
                </button>
            </div> */}
            <iframe
                src={url}
                className="flex-1 w-full h-screen"
                style={{ 
                    border: 'none',
                    width: '100%',
                    height: '100vh',
                    overflow: 'hidden'
                }}
                title={`${title} — Bab ${chapterNumber}`}
                allow="fullscreen"
                // sandbox="allow-same-origin allow-scripts allow-forms"
            />
        </div>
    );
};

export default PDFViewer;
