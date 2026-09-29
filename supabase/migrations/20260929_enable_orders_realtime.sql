-- ============================================================================
-- Migração M4.4: Habilitar Supabase Realtime para KDS
-- Adiciona as tabelas 'orders' e 'order_items' à publicação 'supabase_realtime'
-- e define REPLICA IDENTITY FULL para suporte a filtros em UPDATE/DELETE
-- ============================================================================

DO $$
BEGIN
    -- Adicionar public.orders se ainda não estiver na publicação
    IF NOT EXISTS (
        SELECT 1
        FROM pg_publication_rel pr
        JOIN pg_class c ON c.oid = pr.prrelid
        JOIN pg_publication p ON p.oid = pr.prpubid
        WHERE p.pubname = 'supabase_realtime'
        AND c.relname = 'orders'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
    END IF;

    -- Adicionar public.order_items se ainda não estiver na publicação
    IF NOT EXISTS (
        SELECT 1
        FROM pg_publication_rel pr
        JOIN pg_class c ON c.oid = pr.prrelid
        JOIN pg_publication p ON p.oid = pr.prpubid
        WHERE p.pubname = 'supabase_realtime'
        AND c.relname = 'order_items'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.order_items;
    END IF;
END $$;

-- Garante que o WAL do PostgreSQL contenha todas as colunas da linha anterior
-- para permitir avaliação de RLS e filtros em eventos de UPDATE e DELETE
ALTER TABLE public.orders REPLICA IDENTITY FULL;
