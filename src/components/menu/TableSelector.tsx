'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { mockTables } from '@/data/mockRestaurant';
import { UtensilsCrossed, X, Check } from 'lucide-react';

interface TableSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TableSelectorModal: React.FC<TableSelectorModalProps> = ({ isOpen, onClose }) => {
  const { selectedTableNumber, setSelectedTableNumber, isTableLocked } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl p-5 shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Selecionar Mesa</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isTableLocked ? (
          <p className="text-xs text-amber-400/90 bg-amber-500/10 p-3 rounded-xl border border-amber-500/20 mb-3">
            A mesa foi definida automaticamente pelo QR Code que leu na mesa.
          </p>
        ) : (
          <p className="text-xs text-zinc-400 mb-3">
            Escolha a mesa onde está sentado para a nossa equipa lhe entregar o pedido:
          </p>
        )}

        <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
          {mockTables.map((t) => {
            const isSelected = selectedTableNumber === t.number;
            return (
              <button
                key={t.id}
                disabled={isTableLocked}
                onClick={() => {
                  setSelectedTableNumber(t.number);
                  onClose();
                }}
                className={`p-3 rounded-xl text-left border transition-all text-xs font-medium flex items-center justify-between ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                }`}
              >
                <span>{t.name}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
