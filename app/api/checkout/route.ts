import { MercadoPagoConfig, Preference } from 'mercadopago';
import { NextResponse } from 'next/server';

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { items, shippingInfo } = body;

        const preference = new Preference(client);

        const preferenceBody: any = {
            items: items.map((item: any) => ({
                id: item.id,
                title: item.title,
                quantity: item.quantity,
                unit_price: Number(item.price),
                currency_id: 'ARS',
                picture_url: item.image,
            })),
            // payer: {
            //     name: shippingInfo.name,
            //     surname: shippingInfo.surname,
            //     email: shippingInfo.email,
            //     phone: {
            //         area_code: '',
            //         number: shippingInfo.phone,
            //     },
            //     address: {
            //         street_name: shippingInfo.address,
            //         street_number: '',
            //         zip_code: shippingInfo.zip,
            //     },
            // },
            back_urls: {
                success: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout/success`,
                failure: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout/failure`,
                pending: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout/pending`,
            },
            // auto_return: 'approved', // Disabled by default for localhost
            metadata: {
                shipping_info: shippingInfo,
            },
        };

        console.log('Preference Body:', JSON.stringify(preferenceBody, null, 2));

        // Enable auto_return only if we are in production (URL is defined)
        // Mercado Pago often rejects auto_return with localhost
        if (process.env.NEXT_PUBLIC_BASE_URL) {
            preferenceBody.auto_return = 'approved';
        }

        const result = await preference.create({
            body: preferenceBody,
        });

        console.log('MP Preference Result:', JSON.stringify(result, null, 2));

        // Force sandbox URL manually to be 100% sure
        const sandboxUrl = `https://sandbox.mercadopago.com.ar/checkout/v1/redirect?pref_id=${result.id}`;

        return NextResponse.json({ id: result.id, init_point: sandboxUrl });
    } catch (error: any) {
        console.error('Error creating preference:', error);
        console.error('MP_ACCESS_TOKEN present:', !!process.env.MP_ACCESS_TOKEN);
        const token = process.env.MP_ACCESS_TOKEN || '';
        console.error('Token starts with:', token.substring(0, 10));
        return NextResponse.json({ error: 'Error creating preference', details: error.message }, { status: 500 });
    }
}
