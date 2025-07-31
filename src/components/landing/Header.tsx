"use client";

import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
    isDarkMode: boolean;
    toggleDarkMode: () => void;
    onOpen: (type: "login" | "signup") => void;
}

export default function Header({ isDarkMode, toggleDarkMode, onOpen }: HeaderProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="w-full fixed top-0 left-0 z-50 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 shadow-md transition-all duration-300 border-b border-transparent dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between space-x-4">
                {/* Logo */}
                <div className="flex items-center space-x-3 flex-shrink-0">
                    <Image src="/logo-LiniAksara.png" alt="Logo LiniAksara" width={40} height={40} />
                    <span className="text-2xl font-bold text-gray-800 dark:text-white tracking-wide">LiniAksara</span>
                </div>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center space-x-8 text-[15px] font-semibold text-gray-700 dark:text-gray-200 flex-1 justify-center">
                    <a href="#Feature" className="hover:text-primary transition">Feature</a>
                    <a href="#Why" className="hover:text-primary transition">Why LiniAksara</a>
                    <a href="#Content" className="hover:text-primary transition">Content</a>
                    <a href="#Flow" className="hover:text-primary transition">Flow</a>
                    <a href="#premium" className="hover:text-primary transition">Premium</a>
                    <a href="#Community" className="hover:text-primary transition">Community</a>
                </nav>

                {/* Desktop Right */}
                <div className="hidden md:flex items-center gap-x-4 pl-4 flex-shrink-0">
                    <button
                        onClick={toggleDarkMode}
                        aria-label="Toggle Theme"
                        className={`w-14 h-8 rounded-full flex items-center px-1 transition focus:outline-none shadow-inner ${isDarkMode ? "dark-toggle justify-end" : "bg-gray-300 justify-start"
                            }`}
                    >
                        <div className="w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center">
                            {isDarkMode ? "🌙" : "☀️"}
                        </div>
                    </button>

                    <button
                        onClick={() => onOpen("login")}
                        className="px-4 py-2 border dark:border-gray-600 rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                    >
                        Login
                    </button>
                    <button
                        onClick={() => onOpen("signup")}
                        className="px-4 py-2 text-sm btn-primary rounded-full shadow-md"
                    >
                        Signup
                    </button>
                </div>

                {/* Mobile Toggle */}
                <div className="md:hidden">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-800 dark:text-white">
                        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav */}
            {isMenuOpen && (
                <div className="md:hidden px-6 pb-4 space-y-4 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200">
                    <br />
                    <a href="#Feature" className="block hover:text-primary transition">Feature</a>
                    <a href="#Why" className="block hover:text-primary transition">Why LiniAksara</a>
                    <a href="#Content" className="block hover:text-primary transition">Content</a>
                    <a href="#Flow" className="block hover:text-primary transition">Flow</a>
                    <a href="#premium" className="block hover:text-primary transition">Premium</a>
                    <a href="#Community" className="block hover:text-primary transition">Community</a>
                    <div className="flex flex-col gap-2 pt-2">
                        <button
                            onClick={toggleDarkMode}
                            aria-label="Toggle Theme"
                            className={`w-14 h-8 rounded-full flex items-center px-1 transition focus:outline-none shadow-inner ${isDarkMode ? "dark-toggle justify-end" : "bg-gray-300 justify-start"
                                }`}
                        >
                            <div className="w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center">
                                {isDarkMode ? "🌙" : "☀️"}
                            </div>
                        </button>
                        <br />
                        <div className="flex flex-col gap-2">
                            <button
                                onClick={() => onOpen("login")}
                                className="w-full border px-4 py-2 rounded-md text-sm dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                            >
                                Login
                            </button>
                            <button
                                onClick={() => onOpen("signup")}
                                className="w-full px-4 py-2 text-sm btn-primary rounded-full shadow-md"
                            >
                                Signup
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Animated Neon Divider */}
            <div className="h-1 w-full gradient-bg animate-glow"></div>
        </header>
    );
}
