interface NavLinkProps {
    href: string;
    children: React.ReactNode;
    className?: string;
}

export default function NavLink({
    href,
    children,
    className = '',
}: NavLinkProps) {
    return (
        <a
            href={href}
            className={`hover:text-primary transition ${className}`}
        >
            {children}
        </a>
    );
}
