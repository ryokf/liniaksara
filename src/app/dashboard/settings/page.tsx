'use client';

import { useState } from 'react';
import { Bell, Moon, Sun, Globe, Shield, Key } from 'lucide-react';
import DashboardLayout from '@/components/templates/DashboardLayout';

interface SettingsSectionProps {
    title: string;
    description: string;
    icon: any;
    children: React.ReactNode;
}

function SettingsSection({ title, description, icon: Icon, children }: SettingsSectionProps) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex gap-4 mb-6">
                <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg h-fit">
                    <Icon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                </div>
                <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {description}
                    </p>
                </div>
            </div>
            <div className="space-y-4">
                {children}
            </div>
        </div>
    );
}

function ToggleSwitch({ label, enabled, onChange }: { label: string; enabled: boolean; onChange: () => void }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-gray-900 dark:text-white">{label}</span>
            <button
                onClick={onChange}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                    ${enabled ? 'gradient-bg' : 'bg-gray-200 dark:bg-gray-700'}`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                        ${enabled ? 'translate-x-6' : 'translate-x-1'}`}
                />
            </button>
        </div>
    );
}

export default function SettingsPage() {
    const [settings, setSettings] = useState({
        darkMode: false,
        emailNotifications: true,
        pushNotifications: true,
        profileVisibility: 'public',
        twoFactorAuth: false,
        language: 'id'
    });

    return (
        <DashboardLayout activeMenu="/dashboard/settings">
            {/* Header */}
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                Pengaturan
            </h1>

            <div className="space-y-6 max-w-3xl">
                {/* Theme Settings */}
                <SettingsSection
                    title="Tampilan"
                    description="Atur preferensi tampilan aplikasi"
                    icon={Sun}
                >
                    <ToggleSwitch
                        label="Dark Mode"
                        enabled={settings.darkMode}
                        onChange={() => setSettings({ ...settings, darkMode: !settings.darkMode })}
                    />
                </SettingsSection>

                {/* Notification Settings */}
                <SettingsSection
                    title="Notifikasi"
                    description="Atur preferensi notifikasi"
                    icon={Bell}
                >
                    <ToggleSwitch
                        label="Email Notifications"
                        enabled={settings.emailNotifications}
                        onChange={() => setSettings({ ...settings, emailNotifications: !settings.emailNotifications })}
                    />
                    <ToggleSwitch
                        label="Push Notifications"
                        enabled={settings.pushNotifications}
                        onChange={() => setSettings({ ...settings, pushNotifications: !settings.pushNotifications })}
                    />
                </SettingsSection>

                {/* Privacy Settings */}
                <SettingsSection
                    title="Privasi"
                    description="Atur privasi akun Anda"
                    icon={Shield}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-gray-900 dark:text-white">Profile Visibility</span>
                        <select
                            value={settings.profileVisibility}
                            onChange={(e) => setSettings({ ...settings, profileVisibility: e.target.value })}
                            className="px-3 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white"
                        >
                            <option value="public">Public</option>
                            <option value="private">Private</option>
                        </select>
                    </div>
                    <ToggleSwitch
                        label="Two Factor Authentication"
                        enabled={settings.twoFactorAuth}
                        onChange={() => setSettings({ ...settings, twoFactorAuth: !settings.twoFactorAuth })}
                    />
                </SettingsSection>

                {/* Language Settings */}
                <SettingsSection
                    title="Bahasa"
                    description="Atur bahasa aplikasi"
                    icon={Globe}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-gray-900 dark:text-white">Language</span>
                        <select
                            value={settings.language}
                            onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                            className="px-3 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white"
                        >
                            <option value="id">Bahasa Indonesia</option>
                            <option value="en">English</option>
                        </select>
                    </div>
                </SettingsSection>

                {/* Save Button */}
                <div className="flex justify-end">
                    <button className="px-6 py-2 rounded-lg gradient-bg text-white font-medium hover:opacity-90 transition-opacity">
                        Simpan Perubahan
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
}
