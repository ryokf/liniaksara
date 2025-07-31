interface ThemeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
  className?: string;
}

export default function ThemeToggle({
  isDarkMode,
  onToggle,
  className = '',
}: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      aria-label="Toggle Theme"
      className={`w-14 h-8 rounded-full flex items-center px-1 transition focus:outline-none shadow-inner ${
        isDarkMode ? "dark-toggle justify-end" : "bg-gray-300 justify-start"
      } ${className}`}
    >
      <div className="w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center">
        {isDarkMode ? "🌙" : "☀️"}
      </div>
    </button>
  );
}
