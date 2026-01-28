'use server';

import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation';

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', {
            email: formData.get('email'),
            password: formData.get('password'),
            redirect: false,
        });
    } catch (error) {
        console.log('❌ Login Error (Pre-Redirect):', error);
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Credenciais Inválidas.';
                default:
                    return 'Algo deu errado.';
            }
        }
        throw error;
    }

    // If we get here, login was successful (no error thrown)
    redirect('/');
}

export async function handleSignOut() {
    await signOut();
}
