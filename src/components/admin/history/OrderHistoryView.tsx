'use client';

import React, { useState, useCallback, useTransition } from 'react';
import { ManagedOrder, getOrderHistory } from '@/actions/order-management';
import { OrderStatusBadge } from '../orders/OrderStatusBadge';
import { OrderHistoryDetailModal } from './OrderHistoryDetailModal';
import {
  RotateCcw,
  History,
  CheckCircle2,
  XCircle,
  Eye,
  AlertCircle,
  Inbox,
  Calendar,
} from 'lucide-react';

interface OrderHistoryViewProps {
  restaurantName: string;
  restaurantSlug: string;
  initialOrders: ManagedOrder[];
}

export function OrderHistoryView({
  restaurantName,
  restaurantSlug,
  initialOrders,
}: OrderHistoryViewProps) {
  const [orders, setOrders] = useState<ManagedOrder[]>(initialOrders);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<ManagedOrder | null>(null);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date>(new Date());

  const [isRefreshing, startRefreshTransition] = useTransition();

  const fetchHistory = useCallback(async () => {
    setError(null);
    try {
      const result = await getOrderHistory();
      if (!result.success) {
        setError(result.error.message);
      } else {
        setOrders(result.data);
        setLastRefreshedAt(new Date());
      }
    } catch {
      setError('Não foi possível carregar o histórico de pedidos.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleManualRefresh = () => {
    startRefreshTransition(async () => {
      await fetchHistory();
    });
  };

  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('pt-PT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch {
      return dateString;
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);

  const completedCount = orders.filter((o) => o.status === 'completed').length;
  const cancelledCount = orders.filter((o) => o.status === 'cancelled').length;
  const totalHistoryCount = orders.length;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gulas-gray-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-gulas-dark tracking-tight">
              Histórico de Pedidos
            </h1>
            <span className="hidden sm:inline-flex text-xs font-mono bg-gulas-gray-100 text-gulas-gray-600 px-2 py-0.5 rounded-md">
              /{restaurantSlug}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gulas-gray-500 mt-0.5">
            Registo de pedidos concluídos e cancelados &bull; {restaurantName}
          </p>
        </div>

        {/* Refresh button & info */}
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
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gulas-gray-200 hover:bg-gulas-gray-100 text-gulas-dark text-xs sm:text-sm font-bold shadow-xs transition-all disabled:opacity-50 cursor-pointer"
            aria-label="Atualizar histórico"
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

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {/* Total Finalizados */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gulas-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gulas-gray-400">
              Total no Histórico
            </span>
            <p className="text-2xl sm:text-3xl font-black text-gulas-dark mt-0.5">
              {totalHistoryCount}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-600">
            <History className="w-5 h-5" />
          </div>
        </div>

        {/* Concluídos */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-zinc-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-600">
              Concluídos com Sucesso
            </span>
            <p className="text-2xl sm:text-3xl font-black text-zinc-900 mt-0.5">
              {completedCount}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-700">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* Cancelados */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-rose-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
              Cancelados
            </span>
            <p className="text-2xl sm:text-3xl font-black text-rose-900 mt-0.5">
              {cancelledCount}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
            <XCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {error ? (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 sm:p-8 text-center max-w-lg mx-auto space-y-3">
          <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-rose-950">
            Não foi possível carregar o histórico
          </h3>
          <p className="text-xs text-rose-700">{error}</p>
          <button
            type="button"
            onClick={fetchHistory}
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all cursor-pointer"
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
            Não existem pedidos no histórico
          </h3>
          <p className="text-xs sm:text-sm text-gulas-gray-500 max-w-xs mx-auto leading-relaxed">
            Os pedidos concluídos ou cancelados aparecerão arquivados nesta lista.
          </p>
          <button
            type="button"
            onClick={handleManualRefresh}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-bold transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Atualizar Lista</span>
          </button>
        </div>
      ) : (
        /* Orders List & Table */
        <div className="bg-white rounded-2xl border border-gulas-gray-200 shadow-xs overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50/80 border-b border-gulas-gray-200 text-xs font-bold text-gulas-gray-500 uppercase tracking-wider">
                <tr>
                  <th scope="col" className="px-5 py-3.5">
                    Pedido
                  </th>
                  <th scope="col" className="px-5 py-3.5">
                    Mesa
                  </th>
                  <th scope="col" className="px-5 py-3.5">
                    Data / Hora
                  </th>
                  <th scope="col" className="px-5 py-3.5">
                    Artigos
                  </th>
                  <th scope="col" className="px-5 py-3.5">
                    Estado
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-right">
                    Total
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-center">
                    Ação
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gulas-gray-100">
                {orders.map((order) => {
                  const totalItemsCount = order.items.reduce(
                    (acc, item) => acc + item.quantity,
                    0
                  );
                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-zinc-50/60 transition-colors"
                    >
                      <td className="px-5 py-4 font-black text-gulas-dark">
                        #{order.orderNumber}
                      </td>
                      <td className="px-5 py-4 font-bold text-gulas-dark">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-zinc-100 text-xs font-bold">
                          Mesa {order.tableNumber}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-gulas-gray-500 font-medium">
                        {formatDateTime(order.createdAt)}
                      </td>
                      <td className="px-5 py-4 text-xs text-gulas-dark font-medium">
                        <span className="font-bold">{totalItemsCount}x</span>{' '}
                        artigo{totalItemsCount > 1 ? 's' : ''}
                      </td>
                      <td className="px-5 py-4">
                        <OrderStatusBadge status={order.status} size="sm" />
                      </td>
                      <td className="px-5 py-4 font-black text-gulas-dark text-right">
                        {formatPrice(order.total)}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-gulas-dark text-xs font-bold transition-all cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Ver Detalhes</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="md:hidden divide-y divide-gulas-gray-100">
            {orders.map((order) => {
              const totalItemsCount = order.items.reduce(
                (acc, item) => acc + item.quantity,
                0
              );
              return (
                <div key={order.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-black text-gulas-dark">
                          #{order.orderNumber}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-zinc-100 text-xs font-bold">
                          Mesa {order.tableNumber}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gulas-gray-500 font-medium mt-1">
                        <Calendar className="w-3.5 h-3.5 text-gulas-gray-400" />
                        <span>{formatDateTime(order.createdAt)}</span>
                      </div>
                    </div>
                    <OrderStatusBadge status={order.status} size="sm" />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-gulas-gray-500">
                      {totalItemsCount} artigo{totalItemsCount > 1 ? 's' : ''} &bull;{' '}
                      <strong className="text-sm font-black text-gulas-dark">
                        {formatPrice(order.total)}
                      </strong>
                    </span>

                    <button
                      type="button"
                      onClick={() => setSelectedOrder(order)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 text-white text-xs font-bold transition-all cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Detalhes</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <OrderHistoryDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
}
