import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Button from '../atoms/Button';
import { deleteWork } from '@/services/deleteWorkService';

interface DeleteWorkButtonProps {
    workId: string;
}

export default function DeleteWorkButton({ workId }: DeleteWorkButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        setIsLoading(true);
        try {
            const { success, error } = await deleteWork(workId);
            
            if (success) {
                toast.success('Karya berhasil dihapus');
                router.push('/dashboard/works');
            } else {
                throw error;
            }
        } catch (error) {
            console.error('Failed to delete work:', error);
            toast.error('Gagal menghapus karya');
        } finally {
            setIsLoading(false);
            setIsOpen(false);
        }
    };

    return (
        <>
            <Button 
                variant="danger"
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 bg-red-500"
            >
                <Trash2 className="w-4 h-4" />
                Hapus Karya
            </Button>

            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl w-full max-w-md">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                            Hapus Karya
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            Apakah Anda yakin ingin menghapus karya ini? Tindakan ini tidak dapat dibatalkan.
                        </p>
                        <div className="flex justify-end gap-4">
                            <Button
                                variant="secondary"
                                onClick={() => setIsOpen(false)}
                                disabled={isLoading}
                            >
                                Batal
                            </Button>
                            <Button
                                variant="danger"
                                onClick={handleDelete}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Menghapus...' : 'Hapus'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}