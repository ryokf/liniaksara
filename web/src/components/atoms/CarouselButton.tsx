interface CarouselButtonProps {
  direction: 'prev' | 'next';
  onClick: () => void;
  className?: string;
}

export default function CarouselButton({
  direction,
  onClick,
  className = '',
}: CarouselButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        absolute top-1/2 -translate-y-1/2 
        ${direction === 'prev' ? '-left-4' : '-right-4'}
        w-10 h-10 rounded-full 
        bg-white dark:bg-gray-800 
        shadow-lg hover:shadow-xl
        flex items-center justify-center
        text-gray-800 dark:text-white
        transition-all duration-300
        hover:scale-110
        ${className}
      `}
      aria-label={direction === 'prev' ? 'Previous slide' : 'Next slide'}
    >
      {direction === 'prev' ? (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M15 19l-7-7 7-7" 
          />
        </svg>
      ) : (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M9 5l7 7-7 7" 
          />
        </svg>
      )}
    </button>
  );
}
