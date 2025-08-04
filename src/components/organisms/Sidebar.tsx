import {
    LayoutDashboard,
    Library,
    UserCircle,
    Settings,
} from 'lucide-react';
import SidebarMenuItem from '../molecules/SidebarMenuItem';

interface SidebarProps {
    activeMenu: string;
    isOpen?: boolean;
    onClose?: () => void;
}

export default function Sidebar({ activeMenu, isOpen, onClose }: SidebarProps) {
    const menuItems = [
        {
            icon: LayoutDashboard,
            label: 'Overview',
            href: '/dashboard'
        },
        {
            icon: Library,
            label: 'Karya Saya',
            href: '/dashboard/works'
        },
        // {
        //     icon: History,
        //     label: 'Draft',
        //     href: '/dashboard/drafts'
        // },
        // {
        //     icon: Bell,
        //     label: 'Notifikasi',
        //     href: '/dashboard/notifications'
        // },
        // {
        //     icon: MessageSquare,
        //     label: 'Komentar',
        //     href: '/dashboard/comments'
        // },
        // {
        //     icon: Trophy,
        //     label: 'Achievement',
        //     href: '/dashboard/achievements'
        // },
        {
            icon: UserCircle,
            label: 'Profil',
            href: '/dashboard/profile'
        },
        {
            icon: Settings,
            label: 'Pengaturan',
            href: '/dashboard/settings'
        }
    ];

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 lg:hidden" 
                    onClick={onClose}
                />
            )}
            
            <aside className={`
                w-64 fixed left-0 top-0 h-screen bg-white dark:bg-gray-900 
                border-r border-gray-200 dark:border-gray-800 z-40
                transform transition-transform duration-200 ease-in-out
                lg:transform-none
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0
            `}>
                {/* Logo */}
                <div className="px-6 py-8 flex items-center justify-between">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                        LiniAksara
                    </h1>
                    <button 
                        onClick={onClose}
                        className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <span className="sr-only">Close sidebar</span>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Menu */}
                <nav className="px-3 space-y-1">
                    {menuItems.map((item) => (
                        <SidebarMenuItem
                            key={item.href}
                            {...item}
                            isActive={activeMenu === item.href}
                            onClick={onClose}
                        />
                    ))}
                </nav>
            </aside>
        </>
    );
}
