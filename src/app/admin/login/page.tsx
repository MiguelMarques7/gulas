import React from 'react';
import { redirect } from 'next/navigation';
import { getAuthenticatedStaff } from '@/lib/auth/staff';
import { LoginForm } from './LoginForm';

export const metadata = {
  title: 'Iniciar Sessão — Gulas Admin',
  description: 'Acesso reservado ao painel administrativo do Gulas.',
};

export default async function AdminLoginPage() {
  const staff = await getAuthenticatedStaff();

  // If already authenticated and authorized, redirect to orders
  if (staff) {
    redirect('/admin/orders');
  }

  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8">
      <LoginForm />
    </div>
  );
}
