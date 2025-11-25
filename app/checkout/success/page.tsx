'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/app/store';
import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';

export default function SuccessPage() {
    const { clearCart } = useCartStore();
    const router = useRouter();

    useEffect(() => {
        clearCart();
    }, [clearCart]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full text-center">
                <div className="flex justify-center mb-6">
                    <CheckCircle className="w-16 h-16 text-green-500" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">¡Pago Exitoso!</h1>
                <p className="text-gray-600 mb-8">
                    Gracias por tu compra. Te enviamos un email con los detalles.
                </p>
                <button
                    onClick={() => router.push('/')}
                    className="w-full bg-black text-white font-medium py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors"
                >
                    Volver a la tienda
                </button>
            </div>
        </div>
    );
}
