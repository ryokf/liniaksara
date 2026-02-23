import { Edit } from 'lucide-react';
import { useState } from 'react';
import Button from '../atoms/Button';
import EditWorkModal from './EditWorkModal';
import { Work } from '@/types/works';

interface EditWorkButtonProps {
    work: Work;
}

export default function EditWorkButton({ work }: EditWorkButtonProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <Button 
                variant="outline"
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-amber-500 hover:!bg-amber-500/80"
            >
                <Edit className="w-4 h-4" />
                Edit Karya
            </Button>

            <EditWorkModal
                work={work}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}