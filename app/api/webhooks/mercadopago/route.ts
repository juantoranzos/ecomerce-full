import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { db } from '@/app/lib/firebase'; // Adjust path if needed
import { collection, addDoc, Timestamp } from 'firebase/firestore';

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });

export async function POST(request: Request) {
    const url = new URL(request.url);
    const topic = url.searchParams.get('topic') || url.searchParams.get('type');
    const id = url.searchParams.get('id') || url.searchParams.get('data.id');

    try {
        if (topic === 'payment') {
            const payment = new Payment(client);
            const paymentData = await payment.get({ id: id! });

            if (paymentData.status === 'approved') {
                // Create order in Firebase
                const orderData = {
                    paymentId: paymentData.id,
                    status: 'paid',
                    total: paymentData.transaction_amount,
                    items: paymentData.additional_info?.items || [],
                    shippingInfo: paymentData.metadata.shipping_info,
                    createdAt: Timestamp.now(),
                    shippingStatus: 'pending', // pending, shipped
                    trackingNumber: null,
                };

                await addDoc(collection(db, 'orders'), orderData);
            }
        }

        return NextResponse.json({ status: 'success' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Webhook error' }, { status: 500 });
    }
}
