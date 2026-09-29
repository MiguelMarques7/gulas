import React from 'react';
import { ManagedOrderItem } from '@/actions/order-management';
import { MessageSquareText } from 'lucide-react';

interface OrderItemsListProps {
  items: ManagedOrderItem[];
}

export function OrderItemsList({ items }: OrderItemsListProps) {
  const formatPrice = (price: number) =>
    new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);

  return (
    <ul className="divide-y divide-zinc-100 py-1">
      {items.map((item) => {
        const lineTotal = item.unitPrice * item.quantity;
        return (
          <li key={item.id} className="py-2.5 first:pt-1 last:pb-1">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5 min-w-0">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-gulas-cream border border-gulas-gray-200 text-xs font-black text-gulas-dark flex-shrink-0">
                  {item.quantity}x
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gulas-dark leading-snug">
                    {item.productName}
                  </p>
                  {item.quantity > 1 && (
                    <span className="text-xs text-gulas-gray-500 font-medium">
                      {formatPrice(item.unitPrice)} / un.
                    </span>
                  )}
                </div>
              </div>

              <span className="text-sm font-bold text-gulas-dark flex-shrink-0 text-right">
                {formatPrice(lineTotal)}
              </span>
            </div>

            {item.notes && (
              <div className="mt-1.5 ml-8.5 flex items-start gap-1.5 p-1.5 rounded-lg bg-amber-50/70 border border-amber-200/60 text-xs text-amber-900 font-medium">
                <MessageSquareText className="w-3.5 h-3.5 text-amber-700 flex-shrink-0 mt-0.5" />
                <span className="leading-tight">
                  <strong className="font-semibold">Obs:</strong> {item.notes}
                </span>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
