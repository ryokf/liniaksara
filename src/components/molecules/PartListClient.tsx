'use client';

import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import ComicEpisodeCard from './ComicEpisodeCard';
import ChapterItem from './ChapterItem';
import MovieEpisodeCard from './MovieEpisodeCard';
import EditPartModal from './EditPartModal';
import supabase from '@/config/supabase';

export interface Part {
    id: string;
    title: string;
    part_order: number;
    content?: string;
    content_url?: string;
    type: string;
    creatorId: string;
    workId: string;
    status: string;
    thumbnail?: string;
    description?: string;
    is_free: boolean;
}

export interface PartListClientProps {
    parts: Part[];
    isAuthor: boolean;
}

const PartListClient: React.FC<PartListClientProps> = ({ parts, isAuthor }) => {
    const router = useRouter();
    const [items, setItems] = useState<Part[]>(parts);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedPart, setSelectedPart] = useState<Part | null>(null);

    const handleEditClick = (part: Part) => {
        setSelectedPart(part);
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = async (editedPart: Part) => {
        try {
            const currentPart = items.find(item => item.id === editedPart.id);
            if (!currentPart) throw new Error('Part not found');

            const oldOrder = currentPart.part_order;
            const newOrder = editedPart.part_order;
            
            // Jika urutan tidak berubah, hanya update field lainnya
            if (oldOrder === newOrder) {
                const { error } = await supabase
                    .from('parts')
                    .update({
                        title: editedPart.title,
                        is_free: editedPart.is_free,
                        content_url: editedPart.content_url,
                    })
                    .eq('id', editedPart.id);

                if (error) throw error;
            } else {
                // Langkah 1: Identifikasi part yang perlu diupdate
                const affectedParts = items
                    .filter(item => 
                        item.part_order > oldOrder && 
                        item.part_order <= newOrder
                    )
                    .sort((a, b) => b.part_order - a.part_order); // Urutkan dari yang terbesar

                // Langkah 2: Pindahkan semua part yang terpengaruh ke urutan yang sangat besar (10000+)
                let tempOrder = 10000;
                for (const part of [...affectedParts, currentPart]) {
                    const { error } = await supabase
                        .from('parts')
                        .update({ part_order: tempOrder++ })
                        .eq('id', part.id);

                    if (error) throw error;
                }

                // Langkah 3: Update part yang diedit ke urutan final
                const { error: editError } = await supabase
                    .from('parts')
                    .update({
                        title: editedPart.title,
                        is_free: editedPart.is_free,
                        content_url: editedPart.content_url,
                        part_order: newOrder
                    })
                    .eq('id', editedPart.id);

                if (editError) throw editError;

                // Langkah 4: Update urutan part yang terpengaruh
                for (const part of affectedParts) {
                    const { error } = await supabase
                        .from('parts')
                        .update({
                            part_order: part.part_order - 1
                        })
                        .eq('id', part.id);

                    if (error) {
                        console.error('Error updating part order:', error);
                        throw error;
                    }
                }

            }

            // Update state lokal
            const updatedItems = items.map(item => {
                if (item.id === editedPart.id) {
                    return { ...item, ...editedPart };
                } else if (item.part_order > oldOrder && item.part_order <= newOrder) {
                    return { ...item, part_order: item.part_order - 1 };
                }
                return item;
            }).sort((a, b) => a.part_order - b.part_order);

            setItems(updatedItems);
            toast.success('Bagian berhasil diperbarui');
        } catch (error) {
            console.error('Error updating part:', error);
            toast.error('Gagal memperbarui bagian');
        } finally {
            setIsEditModalOpen(false);
            setSelectedPart(null);
            router.refresh();
            router.push(window.location.pathname);
        }
    };

    return (
        <div className="relative">
            <div className="space-y-4">
                {items.map((part) => (
                    <div
                        key={part.id}
                        className="rounded-lg shadow hover:shadow-md transition-all duration-200"
                    >
                        {part.type === 'comic' && (
                            <ComicEpisodeCard
                                id={part.id}
                                workId={part.workId}
                                title={part.title}
                                type={part.type}
                                part_order={part.part_order}
                                thumbnail={part.thumbnail}
                                is_free={part.is_free}
                                isAuthor={isAuthor}
                                onEdit={() => handleEditClick(part)}
                            />
                        )}
                        {part.type === 'novel' && (
                            <ChapterItem
                                id={part.id}
                                workId={part.workId}
                                title={part.title}
                                type={part.type}
                                chapterNumber={part.part_order}
                                isAuthor={isAuthor}
                                onEdit={() => handleEditClick(part)}
                            />
                        )}
                        {part.type === 'movie' && (
                            <MovieEpisodeCard
                                id={part.id}
                                workId={part.workId}
                                title={part.title}
                                episodeNumber={part.part_order}
                                thumbnail={part.thumbnail || '/images/default-cover.svg'}
                                isFree={part.is_free}
                                duration="0:00"
                                isAuthor={isAuthor}
                                onEdit={() => handleEditClick(part)}
                            />
                        )}
                    </div>
                ))}
            </div>
            {isEditModalOpen && selectedPart && (
                <EditPartModal
                    isOpen={isEditModalOpen}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setSelectedPart(null);
                    }}
                    onSubmit={handleEditSubmit}
                    part={selectedPart}
                />
            )}
        </div>
    );
};

export default PartListClient;