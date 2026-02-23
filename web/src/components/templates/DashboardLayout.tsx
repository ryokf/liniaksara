'use client';

import { ReactNode, useState } from 'react';
import Sidebar from '../organisms/Sidebar';
import { Menu } from 'lucide-react';

interface DashboardLayoutProps {
    children: ReactNode;
    activeMenu: string;
}

export default function DashboardLayout({
    children,
    activeMenu
}: DashboardLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Sidebar 
                activeMenu={activeMenu} 
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            {/* Mobile Header */}
            <div className="sticky top-0 z-30 lg:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between h-16 px-4">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                        LiniAksara
                    </h1>
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <Menu size={24} />
                    </button>
                </div>
            </div>

            <main className="lg:pl-64">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
