interface BadgeProps {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary';
}

export default function Badge({ children, variant = 'primary' }: BadgeProps) {
    const baseClasses = 'px-3 py-1 rounded-full text-xs font-medium';
    const variantClasses = {
        primary: 'gradient-bg text-white',
        secondary: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
    };

    return (
        <span className={`${baseClasses} ${variantClasses[variant]}`}>
            {children}
        </span>
    );
}
