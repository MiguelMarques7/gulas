'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/data/mockRestaurant';
import { ShoppingBag } from 'lucide-react';

export const FloatingCartBar: React.FC = () => {
  const { itemCount, total, setIsCartOpen } = useCart();

  if (itemCount === 0) return null;

  return (
    <div className="fixed bottom-4 inset-x-0 z-40 px-4 flex justify-center animate-in slide-in-from-bottom-4 duration-200 pointer-events-none">
      <div className="w-full max-w-md pointer-events-auto">
        <button
          onClick={() => setIsCartOpen(true)}
          className="w-full py-3 px-4 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white font-bold shadow-lg shadow-emerald-900/15 flex items-center justify-between transition-all active:scale-[0.99] cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-4 h-4" />
            <span className="text-xs sm:text-sm font-bold">
              {itemCount} {itemCount === 1 ? 'artigo' : 'artigos'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-extrabold tracking-tight">
              {formatCurrency(total)}
            </span>
            <span className="text-xs opacity-80 underline underline-offset-2">
              Ver pedido
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};
