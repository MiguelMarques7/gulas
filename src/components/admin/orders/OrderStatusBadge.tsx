import React from 'react';
import { OrderStatus } from '@/types/restaurant';
import {
  Clock,
  CheckCircle2,
  Flame,
  BellRing,
  Check,
  XCircle,
} from 'lucide-react';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md';
}

const STATUS_CONFIG: Record<
  OrderStatus,
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    className: string;
    dotClassName: string;
  }
> = {
  pending: {
    label: 'A aguardar',
    icon: Clock,
    className: 'bg-amber-50 text-amber-800 border-amber-200/80',
    dotClassName: 'bg-amber-500 animate-pulse',
  },
  accepted: {
    label: 'Aceite',
    icon: CheckCircle2,
    className: 'bg-blue-50 text-blue-800 border-blue-200/80',
    dotClassName: 'bg-blue-500',
  },
  preparing: {
    label: 'Em preparação',
    icon: Flame,
    className: 'bg-orange-50 text-orange-800 border-orange-200/80',
    dotClassName: 'bg-orange-500 animate-pulse',
  },
  ready: {
    label: 'Pronto',
    icon: BellRing,
    className: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
    dotClassName: 'bg-emerald-500',
  },
  completed: {
    label: 'Concluído',
    icon: Check,
    className: 'bg-zinc-100 text-zinc-700 border-zinc-200',
    dotClassName: 'bg-zinc-400',
  },
  cancelled: {
    label: 'Cancelado',
    icon: XCircle,
    className: 'bg-rose-50 text-rose-800 border-rose-200',
    dotClassName: 'bg-rose-500',
  },
};

export function OrderStatusBadge({ status, size = 'md' }: OrderStatusBadgeProps) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const Icon = config.icon;

  const sizeClasses =
    size === 'sm'
      ? 'px-2 py-0.5 text-xs gap-1.5'
      : 'px-2.5 py-1 text-xs sm:text-sm font-bold gap-1.5';

  return (
    <span
      className={`inline-flex items-center font-bold rounded-full border transition-all ${config.className} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotClassName}`} />
      <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
      <span>{config.label}</span>
    </span>
  );
}
