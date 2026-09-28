'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { formatCurrency, mockRestaurant } from '@/data/mockRestaurant';
import { CheckCircle2, UtensilsCrossed, X } from 'lucide-react';

export const OrderConfirmationModal: React.FC = () => {
  const {
    activeOrder,
    isOrderSuccessModalOpen,
    setIsOrderSuccessModalOpen,
  } = useCart();

  if (!isOrderSuccessModalOpen || !activeOrder) return null;

  const steps = [
    { label: 'Enviado', status: 'completed' },
    { label: 'Aceite', status: 'current' },
    { label: 'Em preparação', status: 'upcoming' },
    { label: 'Pronto', status: 'upcoming' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white border border-zinc-200 rounded-2xl p-5 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-200 relative text-[#141619]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsOrderSuccessModalOpen(false)}
          className="absolute top-4 right-4 w-7 h-7 rounded-full bg-zinc-100 text-zinc-500 hover:bg-zinc-200 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Fechar confirmação"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Success Icon & Header */}
        <div className="text-center space-y-1.5 mb-5">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#15803D] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-black text-[#141619] tracking-tight">
            Pedido Confirmado!
          </h2>
          <p className="text-xs text-zinc-500 max-w-xs mx-auto">
            O teu pedido foi enviado para a cozinha do {mockRestaurant.name} ({mockRestaurant.location}).
          </p>
        </div>

        {/* Order Details Badge Card */}
        <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-2.5 mb-4">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-zinc-200/60">
            <div>
              <span className="text-zinc-500 block text-[10px]">Identificador</span>
              <span className="text-xs font-black text-[#15803D]">
                #{activeOrder.id.replace('ord_', '')}
              </span>
            </div>
            <div className="text-right">
              <span className="text-zinc-500 block text-[10px]">Mesa</span>
              <span className="text-xs font-bold text-[#141619] flex items-center gap-1 justify-end">
                <UtensilsCrossed className="w-3 h-3 text-[#15803D]" />
                Mesa {activeOrder.tableNumber}
              </span>
            </div>
          </div>

          {/* Progress tracker */}
          <div className="pt-0.5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-zinc-700">Estado:</span>
              <span className="text-[10px] font-bold text-[#15803D] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                A aguardar preparação
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1 text-center">
              {steps.map((step, idx) => (
                <div key={idx} className="space-y-1">
                  <div
                    className={`h-1.5 rounded-full ${
                      step.status === 'completed'
                        ? 'bg-[#15803D]'
                        : step.status === 'current'
                        ? 'bg-[#15803D] opacity-60 animate-pulse'
                        : 'bg-zinc-200'
                    }`}
                  />
                  <span
                    className={`text-[9px] block truncate ${
                      step.status === 'completed' || step.status === 'current'
                        ? 'text-[#141619] font-bold'
                        : 'text-zinc-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Item summary */}
        <div className="space-y-1.5 mb-5 max-h-36 overflow-y-auto pr-1">
          <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">
            Resumo dos Artigos
          </span>
          {activeOrder.items.map(({ product, quantity }) => (
            <div key={product.id} className="flex justify-between text-xs text-zinc-700 py-1 border-b border-zinc-100">
              <span>
                {quantity}× {product.name}
              </span>
              <span className="font-bold text-[#141619]">
                {formatCurrency(product.price * quantity)}
              </span>
            </div>
          ))}
          <div className="flex justify-between text-sm font-black text-[#141619] pt-1.5">
            <span>Total</span>
            <span className="text-[#15803D]">{formatCurrency(activeOrder.total)}</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => setIsOrderSuccessModalOpen(false)}
          className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-black text-white font-bold text-xs transition-colors cursor-pointer"
        >
          Voltar ao Menu
        </button>
      </div>
    </div>
  );
};
