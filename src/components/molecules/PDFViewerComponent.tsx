'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2, ArrowLeft, ArrowDownWideNarrow, ArrowLeftRight } from 'lucide-react';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Using specific version that matches the worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PDFViewerComponentProps {
    url: string;
    title?: string;
    chapterNumber?: number;
    onNavigateChapter?: (direction: 'prev' | 'next') => void;
    hasNextChapter?: boolean;
    hasPrevChapter?: boolean;
    onBack?: () => void;
}

const PDFViewerComponent: React.FC<PDFViewerComponentProps> = ({
    url,
    title,
    chapterNumber,
    onNavigateChapter,
    hasNextChapter,
    hasPrevChapter,
    onBack
}) => {
    const [numPages, setNumPages] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [scale, setScale] = useState<number>(1.0);
    const [isLoading, setIsLoading] = useState(true);
    const [isDoublePage, setIsDoublePage] = useState(true);
    const [readingDirection, setReadingDirection] = useState<'horizontal' | 'vertical'>('vertical');
    const contentRef = React.useRef<HTMLDivElement>(null);

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
        setIsLoading(false);
    };

    const handleZoom = (direction: 'in' | 'out') => {
        if (direction === 'in' && scale < 2.0) {
            setScale(prev => prev + 0.1);
        } else if (direction === 'out' && scale > 0.5) {
            setScale(prev => prev - 0.1);
        }
    };

    const handlePageChange = (offset: number) => {
        const newPage = currentPage + offset;
        if (newPage >= 1 && newPage <= numPages) {
            setCurrentPage(newPage);
        } else if (newPage > numPages && hasNextChapter) {
            onNavigateChapter?.('next');
        } else if (newPage < 1 && hasPrevChapter) {
            onNavigateChapter?.('prev');
        }
    };

    return (
        <div className="fixed inset-0 w-full h-full bg-black">
            {/* Top Navigation */}
            <div className="absolute top-0 left-0 right-0 h-16 bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-between px-4">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={onBack}
                        className="text-white hover:text-gray-300 transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div className="text-white">
                        <h2 className="text-sm md:text-lg font-semibold">{title}</h2>
                        <p className="text-xs text-gray-300">Chapter {chapterNumber}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => handleZoom('out')}
                        className="p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                        disabled={scale <= 0.5}
                        title="Zoom Out"
                    >
                        <ZoomOut size={20} />
                    </button>
                    <button 
                        onClick={() => handleZoom('in')}
                        className="p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                        disabled={scale >= 2.0}
                        title="Zoom In"
                    >
                        <ZoomIn size={20} />
                    </button>
                    <button 
                        onClick={() => {
                            setReadingDirection(prev => {
                                const newDirection = prev === 'horizontal' ? 'vertical' : 'horizontal';
                                if (newDirection === 'vertical') {
                                    // Scroll to top when switching to vertical mode
                                    setTimeout(() => {
                                        contentRef.current?.scrollTo({ top: 0, behavior: 'instant' });
                                    }, 0);
                                }
                                return newDirection;
                            });
                        }}
                        className="p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                        title={`${readingDirection === 'horizontal' ? 'Vertical' : 'Horizontal'} Reading Mode`}
                    >
                        {readingDirection === 'horizontal' ? 
                            <ArrowDownWideNarrow size={20} /> : 
                            <ArrowLeftRight size={20} />
                        }
                    </button>
                    {readingDirection === 'horizontal' && (
                        <button 
                            onClick={() => setIsDoublePage(!isDoublePage)}
                            className="p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                            title={isDoublePage ? "Single Page" : "Double Page"}
                        >
                            <Maximize2 size={20} />
                        </button>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="h-full w-full flex items-center justify-center pt-16 relative">
                {/* PDF Document */}
                <div 
                    ref={contentRef}
                    className={`
                        flex-1 h-full 
                        ${readingDirection === 'vertical' 
                            ? 'overflow-y-auto py-4 items-start' 
                            : 'overflow-hidden items-center'
                        } 
                        flex justify-center
                    `}>
                    <Document
                        file={url}
                        onLoadSuccess={onDocumentLoadSuccess}
                        loading={<div className="text-white">Loading...</div>}
                    >
                        {readingDirection === 'vertical' ? (
                            // Vertical Reading Mode - All pages in a column
                            <div className="flex flex-col gap-4 items-center w-full max-w-full">
                                {Array.from(new Array(numPages), (_, index) => (
                                    <div 
                                        key={index + 1} 
                                        className="w-full flex justify-center px-4"
                                    >
                                        <Page
                                            pageNumber={index + 1}
                                            scale={scale}
                                            loading={<div className="text-white">Loading page...</div>}
                                            renderTextLayer={false}
                                            renderAnnotationLayer={false}
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            // Horizontal Reading Mode - One or two pages side by side
                            <div className="flex gap-4">
                                <Page
                                    pageNumber={currentPage}
                                    scale={scale}
                                    loading={<div className="text-white">Loading page...</div>}
                                    renderTextLayer={false}
                                    renderAnnotationLayer={false}
                                />
                                {isDoublePage && currentPage < numPages && (
                                    <Page
                                        pageNumber={currentPage + 1}
                                        scale={scale}
                                        loading={<div className="text-white">Loading page...</div>}
                                        renderTextLayer={false}
                                        renderAnnotationLayer={false}
                                    />
                                )}
                            </div>
                        )}
                    </Document>
                </div>

                {/* Navigation Buttons - Only show in horizontal mode */}
                {readingDirection === 'horizontal' && (
                    <>
                        <button
                            onClick={() => handlePageChange(-2)}
                            disabled={currentPage <= 1 && !hasPrevChapter}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white p-2 rounded-full bg-gray-900/50 hover:bg-gray-900/80 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            onClick={() => handlePageChange(2)}
                            disabled={currentPage >= numPages && !hasNextChapter}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white p-2 rounded-full bg-gray-900/50 hover:bg-gray-900/80 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default PDFViewerComponent;
