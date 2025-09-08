'use client';

import React, { useState } from 'react';
import AuthCard from '@/components/molecules/AuthCard';
import InputField from '@/components/atoms/InputField';
import Button from '@/components/atoms/Button';
import Link from 'next/link';
import { resetPassword } from '@/services/authServices';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage(null);

        try {
            const { error } = await resetPassword(email);
            
            if (error) {
                setMessage({ type: 'error', text: error });
            } else {
                setMessage({ 
                    type: 'success', 
                    text: 'Link reset password telah dikirim ke email Anda. Silakan cek inbox atau folder spam Anda.' 
                });
                setEmail('');
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Terjadi kesalahan. Silakan coba lagi.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AuthCard
            title="Lupa Password"
            subtitle="Masukkan email Anda untuk menerima link reset password"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <InputField
                    id="email"
                    name="email"
                    label="Email"
                    type="email"
                    placeholder="nama@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                {message && (
                    <div className={`text-sm text-center ${
                        message.type === 'success' ? 'text-green-600' : 'text-red-500'
                    }`}>
                        {message.text}
                    </div>
                )}

                <Button
                    type="submit"
                    variant="primary"
                    className="w-full gradient-bg hover:shadow-glow-strong transition-all duration-500"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Mengirim...' : 'Kirim Link Reset Password'}
                </Button>

                <div className="text-center mt-4">
                    <Link
                        href="/login"
                        className="text-primary-1 hover:underline text-sm"
                    >
                        Kembali ke halaman login
                    </Link>
                </div>
            </form>
        </AuthCard>
    );
}
