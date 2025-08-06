import React, { ReactNode } from 'react';

interface SocialButtonProps {
  icon: ReactNode;
  provider: string;
  onClick: () => void;
  className?: string;
}

export default function SocialButton({
  icon,
  provider,
  onClick,
  className = '',
}: SocialButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-primary-1 dark:hover:border-primary-1 transition-all duration-300 hover:shadow-sm ${className}`}
    >
      {icon}
      <span>Continue with {provider}</span>
    </button>
  );
}