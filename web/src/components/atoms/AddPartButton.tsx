import { Plus, X } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import Button from './Button'
import InputField from './InputField'
import { addPart, getLastPartOrder } from '@/services/partService'
import { toast } from 'react-hot-toast'

interface AddPartButtonProps {
    workId: string;
    onSuccess?: () => void;
    type?: 'comic' | 'novel' | 'movie' | 'series'; // Optional, in case you want to differentiate behavior based on type
}

export default function AddPartButton({ workId, onSuccess, type }: AddPartButtonProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        part_order: 1,
        thumbnail: null as File | null,
        content_file: null as File | null,
        is_free: true,
    })

    const acceptFileTypes = () => {
        if (type === 'comic' || type === 'novel') {
            return '.pdf'
        } else if (type === 'movie' || type === 'series') {
            return '.mp4,.webm'
        } else {
            return ''
        }
    }

    useEffect(() => {

        if (isOpen) {
            getLastPartOrder(workId).then(order => {
                setFormData(prev => ({ ...prev, part_order: order }))
            })
        }
    }, [isOpen, workId])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const target = e.target
        const name = target.name
        const type = target.type

        if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: (target as HTMLInputElement).checked }))
        } else if (type === 'file') {
            const fileInput = target as HTMLInputElement
            setFormData(prev => ({ ...prev, [name]: fileInput.files?.[0] || null }))
        } else if (type === 'number') {
            setFormData(prev => ({ ...prev, [name]: Number(target.value) }))
        } else {
            setFormData(prev => ({ ...prev, [name]: target.value }))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.content_file) {
            toast.error('Silakan pilih file konten')
            return
        }

        setIsLoading(true)

        try {
            await addPart({
                ...formData,
                workId
            })
            toast.success('Part berhasil ditambahkan')
            setIsOpen(false)
            onSuccess?.()

            // Reset form
            setFormData({
                title: '',
                part_order: 1,
                thumbnail: null,
                content_file: null,
                is_free: true,
            })
        } catch (error) {
            console.error('Error adding part:', error)
            toast.error('Gagal menambahkan part. Silakan coba lagi.')
        } finally {
            setIsLoading(false)
        }

        window.location.reload();
    }

    return (
        <>
            <Button
                variant="secondary"
                onClick={() => setIsOpen(true)}
                className="w-full flex items-center justify-center gap-2"
            >
                <Plus className="w-5 h-5" />
                Tambah Part
            </Button>

            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl w-full max-w-lg relative">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Tambah Part</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <InputField
                                id="title"
                                type="text"
                                name="title"
                                label="Judul"
                                placeholder="Masukkan judul part"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                            <InputField
                                id="part_order"
                                type="number"
                                name="part_order"
                                label="Urutan Part"
                                placeholder="Masukkan urutan part"
                                value={String(formData.part_order)}
                                onChange={handleChange}
                                required
                            />
                            {
                                type !== 'novel' && (
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                                            Thumbnail
                                        </label>
                                        <input
                                            type="file"
                                            name="thumbnail"
                                            onChange={handleChange}
                                            className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                            accept="image/*"
                                        />
                                    </div>
                                )
                            }

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                                    File Konten
                                </label>
                                <input
                                    type="file"
                                    name="content_file"
                                    onChange={handleChange}
                                    className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                    accept={acceptFileTypes()}
                                />
                            </div>
                            <label className="flex items-center gap-3 text-gray-700 dark:text-gray-200">
                                <input
                                    type="checkbox"
                                    name="is_free"
                                    checked={formData.is_free}
                                    onChange={handleChange}
                                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm font-medium">Gratis</span>
                            </label>
                            <div className="flex justify-end gap-4 pt-4">
                                <Button
                                    variant="secondary"
                                    onClick={() => setIsOpen(false)}
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
            )}
        </>
    )
}
