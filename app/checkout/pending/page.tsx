'use client';

import { useRouter } from 'next/navigation';
import { Clock } from 'lucide-react';
import Link from 'next/link';

export default function PendingPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full text-center">
                <div className="flex justify-center mb-6">
                    <Clock className="w-16 h-16 text-yellow-500" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Pago Pendiente</h1>
                <p className="text-gray-600 mb-6">
                    Tu pago en Mercado Pago se encuentra en estado pendiente.
                    Te notificaremos por correo electrónico una vez que se acredite y procesaremos tu orden inmediatamente.
                </p>
                <div className="space-y-4">
                    <button
                        onClick={() => router.push('/')}
                        className="w-full bg-black text-white font-medium py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        Volver a la tienda
                    </button>
                    <p className="text-sm text-gray-500">
                        ¿Tienes dudas? <Link href="/#contacto" className="text-blue-600 hover:underline">Contáctanos</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
