import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { db } from '@/app/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query } from 'firebase/firestore';

// Types
export interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    image: string;
    category: string;
    features?: { name: string; value: string }[];
}

export interface CartItem extends Product {
    quantity: number;
}

interface CartState {
    items: CartItem[];
    addItem: (product: Product) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    total: () => number;
}

interface AuthState {
    user: { email: string; role: 'admin' | 'user' } | null;
    login: (email: string, role: 'admin' | 'user') => void;
    logout: () => void;
}

interface ProductState {
    products: Product[];
    isLoading: boolean;
    fetchProducts: () => Promise<void>;
    addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
    updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
}

// Cart Store
export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (product) => {
                const items = get().items;
                const existingItem = items.find((item) => item.id === product.id);

                if (existingItem) {
                    set({
                        items: items.map((item) =>
                            item.id === product.id
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        ),
                    });
                } else {
                    set({ items: [...items, { ...product, quantity: 1 }] });
                }
            },
            removeItem: (productId) => {
                set({ items: get().items.filter((item) => item.id !== productId) });
            },
            updateQuantity: (productId, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(productId);
                } else {
                    set({
                        items: get().items.map((item) =>
                            item.id === productId ? { ...item, quantity } : item
                        ),
                    });
                }
            },
            clearCart: () => set({ items: [] }),
            total: () =>
                get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
        }),
        {
            name: 'cart-storage',
        }
    )
);

// Auth Store
export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            login: (email, role) => set({ user: { email, role } }),
            logout: () => set({ user: null }),
        }),
        {
            name: 'auth-storage',
        }
    )
);

// Product Store
export const useProductStore = create<ProductState>((set, get) => ({
    products: [],
    isLoading: false,
    fetchProducts: async () => {
        set({ isLoading: true });
        try {
            const q = query(collection(db, 'products'));
            const querySnapshot = await getDocs(q);
            const products: Product[] = [];
            querySnapshot.forEach((doc) => {
                // Spread data first, then overwrite id with the real document ID
                const data = doc.data();
                products.push({ ...data, id: doc.id } as Product);
            });
            console.log("Fetched products from Firestore:", products);
            set({ products, isLoading: false });
        } catch (error) {
            console.error("Error fetching products:", error);
            set({ isLoading: false });
        }
    },
    addProduct: async (newProduct) => {
        try {
            console.log("Adding product:", newProduct);
            const docRef = await addDoc(collection(db, 'products'), newProduct);
            console.log("Product added with ID:", docRef.id);
            const product = { ...newProduct, id: docRef.id };
            set((state) => ({ products: [...state.products, product] }));
            alert("Producto agregado correctamente!");
        } catch (error: any) {
            console.error("Error adding product:", error);
            alert(`Error al agregar: ${error.message}`);
        }
    },
    updateProduct: async (id, updatedProduct) => {
        try {
            console.log("Updating product:", id, updatedProduct);
            const productRef = doc(db, 'products', id);
            await updateDoc(productRef, updatedProduct);
            console.log("Product updated successfully");
            set((state) => ({
                products: state.products.map((p) =>
                    p.id === id ? { ...p, ...updatedProduct } : p
                ),
            }));
            await get().fetchProducts();
            alert("Producto actualizado correctamente!");
        } catch (error: any) {
            console.error("Error updating product:", error);
            alert(`Error al actualizar: ${error.message}`);
        }
    },
    deleteProduct: async (id) => {
        try {
            console.log("Deleting product:", id);
            await deleteDoc(doc(db, 'products', id));
            console.log("Product deleted successfully");
            set((state) => ({
                products: state.products.filter((p) => p.id !== id),
            }));
            alert("Producto eliminado correctamente!");
        } catch (error: any) {
            console.error("Error deleting product:", error);
            alert(`Error al eliminar: ${error.message}`);
        }
    },
}));
