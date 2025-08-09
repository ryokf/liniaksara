import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Logo from '../../atoms/Logo';
import Button from '../../atoms/Button';
import NavMenu from '../../organisms/NavMenu';

interface HeaderProps {
    onOpen: (type: 'login' | 'signup') => void;
}

export default function Header({
    onOpen,
}: HeaderProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-sm">
            <div className="w-full">
                <div className="max-w-7xl  mx-auto flex items-center justify-between h-20 px-6 lg:px-12">
                    <Logo />

                    {/* <NavMenu /> */}

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-x-4 pl-4 flex-shrink-0">

                        <a href="/login">

                            <Button
                                variant="outline"
                                size="sm"

                            >
                                Login
                            </Button>
                        </a>

                        <a href="/register">
                            <Button
                                size="sm"
                            >
                                Signup
                            </Button>
                        </a>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-800 dark:text-white"
                        >
                            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden px-6 pb-4 bg-white dark:bg-gray-900">
                        <NavMenu mobile />

                        <div className="flex flex-col gap-4 pt-4">

                            <a href="/login">
                                <Button
                                    variant="outline"

                                    className="w-full"
                                >
                                    Login
                                </Button>
                            </a>

                            <a href="/register">
                                <Button

                                    className="w-full"
                                >
                                    Signup
                                </Button>
                            </a>
                        </div>
                    </div>
                )}

                {/* Animated Neon Divider */}
                <div className="h-1 w-full gradient-bg animate-glow" />
            </div>
        </header>
    );
}
