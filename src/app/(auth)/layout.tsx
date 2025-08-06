import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Logo from '@/components/atoms/Logo';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row ">
      {/* Left side - Form */}
      <div className="w-full flex flex-col justify-center items-center p-8 md:p-16 ">
        <div className="w-full max-w-xl ">
          <div className="mb-8 ">
            <Link href="/">
              <Logo className="h-10 w-auto" />
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}