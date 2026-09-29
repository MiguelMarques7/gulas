'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, History } from 'lucide-react';

export function AdminNav() {
  const pathname = usePathname();

  const isKdsActive = pathname === '/admin/orders';
  const isHistoryActive = pathname.startsWith('/admin/orders/history');

  return (
    <nav className="flex items-center gap-1.5 p-1 bg-gulas-gray-100 rounded-xl border border-gulas-gray-200">
      <Link
        href="/admin/orders"
        className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
          isKdsActive
            ? 'bg-white text-gulas-dark shadow-xs'
            : 'text-gulas-gray-500 hover:text-gulas-dark'
        }`}
      >
        <LayoutGrid className="w-4 h-4" />
        <span>Monitor KDS</span>
      </Link>

      <Link
        href="/admin/orders/history"
        className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
          isHistoryActive
            ? 'bg-white text-gulas-dark shadow-xs'
            : 'text-gulas-gray-500 hover:text-gulas-dark'
        }`}
      >
        <History className="w-4 h-4" />
        <span>Histórico</span>
      </Link>
    </nav>
  );
}
