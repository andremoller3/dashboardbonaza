'use client';

import { useActionState } from 'react';
import { authenticate } from '@/app/lib/actions'; // We need to create this action
import { useState } from 'react';

export default function LoginPage() {
    const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined);

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
            <div className="w-full max-w-md space-y-8">
                {/* Logo/Header area */}
                <div className="text-center space-y-2">
                    <div className="inline-block border border-[#ccff00] bg-[#ccff00]/10 px-4 py-1 mb-4">
                        <span className="text-[#ccff00] font-bold text-sm uppercase tracking-widest">Acesso Restrito</span>
                    </div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter">Carmen Dashboard</h1>
                    <p className="text-muted-foreground">Entre com suas credenciais para continuar.</p>
                </div>

                <form action={formAction} className="space-y-6 bg-[#0a0a0a] border border-white/10 p-8 rounded-2xl shadow-2xl">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs uppercase font-bold tracking-widest text-muted-foreground mb-2" htmlFor="email">
                                Email
                            </label>
                            <input
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#ccff00] transition-colors"
                                id="email"
                                type="email"
                                name="email"
                                placeholder="admin@dashboard.com"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs uppercase font-bold tracking-widest text-muted-foreground mb-2" htmlFor="password">
                                Senha
                            </label>
                            <input
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#ccff00] transition-colors"
                                id="password"
                                type="password"
                                name="password"
                                placeholder="••••••"
                                required
                                minLength={4}
                            />
                        </div>
                    </div>

                    <button
                        className="w-full bg-[#ccff00] text-black font-black uppercase tracking-wider py-4 rounded-lg hover:bg-[#bbe600] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-disabled={isPending}
                        disabled={isPending}
                    >
                        {isPending ? 'Entrando...' : 'Entrar'}
                    </button>

                    {errorMessage && (
                        <div className="flex h-8 items-end space-x-1" aria-live="polite" aria-atomic="true">
                            <p className="text-sm text-red-500 font-bold">{errorMessage}</p>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
