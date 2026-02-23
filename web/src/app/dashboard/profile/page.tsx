'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Camera } from 'lucide-react';
import DashboardLayout from '@/components/templates/DashboardLayout';

import { useAuth } from '@/contexts/AuthContext';
import { getUserProfile, updateProfile } from '@/services/profileService';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import supabase from '@/config/supabase';

export default function ProfilePage() {
    const { userLogin } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [profileData, setProfileData] = useState({
        username: '',
        email: '',
        avatar: '/images/default-avatar.svg'
    });

    useEffect(() => {
        const loadProfile = async () => {
            if (!userLogin?.id) return;

            try {
                // Mengambil data profil dari supabase profiles table
                const { data: profile, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', userLogin.id)
                    .single();

                if (error) throw error;

                if (profile) {
                    setProfileData({
                        username: profile.username || '',
                        email: userLogin.email, // use email from auth
                        avatar: profile.photo_url || '/images/default-avatar.svg'
                    });
                }
            } catch (error) {
                console.error('Error loading profile:', error);
                toast.error('Gagal memuat data profil');
            }
        };

        loadProfile();
    }, [userLogin?.id, userLogin?.email]);

    return (
        <DashboardLayout activeMenu="/dashboard/profile">
            <div className="max-w-3xl">
                {/* Header */}
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                    Edit Profil
                </h1>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                    {/* Avatar Section */}
                    <div className="flex items-center gap-6 mb-8">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full overflow-hidden">
                                <Image
                                    src={profileData.avatar}
                                    alt="Profile"
                                    width={96}
                                    height={96}
                                    className="object-cover"
                                />
                            </div>
                            <label className="absolute bottom-0 right-0 w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white hover:opacity-90 transition-opacity cursor-pointer">
                                <Camera className="w-4 h-4" />
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (!file || !userLogin?.id) return;

                                        try {
                                            setIsLoading(true);

                                            // Upload file ke storage
                                            const fileExt = file.name.split('.').pop();
                                            const fileName = `${userLogin.id}/avatar-${Date.now()}.${fileExt}`;

                                            const { error: uploadError } = await supabase.storage
                                                .from('works')
                                                .upload(`profiles/${fileName}`, file);

                                            if (uploadError) throw uploadError;

                                            // Dapatkan URL publik
                                            const { data: { publicUrl } } = supabase.storage
                                                .from('works')
                                                .getPublicUrl(`profiles/${fileName}`);

                                            // Update profile dengan URL foto baru
                                            await updateProfile(userLogin.id, {
                                                photo_url: publicUrl
                                            });

                                            setProfileData(prev => ({
                                                ...prev,
                                                avatar: publicUrl
                                            }));

                                            toast.success('Foto profil berhasil diperbarui');
                                        } catch (error) {
                                            console.error('Error uploading avatar:', error);
                                            toast.error('Gagal mengupload foto profil');
                                        } finally {
                                            setIsLoading(false);
                                        }
                                    }}
                                />
                            </label>
                        </div>
                        <div>
                            <h2 className="font-medium text-gray-900 dark:text-white">
                                Foto Profil
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                JPG, GIF or PNG. Maksimal 2MB
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <form className="space-y-6" onSubmit={async (e) => {
                        e.preventDefault();
                        if (!userLogin?.id) {
                            toast.error('Silakan login terlebih dahulu');
                            return;
                        }

                        try {
                            setIsLoading(true);
                            await updateProfile(userLogin.id, {
                                username: profileData.username,
                                email: profileData.email,
                                // Untuk photo_url akan dihandle terpisah saat upload gambar
                            });
                            toast.success('Profil berhasil diperbarui');
                            router.refresh();
                        } catch (error) {
                            console.error('Error updating profile:', error);
                            toast.error('Gagal memperbarui profil');
                        } finally {
                            setIsLoading(false);
                        }
                    }}>
                        {/* Username */}
                        <div>
                            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                value={profileData.username}
                                onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                                className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                disabled
                                value={profileData.email}
                                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white"
                            />
                        </div>


                        {/* Submit Button */}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`px-6 py-2 rounded-lg gradient-bg text-white font-medium transition-opacity ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
                            >
                                {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
}
