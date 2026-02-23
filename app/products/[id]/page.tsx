import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import ProductClient from './ProductClient';
import { Metadata } from 'next';
import { Product } from '@/store';

// Helper to fetch product
async function getProduct(id: string): Promise<Product | null> {
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        return { id: docSnap.id, ...data } as Product;
    }
    return null;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        return {
            title: 'Producto no encontrado',
        };
    }

    return {
        title: product.name,
        description: product.description.substring(0, 160),
        openGraph: {
            images: [product.image],
        },
    };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await getProduct(id);

    return <ProductClient product={product!} />;
}
