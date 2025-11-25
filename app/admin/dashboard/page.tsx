'use client';

import { useAuthStore } from '@/app/store';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import Link from 'next/link';
import { Package, Users, DollarSign, BarChart } from 'lucide-react';
import { Navbar } from '@/app/components/navbar';

export default function AdminDashboard() {
    const user = useAuthStore((state) => state.user);

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
                        <h1 className="text-3xl font-bold tracking-tight">Panel de Administración</h1>
                        <div className="flex gap-4">
                            <Button
                                variant="danger"
                                onClick={() => {
                                    localStorage.clear();
                                    window.location.reload();
                                }}
                            >
                                Limpiar Caché (Fix Errores)
                            </Button>
                            <Link href="/admin/products">
                                <Button>Gestionar Productos</Button>
                            </Link>
                            <Link href="/admin/orders">
                                <Button variant="secondary">Ver Pedidos</Button>
                            </Link>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">$45,231.89</div>
                                <p className="text-xs text-muted-foreground">+20.1% desde el mes pasado</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">+2350</div>
                                <p className="text-xs text-muted-foreground">+180.1% desde el mes pasado</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Ventas</CardTitle>
                                <BarChart className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">+12,234</div>
                                <p className="text-xs text-muted-foreground">+19% desde el mes pasado</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Productos Activos</CardTitle>
                                <Package className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">573</div>
                                <p className="text-xs text-muted-foreground">+201 desde la última hora</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-4">
                            <CardHeader>
                                <CardTitle>Resumen</CardTitle>
                            </CardHeader>
                            <CardContent className="pl-2">
                                <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                                    Marcador de posición del gráfico
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="col-span-3">
                            <CardHeader>
                                <CardTitle>Ventas Recientes</CardTitle>
                                <CardContent>
                                    <div className="space-y-8 mt-4">
                                        <div className="flex items-center">
                                            <div className="ml-4 space-y-1">
                                                <p className="text-sm font-medium leading-none">Olivia Martin</p>
                                                <p className="text-sm text-muted-foreground">olivia.martin@email.com</p>
                                            </div>
                                            <div className="ml-auto font-medium">+$1,999.00</div>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="ml-4 space-y-1">
                                                <p className="text-sm font-medium leading-none">Jackson Lee</p>
                                                <p className="text-sm text-muted-foreground">jackson.lee@email.com</p>
                                            </div>
                                            <div className="ml-auto font-medium">+$39.00</div>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="ml-4 space-y-1">
                                                <p className="text-sm font-medium leading-none">Isabella Nguyen</p>
                                                <p className="text-sm text-muted-foreground">isabella.nguyen@email.com</p>
                                            </div>
                                            <div className="ml-auto font-medium">+$299.00</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </CardHeader>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
