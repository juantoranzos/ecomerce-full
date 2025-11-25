'use client';

import Link from 'next/link';
import { ShoppingCart, User, Menu } from 'lucide-react';
import { useCartStore, useAuthStore } from '@/app/store';
import { Button } from './ui/button';
import { useState } from 'react';

export function Navbar() {
    const cartItems = useCartStore((state) => state.items);
    const { user, logout } = useAuthStore();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <nav className="sticky top-0 z-50 border-b border-white/10 bg-white/70 backdrop-blur-md shadow-sm transition-all duration-300">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="text-xl font-bold tracking-tight">
                    YO TE IMPORTO
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-6">
                    <Link href="/" className="text-sm font-medium hover:text-primary/80">
                        Inicio
                    </Link>
                    {user?.role === 'admin' && (
                        <Link href="/admin/dashboard" className="text-sm font-medium hover:text-primary/80">
                            Panel
                        </Link>
                    )}
                </div>

                <div className="hidden md:flex items-center gap-4">
                    <Link href="/cart">
                        <Button variant="ghost" size="icon" className="relative">
                            <ShoppingCart className="h-5 w-5" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </Button>
                    </Link>

                    {user ? (
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Hola, {user.email}</span>
                            <Button variant="ghost" size="sm" onClick={() => logout()}>
                                Salir
                            </Button>
                        </div>
                    ) : (
                        <Link href="/login">
                            <Button variant="ghost" size="icon">
                                <User className="h-5 w-5" />
                            </Button>
                        </Link>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <Menu className="h-6 w-6" />
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t p-4 space-y-4 bg-background">
                    <Link
                        href="/"
                        className="block text-sm font-medium"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Inicio
                    </Link>
                    {user?.role === 'admin' && (
                        <Link
                            href="/admin/dashboard"
                            className="block text-sm font-medium"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Panel
                        </Link>
                    )}
                    <Link
                        href="/cart"
                        className="block text-sm font-medium"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Carrito ({cartCount})
                    </Link>
                    {user ? (
                        <button
                            className="block text-sm font-medium text-left w-full"
                            onClick={() => {
                                logout();
                                setIsMenuOpen(false);
                            }}
                        >
                            Salir
                        </button>
                    ) : (
                        <Link
                            href="/login"
                            className="block text-sm font-medium"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Entrar
                        </Link>
                    )}
                </div>
            )}
        </nav>
    );
}
