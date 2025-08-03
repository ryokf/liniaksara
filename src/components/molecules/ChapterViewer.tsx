"use client";

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Settings, List } from 'lucide-react';

interface ChapterViewerProps {
    type: 'comic' | 'novel';
    title: string;
    chapterNumber: number;
    content: string | string[]; // string for novel, string[] of image URLs for comic
    onNavigateChapter?: (direction: 'prev' | 'next') => void;
    hasNextChapter?: boolean;
    hasPrevChapter?: boolean;
}

export default function ChapterViewer({
    type,
    title,
    chapterNumber,
    content,
    onNavigateChapter,
    hasNextChapter = false,
    hasPrevChapter = false,
}: ChapterViewerProps) {
    const [showControls, setShowControls] = useState(true);
    const [fontSize, setFontSize] = useState(16); // untuk novel
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const handleFontSizeChange = (size: number) => {
        setFontSize(Math.max(12, Math.min(24, size))); // min 12px, max 24px
        setIsSettingsOpen(false);
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            {/* Header */}
            <nav className={`
                fixed top-0 left-0 right-0 z-50 transition-transform duration-300
                ${showControls ? 'translate-y-0' : '-translate-y-full'}
            `}>
                <div className="bg-white dark:bg-gray-800 shadow-lg">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center gap-4">
                                <h1 className="text-gray-900 dark:text-white font-medium">
                                    {title}
                                </h1>
                                <span className="text-gray-500 dark:text-gray-400">
                                    Chapter {chapterNumber}
                                </span>
                            </div>

                            <div className="flex items-center gap-4">
                                {type === 'novel' && (
                                    <button 
                                        onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                                        className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                                    >
                                        <Settings size={20} />
                                    </button>
                                )}
                                <button className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                                    <List size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Font size settings untuk novel */}
                {type === 'novel' && isSettingsOpen && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4">
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white">Font Size</h3>
                            <div className="flex items-center justify-between">
                                <button 
                                    onClick={() => handleFontSizeChange(fontSize - 2)}
                                    className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                                >
                                    A-
                                </button>
                                <span className="text-gray-900 dark:text-white">{fontSize}px</span>
                                <button 
                                    onClick={() => handleFontSizeChange(fontSize + 2)}
                                    className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                                >
                                    A+
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {/* Content */}
            <div 
                className="pt-20 pb-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto"
                onMouseMove={() => setShowControls(true)}
                onMouseLeave={() => setShowControls(false)}
            >
                {type === 'novel' ? (
                    // Novel content
                    <div 
                        className="prose dark:prose-invert max-w-none"
                        style={{ fontSize: `${fontSize}px` }}
                    >
                        {typeof content === 'string' && (
                            <div dangerouslySetInnerHTML={{ __html: content }} />
                        )}
                    </div>
                ) : (
                    // Comic content
                    <div className="space-y-4">
                        {Array.isArray(content) && content.map((imageUrl, index) => (
                            <div key={index} className="relative aspect-[2/3] w-full">
                                <Image
                                    src={imageUrl}
                                    alt={`Page ${index + 1}`}
                                    fill
                                    className="object-contain"
                                    priority={index < 2} // Prioritas load untuk 2 gambar pertama
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Navigation Controls */}
            <div className={`
                fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300
                ${showControls ? 'translate-y-0' : 'translate-y-full'}
            `}>
                <div className="bg-white dark:bg-gray-800 shadow-lg">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <button
                                onClick={() => onNavigateChapter?.('prev')}
                                disabled={!hasPrevChapter}
                                className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft size={24} />
                            </button>

                            <button
                                onClick={() => onNavigateChapter?.('next')}
                                disabled={!hasNextChapter}
                                className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
