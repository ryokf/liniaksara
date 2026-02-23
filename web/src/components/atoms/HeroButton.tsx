interface HeroButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export default function HeroButton({ 
  children, 
  onClick, 
  variant = 'primary',
  className = '' 
}: HeroButtonProps) {
  const baseStyles = 'px-6 py-3 rounded-md font-semibold transition-all duration-300';
  const variantStyles = {
    primary: 'bg-white text-black hover:bg-gray-100',
    secondary: 'bg-gray-800/80 text-white hover:bg-gray-700/80'
  };

  return (
    <button 
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
