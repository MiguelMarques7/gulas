'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { loginStaff } from '@/actions/auth';
import { Lock, Mail, AlertCircle, Loader2, ChefHat } from 'lucide-react';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage('Por favor preencha todos os campos.');
      return;
    }

    startTransition(async () => {
      try {
        const result = await loginStaff({ email, password });
        if (!result.success) {
          setErrorMessage(result.error || 'Erro ao iniciar sessão.');
        } else {
          router.push('/admin/orders');
          router.refresh();
        }
      } catch {
        setErrorMessage('Ocorreu um erro inesperado. Tente novamente.');
      }
    });
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gulas-gray-200 p-8 sm:p-10">
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-14 h-14 bg-gulas-green-subtle rounded-2xl flex items-center justify-center text-gulas-green mb-4 border border-gulas-green-border">
          <ChefHat className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-gulas-dark tracking-tight">
          Gulas Backoffice
        </h1>
        <p className="text-sm text-gulas-gray-500 mt-1">
          Acesso reservado a funcionários e gerência
        </p>
      </div>

      {/* Error alert */}
      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700 text-sm animate-in fade-in slide-in-from-top-1">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-600" />
          <p className="font-medium leading-relaxed">{errorMessage}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-bold uppercase tracking-wider text-gulas-gray-700 mb-2"
          >
            Email de Acesso
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gulas-gray-400">
              <Mail className="w-5 h-5" />
            </div>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              disabled={isPending}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="funcionario@gulas.pt"
              className="w-full pl-11 pr-4 py-3 bg-gulas-cream/60 border border-gulas-gray-300 rounded-xl text-gulas-dark text-sm focus:outline-none focus:ring-2 focus:ring-gulas-green focus:border-transparent transition-all disabled:opacity-50"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-xs font-bold uppercase tracking-wider text-gulas-gray-700 mb-2"
          >
            Palavra-passe
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gulas-gray-400">
              <Lock className="w-5 h-5" />
            </div>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              disabled={isPending}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-11 pr-4 py-3 bg-gulas-cream/60 border border-gulas-gray-300 rounded-xl text-gulas-dark text-sm focus:outline-none focus:ring-2 focus:ring-gulas-green focus:border-transparent transition-all disabled:opacity-50"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full mt-2 py-3.5 px-4 bg-gulas-green hover:bg-gulas-green-hover active:scale-[0.99] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>A verificar credenciais...</span>
            </>
          ) : (
            <span>Entrar no Painel</span>
          )}
        </button>
      </form>
    </div>
  );
}
