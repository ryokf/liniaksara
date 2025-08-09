"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, PlusSquare, BookOpen, User } from "lucide-react";

export default function BottomNav() {
    const pathname = usePathname();

    const isActive = (path: string) => {
        return pathname === path;
    };

    return (
        <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-900 dark:border-gray-600 md:hidden">
            <div className="grid h-full max-w-lg grid-cols-5 mx-auto">
                <Link href="/home" 
                    className={`inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group ${
                        isActive('/home') ? 'text-primary' : 'text-gray-500 dark:text-gray-400'
                    }`}
                >
                    <Home className="w-6 h-6 mb-1" />
                    <span className="text-xs">Home</span>
                </Link>
                <Link href="/search" 
                    className={`inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group ${
                        isActive('/search') ? 'text-primary' : 'text-gray-500 dark:text-gray-400'
                    }`}
                >
                    <Search className="w-6 h-6 mb-1" />
                    <span className="text-xs">Search</span>
                </Link>
                <Link href="/create" 
                    className={`inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group ${
                        isActive('/create') ? 'text-primary' : 'text-gray-500 dark:text-gray-400'
                    }`}
                >
                    <PlusSquare className="w-6 h-6 mb-1" />
                    <span className="text-xs">Create</span>
                </Link>
                <Link href="/library" 
                    className={`inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group ${
                        isActive('/library') ? 'text-primary' : 'text-gray-500 dark:text-gray-400'
                    }`}
                >
                    <BookOpen className="w-6 h-6 mb-1" />
                    <span className="text-xs">Library</span>
                </Link>
                <Link href="/profile" 
                    className={`inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group ${
                        isActive('/profile') ? 'text-primary' : 'text-gray-500 dark:text-gray-400'
                    }`}
                >
                    <User className="w-6 h-6 mb-1" />
                    <span className="text-xs">Profile</span>
                </Link>
            </div>
        </div>
    );
}
