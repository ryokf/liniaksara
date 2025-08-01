import { useState, useEffect, useRef } from 'react';
import NavLink from '../atoms/NavLink';

interface NavMenuProps {
    mobile?: boolean;
    className?: string;
}

export default function NavMenu({
    mobile = false,
    className = '',
}: NavMenuProps) {
    const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
    const submenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (submenuRef.current && !submenuRef.current.contains(event.target as Node)) {
                setIsSubMenuOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const links: Array<{
        text: string;
        href?: string;
        submenu?: { href: string; text: string }[];
    }> = [
            {
                text: 'Feature',
                submenu: [
                    { href: '#feature1', text: 'Feature 1' },
                    { href: '#feature2', text: 'Feature 2' },
                    { href: '#feature3', text: 'Feature 3' },
                ],
            },
        ];

    const baseClasses = mobile
        ? 'flex flex-col space-y-4'
        : 'hidden md:flex items-center space-x-8 text-[15px] font-semibold text-gray-700 dark:text-gray-200 flex-1 justify-center';

    return (
        <nav className={`${baseClasses} ${className}`}>
            {links.map((link) => {
                if (link.submenu) {
                    return (
                        <div ref={submenuRef} key={link.text} className={`relative group ${mobile ? '' : 'flex items-center'}`}>
                            {/* Teks parent */}
                            <span 
                                className={`${mobile ? 'block' : 'cursor-pointer flex items-center'}`}
                                onClick={() => setIsSubMenuOpen(!isSubMenuOpen)}
                            >
                                {link.text}
                            </span>
                            {/* Submenu di mobile: selalu tampak di bawah parent */}
                            {mobile ? (
                                <ul className="mt-2 pl-4 space-y-2">
                                    {link.submenu.map((sublink) => (
                                        <li key={sublink.href}>
                                            <NavLink href={sublink.href} className="block">
                                                {sublink.text}
                                            </NavLink>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                // Submenu di desktop: tampak saat klik
                                <ul className={`absolute z-[99999] left-0 top-0 mt-2 ${isSubMenuOpen ? 'block' : 'hidden'} bg-white dark:bg-gray-800 rounded shadow-lg py-2 w-48`}>
                                    {link.submenu.map((sublink) => (
                                        <li key={sublink.href}>
                                            <NavLink
                                                href={sublink.href}
                                                className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                            >
                                                {sublink.text}
                                            </NavLink>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    );
                }
                // Item biasa tanpa submenu
                return (
                    <NavLink key={link.href ?? link.text} href={link.href ?? ''} className={mobile ? 'block' : ''}>
                        {link.text}
                    </NavLink>
                );
            })}
        </nav>
    );
}
