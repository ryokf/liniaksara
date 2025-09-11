import { useState, useEffect } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { uploadWork, getWorkTypes } from '@/services/uploadService';
import { useAuth } from '@/contexts/AuthContext';
import { WorkType } from '@/types/works';

interface UploadWorkFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function UploadWorkForm({ isOpen, onClose, onSuccess }: UploadWorkFormProps) {
    const { userLogin } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [contentFile, setContentFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [workTypes, setWorkTypes] = useState<WorkType[]>([]);
    const [error, setError] = useState<string>('');
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        workTypeId: 0,
        isDraft: true,
        price: ''
    });

    useEffect(() => {
        // Load work types when component mounts
        const loadWorkTypes = async () => {
            try {
                const types = await getWorkTypes();
                setWorkTypes(types);
                if (types.length > 0) {
                    setFormData(prev => ({ ...prev, workTypeId: types[0].id }));
                }
            } catch (error) {
                console.error('Error loading work types:', error);
                setError('Failed to load work types');
            }
        };
        
        if (isOpen) {
            loadWorkTypes();
        }
    }, [isOpen]);

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setCoverFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setContentFile(file);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        // Special handling for workTypeId so the state stays numeric and we can react to One Page type
        if (name === 'workTypeId') {
            const id = Number(value);
            const nextType = workTypes.find(t => t.id === id)?.type?.toLowerCase();
            setFormData(prev => ({
                ...prev,
                workTypeId: id,
                // If switching to One Page, ensure price is cleared/ignored
                ...(nextType === 'one page' ? { price: '' } : {})
            }));
            return;
        }

        // Default handler
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            workTypeId: workTypes[0]?.id || 0,
            isDraft: true,
            price: ''
        });
        setCoverFile(null);
        setContentFile(null);
        setPreviewUrl(null);
        setError('');
    };

    // Determine selected work type and whether it is a One Page (free)
    const selectedWorkType = workTypes.find(t => t.id === Number(formData.workTypeId));
    const isOnePage = (selectedWorkType?.type || '').toLowerCase() === 'one page';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userLogin) {
            setError('You must be logged in to upload works');
            return;
        }

        if (!formData.title.trim()) {
            setError('Title is required');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            await uploadWork({
                ...formData,
                // Enforce free price for One Page type
                price: isOnePage ? '0' : formData.price,
                authorId: userLogin.id,
                cover: coverFile ?? undefined
            });

            resetForm();
            onSuccess?.();
            onClose();
        } catch (error) {
            console.error('Error uploading work:', error);
            setError('Failed to upload work. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/50" onClick={onClose} />

            {/* Modal */}
            <div className="relative min-h-screen flex items-center justify-center p-4">
                <div className="relative bg-white dark:bg-gray-900 rounded-2xl w-full max-w-2xl shadow-xl">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            Upload Karya Baru
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {error && (
                        <div className="mx-6 mt-4 p-4 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Title */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Judul
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary/50"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Deskripsi
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={4}
                                className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary/50 resize-none"
                            />
                        </div>

                        {/* Work Type */}
                        <div>
                            <label htmlFor="workTypeId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Tipe Karya
                            </label>
                            <select
                                id="workTypeId"
                                name="workTypeId"
                                value={formData.workTypeId}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary/50"
                            >
                                {workTypes.map(type => (
                                    <option key={type.id} value={type.id}>
                                        {type.type}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Price */}
                        <div className={`${isOnePage ? 'hidden' : ''}`}>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Harga
                            </label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                className={` w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary/50 disabled:opacity-50`}
                                placeholder={isOnePage ? "Tipe One Page selalu gratis" : "Masukkan harga karya"}
                                min="0"
                                disabled={isOnePage}
                                title={isOnePage ? "Harga dinonaktifkan untuk tipe One Page" : undefined}
                            />
                            {isOnePage && (
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    Tipe <span className="font-medium">One Page</span> bersifat gratis. Field harga dinonaktifkan.
                                </p>
                            )}
                        </div>

                        {/* Draft or Published */}
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isDraft"
                                name="isDraft"
                                checked={formData.isDraft}
                                onChange={(e) => setFormData(prev => ({ ...prev, isDraft: e.target.checked }))}
                                className="h-4 w-4 text-primary border-gray-300 rounded"
                            />
                            <label htmlFor="isDraft" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Simpan sebagai Draft
                            </label>
                        </div>

                        {/* Cover Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Cover Image
                            </label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-lg">
                                <div className="space-y-1 text-center">
                                    {previewUrl ? (
                                        <div className="relative w-40 h-40 mx-auto">
                                            <Image
                                                src={previewUrl}
                                                alt="Preview"
                                                fill
                                                className="object-cover rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setCoverFile(null);
                                                    setPreviewUrl(null);
                                                }}
                                                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                            <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                                <label htmlFor="cover" className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80">
                                                    <span>Upload a file</span>
                                                    <input
                                                        id="cover"
                                                        name="cover"
                                                        type="file"
                                                        accept="image/*"
                                                        className="sr-only"
                                                        onChange={handleCoverChange}
                                                    />
                                                </label>
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                PNG, JPG, GIF up to 10MB
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Content File Upload */}
                        {/* <div>
                            <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Content File (Optional)
                            </label>
                            <div className="mt-1">
                                <input
                                    type="file"
                                    id="content"
                                    name="content"
                                    onChange={handleContentChange}
                                    className="w-full text-sm text-gray-500 dark:text-gray-400
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-full file:border-0
                                        file:text-sm file:font-medium
                                        file:bg-primary/10 file:text-primary
                                        hover:file:bg-primary/20
                                        cursor-pointer"
                                    accept=".pdf,.epub,.doc,.docx,image/*,video/*"
                                />
                            </div>
                            {contentFile && (
                                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                    <span>Selected: {contentFile.name}</span>
                                    <button
                                        type="button"
                                        onClick={() => setContentFile(null)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div> */}

                        {/* Submit Button */}
                        <div className="flex justify-end gap-4 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                disabled={isLoading}
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-4 py-2 gradient-bg text-white font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Mengupload...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-5 h-5" />
                                        Upload
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
