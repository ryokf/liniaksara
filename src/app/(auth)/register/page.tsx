'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import InputField from '@/components/atoms/InputField';
import Button from '@/components/atoms/Button';
import SocialButton from '@/components/atoms/SocialButton';
import Divider from '@/components/atoms/Divider';
import { signInWithGoogle } from '@/services/authServices';
import AuthCard from '@/components/molecules/AuthCard';
import supabase from '@/config/supabase';

export default function RegisterPage() {
    const getUser = useCallback(async () => {
        const { data: { user } } = await supabase.auth.getUser();

    }, []);

    useEffect(() => {
        getUser();
    }, [getUser]);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
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
        if (!formData.name) newErrors.name = 'Nama diperlukan';
        if (!formData.email) newErrors.email = 'Email diperlukan';
        if (!formData.password) newErrors.password = 'Password diperlukan';
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Password tidak cocok';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Handle registration logic here

    };

    const handleSocialLogin = (provider: string) => {
        if (provider === 'google') {
            signInWithGoogle();
        } else if (provider === 'github') {
            // Handle GitHub login logic here
        }
        // Handle social registration logic here
    };

    return (
        <AuthCard
            title="Buat Akun Baru"
            subtitle="Daftar untuk mulai menggunakan Lini Aksara"
        >
            <form onSubmit={handleSubmit} className="space-y-4 ">
                <InputField
                    id="name"
                    label="Nama Lengkap"
                    type="text"
                    placeholder="Nama Anda"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    error={errors.name}
                />

                <InputField
                    id="email"
                    label="Email"
                    type="email"
                    placeholder="nama@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    error={errors.email}
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

                <InputField
                    id="confirmPassword"
                    label="Konfirmasi Password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    error={errors.confirmPassword}
                />

                <Button
                    type="submit"
                    variant="primary"
                    className="w-full gradient-bg hover:shadow-glow-strong transition-all duration-500"
                >
                    Daftar
                </Button>

                <Divider text="atau" />

                <div className="space-y-3">
                    <SocialButton
                        icon={<FaGoogle className="text-lg" />}
                        provider="Google"
                        onClick={() => handleSocialLogin('google')}
                    />

                    {/* <SocialButton
                        icon={<FaGithub className="text-lg" />}
                        provider="GitHub"
                        onClick={() => handleSocialLogin('github')}
                    /> */}
                </div>
            </form>

            <div className="mt-6 text-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                    Sudah punya akun?{' '}
                </span>
                <Link
                    href="/login"
                    className="text-primary-1 hover:underline font-medium"
                >
                    Masuk sekarang
                </Link>
            </div>
        </AuthCard>
    );
}