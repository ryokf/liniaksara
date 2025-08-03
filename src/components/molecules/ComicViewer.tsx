import { useState } from 'react';
import Image from 'next/image';
import { ChevronUp, ChevronDown, Settings, List } from 'lucide-react';

interface ComicViewerProps {
    images: string[];
    title: string;
    chapterNumber: number;
    onNavigateChapter?: (direction: 'prev' | 'next') => void;
    hasNextChapter?: boolean;
    hasPrevChapter?: boolean;
}

export default function ComicViewer({ 
    images, 
    title, 
    chapterNumber,
    onNavigateChapter,
    hasNextChapter = false,
    hasPrevChapter = false,
}: ComicViewerProps) {
    const [showControls, setShowControls] = useState(true);

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Fixed Top Navigation */}
            <nav className={`
                fixed top-0 left-0 right-0 z-50 transition-transform duration-300
                ${showControls ? 'translate-y-0' : '-translate-y-full'}
            `}>
                <div className="bg-gray-800/80 backdrop-blur-lg border-b border-gray-700">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            {/* Title & Chapter */}
                            <div className="flex items-center gap-4">
                                <h1 className="text-white font-medium">
                                    {title}
                                </h1>
                                <span className="text-gray-400">
                                    Chapter {chapterNumber}
                                </span>
                            </div>

                            {/* Controls */}
                            <div className="flex items-center gap-4">
                                <button 
                                    className="p-2 text-gray-400 hover:text-white transition-colors"
                                    title="Chapters List"
                                >
                                    <List size={20} />
                                </button>
                                <button 
                                    className="p-2 text-gray-400 hover:text-white transition-colors"
                                    title="Settings"
                                >
                                    <Settings size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Content */}
            <div 
                className="max-w-3xl mx-auto py-20 px-4"
                onClick={() => setShowControls(prev => !prev)}
            >
                <div className="space-y-2">
                    {images.map((src, index) => (
                        <div 
                            key={index}
                            className="relative aspect-[2/3] w-full bg-gray-800 rounded-lg overflow-hidden"
                        >
                            <Image
                                src={src}
                                alt={`Page ${index + 1}`}
                                fill
                                className="object-contain"
                                sizes="(max-width: 768px) 100vw, 768px"
                                priority={index < 3} // Prioritize loading first 3 images
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Fixed Bottom Navigation */}
            <nav className={`
                fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300
                ${showControls ? 'translate-y-0' : 'translate-y-full'}
            `}>
                <div className="bg-gray-800/80 backdrop-blur-lg border-t border-gray-700">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-center h-16 gap-4">
                            <button
                                onClick={() => onNavigateChapter?.('prev')}
                                disabled={!hasPrevChapter}
                                className="p-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronUp size={24} />
                            </button>
                            <button
                                onClick={() => onNavigateChapter?.('next')}
                                disabled={!hasNextChapter}
                                className="p-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronDown size={24} />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
}
