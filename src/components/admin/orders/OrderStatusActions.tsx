import React, { useState } from 'react';
import { OrderStatus } from '@/types/restaurant';
import { ValidNextStatus } from '@/lib/validations/order-management';
import {
  CheckCircle2,
  Flame,
  BellRing,
  Check,
  XCircle,
  Loader2,
} from 'lucide-react';

interface OrderStatusActionsProps {
  status: OrderStatus;
  isUpdating: boolean;
  onUpdateStatus: (nextStatus: ValidNextStatus) => Promise<void>;
}

export function OrderStatusActions({
  status,
  isUpdating,
  onUpdateStatus,
}: OrderStatusActionsProps) {
  const [activeNextStatus, setActiveNextStatus] =
    useState<ValidNextStatus | null>(null);
  const [isConfirmingCancel, setIsConfirmingCancel] = useState(false);

  const handleAction = async (nextStatus: ValidNextStatus) => {
    if (isUpdating) return;
    try {
      setActiveNextStatus(nextStatus);
      await onUpdateStatus(nextStatus);
    } finally {
      setActiveNextStatus(null);
      setIsConfirmingCancel(false);
    }
  };

  if (status === 'completed' || status === 'cancelled') {
    return null;
  }

  return (
    <div className="pt-3 border-t border-gulas-gray-200 flex flex-col gap-2">
      {/* Cancellation confirmation sub-panel */}
      {isConfirmingCancel ? (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-2.5 animate-in fade-in duration-150">
          <p className="text-xs font-bold text-rose-900">
            Confirmas o cancelamento deste pedido?
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isUpdating}
              onClick={() => handleAction('cancelled')}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
            >
              {isUpdating && activeNextStatus === 'cancelled' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <XCircle className="w-3.5 h-3.5" />
              )}
              <span>Sim, Cancelar</span>
            </button>
            <button
              type="button"
              disabled={isUpdating}
              onClick={() => setIsConfirmingCancel(false)}
              className="py-2 px-3 rounded-lg bg-white border border-rose-200 text-rose-800 hover:bg-rose-100/60 text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
            >
              Voltar
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* Primary Action Button by Status */}
          {status === 'pending' && (
            <button
              type="button"
              disabled={isUpdating}
              onClick={() => handleAction('accepted')}
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs sm:text-sm font-bold shadow-xs transition-all disabled:opacity-50 cursor-pointer"
            >
              {isUpdating && activeNextStatus === 'accepted' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              <span>Aceitar Pedido</span>
            </button>
          )}

          {status === 'accepted' && (
            <button
              type="button"
              disabled={isUpdating}
              onClick={() => handleAction('preparing')}
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 active:scale-[0.98] text-white text-xs sm:text-sm font-bold shadow-xs transition-all disabled:opacity-50 cursor-pointer"
            >
              {isUpdating && activeNextStatus === 'preparing' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Flame className="w-4 h-4" />
              )}
              <span>Iniciar Preparação</span>
            </button>
          )}

          {status === 'preparing' && (
            <button
              type="button"
              disabled={isUpdating}
              onClick={() => handleAction('ready')}
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-xs sm:text-sm font-bold shadow-xs transition-all disabled:opacity-50 cursor-pointer"
            >
              {isUpdating && activeNextStatus === 'ready' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <BellRing className="w-4 h-4" />
              )}
              <span>Marcar como Pronto</span>
            </button>
          )}

          {status === 'ready' && (
            <button
              type="button"
              disabled={isUpdating}
              onClick={() => handleAction('completed')}
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gulas-dark hover:bg-black active:scale-[0.98] text-white text-xs sm:text-sm font-bold shadow-xs transition-all disabled:opacity-50 cursor-pointer"
            >
              {isUpdating && activeNextStatus === 'completed' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              <span>Concluir Entrega</span>
            </button>
          )}

          {/* Secondary / Cancel Action (Allowed for pending, accepted, preparing) */}
          {(status === 'pending' ||
            status === 'accepted' ||
            status === 'preparing') && (
            <button
              type="button"
              disabled={isUpdating}
              onClick={() => setIsConfirmingCancel(true)}
              className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 hover:border-rose-300 text-xs sm:text-sm font-bold transition-all disabled:opacity-50 cursor-pointer"
              title="Cancelar pedido"
            >
              <XCircle className="w-4 h-4 text-rose-500" />
              <span>Cancelar</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
