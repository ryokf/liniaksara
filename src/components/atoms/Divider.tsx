import React from 'react';

interface DividerProps {
  text?: string;
  className?: string;
}

export default function Divider({ text, className = '' }: DividerProps) {
  if (!text) {
    return <hr className={`border-t border-gray-300 dark:border-gray-700 my-4 ${className}`} />;
  }

  return (
    <div className={`flex items-center my-4 ${className}`}>
      <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
      <span className="px-3 text-sm text-gray-500 dark:text-gray-400">{text}</span>
      <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
    </div>
  );
}