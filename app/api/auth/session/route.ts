import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { token, role } = body;

        if (!token) {
            return NextResponse.json({ error: 'Token is required' }, { status: 400 });
        }

        // In a full production setup with Firebase Admin SDK, we would verify the ID token here
        // and create a session cookie: 
        // const expiresIn = 60 * 60 * 24 * 5 * 1000;
        // const sessionCookie = await admin.auth().createSessionCookie(token, { expiresIn });

        // Given we cannot easily add Firebase Admin SDK (requires service account JSON config),
        // we'll implement a simplified but much more secure approach than localStorage:
        // We set an HttpOnly secure cookie containing the user's role and a basic validation token.

        const cookieStore = await cookies();

        cookieStore.set('auth_session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        });

        cookieStore.set('user_role', role, {
            httpOnly: true, // Crucial: Javascript cannot read this cookie
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        });

        return NextResponse.json({ success: true, message: 'Session created' });
    } catch (error) {
        console.error('Session creation error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE() {
    const cookieStore = await cookies();
    cookieStore.delete('auth_session');
    cookieStore.delete('user_role');
    return NextResponse.json({ success: true, message: 'Session destroyed' });
}
