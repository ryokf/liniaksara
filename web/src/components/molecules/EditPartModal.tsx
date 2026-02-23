'use client';

import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Part } from './PartListClient';
import Button from '../atoms/Button';
import InputField from '../atoms/InputField';
import supabase from '@/config/supabase';

export interface EditPartModalProps {
    part: Part;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (editedPart: Part) => Promise<void>;
}

export default function EditPartModal({ part, isOpen, onClose, onSubmit }: EditPartModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: part.title,
        is_free: part.is_free,
        part_order: part.part_order,
        content_url: part.content_url || ''
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setSelectedFile(file);
        // Menampilkan nama file yang dipilih di form
        setFormData(prev => ({
            ...prev,
            content_url: file.name // Ini hanya untuk UI, URL sebenarnya akan diupdate setelah upload
        }));
    };

    const uploadFile = async (file: File) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${part.workId}/${part.id}/${Date.now()}.${fileExt}`;
        
        try {
            const { error: uploadError } = await supabase.storage
                .from('works')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('works')
                .getPublicUrl(fileName);

            return publicUrl;
        } catch (error) {
            console.error('Error uploading file:', error);
            throw new Error('Failed to upload file');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            const updatedData = { ...formData };

            if (selectedFile) {
                const publicUrl = await uploadFile(selectedFile);
                updatedData.content_url = publicUrl;
            }

            await onSubmit({
                ...part,
                ...updatedData
            });
            onClose();
        } catch (error) {
            console.error('Error updating part:', error);
            toast.error('Gagal memperbarui bagian');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                    Edit Bagian
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
                    {/* <InputField
                        id="part_order"
                        name="part_order"
                        label="Urutan"
                        type="number"
                        value={formData.part_order.toString()}
                        onChange={(e) => setFormData({ ...formData, part_order: parseInt(e.target.value, 10) })}
                        required
                    /> */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            File Konten
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                type="file"
                                id="content"
                                onChange={handleFileChange}
                                className="block w-full text-sm text-gray-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-md file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-primary file:text-white
                                    hover:file:bg-primary/90"
                                accept=".pdf,.epub,.doc,.docx"
                            />
                            {formData.content_url && (
                                <span className="text-sm text-gray-500 truncate">
                                    {selectedFile ? selectedFile.name : formData.content_url.split('/').pop()}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="is_free"
                            checked={formData.is_free}
                            onChange={(e) => setFormData({ ...formData, is_free: e.target.checked })}
                            className="h-4 w-4"
                        />
                        <label htmlFor="is_free" className="text-gray-700 dark:text-gray-300">
                            Gratis
                        </label>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button 
                            type="button" 
                            onClick={onClose}
                            variant="secondary"
                            disabled={isLoading}
                        >
                            Batal
                        </Button>
                        <Button 
                            type="submit"
                            variant="primary"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}