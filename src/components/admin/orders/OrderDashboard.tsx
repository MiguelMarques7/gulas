'use client';

import React, { useState, useCallback, useTransition, useRef } from 'react';
import {
  ManagedOrder,
  getActiveOrders,
  updateOrderStatus,
} from '@/actions/order-management';
import { ValidNextStatus } from '@/lib/validations/order-management';
import { useOrdersRealtime } from '@/hooks/useOrdersRealtime';
import { OrderCard } from './OrderCard';
import {
  RotateCcw,
  UtensilsCrossed,
  Clock,
  Flame,
  BellRing,
  AlertCircle,
  Loader2,
  Inbox,
  Radio,
} from 'lucide-react';

interface OrderDashboardProps {
  restaurantId: string;
  restaurantName: string;
  restaurantSlug: string;
  initialOrders: ManagedOrder[];
}

export function OrderDashboard({
  restaurantId,
  restaurantName,
  restaurantSlug,
  initialOrders,
}: OrderDashboardProps) {
  const [orders, setOrders] = useState<ManagedOrder[]>(initialOrders);
  const [isLoading, setIsLoading] = useState(false);
  const [dashboardError, setDashboardError] = useState<string | null>(null);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date>(new Date());
  const [updatingMap, setUpdatingMap] = useState<Record<string, boolean>>({});
  const [orderErrorMap, setOrderErrorMap] = useState<Record<string, string | null>>({});
  const [newOrderIds, setNewOrderIds] = useState<Set<string>>(new Set());

  const previousOrderIdsRef = useRef<Set<string>>(
    new Set(initialOrders.map((o) => o.id))
  );

  const [isRefreshing, startRefreshTransition] = useTransition();

  // Fetch active orders from server
  const fetchOrders = useCallback(async () => {
    setDashboardError(null);
    try {
      const result = await getActiveOrders();
      if (!result.success) {
        setDashboardError(result.error.message);
      } else {
        // Detect newly arrived orders for visual highlight
        const currentIds = previousOrderIdsRef.current;
        const newlyAdded = new Set<string>();

        result.data.forEach((o) => {
          if (!currentIds.has(o.id)) {
            newlyAdded.add(o.id);
          }
        });

        if (newlyAdded.size > 0) {
          setNewOrderIds((prev) => new Set([...prev, ...newlyAdded]));
          // Remove highlight after 10 seconds
          setTimeout(() => {
            setNewOrderIds((prev) => {
              const updated = new Set(prev);
              newlyAdded.forEach((id) => updated.delete(id));
              return updated;
            });
          }, 10000);
        }

        previousOrderIdsRef.current = new Set(result.data.map((o) => o.id));
        setOrders(result.data);
        setLastRefreshedAt(new Date());
      }
    } catch {
      setDashboardError('Não foi possível carregar os pedidos.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Supabase Realtime Subscription Hook
  const { isConnected } = useOrdersRealtime({
    restaurantId,
    onOrdersChange: fetchOrders,
  });

  // Manual refresh handler
  const handleManualRefresh = () => {
    startRefreshTransition(async () => {
      await fetchOrders();
    });
  };

  // Status transition handler
  const handleUpdateStatus = async (
    orderId: string,
    nextStatus: ValidNextStatus
  ) => {
    // 1. Mark order as updating and clear past card-level error
    setUpdatingMap((prev) => ({ ...prev, [orderId]: true }));
    setOrderErrorMap((prev) => ({ ...prev, [orderId]: null }));

    try {
      const result = await updateOrderStatus(orderId, nextStatus);

      if (!result.success) {
        setOrderErrorMap((prev) => ({
          ...prev,
          [orderId]: result.error.message,
        }));
        return;
      }

      // 2. Remove highlight if active
      setNewOrderIds((prev) => {
        const next = new Set(prev);
        next.delete(orderId);
        return next;
      });

      // 3. If status is terminal ('completed' or 'cancelled'), remove from active list
      if (nextStatus === 'completed' || nextStatus === 'cancelled') {
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
      } else {
        // Otherwise, update existing order in place
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? result.data : o))
        );
      }
    } catch {
      setOrderErrorMap((prev) => ({
        ...prev,
        [orderId]: 'Ocorreu um erro ao atualizar o pedido.',
      }));
    } finally {
      setUpdatingMap((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  // Summary Metrics Counters
  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const preparingCount = orders.filter(
    (o) => o.status === 'accepted' || o.status === 'preparing'
  ).length;
  const readyCount = orders.filter((o) => o.status === 'ready').length;
  const totalActiveCount = orders.length;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gulas-gray-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-gulas-dark tracking-tight">
              Gestão de Pedidos
            </h1>
            <span className="hidden sm:inline-flex text-xs font-mono bg-gulas-gray-100 text-gulas-gray-600 px-2 py-0.5 rounded-md">
              /{restaurantSlug}
            </span>

            {/* Realtime Live Status Badge */}
            <div
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border transition-all ${
                isConnected
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-zinc-100 text-zinc-600 border-zinc-200'
              }`}
              title={
                isConnected
                  ? 'Sincronização em tempo real ativa'
                  : 'A ligar ao canal em tempo real...'
              }
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isConnected
                    ? 'bg-emerald-500 animate-pulse'
                    : 'bg-zinc-400'
                }`}
              />
              <span className="hidden sm:inline">
                {isConnected ? 'Tempo Real Ativo' : 'A Conectar...'}
              </span>
              <Radio className="w-3 h-3 sm:hidden" />
            </div>
          </div>
          <p className="text-xs sm:text-sm text-gulas-gray-500 mt-0.5">
            Monitor de Cozinha e Sala (KDS) &bull; {restaurantName}
          </p>
        </div>

        {/* Refresh button & last updated info */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <span className="text-xs text-gulas-gray-400 hidden sm:inline-block">
            Última atualização:{' '}
            {lastRefreshedAt.toLocaleTimeString('pt-PT', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })}
          </span>

          <button
            type="button"
            disabled={isLoading || isRefreshing}
            onClick={handleManualRefresh}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gulas-gray-200 hover:bg-gulas-gray-100 text-gulas-dark text-xs sm:text-sm font-bold shadow-xs transition-all disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:outline-none cursor-pointer"
            aria-label="Atualizar lista de pedidos"
          >
            <RotateCcw
              className={`w-4 h-4 text-gulas-gray-600 ${
                isLoading || isRefreshing ? 'animate-spin' : ''
              }`}
            />
            <span>Atualizar</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Ativos */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gulas-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gulas-gray-400">
              Total Ativos
            </span>
            <p className="text-2xl sm:text-3xl font-black text-gulas-dark mt-0.5">
              {totalActiveCount}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-600">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
        </div>

        {/* A Aguardar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-amber-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
              A Aguardar
            </span>
            <p className="text-2xl sm:text-3xl font-black text-amber-900 mt-0.5">
              {pendingCount}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Em Preparação */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-orange-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
              Em Preparação
            </span>
            <p className="text-2xl sm:text-3xl font-black text-orange-900 mt-0.5">
              {preparingCount}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
            <Flame className="w-5 h-5" />
          </div>
        </div>

        {/* Prontos */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-emerald-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Prontos p/ Entrega
            </span>
            <p className="text-2xl sm:text-3xl font-black text-emerald-900 mt-0.5">
              {readyCount}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <BellRing className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-center space-y-3">
          <Loader2 className="w-8 h-8 text-gulas-green animate-spin" />
          <p className="text-sm font-bold text-gulas-dark">
            Carregando pedidos...
          </p>
          <p className="text-xs text-gulas-gray-500">
            A sincronizar dados da cozinha e sala
          </p>
        </div>
      ) : dashboardError ? (
        <div
          role="alert"
          className="bg-rose-50 border border-rose-200 rounded-2xl p-6 sm:p-8 text-center max-w-lg mx-auto space-y-3"
        >
          <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-rose-950">
            Não foi possível carregar os pedidos
          </h3>
          <p className="text-xs text-rose-700">{dashboardError}</p>
          <button
            type="button"
            onClick={fetchOrders}
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold focus-visible:ring-2 focus-visible:ring-rose-800 focus-visible:outline-none transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Tentar Novamente</span>
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white border border-gulas-gray-200 rounded-2xl p-10 sm:p-14 text-center max-w-lg mx-auto shadow-xs space-y-3">
          <div className="w-16 h-16 bg-gulas-cream text-gulas-gray-400 rounded-2xl flex items-center justify-center mx-auto border border-gulas-gray-200">
            <Inbox className="w-8 h-8 text-gulas-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gulas-dark">
            Não existem pedidos ativos.
          </h3>
          <p className="text-xs sm:text-sm text-gulas-gray-500 max-w-xs mx-auto leading-relaxed">
            Assim que os clientes submeterem pedidos a partir do menu digital das
            mesas, eles surgirão aqui automaticamente em tempo real.
          </p>
          <button
            type="button"
            onClick={handleManualRefresh}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-bold focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:outline-none transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Verificar Novos Pedidos</span>
          </button>
        </div>
      ) : (
        /* Orders Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-5">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              isNew={newOrderIds.has(order.id)}
              isUpdating={Boolean(updatingMap[order.id])}
              error={orderErrorMap[order.id]}
              onClearError={() =>
                setOrderErrorMap((prev) => ({ ...prev, [order.id]: null }))
              }
              onUpdateStatus={handleUpdateStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
}
