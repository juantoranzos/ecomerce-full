'use client';

import { useEffect, Suspense } from 'react';
import { useCartStore } from '@/store';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle } from 'lucide-react';

function SuccessContent() {
    const { clearCart } = useCartStore();
    const router = useRouter();
    // Email is no longer passed via URL for security reasons
    // const searchParams = useSearchParams();
    // const email = searchParams.get('email');

    useEffect(() => {
        clearCart();
    }, [clearCart]);

    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full text-center">
            <div className="flex justify-center mb-6">
                <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">¡Compra Exitosa!</h1>
            <p className="text-gray-600 mb-4">
                El pago se ha procesado correctamente.
            </p>
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-8">
                <p className="text-sm text-blue-800">
                    Te enviaremos la información detallada de tu compra al correo electrónico asociado a la misma.
                </p>
            </div>
            <button
                onClick={() => router.push('/')}
                className="w-full bg-black text-white font-medium py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors"
            >
                Volver a la tienda
            </button>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
            <Suspense fallback={
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full text-center">
                    <p className="text-gray-500">Cargando detalles...</p>
                </div>
            }>
                <SuccessContent />
            </Suspense>
        </div>
    );
}
