'use client';

import { useRouter } from 'next/navigation';
import { XCircle } from 'lucide-react';

export default function FailurePage() {
    const router = useRouter();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full text-center">
                <div className="flex justify-center mb-6">
                    <XCircle className="w-16 h-16 text-red-500" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Algo salió mal</h1>
                <p className="text-gray-600 mb-8">
                    No pudimos procesar tu pago. Por favor, intenta nuevamente.
                </p>
                <div className="space-y-3">
                    <button
                        onClick={() => router.push('/checkout')}
                        className="w-full bg-black text-white font-medium py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        Intentar de nuevo
                    </button>
                    <button
                        onClick={() => router.push('/')}
                        className="w-full bg-gray-100 text-gray-700 font-medium py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Volver a la tienda
                    </button>
                </div>
            </div>
        </div>
    );
}
