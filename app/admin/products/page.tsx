'use client';

import { useState, useEffect } from 'react';
import { useProductStore, useAuthStore, Product } from '@/app/store';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Navbar } from '@/app/components/navbar';
import { Trash2, Edit, Plus, X, Save } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminProducts() {
    const { products, addProduct, updateProduct, deleteProduct, fetchProducts } = useProductStore();
    const user = useAuthStore((state) => state.user);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);

    const [formData, setFormData] = useState<Omit<Product, 'id'>>({
        name: '',
        price: 0,
        description: '',
        image: '',
        category: '',
        features: []
    });

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    if (!user || user.role !== 'admin') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Access Denied. Admins only.</p>
                <Link href="/login" className="ml-2 text-blue-500 hover:underline">Login</Link>
            </div>
        );
    }

    const handleEdit = (product: Product) => {
        setEditingId(product.id);
        setFormData({
            name: product.name,
            price: product.price,
            description: product.description,
            image: product.image,
            category: product.category,
            features: product.features || []
        });
        setIsAdding(false);
    };

    const handleDelete = async (id: string) => {
        if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
            await deleteProduct(id);
        }
    };

    const handleAdd = () => {
        setIsAdding(true);
        setEditingId(null);
        setFormData({
            name: '',
            price: 0,
            description: '',
            image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=800&q=80', // Placeholder
            category: '',
            features: []
        });
    };

    const handleSave = async () => {
        if (isAdding) {
            await addProduct(formData);
        } else if (editingId) {
            await updateProduct(editingId, formData);
        }
        setEditingId(null);
        setIsAdding(false);
    };

    const handleCancel = () => {
        setEditingId(null);
        setIsAdding(false);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />

            <main className="flex-1 py-12">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold tracking-tight">Gestión de Productos</h1>
                        <Button onClick={handleAdd} disabled={isAdding || !!editingId}>
                            <Plus className="mr-2 h-4 w-4" /> Agregar Producto
                        </Button>
                    </div>

                    {/* Edit/Add Form */}
                    {(isAdding || editingId) && (
                        <Card className="mb-8">
                            <CardHeader>
                                <CardTitle>{isAdding ? 'Agregar Nuevo Producto' : 'Editar Producto'}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Nombre</label>
                                            <Input
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Precio</label>
                                            <Input
                                                type="number"
                                                value={formData.price}
                                                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Descripción</label>
                                        <Input
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Categoría</label>
                                            <Input
                                                value={formData.category}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">URL de Imagen</label>
                                            <Input
                                                value={formData.image}
                                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Características</label>
                                        {formData.features?.map((feature, index) => (
                                            <div key={index} className="flex gap-2 mb-2">
                                                <Input
                                                    placeholder="Nombre (ej: Color)"
                                                    value={feature.name}
                                                    onChange={(e) => {
                                                        const newFeatures = [...(formData.features || [])];
                                                        newFeatures[index].name = e.target.value;
                                                        setFormData({ ...formData, features: newFeatures });
                                                    }}
                                                />
                                                <Input
                                                    placeholder="Valor (ej: Rojo)"
                                                    value={feature.value}
                                                    onChange={(e) => {
                                                        const newFeatures = [...(formData.features || [])];
                                                        newFeatures[index].value = e.target.value;
                                                        setFormData({ ...formData, features: newFeatures });
                                                    }}
                                                />
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-red-500"
                                                    onClick={() => {
                                                        const newFeatures = formData.features?.filter((_, i) => i !== index);
                                                        setFormData({ ...formData, features: newFeatures });
                                                    }}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setFormData({
                                                ...formData,
                                                features: [...(formData.features || []), { name: '', value: '' }]
                                            })}
                                        >
                                            <Plus className="mr-2 h-4 w-4" /> Agregar Característica
                                        </Button>
                                    </div>

                                    <div className="flex justify-end gap-2 mt-4">
                                        <Button variant="outline" onClick={handleCancel}>Cancelar</Button>
                                        <Button onClick={handleSave}>Guardar Cambios</Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Product List */}
                    <div className="grid gap-4">
                        {products.map((product) => (
                            <Card key={product.id} className="overflow-hidden">
                                <div className="flex items-center p-4 gap-4">
                                    <div className="relative h-16 w-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold truncate">{product.name}</h3>
                                        <p className="text-sm text-muted-foreground truncate">{product.category}</p>
                                    </div>
                                    <div className="font-medium w-24 text-right">
                                        ${product.price.toFixed(2)}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleEdit(product)}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                            onClick={() => handleDelete(product.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
