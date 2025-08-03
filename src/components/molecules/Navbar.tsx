"use client";

import Image from "next/image";
import Link from "next/link";
import {
    Search,
    Upload,
    Bookmark,
    Bell,
    Settings,
    ChevronDown,
    User,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
// Anda mungkin perlu mengambil data sesi untuk menampilkan username
// import { useSession } from "next-auth/react";

export default function Navbar() {
    // Contoh state untuk data user, idealnya diambil dari useSession()
    // const { data: session } = useSession();
    const user = {
        name: "username",
        image: "", // URL gambar profil user
    };

    const [searchQuery, setSearchQuery] = useState("");
    const [searchCategory, setSearchCategory] = useState("Title");
    const [isScrolled, setIsScrolled] = useState(false);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(prev => !prev);
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`w-full fixed top-0 left-0 z-50 transition-all ${isScrolled ? 'backdrop-blur-xl' : ''}`}>
            <div className="max-w-[90rem] mx-auto px-6 py-2 flex items-center justify-between gap-8">
                {/* Bagian Kiri: Logo & Navigasi Utama */}
                <div className="flex items-center gap-8">
                    {/* Logo */}
                    <Link href="/home" className="flex items-center gap-3 flex-shrink-0">
                        <Image
                            src="/logo-LiniAksara.png" // Menggunakan logo yang ada di proyek Anda
                            alt="LiniAksara Logo"
                            width={36}
                            height={36}
                        />
                        {/* INKURA pada screenshot diganti dengan nama proyek Anda */}
                        <span className="text-xl font-bold text-gray-800 dark:text-white hidden lg:block">
                            LiniAksara
                        </span>
                    </Link>

                    {/* Navigasi Link */}
                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600 dark:text-gray-300">
                        {/* <Link href="/explore?type=all" className="hover:text-primary transition">All</Link>
                        <Link href="/explore?type=novel" className="hover:text-primary transition">Novel</Link>
                        <Link href="/explore?type=comic" className="hover:text-primary transition">Comic</Link>
                        <Link href="/explore?type=film" className="hover:text-primary transition">Film</Link> */}
                    </nav>
                </div>

                {/* Bagian Tengah: Search Bar */}
                <div className="flex-1 max-w-xl hidden md:flex">
                    <div className="relative w-full">
                        <input
                            type="text"
                            placeholder={`Search ${searchCategory.toLowerCase()}...`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-full focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition"
                        />
                        <button className="absolute inset-y-0 right-0 flex items-center justify-center w-10 h-full text-white rounded-r-full gradient-bg hover:opacity-90 transition">
                            <Search size={18} />
                        </button>
                    </div>
                </div>

                {/* Bagian Kanan: Ikon & Profil Pengguna */}
                <div className="flex items-center gap-5 text-gray-600 dark:text-gray-300">
                    {/* <button className="hover:text-primary transition" title="Upload Karya">
                        <Upload size={20} />
                    </button>
                    <button className="hover:text-primary transition" title="Bookmark">
                        <Bookmark size={20} />
                    </button>
                    <button className="hover:text-primary transition" title="Notifikasi">
                        <Bell size={20} />
                    </button>
                    <button className="hover:text-primary transition" title="Pengaturan">
                        <Settings size={20} />
                    </button> */}


                    <div className="relative flex items-center gap-3 cursor-pointer" onClick={toggleDropdown}>
                        <span className="text-sm font-medium text-gray-800 dark:text-white hidden sm:block">
                            {user.name}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                            {user.image ? (
                                <Image src={user.image} alt="Profil" width={32} height={32} />
                            ) : (
                                <User size={18} className="text-gray-500" />
                            )}
                        </div>

                        {isDropdownOpen && (
                            <div className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-gray-800 shadow-lg rounded-lg py-2 text-sm">
                                <Link href="/profile" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Profile</Link>
                                <Link href="/settings" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Settings</Link>
                                <button className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Logout</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}