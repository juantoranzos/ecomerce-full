'use client';

import { useState, useMemo, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/app/components/ui/input';
import { useProductStore, useCartStore } from '@/app/store';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Navbar } from '@/app/components/navbar';
import { Footer } from '@/app/components/footer';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Home() {
    const { products, fetchProducts } = useProductStore();
    const addItem = useCartStore((state) => state.addItem);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const categories = useMemo(() => {
        const cats = products.map(p => p.category).filter(Boolean);
        return Array.from(new Set(cats));
    }, [products]);

    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
            return matchesSearch && matchesCategory;
        });
    }, [products, searchQuery, selectedCategory]);

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="bg-black text-white py-20 md:py-32">
                    <div className="container mx-auto px-4 text-center">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-4xl md:text-6xl font-bold mb-6 tracking-tight"
                        >
                            Somos tu tienda de importacion de confianza
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto"
                        >
                            Aca vas a poder encontrar todo lo que buscas y mas!
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <Button size="lg" className="bg-white text-black hover:bg-gray-200">
                                Comprar Ahora
                            </Button>
                        </motion.div>
                    </div>
                </section>

                {/* Product Grid */}
                <section className="py-16 md:py-24 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold mb-8 text-center tracking-tight">Productos Destacados</h2>

                        {/* Search and Filter Controls */}
                        <div className="mb-12 max-w-4xl mx-auto space-y-6">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <Input
                                    placeholder="Buscar productos..."
                                    className="pl-10 h-12 text-lg"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            {categories.length > 0 && (
                                <div className="flex flex-wrap gap-2 justify-center">
                                    <Button
                                        variant={selectedCategory === null ? "default" : "outline"}
                                        onClick={() => setSelectedCategory(null)}
                                        className="rounded-full"
                                    >
                                        Todos
                                    </Button>
                                    {categories.map(category => (
                                        <Button
                                            key={category}
                                            variant={selectedCategory === category ? "default" : "outline"}
                                            onClick={() => setSelectedCategory(category)}
                                            className="rounded-full"
                                        >
                                            {category}
                                        </Button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {filteredProducts.map((product) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300 border-0 bg-white">
                                        <div className="relative h-64 w-full bg-gray-100 group overflow-hidden">
                                            <Image
                                                src={product.image}
                                                alt={product.name}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        </div>
                                        <CardHeader>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <CardTitle className="text-lg font-medium line-clamp-1">{product.name}</CardTitle>
                                                    <CardDescription className="text-sm mt-1">{product.category}</CardDescription>
                                                </div>
                                                <span className="font-semibold">${product.price.toFixed(2)}</span>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="flex-1">
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {product.description}
                                            </p>
                                        </CardContent>
                                        <CardFooter className="gap-2">
                                            <Link href={`/products/${product.id}`} className="w-full">
                                                <Button variant="outline" className="w-full">
                                                    Ver Detalles
                                                </Button>
                                            </Link>
                                            <Button
                                                onClick={() => addItem(product)}
                                                className="w-full"
                                            >
                                                Agregar
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
