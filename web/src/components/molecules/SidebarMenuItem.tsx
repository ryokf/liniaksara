import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

interface SidebarMenuItemProps {
    icon: LucideIcon;
    label: string;
    href: string;
    isActive?: boolean;
    onClick?: () => void;
}

export default function SidebarMenuItem({
    icon: Icon,
    label,
    href,
    isActive = false,
    onClick
}: SidebarMenuItemProps) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors
                ${isActive
                    ? 'gradient-bg text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
        >
            <Icon className="w-5 h-5" />
            <span className="font-medium">{label}</span>
        </Link>
    );
}
