import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { db } from '@/lib/firebase';
import { collection, setDoc, doc, Timestamp, increment, writeBatch, getDoc } from 'firebase/firestore'; // Changed imports
import crypto from 'crypto';

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });

export async function POST(request: Request) {
    console.log(`[Webhook Entry] Received request from: ${request.url}`);
    const url = new URL(request.url);
    const topic = url.searchParams.get('topic') || url.searchParams.get('type');
    const id = url.searchParams.get('id') || url.searchParams.get('data.id');

    console.log(`[Webhook Parsed] Topic/Type: ${topic}, ID: ${id}`);

    try {
        const bodyText = await request.text();
        // Remove raw payload logging in production to prevent PII exposure, 
        // but keep a structured, sanitized log.
        console.log(`[Webhook Received] ID: ${id}, Topic/Type: ${topic}`);

        // 1. Signature Validation (x-signature)
        const xSignature = request.headers.get('x-signature');
        const xRequestId = request.headers.get('x-request-id');
        const webhookSecret = process.env.MP_WEBHOOK_SECRET;

        if (webhookSecret && xSignature && xRequestId) {
            // Extract ts and v1 from x-signature (format: 'ts=...,v1=...')
            const signatureParts = xSignature.split(',');
            let ts = '';
            let v1 = '';
            signatureParts.forEach(part => {
                if (part.startsWith('ts=')) ts = part.replace('ts=', '');
                if (part.startsWith('v1=')) v1 = part.replace('v1=', '');
            });

            if (ts && v1) {
                // Construct manifest: id;request-id;ts;
                // Important: Mercado Pago documentation says data.id, but usually it's just the URL id for payment events.
                const manifest = `id:${id};request-id:${xRequestId};ts:${ts};`;

                // Calculate HMAC-SHA256
                const hmac = crypto.createHmac('sha256', webhookSecret);
                hmac.update(manifest);
                const computedSignature = hmac.digest('hex');

                if (computedSignature !== v1) {
                    console.error('[auth] Invalid Mercado Pago Signature');
                    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
                }
            } else {
                console.warn('[auth] Malformed x-signature header');
            }
        } else {
            console.warn('[auth] Missing signature headers or webhook secret not configured. Skipping signature validation.');
        }


        // Mercado Pago sometimes sends 'payment' as topic, or 'payment' as type.
        if (topic === 'payment') {
            const payment = new Payment(client);
            const paymentData = await payment.get({ id: id! });

            if (paymentData.status === 'approved') {
                const items = paymentData.additional_info?.items || [];

                const orderRef = doc(db, 'orders', String(paymentData.id));
                const orderSnap = await getDoc(orderRef);

                // Anti-Replay / Idempotency Check: 
                // Only create order and decrement stock if it doesn't exist yet
                if (orderSnap.exists()) {
                    console.log(`[Webhook] Order ${paymentData.id} already processed. Skipping to prevent double stock decrement.`);
                    return NextResponse.json({ status: 'ignored', message: 'Already processed' });
                }

                // Create order in Firebase using payment ID for idempotency
                const orderData = {
                    paymentId: paymentData.id,
                    status: 'paid',
                    total: paymentData.transaction_amount,
                    items: items,
                    // shippingInfo should ideally be just the necessary non-sensitive info, 
                    // but we store what MP provides in metadata. Ensure our logs don't print it.
                    shippingInfo: paymentData.metadata?.shipping_info || {},
                    createdAt: Timestamp.now(),
                    shippingStatus: 'pending',
                    trackingNumber: null,
                };

                // Use a batch to atomically save the order and decrease stock
                const batch = writeBatch(db);
                batch.set(orderRef, orderData);

                for (const item of items) {
                    if (item.id) {
                        const productRef = doc(db, 'products', String(item.id));
                        batch.update(productRef, { stock: increment(-Number(item.quantity || 1)) });
                    }
                }

                await batch.commit();
                console.log(`[Webhook] Order ${paymentData.id} successfully created and stock updated.`);
            }
        }

        return NextResponse.json({ status: 'success' });
    } catch (error) {
        console.error('[Webhook Error]', error);
        return NextResponse.json({ error: 'Webhook error' }, { status: 500 });
    }
}
