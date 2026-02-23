import { MercadoPagoConfig, Preference } from 'mercadopago';
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

import { checkoutSchema } from '@/lib/validators';

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Validate with Zod
        const validationResult = checkoutSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json({
                error: 'Datos inválidos',
                details: validationResult.error.format()
            }, { status: 400 });
        }

        const { items: clientItems, shippingInfo } = validationResult.data;

        const validItems = [];

        // Validate items server-side
        for (const clientItem of clientItems) {
            const productRef = doc(db, 'products', clientItem.id);
            const productSnap = await getDoc(productRef);

            if (!productSnap.exists()) {
                console.warn(`Product not found: ${clientItem.id}`);
                continue; // Skip invalid products
            }

            const productData = productSnap.data();

            // Check stock server-side to prevent overselling
            if ((productData.stock || 0) < clientItem.quantity) {
                return NextResponse.json({
                    error: `Stock insuficiente para el producto: ${productData.name}`,
                    message: `Solo quedan ${productData.stock || 0} unidades disponibles.`
                }, { status: 400 });
            }

            validItems.push({
                id: clientItem.id,
                title: productData.name, // Use name from DB
                quantity: Number(clientItem.quantity),
                unit_price: Number(productData.price), // CRITICAL: Use price from DB
                currency_id: 'ARS',
                picture_url: productData.image, // Use image from DB
            });
        }

        if (validItems.length === 0) {
            return NextResponse.json({ error: 'No valid items found' }, { status: 400 });
        }

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const preferenceBody: any = {
            items: validItems,
            back_urls: {
                success: `${baseUrl}/checkout/success?email=${encodeURIComponent(shippingInfo.email)}`,
                failure: `${baseUrl}/checkout/failure`,
                pending: `${baseUrl}/checkout/pending`,
            },
            metadata: {
                shipping_info: shippingInfo,
            },
        };

        // Mercado Pago strict validation: auto_return requires valid back_urls (HTTPS).
        if (baseUrl.startsWith('https://')) {
            preferenceBody.auto_return = 'approved';
        }

        console.log('Preference Body (Server-Validated):', JSON.stringify(preferenceBody, null, 2));

        const preference = new Preference(client);
        const result = await preference.create({
            body: preferenceBody,
        });

        console.log('MP Preference Result:', JSON.stringify(result, null, 2));

        // Use sandbox URL for testing if needed, or init_point for production
        // For security, stick to standard init_point unless specifically in sandbox mode
        // But user code had sandbox override, preserving it for now but using init_point is safer
        const initPoint = result.init_point;

        return NextResponse.json({ id: result.id, init_point: initPoint });
    } catch (error: any) {
        console.error('Error creating preference:', error);
        return NextResponse.json({ error: 'Error creating preference', details: error.message }, { status: 500 });
    }
}
