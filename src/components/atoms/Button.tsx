import { ReactNode } from 'react';

interface ButtonProps {
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    children: ReactNode;
    onClick?: () => void;
    className?: string;
    type?: 'button' | 'submit';
    disabled?: boolean;
    ariaLabel?: string;
}

export default function Button({
    variant = 'primary',
    size = 'md',
    children,
    onClick,
    className = '',
    type = 'button',
    disabled = false,
    ariaLabel,
}: ButtonProps) {
    const baseStyles = 'transition-all duration-300 rounded-full font-semibold';

    const variantStyles = {
        primary: 'btn-primary shadow-md',
        secondary: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700',
        outline: 'border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-white',
    };

    const sizeStyles = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            aria-label={ariaLabel}
            className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''
                }`}
        >
            {children}
        </button>
    );
}
