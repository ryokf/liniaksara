'use client';

import React from 'react';
import dynamic from 'next/dynamic';

interface PDFViewerProps {
    url: string;
    title?: string;
    chapterNumber?: number;
    onNavigateChapter?: (direction: 'prev' | 'next') => void;
    hasNextChapter?: boolean;
    hasPrevChapter?: boolean;
    onBack?: () => void;
}

const DynamicPDFViewer = dynamic(
  () => import('./PDFViewerComponent'),
  { 
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 w-full h-full bg-black flex items-center justify-center">
        <div className="text-white">Loading PDF viewer...</div>
      </div>
    )
  }
);

const PDFViewer: React.FC<PDFViewerProps> = (props) => {
  return <DynamicPDFViewer {...props} />;
};

export default PDFViewer;
