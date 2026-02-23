import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { db } from '@/lib/firebase';
import { collection, setDoc, doc, Timestamp, increment, writeBatch } from 'firebase/firestore'; // Changed imports

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
                const items = paymentData.additional_info?.items || [];

                // Create order in Firebase using payment ID for idempotency
                const orderData = {
                    paymentId: paymentData.id,
                    status: 'paid',
                    total: paymentData.transaction_amount,
                    items: items,
                    shippingInfo: paymentData.metadata.shipping_info,
                    createdAt: Timestamp.now(),
                    shippingStatus: 'pending',
                    trackingNumber: null,
                };

                // Use a batch to atomically save the order and decrease stock
                const batch = writeBatch(db);
                batch.set(doc(db, 'orders', String(paymentData.id)), orderData, { merge: true });

                for (const item of items) {
                    if (item.id) {
                        const productRef = doc(db, 'products', String(item.id));
                        batch.update(productRef, { stock: increment(-Number(item.quantity || 1)) });
                    }
                }

                await batch.commit();
            }
        }

        return NextResponse.json({ status: 'success' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Webhook error' }, { status: 500 });
    }
}
