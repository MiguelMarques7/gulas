import { createBrowserClient } from '@supabase/ssr';
import { Database } from './types';

let clientInstance: ReturnType<typeof createBrowserClient<Database>> | null = null;

/**
 * Retorna uma instância singleton do cliente Supabase para o browser.
 * Garante preservação de sessão, sincronização de tokens e reaproveitamento do WebSocket Realtime.
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  if (!clientInstance) {
    clientInstance = createBrowserClient<Database>(supabaseUrl, supabaseKey);
  }

  return clientInstance;
}
