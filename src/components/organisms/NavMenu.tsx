import NavLink from '../molecules/NavLink';

interface NavMenuProps {
  mobile?: boolean;
  className?: string;
}

export default function NavMenu({
  mobile = false,
  className = '',
}: NavMenuProps) {
  const links = [
    { href: '#Feature', text: 'Feature' },
    { href: '#Why', text: 'Why Inkura' },
    { href: '#Content', text: 'Content' },
    { href: '#Flow', text: 'Flow' },
    { href: '#premium', text: 'Premium' },
    { href: '#Community', text: 'Community' },
  ];

  const baseClasses = mobile
    ? 'flex flex-col space-y-4'
    : 'hidden md:flex items-center space-x-8 text-[15px] font-semibold text-gray-700 dark:text-gray-200 flex-1 justify-center';

  return (
    <nav className={`${baseClasses} ${className}`}>
      {links.map((link) => (
        <NavLink
          key={link.href}
          href={link.href}
          className={mobile ? 'block' : ''}
        >
          {link.text}
        </NavLink>
      ))}
    </nav>
  );
}
