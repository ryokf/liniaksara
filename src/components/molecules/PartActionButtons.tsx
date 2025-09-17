import { Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Button from '../atoms/Button';
import supabase from '@/config/supabase';

interface PartActionButtonsProps {
    partId: string;
    workId: string;
    type: string;
    onEditClick?: () => void;
}

export default function PartActionButtons({ partId, workId, type, onEditClick }: PartActionButtonsProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm('Apakah Anda yakin ingin menghapus bagian ini?')) {
            return;
        }

        setIsDeleting(true);
        try {
            // First, get the part data to check for files to delete
            const { data: part, error: fetchError } = await supabase
                .from('parts')
                .select('*')
                .eq('id', partId)
                .single();

            if (fetchError) throw fetchError;

            // Delete the content file based on the type
            if (part) {
                if (type === 'comic') {
                    const { error: storageError } = await supabase.storage
                        .from('comics')
                        .remove([`${workId}/${partId}.pdf`]);
                    if (storageError) throw storageError;
                } else if (type === 'movie') {
                    const { error: storageError } = await supabase.storage
                        .from('movies')
                        .remove([`${workId}/${partId}.mp4`]);
                    if (storageError) throw storageError;
                }

                // Delete thumbnail if exists
                if (part.thumbnail) {
                    const { error: thumbError } = await supabase.storage
                        .from('thumbnails')
                        .remove([part.thumbnail]);
                    if (thumbError) throw thumbError;
                }
            }

            // Finally delete the part record
            const { error: deleteError } = await supabase
                .from('parts')
                .delete()
                .eq('id', partId);

            if (deleteError) throw deleteError;

            toast.success('Bagian berhasil dihapus');
            router.refresh();
        } catch (error) {
            console.error('Error deleting part:', error);
            toast.error('Gagal menghapus bagian');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="flex items-center gap-2">
            <Button
                variant="outline"
                onClick={onEditClick}
                disabled={isDeleting}
                className="!p-2"
                ariaLabel="Edit bagian"
            >
                <Edit className="w-4 h-4" />
            </Button>
            <Button
                variant="danger"
                onClick={handleDelete}
                disabled={isDeleting}
                className="!p-2"
                ariaLabel="Hapus bagian"
            >
                <Trash2 className="w-4 h-4" />
            </Button>
        </div>
    );
}