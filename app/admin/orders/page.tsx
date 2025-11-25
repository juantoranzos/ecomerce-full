'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/app/store';
import { db } from '@/app/lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { Navbar } from '@/app/components/navbar';
import { Button } from '@/app/components/ui/button';
import { Truck, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';

interface Order {
    id: string;
    paymentId: string;
    status: string;
    total: number;
    items: any[];
    shippingInfo: {
        name: string;
        surname: string;
        email: string;
        address: string;
        city: string;
        province: string;
        zip: string;
        phone: string;
    };
    createdAt: any;
    shippingStatus: 'pending' | 'shipped';
    trackingNumber?: string;
}

export default function AdminOrdersPage() {
    const user = useAuthStore((state) => state.user);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [trackingInput, setTrackingInput] = useState('');

    useEffect(() => {
        if (!user || user.role !== 'admin') return;

        const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const ordersData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Order[];
            setOrders(ordersData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const handleUpdateShipping = async (orderId: string) => {
        if (!trackingInput) return;

        try {
            const orderRef = doc(db, 'orders', orderId);
            await updateDoc(orderRef, {
                shippingStatus: 'shipped',
                trackingNumber: trackingInput,
            });
            setEditingId(null);
            setTrackingInput('');
            alert('Orden actualizada correctamente');
        } catch (error) {
            console.error(error);
            alert('Error al actualizar la orden');
        }
    };

    if (!user || user.role !== 'admin') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Access Denied. Admins only.</p>
                <Link href="/login" className="ml-2 text-blue-500 hover:underline">Login</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />

            <main className="flex-1 py-12">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold tracking-tight">Gestión de Pedidos</h1>
                        <Link href="/admin/dashboard">
                            <Button variant="outline">Volver al Dashboard</Button>
                        </Link>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="p-4 font-semibold text-gray-600">Fecha</th>
                                        <th className="p-4 font-semibold text-gray-600">Cliente</th>
                                        <th className="p-4 font-semibold text-gray-600">Items</th>
                                        <th className="p-4 font-semibold text-gray-600">Total</th>
                                        <th className="p-4 font-semibold text-gray-600">Estado Pago</th>
                                        <th className="p-4 font-semibold text-gray-600">Envío</th>
                                        <th className="p-4 font-semibold text-gray-600">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {orders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="p-4 text-sm text-gray-600">
                                                {order.createdAt?.toDate().toLocaleDateString()}
                                            </td>
                                            <td className="p-4">
                                                <div className="font-medium text-gray-900">
                                                    {order.shippingInfo.name} {order.shippingInfo.surname}
                                                </div>
                                                <div className="text-sm text-gray-500">{order.shippingInfo.email}</div>
                                                <div className="text-xs text-gray-400 mt-1">
                                                    {order.shippingInfo.address}, {order.shippingInfo.city}
                                                </div>
                                            </td>
                                            <td className="p-4 text-sm text-gray-600">
                                                {order.items.map((item: any) => (
                                                    <div key={item.id}>
                                                        {item.quantity}x {item.title}
                                                    </div>
                                                ))}
                                            </td>
                                            <td className="p-4 font-medium text-gray-900">
                                                ${order.total.toLocaleString()}
                                            </td>
                                            <td className="p-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                {order.shippingStatus === 'shipped' ? (
                                                    <div className="flex items-center text-green-600 gap-2">
                                                        <Truck size={16} />
                                                        <span className="text-sm font-medium">Enviado</span>
                                                        <span className="text-xs text-gray-500 block">
                                                            TN: {order.trackingNumber}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center text-yellow-600 gap-2">
                                                        <Clock size={16} />
                                                        <span className="text-sm font-medium">Pendiente</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                {order.shippingStatus === 'pending' && (
                                                    <div>
                                                        {editingId === order.id ? (
                                                            <div className="flex gap-2">
                                                                <input
                                                                    type="text"
                                                                    placeholder="Tracking #"
                                                                    className="border rounded px-2 py-1 text-sm w-32"
                                                                    value={trackingInput}
                                                                    onChange={(e) => setTrackingInput(e.target.value)}
                                                                />
                                                                <Button
                                                                    size="sm"
                                                                    onClick={() => handleUpdateShipping(order.id)}
                                                                >
                                                                    Guardar
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    onClick={() => {
                                                                        setEditingId(null);
                                                                        setTrackingInput('');
                                                                    }}
                                                                >
                                                                    X
                                                                </Button>
                                                            </div>
                                                        ) : (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => setEditingId(order.id)}
                                                            >
                                                                Despachar
                                                            </Button>
                                                        )}
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {orders.length === 0 && !loading && (
                                        <tr>
                                            <td colSpan={7} className="p-8 text-center text-gray-500">
                                                No hay pedidos registrados.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
