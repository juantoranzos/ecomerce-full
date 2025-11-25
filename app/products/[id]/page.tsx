'use client';

import { useProductStore, useCartStore } from '@/app/store';
import { Button } from '@/app/components/ui/button';
import { Navbar } from '@/app/components/navbar';
import { Footer } from '@/app/components/footer';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import React, { useEffect } from 'react';

export default function ProductPage() {
    const { id } = useParams();
    const router = useRouter();
    const { products, fetchProducts } = useProductStore();
    const addItem = useCartStore((state) => state.addItem);

    useEffect(() => {
        if (products.length === 0) {
            fetchProducts();
        }
    }, [products.length, fetchProducts]);

    const product = products.find((p) => p.id === id);

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center">
                    <h1 className="text-2xl font-bold mb-4">Producto no encontrado</h1>
                    <Button onClick={() => router.push('/')}>Volver al Inicio</Button>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 py-12 md:py-20">
                <div className="container mx-auto px-4">
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        className="mb-8 pl-0 hover:pl-2 transition-all"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Volver
                    </Button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
                        {/* Image Section */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden"
                        >
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover"
                                priority
                            />
                        </motion.div>

                        {/* Details Section */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="flex flex-col justify-center"
                        >
                            <span className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                                {product.category}
                            </span>
                            <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight text-gray-900">
                                {product.name}
                            </h1>
                            <p className="text-2xl font-semibold mb-6 text-gray-900">
                                ${product.price.toFixed(2)}
                            </p>

                            <div className="prose prose-gray max-w-none mb-8 text-gray-600 leading-relaxed">
                                <p className="text-gray-600 mb-6">{product.description}</p>

                                {product.features && product.features.length > 0 && (
                                    <div className="mb-8">
                                        <h3 className="font-semibold mb-3">Características</h3>
                                        <div className="grid grid-cols-1 gap-y-2">
                                            {product.features.map((feature, index) => (
                                                <div key={index} className="flex border-b border-gray-100 py-2">
                                                    <span className="font-medium w-1/3 text-gray-900">{feature.name}</span>
                                                    <span className="text-gray-600">{feature.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <Button
                                    size="lg"
                                    className="w-full md:w-auto"
                                    onClick={() => {
                                        addItem(product);
                                        router.push('/cart');
                                    }}
                                >
                                    <ShoppingCart className="mr-2 h-5 w-5" />
                                    Agregar al Carrito
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
