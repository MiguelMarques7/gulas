import React from 'react';
import { getAuthenticatedStaff } from '@/lib/auth/staff';
import { redirect } from 'next/navigation';
import {
  UtensilsCrossed,
  Store,
  UserCheck,
  ShieldCheck,
  Clock,
} from 'lucide-react';

export const metadata = {
  title: 'Gestão de Pedidos — Gulas Admin',
};

export default async function AdminOrdersPage() {
  const staff = await getAuthenticatedStaff();

  if (!staff) {
    redirect('/admin/login');
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gulas-gray-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gulas-dark tracking-tight">
            Gestão de Pedidos
          </h1>
          <p className="text-sm text-gulas-gray-500 mt-1">
            Painel de controlo de pedidos da cozinha e sala
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Sessão Segura & Ativa
        </div>
      </div>

      {/* Authenticated Staff & Restaurant Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Restaurant Card */}
        <div className="bg-white p-5 rounded-2xl border border-gulas-gray-200 shadow-sm flex items-start gap-4">
          <div className="w-11 h-11 bg-gulas-green-subtle text-gulas-green rounded-xl flex items-center justify-center flex-shrink-0 border border-gulas-green-border">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gulas-gray-400">
              Restaurante Vinculado
            </span>
            <h3 className="text-base font-bold text-gulas-dark mt-0.5">
              {staff.restaurant.name}
            </h3>
            <p className="text-xs text-gulas-gray-500 mt-0.5">
              Slug: <span className="font-mono text-gulas-dark">{staff.restaurant.slug}</span>
            </p>
          </div>
        </div>

        {/* Staff Profile Card */}
        <div className="bg-white p-5 rounded-2xl border border-gulas-gray-200 shadow-sm flex items-start gap-4">
          <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 border border-blue-200">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gulas-gray-400">
              Utilizador
            </span>
            <h3 className="text-base font-bold text-gulas-dark mt-0.5">
              {staff.profile.fullName || 'Sem nome associado'}
            </h3>
            <p className="text-xs text-gulas-gray-500 mt-0.5 truncate max-w-[200px]">
              {staff.email}
            </p>
          </div>
        </div>

        {/* Role & Security Card */}
        <div className="bg-white p-5 rounded-2xl border border-gulas-gray-200 shadow-sm flex items-start gap-4">
          <div className="w-11 h-11 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 border border-purple-200">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gulas-gray-400">
              Nível de Permissão
            </span>
            <h3 className="text-base font-bold text-gulas-dark mt-0.5 capitalize">
              {staff.profile.role}
            </h3>
            <p className="text-xs text-gulas-gray-500 mt-0.5">
              Autorizado para gestão de pedidos
            </p>
          </div>
        </div>
      </div>

      {/* M4.1 Status / Placeholder Card */}
      <div className="bg-white rounded-2xl border border-gulas-gray-200 p-8 text-center max-w-2xl mx-auto my-8 shadow-sm">
        <div className="w-16 h-16 bg-gulas-cream text-gulas-dark rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gulas-gray-200">
          <UtensilsCrossed className="w-8 h-8 text-gulas-gray-500" />
        </div>
        <h2 className="text-xl font-bold text-gulas-dark">
          Área Administrativa Autenticada
        </h2>
        <p className="text-sm text-gulas-gray-600 mt-2 leading-relaxed max-w-md mx-auto">
          A autenticação e autorização de staff (M4.1) foram concluídas com sucesso.
          O painel de pedidos em tempo real (KDS) e as transições de estado serão ativados nas etapas seguintes (M4.2 a M4.5).
        </p>
        <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-gulas-gray-100 rounded-xl text-xs font-mono text-gulas-gray-600">
          <Clock className="w-4 h-4 text-gulas-gray-500" />
          M4.1 Concluído — Pronto para M4.2 (Realtime & Gestão de Pedidos)
        </div>
      </div>
    </div>
  );
}
