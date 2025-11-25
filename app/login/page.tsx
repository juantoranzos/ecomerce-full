'use client';

import { useState } from 'react';
import { useAuthStore } from '@/app/store';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/app/components/ui/card';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/app/lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [error, setError] = useState('');
    const loginState = useAuthStore((state) => state.login);
    const router = useRouter();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            let userCredential;
            if (isRegistering) {
                userCredential = await createUserWithEmailAndPassword(auth, email, password);
            } else {
                userCredential = await signInWithEmailAndPassword(auth, email, password);
            }

            const user = userCredential.user;
            // Simple role logic: if email contains 'admin', make them admin. 
            // In a real app, this should be stored in a user document in Firestore.
            const role = email.includes('admin') ? 'admin' : 'user';

            loginState(email, role);

            if (role === 'admin') {
                router.push('/admin/dashboard');
            } else {
                router.push('/');
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Ocurrió un error. Verifica tus credenciales.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">
                        {isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión'}
                    </CardTitle>
                    <CardDescription className="text-center">
                        {isRegistering
                            ? 'Ingresa tus datos para registrarte'
                            : 'Ingresa tu email para acceder a tu cuenta'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAuth} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email</label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@ejemplo.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Contraseña</label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>
                        {error && <p className="text-sm text-red-500">{error}</p>}
                        <Button type="submit" className="w-full">
                            {isRegistering ? 'Registrarse' : 'Entrar'}
                        </Button>
                    </form>
                    <div className="mt-4 text-center text-sm text-muted-foreground">
                        <button
                            type="button"
                            onClick={() => setIsRegistering(!isRegistering)}
                            className="underline hover:text-primary"
                        >
                            {isRegistering
                                ? '¿Ya tienes cuenta? Inicia sesión'
                                : '¿No tienes cuenta? Regístrate'}
                        </button>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Link href="/" className="text-sm text-muted-foreground hover:underline">
                        Volver al Inicio
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
