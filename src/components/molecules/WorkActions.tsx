'use client';

import { Edit, Trash2, Plus, Play, Bookmark } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
// import { deleteWork } from '@/services/workDetailService';

interface WorkActionsProps {
    workId: string;
    authorId: string;
}

export default function WorkActions({ workId, authorId }: WorkActionsProps) {
    const { userLogin } = useAuth();
    const router = useRouter();
    const [showMenu, setShowMenu] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Only show the menu if the current user is the author
    if (!userLogin || userLogin.id !== authorId) {
        return (
            <>
                <button className="px-8 py-3 rounded-full gradient-bg text-white font-medium hover:opacity-90 transition-opacity flex items-center gap-2">
                    <Play className="w-5 h-5" fill="currentColor" />
                    Tonton Sekarang
                </button>
                <button className="px-8 py-3 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center gap-2">
                    <Bookmark className="w-5 h-5" />
                    Tambah ke List
                </button>
            </>
        );
    }

    const handleEdit = () => {
        router.push(`/dashboard/works/edit/${workId}`);
    };

    const handleDelete = async () => {
        if (!confirm('Apakah Anda yakin ingin menghapus karya ini?')) {
            return;
        }

        try {
            setIsDeleting(true);
            // await deleteWork(workId);
            router.push('/dashboard/works');
            router.refresh();
        } catch (error) {
            console.error('Error deleting work:', error);
            alert('Gagal menghapus karya. Silakan coba lagi.');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleAddPart = () => {
        router.push(`/dashboard/works/parts/add/${workId}`);
    };

    return (
        <div className="flex gap-4">
            <button
                onClick={handleEdit}
                className="px-8 py-3 rounded-full gradient-bg text-white font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
                disabled={isDeleting}
            >
                <Edit className="w-5 h-5" />
                Edit Karya
            </button>
            <button
                onClick={handleDelete}
                className="px-8 py-3 rounded-full bg-red-600 text-white font-medium hover:bg-red-700 transition-colors flex items-center gap-2"
                disabled={isDeleting}
            >
                <Trash2 className="w-5 h-5" />
                {isDeleting ? 'Menghapus...' : 'Hapus Karya'}
            </button>
        </div>
    );
}
