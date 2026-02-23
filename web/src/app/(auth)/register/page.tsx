'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { FaGoogle } from 'react-icons/fa';
import InputField from '@/components/atoms/InputField';
import Button from '@/components/atoms/Button';
import SocialButton from '@/components/atoms/SocialButton';
import Divider from '@/components/atoms/Divider';
import { signInWithGoogle, registerWithEmail } from '@/services/authServices';
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
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: Record<string, string> = {};
        if (!formData.username) newErrors.username = 'Nama diperlukan';
        if (!formData.email) newErrors.email = 'Email diperlukan';
        if (!formData.password) newErrors.password = 'Password diperlukan';
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Password tidak cocok';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const { data, error } = await registerWithEmail(
                formData.username,
                formData.email,
                formData.password
            );

            if (error) {
                setErrors({ auth: error });
                return;
            }

            // Reset all errors and form data on success
            setErrors({});
            setFormData({
                username: '',
                email: '',
                password: '',
                confirmPassword: ''
            });
            setShowConfirmationPopup(true);
        } catch (error) {
            setErrors({ auth: 'Terjadi kesalahan saat registrasi' });
        }
    };

    const handleSocialLogin = (provider: string) => {
        if (provider === 'google') {
            signInWithGoogle();
        }
    };

    const handleClosePopup = () => {
        setShowConfirmationPopup(false);
        window.location.href = '/login';
    };

    return (
        <div className="relative">
            {showConfirmationPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                            Konfirmasi Email
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            Pendaftaran berhasil! Silakan cek email Anda untuk mengkonfirmasi akun sebelum melakukan login.
                        </p>
                        <div className="flex justify-end">
                            <Button
                                variant="primary"
                                onClick={handleClosePopup}
                            >
                                Mengerti
                            </Button>
                        </div>
                    </div>
                </div>
            )}
            
            <AuthCard
                title="Buat Akun Baru"
                subtitle="Daftar untuk mulai menggunakan Lini Aksara"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <InputField
                        id="username"
                        name="username"
                        label="Nama Lengkap"
                        type="text"
                        placeholder="Nama Anda"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        error={errors.username}
                    />

                    <InputField
                        id="email"
                        name="email"
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
                        name="password"
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
                        name="confirmPassword"
                        label="Konfirmasi Password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        error={errors.confirmPassword}
                    />

                    {errors.auth && (
                        <div className="text-red-500 text-sm text-center mb-4">
                            {errors.auth}
                        </div>
                    )}

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
        </div>
    );
}
