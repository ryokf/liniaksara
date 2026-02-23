import React, { ReactNode } from 'react';

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export default function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <div className="relative w-full shadow-glow-strong gradient-bg rounded-xl overflow-hidden">
      {/* Glow effect behind the card */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-1 to-primary-4 rounded-xl blur-xl opacity-80 animate-glow -m-2 scale-105"></div>
      
      {/* Card with gradient border */}
      <div className="relative w-full bg-white dark:bg-gray-900 rounded-xl p-6 md:p-8 border-2 border-transparent bg-clip-padding">
        {/* Gradient border effect */}
        <div className="absolute inset-0 rounded-xl -z-10 bg-gradient-to-br from-primary-1 to-primary-4 -m-0.5 animate-border-glow"></div>
        
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {subtitle}
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}