import { z } from 'zod';

export const productSchema = z.object({
    name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    price: z.number().positive("El precio debe ser positivo"),
    stock: z.number().int().min(0, "El stock no puede ser negativo"),
    description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
    image: z.string().url("La imagen debe ser una URL válida"),
    category: z.string().min(3, "La categoría es requerida"),
    features: z.array(z.object({
        name: z.string(),
        value: z.string()
    })).optional(),
});

export const checkoutItemSchema = z.object({
    id: z.string(),
    quantity: z.number().int().positive(),
});

export const checkoutSchema = z.object({
    items: z.array(checkoutItemSchema).min(1, "El carrito no puede estar vacío"),
    shippingInfo: z.object({
        name: z.string().min(2, "Nombre requerido"),
        surname: z.string().min(2, "Apellido requerido"),
        email: z.string().email("Email inválido"),
        phone: z.string().min(6, "Teléfono inválido"),
        address: z.string().min(5, "Dirección requerida"),
        zip: z.string().min(4, "Código postal requerido"),
        province: z.string().optional(),
        city: z.string().optional(),
    }),
});
