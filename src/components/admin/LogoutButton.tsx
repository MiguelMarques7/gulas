'use client';

import React, { useTransition } from 'react';
import { logoutStaff } from '@/actions/auth';
import { LogOut, Loader2 } from 'lucide-react';

export function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutStaff();
    });
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      title="Terminar Sessão"
      className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-gulas-gray-700 hover:text-red-600 hover:bg-red-50 border border-gulas-gray-200 hover:border-red-200 transition-all cursor-pointer disabled:opacity-50"
    >
      {isPending ? (
        <Loader2 className="w-4 h-4 animate-spin text-red-600" />
      ) : (
        <LogOut className="w-4 h-4" />
      )}
      <span className="hidden sm:inline">Terminar Sessão</span>
    </button>
  );
}
