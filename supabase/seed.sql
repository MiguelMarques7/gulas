-- ============================================================================
-- GULAS RESTAURANT PLATFORM — SEED DATA
-- Ficheiro: supabase/seed.sql
-- ============================================================================

-- 1. INSERÇÃO DO RESTAURANTE GULAS (Vila das Aves)
INSERT INTO public.restaurants (
    id,
    name,
    full_name,
    slug,
    tagline,
    description,
    location,
    cover_image_url,
    currency,
    timezone,
    address,
    phone,
    is_active,
    is_open,
    opening_hours
) VALUES (
    'e1a1a1a1-1111-4111-a111-111111111111',
    'Gulas',
    'Gulas, Pizza, Burger & Coffee',
    'gulas',
    'Pizza • Burger • Coffee',
    'Pizzas de fermentação lenta, caracóizzz artesanais, burgers suculentos em pão brioche e bolo do caco em Vila das Aves.',
    'Vila das Aves, Portugal',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1600&h=700&q=80',
    'EUR',
    'Europe/Lisbon',
    'Vila das Aves, Portugal',
    '+351 252 870 120',
    true,
    true,
    '12:00 – 15:00 • 19:00 – 23:00'
) ON CONFLICT (slug) DO NOTHING;

-- 2. INSERÇÃO DAS 10 CATEGORIAS
INSERT INTO public.categories (id, restaurant_id, name, slug, description, subtitle, display_order, is_active, is_specialty)
VALUES
    ('c1111111-0001-4000-8000-000000000001', 'e1a1a1a1-1111-4111-a111-111111111111', 'Entradas', 'entradas', 'Para partilhar e começar da melhor forma a refeição', NULL, 1, true, false),
    ('c1111111-0002-4000-8000-000000000002', 'e1a1a1a1-1111-4111-a111-111111111111', 'Caracóizzz', 'caracoizzz', 'Especialidade exclusiva em massa de pizza enrolada (6 unidades)', '6 unidades • Especialidade Gulas', 2, true, true),
    ('c1111111-0003-4000-8000-000000000003', 'e1a1a1a1-1111-4111-a111-111111111111', 'Panuozzos', 'panuozzos', 'Sanduíches italianas artesanais em massa de pizza crocante', NULL, 3, true, false),
    ('c1111111-0004-4000-8000-000000000004', 'e1a1a1a1-1111-4111-a111-111111111111', 'Novidades do Mês', 'novidades', 'Criações exclusivas e edições limitadas da nossa cozinha', 'Edições Limitadas', 4, true, false),
    ('c1111111-0005-4000-8000-000000000005', 'e1a1a1a1-1111-4111-a111-111111111111', 'Burgers', 'burgers', 'Carne 100% bovina em pão brioche ou bolo do caco', 'Todos os burgers incluem batata frita', 5, true, false),
    ('c1111111-0006-4000-8000-000000000006', 'e1a1a1a1-1111-4111-a111-111111111111', 'Pregos', 'pregos', 'Servidos em bolo do caco fresco artesanal', 'Acompanha chips de batata', 6, true, false),
    ('c1111111-0007-4000-8000-000000000007', 'e1a1a1a1-1111-4111-a111-111111111111', 'Pizzas Clássicas', 'pizzas-classicas', 'Massa fina de longa fermentação com ingredientes selecionados', 'Média — 31 cm • €15,00', 7, true, false),
    ('c1111111-0008-4000-8000-000000000008', 'e1a1a1a1-1111-4111-a111-111111111111', 'Pizzas Especiais', 'pizzas-especiais', 'Combinações gourmet com mozzarella fior di latte', 'Média — 31 cm • Fior di Latte', 8, true, false),
    ('c1111111-0009-4000-8000-000000000009', 'e1a1a1a1-1111-4111-a111-111111111111', 'Sobremesas', 'sobremesas', 'Doces artesanais confecionados para finalizar a refeição', NULL, 9, true, false),
    ('c1111111-0010-4000-8000-000000000010', 'e1a1a1a1-1111-4111-a111-111111111111', 'Bebidas & Coffee', 'bebidas', 'Refrigerantes, cervejas frescas, águas e cafetaria', NULL, 10, true, false)
ON CONFLICT (restaurant_id, slug) DO NOTHING;

-- 3. INSERÇÃO DOS PRODUTOS DO GULAS (com cost = NULL)
INSERT INTO public.products (
    id,
    restaurant_id,
    category_id,
    name,
    slug,
    description,
    price,
    cost,
    image_url,
    is_available,
    display_order,
    badges,
    unit_quantity,
    includes_notes,
    customization_note,
    allergens,
    prep_time_minutes
) VALUES
-- 1. Entradas
('b1111111-0001-4000-8000-000000000001', 'e1a1a1a1-1111-4111-a111-111111111111', 'c1111111-0001-4000-8000-000000000001', 'Bolo do Caco com Manteiga d''Alho', 'bolo-do-caco-com-manteiga-d-alho', 'Bolo do caco artesanal tostado com manteiga de alho e ervas finas.', 3.80, NULL, 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?auto=format&fit=crop&w=700&q=80', true, 1, ARRAY['vegetariano'], NULL, NULL, NULL, ARRAY['Glúten', 'Laticínios'], NULL),
('b1111111-0002-4000-8000-000000000002', 'e1a1a1a1-1111-4111-a111-111111111111', 'c1111111-0001-4000-8000-000000000001', 'Calamares com Molho Agridoce', 'calamares-com-molho-agridoce', 'Calamares dourados e estaladiços acompanhados de molho agridoce aromático.', 5.35, NULL, 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=700&q=80', true, 2, ARRAY['picante'], '6 unidades', NULL, NULL, ARRAY['Moluscos', 'Glúten'], NULL),
('b1111111-0003-4000-8000-000000000003', 'e1a1a1a1-1111-4111-a111-111111111111', 'c1111111-0001-4000-8000-000000000001', 'Sticks de Frango', 'sticks-de-frango', 'Tiras tenras de peito de frango panadas e crocantes com molho de acompanhamento.', 6.75, NULL, 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=700&q=80', true, 3, '{}', '5 unidades', NULL, NULL, ARRAY['Glúten', 'Ovos'], NULL),
('b1111111-0004-4000-8000-000000000004', 'e1a1a1a1-1111-4111-a111-111111111111', 'c1111111-0001-4000-8000-000000000001', 'Chacon Fries', 'chacon-fries', 'Batata frita, bacon, molho de cheddar cremoso, jalapeño e cebola frita crocante.', 7.50, NULL, 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=700&q=80', true, 4, ARRAY['picante'], NULL, NULL, NULL, ARRAY['Laticínios', 'Glúten'], NULL),
('b1111111-0005-4000-8000-000000000005', 'e1a1a1a1-1111-4111-a111-111111111111', 'c1111111-0001-4000-8000-000000000001', 'Ovos Rotos', 'ovos-rotos', 'Batata frita palito, presunto, 2 ovos estrelados, paprika fumada e salsa fresca picada.', 8.75, NULL, 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=700&q=80', true, 5, ARRAY['popular'], NULL, NULL, NULL, ARRAY['Ovos', 'Sulfitos'], NULL),
('b1111111-0006-4000-8000-000000000006', 'e1a1a1a1-1111-4111-a111-111111111111', 'c1111111-0001-4000-8000-000000000001', 'Batata Rústica', 'batata-rustica', 'Batata cortada em gomo e condimentada com especiarias da casa.', 3.75, NULL, 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=700&q=80', true, 6, ARRAY['vegetariano'], NULL, NULL, NULL, '{}', NULL),
('b1111111-0007-4000-8000-000000000007', 'e1a1a1a1-1111-4111-a111-111111111111', 'c1111111-0001-4000-8000-000000000001', 'Batata Frita Palito', 'batata-frita-palito', 'Dose de batatas fritas finas e estaladiças com flor de sal.', 3.40, NULL, 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=700&q=80', true, 7, ARRAY['vegetariano'], NULL, NULL, NULL, '{}', NULL),
('b1111111-0008-4000-8000-000000000008', 'e1a1a1a1-1111-4111-a111-111111111111', 'c1111111-0001-4000-8000-000000000001', 'Chips de Batata Doce', 'chips-de-batata-doce', 'Chips estaladiças de batata doce com toque de sal.', 2.40, NULL, 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=700&q=80', true, 8, ARRAY['vegetariano'], NULL, NULL, NULL, '{}', NULL),

-- 2. Caracóizzz (6 unidades)
('b1111111-0009-4000-8000-000000000009', 'e1a1a1a1-1111-4111-a111-111111111111', 'c1111111-0002-4000-8000-000000000002', 'Caracóizz ao Alho', 'caracoizz-ao-alho', 'Em massa de pizza, mozzarella e manteiga d''alho, fio de azeite virgem extra e orégãos.', 7.80, NULL, 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&w=700&q=80', true, 1, ARRAY['especialidade', 'vegetariano'], '6 unidades', NULL, NULL, ARRAY['Glúten', 'Laticínios'], NULL),
('b1111111-0010-4000-8000-000000000010', 'e1a1a1a1-1111-4111-a111-111111111111', 'c1111111-0002-4000-8000-000000000002', 'Caracóizz Clássicos', 'caracoizz-classicos', 'Em massa de pizza, molho de tomate, mozzarella, fiambre, fio de azeite virgem extra e orégãos.', 7.80, NULL, 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=700&q=80', true, 2, ARRAY['especialidade'], '6 unidades', NULL, NULL, ARRAY['Glúten', 'Laticínios'], NULL),
('b1111111-0011-4000-8000-000000000011', 'e1a1a1a1-1111-4111-a111-111111111111', 'c1111111-0002-4000-8000-000000000002', 'Caracóizz Genovese', 'caracoizz-genovese', 'Em massa de pizza, tomate cherry, molho pesto, parmesão, fio de azeite virgem extra e orégãos.', 7.80, NULL, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=700&q=80', true, 3, ARRAY['especialidade', 'vegetariano'], '6 unidades', NULL, NULL, ARRAY['Glúten', 'Laticínios', 'Frutos de Casca Rija'], NULL),
('b1111111-0012-4000-8000-000000000012', 'e1a1a1a1-1111-4111-a111-111111111111', 'c1111111-0002-4000-8000-000000000002', 'Caracóizz Vegan', 'caracoizz-vegan', 'Em massa de pizza, molho de tomate, queijo vegan, cogumelo shitake, pimentos, cebola, fio de azeite virgem extra e manjericão seco.', 7.80, NULL, 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=700&q=80', true, 4, ARRAY['vegan'], '6 unidades', NULL, 'Opção queijo mozzarella sem custo adicional.', ARRAY['Glúten'], NULL),
('b1111111-0013-4000-8000-000000000013', 'e1a1a1a1-1111-4111-a111-111111111111', 'c1111111-0002-4000-8000-000000000002', 'Caracóizz Mexicanos', 'caracoizz-mexicanos', 'Em massa de pizza, molho de tomate, mozzarella e pimento jalapeño, fio de azeite virgem extra e orégãos. Acompanha com molho de cheddar.', 7.80, NULL, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=700&q=80', true, 5, ARRAY['picante', 'especialidade'], '6 unidades', NULL, NULL, ARRAY['Glúten', 'Laticínios'], NULL),
('b1111111-0014-4000-8000-000000000014', 'e1a1a1a1-1111-4111-a111-111111111111', 'c1111111-0002-4000-8000-000000000002', 'Caracóizz Cheddar e Bacon', 'caracoizz-cheddar-e-bacon', 'Em massa de pizza, molho de tomate, queijo cheddar e bacon, fio de azeite virgem extra e orégãos. Acompanha com molho cheddar.', 7.80, NULL, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=700&q=80', true, 6, ARRAY['popular'], '6 unidades', NULL, NULL, ARRAY['Glúten', 'Laticínios'], NULL),
('b1111111-0015-4000-8000-000000000015', 'e1a1a1a1-1111-4111-a111-111111111111', 'c1111111-0002-4000-8000-000000000002', 'Caracóizz Populares', 'caracoizz-populares', 'Em massa de pizza, molho de tomate, queijo flamengo, chourição e topping de cebola granulada, fio de azeite virgem extra e orégãos.', 7.80, NULL, 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=700&q=80', true, 7, '{}', '6 unidades', NULL, NULL, ARRAY['Glúten', 'Laticínios'], NULL),
('b1111111-0016-4000-8000-000000000016', 'e1a1a1a1-1111-4111-a111-111111111111', 'c1111111-0002-4000-8000-000000000002', 'Caracóizz Turcos', 'caracoizz-turcos', 'Em massa de pizza, molho de tomate, mozzarella, kebab e cebola frita, fio de azeite virgem extra e orégãos. Acompanha com molho de kebab.', 7.80, NULL, 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=700&q=80', true, 8, '{}', '6 unidades', NULL, NULL, ARRAY['Glúten', 'Laticínios'], NULL),

-- 3. Panuozzos
('b1111111-0017-4000-8000-000000000017', 'e1a1a1a1-1111-4111-a111-111111111111', 'c1111111-0003-4000-8000-000000000003', 'Panuozzo Ibérico', 'panuozzo-iberico', 'Em massa de pizza, burrata cremosa, rúcula, molho pesto, presunto, lascas de parmesão e um fio de azeite virgem extra.', 15.00, NULL, 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=700&q=80', true, 1, ARRAY['especialidade', 'popular'], NULL, NULL, NULL, ARRAY['Glúten', 'Laticínios', 'Frutos de Casca Rija'], NULL),
('b1111111-0018-4000-8000-000000000018', 'e1a1a1a1-1111-4111-a111-111111111111', 'c1111111-0003-4000-8000-000000000003', 'Panuozzo Caprese', 'panuozzo-caprese', 'Em massa de pizza, burrata fresca, manjericão, molho pesto, tomate, lascas de parmesão e um fio de azeite virgem extra.', 13.75, NULL, 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=700&q=80', true, 2, ARRAY['vegetariano'], NULL, NULL, NULL, ARRAY['Glúten', 'Laticínios', 'Frutos de Casca Rija'], NULL),

-- 4. Novidades do Mês
('b1111111-0019-4000-8000-000000000019', 'e1a1a1a1-1111-4111-a111-111111111111', 'c1111111-0004-4000-8000-000000000004', 'São Miguel Burger', 'sao-miguel-burger', 'Pão brioche, molho secreto, 120 g de carne bovina, queijo da ilha açoriano, bacon crocante, ananás grelhado e ovo.', 13.50, NULL, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=80', true, 1, ARRAY['novidade', 'house_special'], NULL, 'Inclui batata palito.', NULL, ARRAY['Glúten', 'Laticínios', 'Ovos'], NULL),
('b1111111-0020-4000-8000-000000000020', 'e1a1a1a1-1111-4111-a111-111111111111', 'c1111111-0004-4000-8000-000000000004', 'Cheeseburger Bacon Edition', 'cheeseburger-bacon-edition', 'Pão brioche tostado, 120 g de carne bovina, maionese artesanal de bacon, pickles crocantes, queijo cheddar derretido e bacon.', 13.50, NULL, 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=700&q=80', true, 2, ARRAY['novidade', 'popular'], NULL, 'Inclui batata palito.', NULL, ARRAY['Glúten', 'Laticínios', 'Ovos'], NULL),

-- 5. Burgers
('b1111111-0021-4000-8000-000000000021', 'e1a1a1a1-1111-4111-a111-111111111111', 'c1111111-0005-4000-8000-000000000005', 'Gulas Burger', 'gulas-burger', 'Pão brioche, 120 g de carne bovina, cogumelos shitake salteados, queijo flamengo, bacon crocante e ovo estrelado.', 13.00, NULL, 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=700&q=80', true, 1, ARRAY['house_special', 'popular'], NULL, 'Inclui batata frita palito.', NULL, ARRAY['Glúten', 'Laticínios', 'Ovos'], NULL),
('b1111111-0022-4000-8000-000000000022', 'e1a1a1a1-1111-4111-a111-111111111111', 'c1111111-0005-4000-8000-000000000005', 'Clássico 2.0', 'classico-2-0', 'Pão brioche, 120 g de carne bovina, molho smoked BBQ, alface fresca, queijo cheddar, bacon, tomate e cebola roxa fresca.', 13.00, NULL, 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=700&q=80', true, 2, '{}', NULL, 'Inclui batata frita palito.', NULL, ARRAY['Glúten', 'Laticínios'], NULL),
('b1111111-0023-4000-8000-000000000023', 'e1a1a1a1-1111-4111-a111-111111111111', 'c1111111-0005-4000-8000-000000000005', 'Mostarda''s', 'mostarda-s', 'Bolo do caco, 120 g de carne bovina, mostarda especial, cebola caramelizada em mostarda, queijo cheddar e presunto.', 13.00, NULL, 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=700&q=80', true, 3, '{}', NULL, 'Inclui batata frita palito.', NULL, ARRAY['Glúten', 'Laticínios', 'Mostarda'], NULL),
('b1111111-0024-4000-8000-000000000024', 'e1a1a1a1-1111-4111-a111-111111111111', 'c1111111-0005-4000-8000-000000000005', 'Frango Burger', 'frango-burger', 'Bolo do caco, 130 g de frango panado estaladiço, queijo flamengo, cebola frita, alface e maionese de alho.', 13.00, NULL, 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=700&q=80', true, 4, '{}', NULL, 'Inclui batata frita palito.', NULL, ARRAY['Glúten', 'Laticínios', 'Ovos'], NULL),
('b1111111-0025-4000-8000-000000000025', 'e1a1a1a1-1111-4111-a111-111111111111', 'c1111111-0005-4000-8000-000000000005', 'Spicy Chicken', 'spicy-chicken', 'Pão brioche, ketchup picante, pimento jalapeño, crocante de frango, rúcula fresca e queijo cheddar.', 13.00, NULL, 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=700&q=80', true, 5, ARRAY['picante'], NULL, 'Inclui batata frita palito.', NULL, ARRAY['Glúten', 'Laticínios'], NULL),
('b1111111-0026-4000-8000-000000000026', 'e1a1a1a1-1111-4111-a111-111111111111', 'c1111111-0005-4000-8000-000000000005', 'Veg Burger', 'veg-burger', 'Bolo do caco, burger crocante de vegetais, tomate, cebola roxa, cogumelos shitake salteados, molho de mostarda e mel e rúcula.', 13.00, NULL, 'https://images.unsplash.com/photo-1520072959219-c595dc870360?auto=format&fit=crop&w=700&q=80', true, 6, ARRAY['vegetariano'], NULL, 'Inclui batata frita palito.', NULL, ARRAY['Glúten', 'Mostarda'], NULL),
('b1111111-0027-4000-8000-000000000027', 'e1a1a1a1-1111-4111-a111-111111111111', 'c1111111-0005-4000-8000-000000000005', 'Cheeseburger', 'cheeseburger', 'Pão brioche, 120 g de carne bovina, queijo cheddar derretido, pickles e ketchup.', 12.50, NULL, 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?auto=format&fit=crop&w=700&q=80', true, 7, '{}', NULL, 'Inclui batata frita palito.', NULL, ARRAY['Glúten', 'Laticínios'], NULL),
('b1111111-0028-4000-8000-000000000028', 'e1a1a1a1-1111-4111-a111-111111111111', 'c1111111-0005-4000-8000-000000000005', 'Classic Burger', 'classic-burger', 'Pão brioche, 120 g de carne bovina, queijo cheddar, fiambre, alface fresca e tomate.', 12.50, NULL, 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=700&q=80', true, 8, '{}', NULL, 'Inclui batata frita palito.', NULL, ARRAY['Glúten', 'Laticínios'], NULL),

-- 6. Pregos
('b1111111-0029-4000-8000-000000000029', 'e1a1a1a1-1111-4111-a111-111111111111', 'c1111111-0006-4000-8000-000000000006', 'Prego no Caco', 'prego-no-caco', 'Bolo do caco fresco, bife de novilho macio, queijo flamengo e fiambre.', 9.25, NULL, 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=700&q=80', true, 1, ARRAY['popular'], NULL, 'Acompanha chips de batata.', NULL, ARRAY['Glúten', 'Laticínios'], NULL),
('b1111111-0030-4000-8000-000000000030', 'e1a1a1a1-1111-4111-a111-111111111111', 'c1111111-0006-4000-8000-000000000006', 'Prego 2.0', 'prego-2-0', 'Bolo do caco fresco, bife de novilho suculento, queijo cheddar, bacon crocante e ovo estrelado.', 10.75, NULL, 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=700&q=80', true, 2, ARRAY['house_special'], NULL, 'Acompanha chips de batata.', NULL, ARRAY['Glúten', 'Laticínios', 'Ovos'], NULL),

-- 7. Pizzas Clássicas
('b1111111-0031-4000-8000-000000000031', 'e1a1a1a1-1111-4111-a111-111111111111', 'c1111111-0007-4000-8000-000000000007', 'Gulas', 'pizza-gulas', 'Molho de tomate, mozzarella, frango grelhado, pimentos, azeitonas, cogumelos, cebola e orégãos.', 15.00, NULL, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=700&q=80', true, 1, ARRAY['house_special', 'popular'], 'Média — 31 cm', NULL, NULL, ARRAY['Glúten', 'Laticínios'], NULL),
('b1111111-0032-4000-8000-000000000032', 'e1a1a1a1-1111-4111-a111-111111111111', 'c1111111-0007-4000-8000-000000000007', 'Pepe', 'pizza-pepe', 'Molho de tomate, mozzarella, generoso pepperoni estaladiço e orégãos.', 15.00, NULL, 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=700&q=80', true, 2, ARRAY['picante', 'popular'], 'Média — 31 cm', NULL, NULL, ARRAY['Glúten', 'Laticínios'], NULL),
('b1111111-0033-4000-8000-000000000033', 'e1a1a1a1-1111-4111-a111-111111111111', 'c1111111-0007-4000-8000-000000000007', 'Aquela com Tabasco®', 'aquela-com-tabasco', 'Molho de tomate, mozzarella, fiambre, bacon, pimentos, cogumelos, orégãos e Tabasco®.', 15.00, NULL, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=700&q=80', true, 3, ARRAY['picante'], 'Média — 31 cm', NULL, NULL, ARRAY['Glúten', 'Laticínios'], NULL),
('b1111111-0034-4000-8000-000000000034', 'e1a1a1a1-1111-4111-a111-111111111111', 'c1111111-0007-4000-8000-000000000007', 'Pescador', 'pizza-pescador', 'Molho de tomate, mozzarella, atum, cebola roxa, ovo cozido, orégãos e manjericão fresco.', 15.00, NULL, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=700&q=80', true, 4, '{}', 'Média — 31 cm', NULL, NULL, ARRAY['Glúten', 'Laticínios', 'Peixe', 'Ovos'], NULL),
('b1111111-0035-4000-8000-000000000035', 'e1a1a1a1-1111-4111-a111-111111111111', 'c1111111-0007-4000-8000-000000000007', 'Salamandra', 'pizza-salamandra', 'Molho de tomate, mozzarella, ovo, bacon, cogumelos, cebola roxa e orégãos.', 15.00, NULL, 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=700&q=80', true, 5, '{}', 'Média — 31 cm', NULL, NULL, ARRAY['Glúten', 'Laticínios', 'Ovos'], NULL),
('b1111111-0036-4000-8000-000000000036', 'e1a1a1a1-1111-4111-a111-111111111111', 'c1111111-0007-4000-8000-000000000007', 'A Mais Formosa', 'a-mais-formosa', 'Molho de tomate, mozzarella, fiambre, bacon, chourição, cogumelos e azeitonas.', 15.00, NULL, 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&w=700&q=80', true, 6, ARRAY['popular'], 'Média — 31 cm', NULL, NULL, ARRAY['Glúten', 'Laticínios'], NULL),
('b1111111-0037-4000-8000-000000000037', 'e1a1a1a1-1111-4111-a111-111111111111', 'c1111111-0007-4000-8000-000000000007', 'Vegetariana', 'pizza-vegetariana', 'Molho de tomate, mozzarella, azeitonas, rúcula, mix de cogumelos Paris e shitake, pimentos, cebola, tomate cherry e orégãos.', 15.00, NULL, 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=700&q=80', true, 7, ARRAY['vegetariano'], 'Média — 31 cm', NULL, NULL, ARRAY['Glúten', 'Laticínios'], NULL),
('b1111111-0038-4000-8000-000000000038', 'e1a1a1a1-1111-4111-a111-111111111111', 'c1111111-0007-4000-8000-000000000007', 'Pizza Kebab', 'pizza-kebab', 'Molho de tomate, mozzarella, carne de kebab suculenta, cebola roxa, molho kebab e orégãos.', 15.00, NULL, 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=700&q=80', true, 8, '{}', 'Média — 31 cm', NULL, NULL, ARRAY['Glúten', 'Laticínios'], NULL),
('b1111111-0039-4000-8000-000000000039', 'e1a1a1a1-1111-4111-a111-111111111111', 'c1111111-0007-4000-8000-000000000007', 'A Polémica', 'a-polemica', 'Molho de tomate, mozzarella, fiambre, ananás caramelizado e orégãos.', 15.00, NULL, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=700&q=80', true, 9, '{}', 'Média — 31 cm', NULL, NULL, ARRAY['Glúten', 'Laticínios'], NULL),
('b1111111-0040-4000-8000-000000000040', 'e1a1a1a1-1111-4111-a111-111111111111', 'c1111111-0007-4000-8000-000000000007', 'Pizza Clássica', 'pizza-classica', 'Molho de tomate, mozzarella, pimentos, fiambre, cogumelos frescos, azeitonas e orégãos.', 15.00, NULL, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=700&q=80', true, 10, '{}', 'Média — 31 cm', NULL, NULL, ARRAY['Glúten', 'Laticínios'], NULL),
('b1111111-0041-4000-8000-000000000041', 'e1a1a1a1-1111-4111-a111-111111111111', 'c1111111-0007-4000-8000-000000000007', 'Mista', 'pizza-mista', 'Molho de tomate, mozzarella, fiambre selecionado e orégãos.', 15.00, NULL, 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=700&q=80', true, 11, '{}', 'Média — 31 cm', NULL, NULL, ARRAY['Glúten', 'Laticínios'], NULL),

-- 8. Pizzas Especiais
('b1111111-0042-4000-8000-000000000042', 'e1a1a1a1-1111-4111-a111-111111111111', 'c1111111-0008-4000-8000-000000000008', 'Margarida', 'margarida-especial', 'Molho de tomate, mozzarella fior di latte, queijo parmesão, manjericão fresco e um fio de azeite.', 15.00, NULL, 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=700&q=80', true, 1, ARRAY['especialidade', 'vegetariano'], 'Média — 31 cm', NULL, NULL, ARRAY['Glúten', 'Laticínios'], NULL),
('b1111111-0043-4000-8000-000000000043', 'e1a1a1a1-1111-4111-a111-111111111111', 'c1111111-0008-4000-8000-000000000008', 'Pepe do Bosque', 'pepe-do-bosque', 'Molho de tomate, mozzarella fior di latte, pepperoni, cogumelos, lascas de parmesão, manjericão, fio de azeite trufado e orégãos.', 17.00, NULL, 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&w=700&q=80', true, 2, ARRAY['picante', 'house_special'], 'Média — 31 cm', NULL, NULL, ARRAY['Glúten', 'Laticínios'], NULL),
('b1111111-0044-4000-8000-000000000044', 'e1a1a1a1-1111-4111-a111-111111111111', 'c1111111-0008-4000-8000-000000000008', 'Romão', 'romao', 'Molho de tomate, mozzarella fior di latte, presunto, mix de cogumelos shitake e Paris, manjericão fresco e orégãos.', 17.00, NULL, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=700&q=80', true, 3, ARRAY['especialidade'], 'Média — 31 cm', NULL, NULL, ARRAY['Glúten', 'Laticínios'], NULL),
('b1111111-0045-4000-8000-000000000045', 'e1a1a1a1-1111-4111-a111-111111111111', 'c1111111-0008-4000-8000-000000000008', 'Ibérica', 'iberica-especial', 'Molho de tomate, mozzarella fior di latte, rúcula fresca, presunto, raspas de parmesão e fio de azeite.', 17.00, NULL, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=700&q=80', true, 4, ARRAY['popular'], 'Média — 31 cm', NULL, NULL, ARRAY['Glúten', 'Laticínios'], NULL),
('b1111111-0046-4000-8000-000000000046', 'e1a1a1a1-1111-4111-a111-111111111111', 'c1111111-0008-4000-8000-000000000008', 'Calzone', 'calzone', 'Pizza fechada artesanal. Molho de tomate, mozzarella fior di latte, fio de azeite, parmesão, chourição, cogumelos, ovo e orégãos.', 17.00, NULL, 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=700&q=80', true, 5, ARRAY['especialidade'], 'Média — 31 cm', NULL, NULL, ARRAY['Glúten', 'Laticínios', 'Ovos'], NULL),

-- 9. Sobremesas
('b1111111-0047-4000-8000-000000000047', 'e1a1a1a1-1111-4111-a111-111111111111', 'c1111111-0009-4000-8000-000000000009', 'Cheesecake da Casa', 'cheesecake-da-casa', 'Cremoso cheesecake artesanal com coulis de frutos silvestres e base crocante.', 4.50, NULL, 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=700&q=80', true, 1, ARRAY['popular', 'vegetariano'], NULL, NULL, NULL, ARRAY['Glúten', 'Laticínios', 'Ovos'], NULL),
('b1111111-0048-4000-8000-000000000048', 'e1a1a1a1-1111-4111-a111-111111111111', 'c1111111-0009-4000-8000-000000000009', 'Mousse de Chocolate Artesanal', 'mousse-de-chocolate-artesanal', 'Mousse aveludada de chocolate negro 70% com raspas de cacau e flor de sal.', 3.80, NULL, 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=700&q=80', true, 2, ARRAY['vegetariano'], NULL, NULL, NULL, ARRAY['Laticínios', 'Ovos'], NULL),
('b1111111-0049-4000-8000-000000000049', 'e1a1a1a1-1111-4111-a111-111111111111', 'c1111111-0009-4000-8000-000000000009', 'Petit Gâteau c/ Gelado de Baunilha', 'petit-gateau-c-gelado', 'Bolo quente de chocolate com coração cremoso derretido e bola de gelado artesanal.', 5.00, NULL, 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=700&q=80', true, 3, ARRAY['house_special', 'vegetariano'], NULL, NULL, NULL, ARRAY['Glúten', 'Laticínios', 'Ovos'], NULL),

-- 10. Bebidas & Coffee
('b1111111-0050-4000-8000-000000000050', 'e1a1a1a1-1111-4111-a111-111111111111', 'c1111111-0010-4000-8000-000000000010', 'Coca-Cola Original (33cl)', 'coca-cola-original-33cl', 'Lata 33cl servida bem fresca com rodela de limão e gelo.', 2.00, NULL, 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=700&q=80', true, 1, '{}', NULL, NULL, NULL, '{}', NULL),
('b1111111-0051-4000-8000-000000000051', 'e1a1a1a1-1111-4111-a111-111111111111', 'c1111111-0010-4000-8000-000000000010', 'Coca-Cola Zero (33cl)', 'coca-cola-zero-33cl', 'Lata 33cl sem açúcar.', 2.00, NULL, 'https://images.unsplash.com/photo-1554866585-cd94860890b7?auto=format&fit=crop&w=700&q=80', true, 2, '{}', NULL, NULL, NULL, '{}', NULL),
('b1111111-0052-4000-8000-000000000052', 'e1a1a1a1-1111-4111-a111-111111111111', 'c1111111-0010-4000-8000-000000000010', 'Ice Tea Limão / Pêssego (33cl)', 'ice-tea-33cl', 'Lata 33cl.', 2.00, NULL, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=700&q=80', true, 3, '{}', NULL, NULL, NULL, '{}', NULL),
('b1111111-0053-4000-8000-000000000053', 'e1a1a1a1-1111-4111-a111-111111111111', 'c1111111-0010-4000-8000-000000000010', 'Cerveja Super Bock (33cl)', 'cerveja-super-bock-33cl', 'Garrafa 33cl gelada.', 2.20, NULL, 'https://images.unsplash.com/photo-1608270116853-2715d2a76fdf?auto=format&fit=crop&w=700&q=80', true, 4, '{}', NULL, NULL, NULL, ARRAY['Glúten'], NULL),
('b1111111-0054-4000-8000-000000000054', 'e1a1a1a1-1111-4111-a111-111111111111', 'c1111111-0010-4000-8000-000000000010', 'Cerveja Artesanal IPA (33cl)', 'cerveja-artesanal-ipa-33cl', 'Cerveja aromática artesanal com notas cítricas e lúpulo fresco.', 3.50, NULL, 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&w=700&q=80', true, 5, '{}', NULL, NULL, NULL, ARRAY['Glúten'], NULL),
('b1111111-0055-4000-8000-000000000055', 'e1a1a1a1-1111-4111-a111-111111111111', 'c1111111-0010-4000-8000-000000000010', 'Água Mineral Natural (50cl)', 'agua-mineral-natural-50cl', 'Garrafa 50cl fresca ou natural.', 1.40, NULL, 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=700&q=80', true, 6, '{}', NULL, NULL, NULL, '{}', NULL),
('b1111111-0056-4000-8000-000000000056', 'e1a1a1a1-1111-4111-a111-111111111111', 'c1111111-0010-4000-8000-000000000010', 'Água das Pedras Salgadas (25cl)', 'agua-das-pedras-salgadas-25cl', 'Água mineral gasocarbónica 100% natural.', 1.60, NULL, 'https://images.unsplash.com/photo-1559839914-ba2a0f8eb2a2?auto=format&fit=crop&w=700&q=80', true, 7, '{}', NULL, NULL, NULL, '{}', NULL),
('b1111111-0057-4000-8000-000000000057', 'e1a1a1a1-1111-4111-a111-111111111111', 'c1111111-0010-4000-8000-000000000010', 'Café Expresso Gulas', 'cafe-expresso-gulas', 'Café de lote selecionado arábica com creme denso.', 0.90, NULL, 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=700&q=80', true, 8, '{}', NULL, NULL, NULL, '{}', NULL)
ON CONFLICT (restaurant_id, slug) DO NOTHING;

-- 4. INSERÇÃO DAS 10 MESAS
INSERT INTO public.tables (id, restaurant_id, number, name, qr_token, is_active)
VALUES
    ('f1111111-0001-4000-8000-000000000001', 'e1a1a1a1-1111-4111-a111-111111111111', 1, 'Mesa 1 (Esplanada)', 'qr_gulas_tbl_1', true),
    ('f1111111-0002-4000-8000-000000000002', 'e1a1a1a1-1111-4111-a111-111111111111', 2, 'Mesa 2 (Esplanada)', 'qr_gulas_tbl_2', true),
    ('f1111111-0003-4000-8000-000000000003', 'e1a1a1a1-1111-4111-a111-111111111111', 3, 'Mesa 3 (Interior)', 'qr_gulas_tbl_3', true),
    ('f1111111-0004-4000-8000-000000000004', 'e1a1a1a1-1111-4111-a111-111111111111', 4, 'Mesa 4 (Sala Principal)', 'qr_gulas_tbl_4', true),
    ('f1111111-0005-4000-8000-000000000005', 'e1a1a1a1-1111-4111-a111-111111111111', 5, 'Mesa 5 (Sala Principal)', 'qr_gulas_tbl_5', true),
    ('f1111111-0006-4000-8000-000000000006', 'e1a1a1a1-1111-4111-a111-111111111111', 6, 'Mesa 6 (Balcão / Janela)', 'qr_gulas_tbl_6', true),
    ('f1111111-0007-4000-8000-000000000007', 'e1a1a1a1-1111-4111-a111-111111111111', 7, 'Mesa 7 (Sala Principal)', 'qr_gulas_tbl_7', true),
    ('f1111111-0008-4000-8000-000000000008', 'e1a1a1a1-1111-4111-a111-111111111111', 8, 'Mesa 8 (Central)', 'qr_gulas_tbl_8', true),
    ('f1111111-0009-4000-8000-000000000009', 'e1a1a1a1-1111-4111-a111-111111111111', 9, 'Mesa 9 (Grupo)', 'qr_gulas_tbl_9', true),
    ('f1111111-0010-4000-8000-000000000010', 'e1a1a1a1-1111-4111-a111-111111111111', 10, 'Mesa 10 (Reservado)', 'qr_gulas_tbl_10', true)
ON CONFLICT (restaurant_id, number) DO NOTHING;

