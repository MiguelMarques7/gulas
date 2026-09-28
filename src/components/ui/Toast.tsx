'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { Check } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage } = useCart();

  if (!toastMessage) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-3 duration-200 pointer-events-none max-w-[90vw]">
      <div className="flex items-center gap-2 px-3.5 py-2 bg-[#141619] text-white text-xs font-semibold rounded-xl shadow-lg border border-zinc-800">
        <span className="w-4 h-4 rounded-full bg-[#15803D] text-white flex items-center justify-center shrink-0">
          <Check className="w-2.5 h-2.5 stroke-[3]" />
        </span>
        <span className="truncate">{toastMessage}</span>
      </div>
    </div>
  );
};
