'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getAuthenticatedStaff } from '@/lib/auth/staff';
import { OrderStatus } from '@/types/restaurant';
import {
  getOrderByIdSchema,
  updateOrderStatusSchema,
  isValidStatusTransition,
} from '@/lib/validations/order-management';

// ============================================================================
// Tipos & Interfaces Estruturados
// ============================================================================

export interface ManagedOrderItem {
  id: string;
  productId: string | null;
  productName: string;
  quantity: number;
  unitPrice: number;
  notes: string | null;
}

export interface ManagedOrder {
  id: string;
  orderNumber: number;
  tableNumber: number;
  status: OrderStatus;
  subtotal: number;
  total: number;
  customerNotes: string | null;
  createdAt: string;
  updatedAt: string;
  items: ManagedOrderItem[];
}

export type OrderManagementErrorCode =
  | 'UNAUTHORIZED'
  | 'INVALID_INPUT'
  | 'ORDER_NOT_FOUND'
  | 'INVALID_STATUS_TRANSITION'
  | 'DATABASE_ERROR';

export interface OrderManagementError {
  code: OrderManagementErrorCode;
  message: string;
}

export type OrderManagementActionResult<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: OrderManagementError;
    };

// ============================================================================
// Helpers Internos de Mapeamento
// ============================================================================

interface RawOrderItemRow {
  id: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  unit_price: number;
  notes: string | null;
}

interface RawOrderRow {
  id: string;
  order_number: number;
  table_number: number;
  status: string;
  subtotal: number;
  total: number;
  customer_notes: string | null;
  created_at: string;
  updated_at: string;
  order_items: RawOrderItemRow[] | null;
}

function mapRawOrderToManagedOrder(row: RawOrderRow): ManagedOrder {
  const items: ManagedOrderItem[] = Array.isArray(row.order_items)
    ? row.order_items.map((item) => ({
        id: String(item.id),
        productId: item.product_id ? String(item.product_id) : null,
        productName: String(item.product_name),
        quantity: Number(item.quantity),
        unitPrice: Number(item.unit_price),
        notes: item.notes ? String(item.notes) : null,
      }))
    : [];

  return {
    id: String(row.id),
    orderNumber: Number(row.order_number),
    tableNumber: Number(row.table_number),
    status: row.status as OrderStatus,
    subtotal: Number(row.subtotal),
    total: Number(row.total),
    customerNotes: row.customer_notes ? String(row.customer_notes) : null,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
    items,
  };
}

// ============================================================================
// Server Actions de Gestão de Pedidos (M4.2)
// ============================================================================

/**
 * 1. getActiveOrders
 * Consulta todos os pedidos ativos pertencentes ao restaurante do staff autenticado.
 * Exclui pedidos já finalizados ('completed') ou cancelados ('cancelled').
 * Ordena por data de criação ascendente (FIFO / mais antigos primeiro).
 */
export async function getActiveOrders(): Promise<
  OrderManagementActionResult<ManagedOrder[]>
> {
  try {
    // 1. Autenticar staff e obter o restaurante associado
    const staff = await getAuthenticatedStaff();
    if (!staff) {
      return {
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Sessão expirada ou utilizador não autorizado.',
        },
      };
    }

    // 2. Obter cliente Supabase com sessão do utilizador
    const supabase = await createServerSupabaseClient();
    if (!supabase) {
      return {
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: 'Serviço de base de dados indisponível.',
        },
      };
    }

    // 3. Consultar pedidos ativos isolados pelo restaurant_id do staff
    const activeStatuses: OrderStatus[] = [
      'pending',
      'accepted',
      'preparing',
      'ready',
    ];

    const { data, error } = await supabase
      .from('orders')
      .select(
        `
        id,
        order_number,
        table_number,
        status,
        subtotal,
        total,
        customer_notes,
        created_at,
        updated_at,
        order_items (
          id,
          product_id,
          product_name,
          quantity,
          unit_price,
          notes
        )
      `
      )
      .eq('restaurant_id', staff.restaurant.id)
      .in('status', activeStatuses)
      .order('created_at', { ascending: true });

    if (error) {
      console.error(
        '[getActiveOrders] Erro ao consultar pedidos ativos:',
        error.message
      );
      return {
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: 'Ocorreu um erro ao carregar os pedidos ativos.',
        },
      };
    }

    const managedOrders = (data || []).map((row) =>
      mapRawOrderToManagedOrder(row as unknown as RawOrderRow)
    );

    return {
      success: true,
      data: managedOrders,
    };
  } catch (err: unknown) {
    console.error('[getActiveOrders] Exceção inesperada:', err);
    return {
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: 'Ocorreu um erro inesperado ao consultar os pedidos.',
      },
    };
  }
}

/**
 * 2. getOrderById
 * Obtém os detalhes completos de um pedido específico com validação de pertença
 * ao restaurante do staff autenticado.
 */
export async function getOrderById(
  orderIdOrInput: unknown
): Promise<OrderManagementActionResult<ManagedOrder>> {
  try {
    // 1. Validação do input com Zod
    const rawInput =
      typeof orderIdOrInput === 'string'
        ? { orderId: orderIdOrInput }
        : orderIdOrInput;

    const parsed = getOrderByIdSchema.safeParse(rawInput);
    if (!parsed.success) {
      return {
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message:
            parsed.error.issues[0]?.message ?? 'Identificador de pedido inválido.',
        },
      };
    }

    const { orderId } = parsed.data;

    // 2. Autenticar staff
    const staff = await getAuthenticatedStaff();
    if (!staff) {
      return {
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Sessão expirada ou utilizador não autorizado.',
        },
      };
    }

    // 3. Obter cliente Supabase
    const supabase = await createServerSupabaseClient();
    if (!supabase) {
      return {
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: 'Serviço de base de dados indisponível.',
        },
      };
    }

    // 4. Consultar o pedido garantindo isolamento estrito por restaurant_id
    const { data, error } = await supabase
      .from('orders')
      .select(
        `
        id,
        order_number,
        table_number,
        status,
        subtotal,
        total,
        customer_notes,
        created_at,
        updated_at,
        order_items (
          id,
          product_id,
          product_name,
          quantity,
          unit_price,
          notes
        )
      `
      )
      .eq('id', orderId)
      .eq('restaurant_id', staff.restaurant.id)
      .maybeSingle();

    if (error) {
      console.error(
        `[getOrderById] Erro ao consultar pedido ${orderId}:`,
        error.message
      );
      return {
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: 'Ocorreu um erro ao obter os detalhes do pedido.',
        },
      };
    }

    if (!data) {
      return {
        success: false,
        error: {
          code: 'ORDER_NOT_FOUND',
          message:
            'Pedido não encontrado ou não pertence a este restaurante.',
        },
      };
    }

    return {
      success: true,
      data: mapRawOrderToManagedOrder(data as unknown as RawOrderRow),
    };
  } catch (err: unknown) {
    console.error('[getOrderById] Exceção inesperada:', err);
    return {
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: 'Ocorreu um erro inesperado ao obter os detalhes do pedido.',
      },
    };
  }
}

/**
 * 3. updateOrderStatus
 * Atualiza o estado de um pedido, aplicando:
 * - Validação de input com Zod
 * - Autenticação e isolamento por restaurant_id
 * - Verificação da máquina de estados permitida
 * - Atualização apenas de status e updated_at
 */
export async function updateOrderStatus(
  orderIdOrInput: unknown,
  maybeNextStatus?: unknown
): Promise<OrderManagementActionResult<ManagedOrder>> {
  try {
    // 1. Normalizar e validar input com Zod
    const rawInput =
      typeof orderIdOrInput === 'string' && typeof maybeNextStatus === 'string'
        ? { orderId: orderIdOrInput, nextStatus: maybeNextStatus }
        : orderIdOrInput;

    const parsed = updateOrderStatusSchema.safeParse(rawInput);
    if (!parsed.success) {
      return {
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message:
            parsed.error.issues[0]?.message ?? 'Dados de atualização inválidos.',
        },
      };
    }

    const { orderId, nextStatus } = parsed.data;

    // 2. Autenticar staff
    const staff = await getAuthenticatedStaff();
    if (!staff) {
      return {
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Sessão expirada ou utilizador não autorizado.',
        },
      };
    }

    // 3. Obter cliente Supabase
    const supabase = await createServerSupabaseClient();
    if (!supabase) {
      return {
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: 'Serviço de base de dados indisponível.',
        },
      };
    }

    // 4. Obter estado atual do pedido e garantir pertença ao restaurante
    const { data: currentOrder, error: fetchError } = await supabase
      .from('orders')
      .select('id, status, restaurant_id')
      .eq('id', orderId)
      .eq('restaurant_id', staff.restaurant.id)
      .maybeSingle();

    if (fetchError) {
      console.error(
        `[updateOrderStatus] Erro ao verificar estado do pedido ${orderId}:`,
        fetchError.message
      );
      return {
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: 'Ocorreu um erro ao verificar o estado atual do pedido.',
        },
      };
    }

    if (!currentOrder) {
      return {
        success: false,
        error: {
          code: 'ORDER_NOT_FOUND',
          message:
            'Pedido não encontrado ou não pertence a este restaurante.',
        },
      };
    }

    // 5. Validar transição de estado permitida
    const currentStatus = currentOrder.status as OrderStatus;
    if (!isValidStatusTransition(currentStatus, nextStatus as OrderStatus)) {
      return {
        success: false,
        error: {
          code: 'INVALID_STATUS_TRANSITION',
          message: `Transição de estado inválida: não é permitido transitar de "${currentStatus}" para "${nextStatus}".`,
        },
      };
    }

    // 6. Atualizar estritamente o estado e timestamp
    const now = new Date().toISOString();
    const { data: updatedOrder, error: updateError } = await supabase
      .from('orders')
      .update({
        status: nextStatus as OrderStatus,
        updated_at: now,
      })
      .eq('id', orderId)
      .eq('restaurant_id', staff.restaurant.id)
      .select(
        `
        id,
        order_number,
        table_number,
        status,
        subtotal,
        total,
        customer_notes,
        created_at,
        updated_at,
        order_items (
          id,
          product_id,
          product_name,
          quantity,
          unit_price,
          notes
        )
      `
      )
      .single();

    if (updateError || !updatedOrder) {
      console.error(
        `[updateOrderStatus] Erro ao atualizar pedido ${orderId}:`,
        updateError?.message
      );
      return {
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: 'Ocorreu um erro ao atualizar o estado do pedido.',
        },
      };
    }

    return {
      success: true,
      data: mapRawOrderToManagedOrder(
        updatedOrder as unknown as RawOrderRow
      ),
    };
  } catch (err: unknown) {
    console.error('[updateOrderStatus] Exceção inesperada:', err);
    return {
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: 'Ocorreu um erro inesperado ao atualizar o pedido.',
      },
    };
  }
}

/**
 * 4. getOrderHistory
 * Obtém os pedidos finalizados ('completed' ou 'cancelled') pertencentes
 * exclusivamente ao restaurante do staff autenticado.
 * Ordena por created_at decrescente (mais recentes primeiro) com limite padrão de 50.
 */
export async function getOrderHistory(
  options?: { limit?: number }
): Promise<OrderManagementActionResult<ManagedOrder[]>> {
  try {
    // 1. Autenticar staff e obter o restaurante associado
    const staff = await getAuthenticatedStaff();
    if (!staff) {
      return {
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Sessão expirada ou utilizador não autorizado.',
        },
      };
    }

    // 2. Obter cliente Supabase
    const supabase = await createServerSupabaseClient();
    if (!supabase) {
      return {
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: 'Serviço de base de dados indisponível.',
        },
      };
    }

    // 3. Consultar histórico garantindo isolamento por restaurant_id
    const limit = Math.min(Math.max(Number(options?.limit) || 50, 1), 100);
    const historyStatuses: OrderStatus[] = ['completed', 'cancelled'];

    const { data, error } = await supabase
      .from('orders')
      .select(
        `
        id,
        order_number,
        table_number,
        status,
        subtotal,
        total,
        customer_notes,
        created_at,
        updated_at,
        order_items (
          id,
          product_id,
          product_name,
          quantity,
          unit_price,
          notes
        )
      `
      )
      .eq('restaurant_id', staff.restaurant.id)
      .in('status', historyStatuses)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error(
        '[getOrderHistory] Erro ao consultar histórico de pedidos:',
        error.message
      );
      return {
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: 'Ocorreu um erro ao carregar o histórico de pedidos.',
        },
      };
    }

    const managedOrders = (data || []).map((row) =>
      mapRawOrderToManagedOrder(row as unknown as RawOrderRow)
    );

    return {
      success: true,
      data: managedOrders,
    };
  } catch (err: unknown) {
    console.error('[getOrderHistory] Exceção inesperada:', err);
    return {
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: 'Ocorreu um erro inesperado ao consultar o histórico.',
      },
    };
  }
}

