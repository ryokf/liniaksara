'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import AuthCard from '@/components/molecules/AuthCard';
import InputField from '@/components/atoms/InputField';
import Button from '@/components/atoms/Button';
import SocialButton from '@/components/atoms/SocialButton';
import Divider from '@/components/atoms/Divider';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    const newErrors: Record<string, string> = {};
    if (!formData.email) newErrors.email = 'Email diperlukan';
    if (!formData.password) newErrors.password = 'Password diperlukan';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Handle login logic here

  };

  const handleSocialLogin = (provider: string) => {

    // Handle social login logic here
  };

  return (
    <AuthCard 
      title="Masuk ke Akun Anda" 
      subtitle="Masukkan kredensial Anda untuk melanjutkan"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          id="email"
          label="Email"
          type="email"
          placeholder="nama@example.com"
          value={formData.email}
          onChange={handleChange}
          required
          error={errors.email}
          className="mb-4"
        />
        
        <InputField
          id="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          required
          error={errors.password}
        />
        
        <div className="flex justify-end">
          <Link 
            href="/forgot-password" 
            className="text-sm text-primary-1 hover:underline"
          >
            Lupa password?
          </Link>
        </div>
        
        <Button 
          type="submit" 
          variant="primary" 
          className="w-full gradient-bg hover:shadow-glow-strong transition-all duration-500"
        >
          Masuk
        </Button>
        
        <Divider text="atau" />
        
        <div className="space-y-3">
          <SocialButton
            icon={<FaGoogle className="text-lg" />}
            provider="Google"
            onClick={() => handleSocialLogin('google')}
          />
          
          <SocialButton
            icon={<FaGithub className="text-lg" />}
            provider="GitHub"
            onClick={() => handleSocialLogin('github')}
          />
        </div>
      </form>
      
      <div className="mt-6 text-center text-sm">
        <span className="text-gray-600 dark:text-gray-400">
          Belum punya akun?{' '}
        </span>
        <Link 
          href="/register" 
          className="text-primary-1 hover:underline font-medium"
        >
          Daftar sekarang
        </Link>
      </div>
    </AuthCard>
  );
}