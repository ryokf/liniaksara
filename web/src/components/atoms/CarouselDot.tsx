interface CarouselDotProps {
  isActive: boolean;
  onClick: () => void;
}

export default function CarouselDot({ isActive, onClick }: CarouselDotProps) {
  return (
    <button
      onClick={onClick}
      className={`h-2 rounded-full transition-all duration-300 mx-1
        ${isActive ? 'w-6 bg-primary' : 'w-2 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600'}`}
      aria-label={isActive ? 'Current slide' : 'Go to slide'}
    />
  );
}
