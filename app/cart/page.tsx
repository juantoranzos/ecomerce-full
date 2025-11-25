'use client';

import { useCartStore } from '@/app/store';
import { Button } from '@/app/components/ui/button';
import { Navbar } from '@/app/components/navbar';
import { Footer } from '@/app/components/footer';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartPage() {
    const { items, removeItem, updateQuantity, total, clearCart } = useCartStore();

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 py-12 md:py-20">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl md:text-4xl font-bold mb-8 tracking-tight">Carrito de Compras</h1>

                    {items.length === 0 ? (
                        <div className="text-center py-20 bg-gray-50 rounded-xl">
                            <h2 className="text-2xl font-semibold mb-4">Tu carrito está vacío</h2>
                            <p className="text-muted-foreground mb-8">Parece que no has agregado nada aún.</p>
                            <Link href="/">
                                <Button size="lg">Empezar a Comprar</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            {/* Cart Items */}
                            <div className="lg:col-span-2 space-y-6">
                                <AnimatePresence>
                                    {items.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="flex gap-6 p-6 bg-white border rounded-xl shadow-sm"
                                        >
                                            <div className="relative h-24 w-24 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>

                                            <div className="flex-1 flex flex-col justify-between">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="font-semibold text-lg">{item.name}</h3>
                                                        <p className="text-sm text-muted-foreground">{item.category}</p>
                                                    </div>
                                                    <p className="font-semibold text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                                                </div>

                                                <div className="flex justify-between items-center mt-4">
                                                    <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        >
                                                            <Minus className="h-3 w-3" />
                                                        </Button>
                                                        <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        >
                                                            <Plus className="h-3 w-3" />
                                                        </Button>
                                                    </div>

                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                        onClick={() => removeItem(item.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                        Eliminar
                                                    </Button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-1">
                                <div className="bg-gray-50 p-8 rounded-xl sticky top-24">
                                    <h2 className="text-xl font-bold mb-6">Resumen del Pedido</h2>

                                    <div className="space-y-4 mb-6">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Subtotal</span>
                                            <span className="font-medium">${total().toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Envío</span>
                                            <span className="font-medium">Gratis</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Impuestos</span>
                                            <span className="font-medium">${(total() * 0.1).toFixed(2)}</span>
                                        </div>
                                        <div className="border-t pt-4 flex justify-between items-center">
                                            <span className="font-bold text-lg">Total</span>
                                            <span className="font-bold text-lg">${(total() * 1.1).toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <Link href="/checkout" className="w-full">
                                        <Button className="w-full h-12 text-lg">
                                            Pagar <ArrowRight className="ml-2 h-5 w-5" />
                                        </Button>
                                    </Link>

                                    <Button
                                        variant="outline"
                                        className="w-full mt-4"
                                        onClick={clearCart}
                                    >
                                        Vaciar Carrito
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
