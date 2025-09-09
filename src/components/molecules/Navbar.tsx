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
import { useAuth } from "@/contexts/AuthContext";
import BottomNav from './BottomNav';
import { useRouter } from "next/router";

export default function Navbar() {

    const { userLogin, loading, error, signOut } = useAuth();
    
    const [searchQuery, setSearchQuery] = useState("");
    const [isScrolled, setIsScrolled] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        
        // Redirect to search page with query
        window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    };
    
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

    const signOutHandle = async () => {
        await signOut();
        location.href = '/login';
    }

    return (
        <>
            {/* Desktop Navbar */}
            <nav className={`w-full fixed top-0 left-0 z-50 transition-all bg-transparent  ${ isScrolled ? 'backdrop-blur-xl !bg-black/20' : ''}`}>
                <div className="max-w-[90rem] mx-auto px-6 py-4 flex items-center justify-between gap-8">
                {/* Bagian Kiri: Logo & Navigasi Utama */}
                <div className="flex items-center gap-8">
                    {/* Logo */}
                    <Link href="/home" className="flex items-center gap-3 flex-shrink-0">
                        <Image
                            src="/logo.png"
                            alt="LiniAksara Logo"
                            width={36}
                            height={36}
                            className="w-9 h-auto"
                            style={{
                                width: "auto",
                                height: "auto"
                            }}
                        />
                        {/* INKURA pada screenshot diganti dengan nama proyek Anda */}
                        <span className="text-xl font-bold text-gray-800 dark:text-white block">
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
                    <form onSubmit={handleSearch} className="w-full">
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="Cari karya..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-full focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition"
                            />
                            <button 
                                type="submit"
                                className="absolute inset-y-0 right-0 flex items-center justify-center w-10 h-full text-white rounded-r-full gradient-bg hover:opacity-90 transition"
                            >
                                <Search size={18} />
                            </button>
                        </div>
                    </form>
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


                    <div className="relative items-center gap-3 cursor-pointer hidden sm:flex" onClick={toggleDropdown}>
                        <span className="text-sm font-medium text-gray-800 dark:text-white hidden sm:block">
                            {userLogin?.displayName || "User"}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                            {userLogin?.photo ? (
                                <Image src={userLogin.photo} alt="Profil" width={32} height={32} priority />
                            ) : (
                                <User size={18} className="text-gray-500" />
                            )}
                        </div>

                        {isDropdownOpen && (
                            <div className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-gray-800 shadow-lg rounded-lg py-2 text-sm">
                                <Link href="/profile" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Profile</Link>
                                <Link href="/dashboard/settings" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Settings</Link>
                                <button onClick={async () => await signOutHandle()} className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Logout</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
        <BottomNav />
        </>
    );
}