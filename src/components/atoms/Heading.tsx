import { createElement } from 'react';

interface HeadingProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  className?: string;
  gradient?: boolean;
}

export default function Heading({
  level = 1,
  children,
  className = '',
  gradient = false,
}: HeadingProps) {
  const baseStyles = 'font-bold leading-tight';
  const gradientStyle = gradient ? 'gradient-text' : '';
  
  const sizeStyles = {
    1: 'text-4xl md:text-5xl',
    2: 'text-3xl lg:text-4xl',
    3: 'text-2xl lg:text-3xl',
    4: 'text-xl lg:text-2xl',
    5: 'text-lg lg:text-xl',
    6: 'text-base lg:text-lg',
  };

  return createElement(
    `h${level}`,
    {
      className: `${baseStyles} ${sizeStyles[level]} ${gradientStyle} ${className}`.trim()
    },
    children
  );
}
