import { useState } from 'react';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Button from '../atoms/Button';
import InputField from '../atoms/InputField';
import { updateWork } from '@/services/updateWorkService';
import { Work } from '@/types/works';
import supabase from '@/config/supabase';

// Work may come with either a direct work_type_id or a joined relation work_type
type WorkMaybeWithType = Work & {
  work_type_id?: number;
  work_type?: { id: number; type?: string } | null;
};

type EditWorkForm = {
  title: string;
  description: string;
  cover: string;
  is_draft: boolean;
  price: number;
  work_type_id?: number; // optional to allow undefined during initialization/invalid state
};

interface EditWorkModalProps {
    work: Work;
    isOpen: boolean;
    onClose: () => void;
}

export default function EditWorkModal({ work, isOpen, onClose }: EditWorkModalProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<EditWorkForm>({
        title: work.title,
        description: work.description || '',
        cover: work.cover || '',
        is_draft: work.is_draft ?? true,
        price: work.price ?? 0,
        work_type_id: (work as WorkMaybeWithType).work_type_id ?? (work as WorkMaybeWithType).work_type?.id ?? undefined
    });

    const [workTypes, setWorkTypes] = useState<Array<{ id: number; type: string }>>([]);
    const [isWorkTypesLoading, setIsWorkTypesLoading] = useState(false);
    const [isUploadingCover, setIsUploadingCover] = useState(false);
    const [coverPreview, setCoverPreview] = useState<string | null>(null);

    const isWorkTypeValid = typeof formData.work_type_id === 'number' && workTypes.some(wt => wt.id === formData.work_type_id);

    useEffect(() => {
        const fetchWorkTypes = async () => {
            try {
                setIsWorkTypesLoading(true);
                const { data, error } = await supabase
                    .from('work_types')
                    .select('id, type')
                    .order('id', { ascending: true });

                if (error) throw error;
                const rows: Array<{ id: number; type: string }> = data ?? [];
                setWorkTypes(rows);
                if ((!formData.work_type_id || !rows.some(wt => wt.id === formData.work_type_id)) && rows.length > 0) {
                    setFormData(prev => ({ ...prev, work_type_id: rows[0].id }));
                }
            } catch (err) {
                console.error('Failed to fetch work_types:', err);
                toast.error('Gagal memuat jenis karya');
            } finally {
                setIsWorkTypesLoading(false);
            }
        };
        fetchWorkTypes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCoverFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const prevCoverUrl = formData.cover;
        try {
            setIsUploadingCover(true);
            // generate unique path
            const ext = file.name.split('.').pop() || 'jpg';
            const fileName = `cover_${work.id}_${Date.now()}.${ext}`;
            const filePath = `${work.author_id}/${Date.now()}-${fileName}`;

            const { error: uploadError } = await supabase
                .storage
                .from('work-cover')
                .upload(filePath, file, { upsert: false, contentType: file.type });

            if (uploadError) throw uploadError;

            const { data } = supabase
                .storage
                .from('work-cover')
                .getPublicUrl(filePath);

            const publicUrl = data?.publicUrl;
            if (!publicUrl) throw new Error('Failed to get public URL');

            // Helper to parse bucket & path from Supabase public URL
            const parseSupabasePublicUrl = (url: string) => {
                try {
                    const u = new URL(url);
                    const marker = '/object/public/';
                    const idx = u.pathname.indexOf(marker);
                    if (idx === -1) return null;
                    const tail = u.pathname.slice(idx + marker.length); // bucket/path/to/file
                    const [bucket, ...rest] = tail.split('/');
                    const path = rest.join('/');
                    if (!bucket || !path) return null;
                    return { bucket, path };
                } catch {
                    return null;
                }
            };

            // If there was a previous cover, attempt deletion
            if (prevCoverUrl && prevCoverUrl !== publicUrl) {
                const parsed = parseSupabasePublicUrl(prevCoverUrl);
                if (parsed) {
                    try {
                        await supabase.storage.from(parsed.bucket).remove([parsed.path]);
                    } catch (delErr) {
                        console.warn('Gagal menghapus cover lama:', delErr);
                    }
                }
            }

            setFormData(prev => ({ ...prev, cover: publicUrl }));
            setCoverPreview(URL.createObjectURL(file));
            toast.success('Cover berhasil diunggah');
        } catch (err) {
            console.error('Upload cover gagal:', err);
            toast.error('Gagal mengunggah cover');
        } finally {
            setIsUploadingCover(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (!isWorkTypeValid) {
            if (workTypes.length > 0) {
                setFormData(prev => ({ ...prev, work_type_id: workTypes[0].id }));
            }
            toast.error('Pilih jenis karya yang valid.');
            setIsLoading(false);
            return;
        }

        try {
            const { success, error } = await updateWork(work.id, formData);
            
            if (success) {
                toast.success('Karya berhasil diperbarui');
                router.refresh();
                onClose();
            } else {
                throw error;
            }
        } catch (error) {
            console.error('Failed to update work:', error);
            toast.error('Gagal memperbarui karya');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl w-full max-w-md">
                <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
                    Edit Karya
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <InputField
                        id="title"
                        name="title"
                        label="Judul"
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                    />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Cover
                        </label>
                        <input
                            id="cover_file"
                            name="cover_file"
                            type="file"
                            accept="image/*"
                            onChange={handleCoverFile}
                            className="block w-full text-sm text-gray-900 dark:text-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 dark:file:bg-gray-700 dark:file:text-gray-100 dark:hover:file:bg-gray-600"
                        />
                        {(coverPreview || formData.cover) && (
                            <div className="mt-2 flex items-center gap-3">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={coverPreview || formData.cover}
                                    alt="Preview cover"
                                    className="h-20 w-20 object-cover rounded-md border border-gray-200 dark:border-gray-700"
                                />
                                {formData.cover && (
                                    <a
                                        href={formData.cover}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-xs text-blue-600 hover:underline"
                                    >
                                        Buka gambar
                                    </a>
                                )}
                            </div>
                        )}
                        {isUploadingCover && (
                            <p className="mt-1 text-xs text-gray-500">Mengunggah cover...</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Deskripsi
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            rows={4}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Jenis Karya
                        </label>
                        <select
                            value={formData.work_type_id ?? ''}
                            onChange={(e) => {
                                const v = e.target.value;
                                setFormData({ ...formData, work_type_id: v === '' ? undefined : Number(v) });
                            }}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            disabled={isWorkTypesLoading}
                        >
                            {workTypes.length === 0 ? (
                                <option value={formData.work_type_id || ''}>
                                    {isWorkTypesLoading ? 'Memuat...' : 'Tidak ada data'}
                                </option>
                            ) : (
                                workTypes.map((wt) => (
                                    <option key={wt.id} value={wt.id}>
                                        {wt.type}
                                    </option>
                                ))
                            )}
                        </select>
                    </div>
                    <InputField
                        id="price"
                        name="price"
                        label="Harga"
                        type="number"
                        value={formData.price.toString()}
                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    />
                    <div className="flex items-center gap-2">
                        <input
                            id="is_draft"
                            type="checkbox"
                            checked={formData.is_draft}
                            onChange={(e) => setFormData({ ...formData, is_draft: e.target.checked })}
                            className="h-4 w-4"
                        />
                        <label htmlFor="is_draft" className="text-sm text-gray-700 dark:text-gray-300">
                            Draft
                        </label>
                    </div>
                    <div className="flex justify-end gap-4 mt-6">
                        <Button
                            variant="secondary"
                            onClick={onClose}
                            disabled={isLoading}
                            type="button"
                        >
                            Batal
                        </Button>
                        <Button
                            variant="primary"
                            type="submit"
                            disabled={isLoading || isWorkTypesLoading || !isWorkTypeValid || isUploadingCover}
                        >
                            {isLoading ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}