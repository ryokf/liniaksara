'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Camera } from 'lucide-react';
import DashboardLayout from '@/components/templates/DashboardLayout';

export default function ProfilePage() {
    const [profileData, setProfileData] = useState({
        name: 'John Doe',
        username: 'johndoe',
        bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        email: 'john@example.com',
        avatar: '/images/default-avatar.svg'
    });

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
                            <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white hover:opacity-90 transition-opacity">
                                <Camera className="w-4 h-4" />
                            </button>
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
                    <form className="space-y-6">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                                Nama Lengkap
                            </label>
                            <input
                                type="text"
                                value={profileData.name}
                                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white"
                            />
                        </div>

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
                                value={profileData.email}
                                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white"
                            />
                        </div>

                        {/* Bio */}
                        <div>
                            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                                Bio
                            </label>
                            <textarea
                                value={profileData.bio}
                                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                rows={4}
                                className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white resize-none"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="px-6 py-2 rounded-lg gradient-bg text-white font-medium hover:opacity-90 transition-opacity"
                            >
                                Simpan Perubahan
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
}
