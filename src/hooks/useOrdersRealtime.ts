'use client';

import { useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

interface UseOrdersRealtimeOptions {
  restaurantId: string;
  onOrdersChange: () => void | Promise<void>;
  debounceMs?: number;
}

export function useOrdersRealtime({
  restaurantId,
  onOrdersChange,
  debounceMs = 300,
}: UseOrdersRealtimeOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const callbackRef = useRef(onOrdersChange);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Keep latest callback reference without re-triggering subscription effect
  useEffect(() => {
    callbackRef.current = onOrdersChange;
  }, [onOrdersChange]);

  useEffect(() => {
    if (!restaurantId) return;

    const supabase = createClient();
    if (!supabase) return;

    let isMounted = true;
    let channel: RealtimeChannel | null = null;

    // Helper to debounce multiple events into a single server refresh
    const triggerDebouncedUpdate = (eventName: string) => {
      if (process.env.NODE_ENV !== 'production') {
        console.log(
          `[Realtime KDS] Evento ${eventName} recebido para restaurant_id=${restaurantId}. A solicitar dados autorizados ao servidor...`
        );
      }
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        callbackRef.current();
      }, debounceMs);
    };

    const setupSubscription = async () => {
      // 1. Obter sessão atual autenticada
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();
      const session = sessionData?.session;

      if (sessionError || !session) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn(
            '[Realtime KDS] Nenhuma sessão ativa encontrada. Subscrição Realtime suspensa.'
          );
        }
        if (isMounted) setIsConnected(false);
        return;
      }

      if (process.env.NODE_ENV !== 'production') {
        console.log(
          '[Realtime KDS] Sessão ativa encontrada. A configurar autenticação do WebSocket Realtime...'
        );
      }

      // 2. Configurar o token JWT no cliente Realtime antes de subscrever
      if (session.access_token) {
        await supabase.realtime.setAuth(session.access_token);
      }

      if (!isMounted) return;

      // 3. Criar canal único por restaurante
      const channelName = `kds-orders-${restaurantId}`;
      channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'orders',
            filter: `restaurant_id=eq.${restaurantId}`,
          },
          () => {
            triggerDebouncedUpdate('INSERT');
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'orders',
            filter: `restaurant_id=eq.${restaurantId}`,
          },
          () => {
            triggerDebouncedUpdate('UPDATE');
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'DELETE',
            schema: 'public',
            table: 'orders',
            filter: `restaurant_id=eq.${restaurantId}`,
          },
          () => {
            triggerDebouncedUpdate('DELETE');
          }
        )
        .subscribe((status) => {
          if (!isMounted) return;

          if (process.env.NODE_ENV !== 'production') {
            console.log(`[Realtime KDS] Subscription status: ${status}`);
          }

          if (status === 'SUBSCRIBED') {
            setIsConnected(true);
          } else if (
            status === 'CLOSED' ||
            status === 'CHANNEL_ERROR' ||
            status === 'TIMED_OUT'
          ) {
            setIsConnected(false);
          }
        });
    };

    setupSubscription();

    // 4. Escutar alterações de autenticação (refresh de token, novo login)
    const {
      data: { subscription: authListener },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (process.env.NODE_ENV !== 'production') {
        console.log(`[Realtime KDS] AuthStateChange: ${event}`);
      }
      if (newSession?.access_token) {
        await supabase.realtime.setAuth(newSession.access_token);
      } else if (event === 'SIGNED_OUT') {
        if (channel) {
          supabase.removeChannel(channel);
          channel = null;
        }
        if (isMounted) setIsConnected(false);
      }
    });

    // Cleanup
    return () => {
      isMounted = false;
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      authListener.unsubscribe();
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [restaurantId, debounceMs]);

  return { isConnected };
}
