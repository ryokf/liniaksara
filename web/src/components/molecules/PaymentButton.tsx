import React, { useEffect } from 'react'
import Button from '../atoms/Button'
import supabase from '@/config/supabase';
import { useRouter } from 'next/navigation';
import { createTransaction } from '@/services/WorkTransactionService';

declare global {
    interface Window {
        snap: {
            pay: (token: string, options?: {
                onSuccess?: (result: unknown) => void;
                onPending?: (result: unknown) => void;
                onError?: (result: unknown) => void;
                onClose?: () => void;
            }) => void;
        };
    }
}

const PaymentButton = ({ price, work_id }: { price: number, work_id: string }) => {
    const router = useRouter();
    const checkout = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            alert('Anda harus login terlebih dahulu.');
            return;
        }

        if (price === 0) {
            await createTransaction(
                user.id,
                work_id
            );
            router.push('/dashboard/order');
            return;
        } else {
            try {
                const id = Date.now().toString();
                const payload = {
                    price,
                    id,
                    customer_details: {
                        email: user.email || '',
                        first_name: user.user_metadata?.full_name || 'Guest',
                    },
                };

                const response = await fetch('/api/tokenizer', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                if (!response.ok) {
                    const text = await response.text().catch(() => '');
                    console.error('Tokenizer error:', response.status, text);
                    alert(`Gagal membuat token pembayaran (${response.status}). Cek server logs.`);
                    return;
                }

                interface TokenizerResponse { token?: string }
                let result: TokenizerResponse;
                try {
                    result = await response.json() as TokenizerResponse;
                } catch (e) {
                    console.error('Tokenizer returned non-JSON body');
                    alert('Response dari /api/tokenizer tidak berupa JSON. Cek handler API.');
                    return;
                }

                if (!result?.token) {
                    console.error('No token in tokenizer result:', result);
                    alert('Token Midtrans tidak ditemukan di response.');
                    return;
                }

                window.snap.pay(result.token, {
                    onSuccess: async () => {
                        try {
                            const statusResponse = await fetch(`/api/check-status?id=${id}`);
                            if (!statusResponse.ok) {
                                const text = await statusResponse.text().catch(() => '');
                                console.error('Status check error:', statusResponse.status, text);
                                alert('Gagal mengecek status pembayaran.');
                                return;
                            }
                            interface MidtransStatusResponse { transaction_status?: string }
                            const statusData = await statusResponse.json() as MidtransStatusResponse;
                            console.log('Midtrans Status:', statusData);

                            if (statusData.transaction_status === 'settlement' || statusData.transaction_status === 'capture') {
                                await createTransaction(user.id, work_id);
                                router.push('/dashboard/order');
                            } else {
                                alert('Pembayaran belum berhasil. Silakan coba lagi.');
                            }
                        } catch (err) {
                            console.error(err);
                            alert('Terjadi kesalahan saat verifikasi pembayaran.');
                        }
                    },
                    onPending: () => {
                        alert('Anda belum menyelesaikan pembayaran, silakan selesaikan pembayaran Anda.');
                    },
                    onError: () => {
                        alert('Terjadi kesalahan saat memproses pembayaran, silakan coba lagi.');
                    },
                    onClose: () => {
                        alert('Payment is closed, please try again later.');
                    },
                });
            } catch (err) {
                console.error(err);
                alert('Terjadi kesalahan tak terduga saat memulai pembayaran.');
            }
        }
    };

    useEffect(() => {
        // render midtrans snap token
        const snapScript = "https://app.midtrans.com/snap/snap.js";
        const clientKey = process.env.NEXT_PUBLIC_CLIENT ?? '';
        const script = document.createElement("script");
        script.src = snapScript;
        script.setAttribute("data-client-key", clientKey);
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        }
    }, []);

    return (
        <>
            <Button
                variant="primary"
                className="flex items-center gap-2 gradient-bg hover:!gradient-bg/80"
                onClick={checkout}
            >
                <span className="text-white">Dapatkan</span>
            </Button>
        </>
    )
}

export default PaymentButton