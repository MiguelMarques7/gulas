# Gulas Platform — Digital Menu & Real Ordering System

Plataforma digital para restauração e pedidos de mesa, desenvolvida de raiz com arquitetura multi-tenant, zero-trust frontend, transações atómicas na base de dados, monitor KDS de cozinha em tempo real e experiência de utilizador mobile-first de alto desempenho.

Atualmente configurada para o restaurante **Gulas — Pizza, Burger & Coffee** (Vila das Aves, Portugal).

---

## 1. Visão Geral e Destaques Arquiteturais

A plataforma foi desenhada para resolver os principais desafios operacionais e de segurança de menus digitais, pedidos de mesa e operação de cozinha no próprio restaurante:

* **Zero-Trust Frontend:** O browser do cliente nunca é a fonte de verdade para preços, nomes ou totais. O cliente envia apenas identificadores de produto, quantidades e observações. O servidor valida a existência, disponibilidade, categoria ativa e calcula todos os montantes com precisão monetária em base de dados.
* **Atomicidade Transacional:** Toda a submissão de pedidos é executada através de uma função PostgreSQL transacional `SECURITY DEFINER` (`create_order_atomic`).
* **Segurança por Defeito (RLS):** Todas as tabelas possuem Row Level Security ativado. As tabelas `orders` e `order_items` permanecem 100% blindadas contra comandos diretos de `INSERT` público.
* **Multi-Tenant Nativo:** A identificação do restaurante é resolvida server-side por slug ou sessão de staff, isolando completamente produtos, categorias, mesas, contadores e pedidos entre diferentes estabelecimentos.
* **Autenticação & Autorização de Staff (M4.1):** Gestão de acesso administrativo com verificação estrita de papéis (`owner`, `manager`, `staff`) associados ao perfil do restaurante em `public.profiles`.
* **Backend de Gestão e Máquina de Estados (M4.2):** Ciclo de vida estrito para transições de estado dos pedidos (`pending` ➔ `accepted` ➔ `preparing` ➔ `ready` ➔ `completed` / `cancelled`).
* **Monitor de Cozinha KDS (M4.3):** Painel administrativo desktop/tablet com métricas operacionais em tempo real, cartões táteis de pedidos, observações de clientes e botões contextuais de transição de estado com proteção contra duplo clique.
* **Supabase Realtime (M4.4):** Sincronização automática em tempo real via WebSockets (Postgres Changes) com o padrão *Signal & Fetch*, garantindo que novos pedidos e atualizações reflitam instantaneamente em múltiplos ecrãs sem recurso a polling.
* **Histórico de Pedidos (M4.5.1):** Arquivo dedicado de pedidos finalizados (`completed` e `cancelled`) com consulta detalhada de itens, notas e valores monetários.

---

## 2. Stack Tecnológica

* **Framework:** Next.js 16 (App Router com Turbopack)
* **Linguagem:** TypeScript 5 (com tipagem estrita de ponta a ponta)
* **Biblioteca UI:** React 19 (Server Components e Client Components otimizados)
* **Estilização:** Tailwind CSS v4 com sistema de design responsivo e tokens semânticos
* **Validação de Esquemas:** Zod v4 (validação server-side de payloads, identificadores UUID e rejeição de duplicados)
* **Base de Dados e Autenticação:** Supabase com PostgreSQL 15+
* **Tempo Real:** Supabase Realtime (WebSockets com Replicação Lógica PostgreSQL)
* **Integração Supabase:** `@supabase/ssr` e `@supabase/supabase-js` (padrão singleton seguro no browser e SSR server client)
* **Iconografia:** Lucide React

---

## 3. Estado dos Milestones

| Milestone | Designação | Estado | Descrição |
| :--- | :--- | :--- | :--- |
| **M1** | Digital Menu Interface | Concluído | Menu mobile-first, navegação por categorias, drawer de carrinho, pesquisa com filtros e modais de detalhe. |
| **M2** | Supabase Multi-Tenant Integration | Concluído | Schema relacional, Row Level Security, seed de 57 produtos, 10 categorias e 10 mesas reais do Gulas. |
| **M3** | Real Ordering System | Concluído | Server Actions (`createOrder`), validação Zod, RPC PostgreSQL atómica, proteção contra double-submit e confirmação real de pedidos. |
| **M4.1** | Staff Auth & Protected Routes | Concluído | Autenticação de staff, controlo de permissões por perfil (`owner`, `manager`, `staff`) e rotas administrativas protegidas. |
| **M4.2** | Order Management Backend | Concluído | Server Actions seguras (`getActiveOrders`, `getOrderById`, `updateOrderStatus`), isolamento por `restaurant_id` e máquina de estados estrita. |
| **M4.3** | Kitchen Display System (KDS) UI | Concluído | Dashboard interativo de cozinha/sala com contadores operacionais (KPIs), cartões detalhados e transições de estado contextuais. |
| **M4.4** | Supabase Realtime KDS | Concluído | Subscrição em tempo real com autenticação JWT prévia, padrão *Signal & Fetch*, coalescing/debounce (300ms) e `REPLICA IDENTITY FULL`. |
| **M4.5.1** | Order History & Details | Concluído | Histórico de pedidos arquivados (`completed`/`cancelled`), modal com discriminação total de artigos e navegação integrada no cabeçalho. |
| **M4.5.2** | History Search & Multi-Filters | Concluído | Pesquisa instantânea por número de pedido e filtros multicritério combinados (estado, mesa dinâmica e período temporal). |
| **M4.5.3** | Admin UX & Polish | Concluído | Confirmação explícita de cancelamento, feedback de loading isolado por cartão, destaque visual para novos pedidos e acessibilidade total por teclado. |
| **M5** | Backoffice & Analytics | Planeado | Gestão de ementa, controlo de stock/disponibilidade e métricas financeiras. |

---

## 4. Arquitetura de Dados (PostgreSQL Schema)

O esquema da base de dados é gerido através de migrações versionadas em `supabase/migrations/`:

### Tabelas Principais

1. **`restaurants`**: Metadados do restaurante (nome, slug, morada, horário, timezone, estado ativo e aberto).
2. **`profiles`**: Associação de utilizadores (`auth.users`) a restaurantes com papéis de gestão (`owner`, `manager`, `staff`).
3. **`categories`**: Categorias de menu ordenadas (`display_order`), associadas a cada restaurante.
4. **`products`**: Catálogo de artigos com preços (`NUMERIC(10,2)`), custo interno opcional, badges, alergénios, notas e disponibilidade (`is_available`).
5. **`tables`**: Mesas ativas do restaurante com número, nome descritivo e identificador único.
6. **`restaurant_counters`**: Registo de contadores incrementais para geração do `order_number` sequencial por restaurante.
7. **`orders`**: Registo principal do pedido com `order_number`, `table_id`, `table_number`, `subtotal`, `total`, `status` (`pending`, `accepted`, `preparing`, `ready`, `completed`, `cancelled`) e notas do cliente.
8. **`order_items`**: Linhas do pedido com snapshots históricos imutáveis (`product_name`, `unit_price`, `unit_cost`, `quantity`, `notes`).

---

## 5. Máquina de Estados de Pedidos (M4.2 / M4.3)

```
[ pending ] ──────► [ accepted ] ──────► [ preparing ] ──────► [ ready ] ──────► [ completed ]
     │                    │                    │
     └────────────────────┴────────────────────┴────────► [ cancelled ]
```

* **Transições Permitidas:**
  * `pending` ➔ `accepted` \| `cancelled`
  * `accepted` ➔ `preparing` \| `cancelled`
  * `preparing` ➔ `ready` \| `cancelled`
  * `ready` ➔ `completed`
  * `completed` / `cancelled`: Estados terminais imutáveis (arquivados para o Histórico).

---

## 6. Estrutura de Diretórios do Projeto

```
gulas/
├── src/
│   ├── actions/
│   │   ├── auth.ts                  # Server Actions de autenticação e logout
│   │   ├── order-management.ts      # Server Actions de gestão de pedidos (KDS e Histórico)
│   │   └── orders.ts                # Server Action pública para submissão de pedidos
│   ├── app/
│   │   ├── admin/
│   │   │   ├── (protected)/
│   │   │   │   ├── layout.tsx       # Layout protegido com verificação de sessão de staff
│   │   │   │   ├── orders/
│   │   │   │   │   ├── page.tsx     # Monitor KDS de cozinha em tempo real
│   │   │   │   │   └── history/
│   │   │   │   │       └── page.tsx # Histórico de pedidos finalizados
│   │   │   ├── login/
│   │   │   │   └── page.tsx         # Página de login administrativo
│   │   │   ├── layout.tsx           # Layout base da área administrativa
│   │   │   └── page.tsx             # Redirecionamento admin
│   │   ├── menu/
│   │   │   └── [restaurantSlug]/
│   │   │       ├── page.tsx         # Menu digital público
│   │   │       └── table/[tableNumber]/
│   │   │           └── page.tsx     # Menu digital com mesa bloqueada por URL/QR code
│   │   ├── globals.css              # Configurações globais e tokens semânticos Tailwind v4
│   │   ├── layout.tsx               # Root Layout com injeção do CartProvider
│   │   └── page.tsx                 # Página inicial de apresentação
│   ├── components/
│   │   ├── admin/
│   │   │   ├── AdminHeader.tsx      # Cabeçalho administrativo com identidade e perfil
│   │   │   ├── AdminNav.tsx         # Navegação entre Monitor KDS e Histórico
│   │   │   ├── LogoutButton.tsx     # Botão seguro de término de sessão
│   │   │   ├── history/
│   │   │   │   ├── OrderHistoryDetailModal.tsx # Modal de inspeção detalhada de pedido
│   │   │   │   └── OrderHistoryView.tsx        # Tabela e cartões do histórico
│   │   │   └── orders/
│   │   │       ├── OrderCard.tsx           # Cartão tátil de pedido no KDS
│   │   │       ├── OrderDashboard.tsx      # Dashboard KDS com métricas e grelha
│   │   │       ├── OrderItemsList.tsx      # Listagem de artigos e observações
│   │   │       ├── OrderStatusActions.tsx  # Botões de transição com proteção de duplo clique
│   │   │       └── OrderStatusBadge.tsx    # Badges visuais de estado
│   │   ├── menu/
│   │   │   ├── CartDrawer.tsx       # Gaveta lateral do carrinho e revisão do pedido
│   │   │   ├── CategoryNav.tsx      # Barra adesiva de navegação por categorias
│   │   │   ├── FloatingCartBar.tsx  # Barra flutuante inferior com total e contagem
│   │   │   ├── OrderConfirmationModal.tsx # Modal de confirmação com stepper de estado
│   │   │   ├── ProductCard.tsx      # Cartão de produto com imagem e badges
│   │   │   ├── ProductDetailModal.tsx # Modal com detalhes, observações e alergénios
│   │   │   ├── RestaurantHeader.tsx # Cabeçalho com informações do restaurante
│   │   │   ├── RestaurantMenuView.tsx # Vista principal agregadora do menu
│   │   │   ├── SearchBar.tsx        # Pesquisa em tempo real com filtros por badge
│   │   │   └── TableSelector.tsx    # Seletor de mesa para pedidos manuais
│   │   └── ui/
│   │       ├── Badge.tsx            # Componente de tags
│   │       └── Toast.tsx            # Notificações temporárias de feedback
│   ├── context/
│   │   └── CartContext.tsx          # Gestão de estado do carrinho e ciclo de checkout
│   ├── hooks/
│   │   └── useOrdersRealtime.ts     # Hook dedicado à subscrição Supabase Realtime
│   ├── lib/
│   │   ├── auth/
│   │   │   └── staff.ts             # Validação server-side de staff autenticado
│   │   ├── supabase/
│   │   │   ├── client.ts            # Cliente Supabase Singleton para o browser
│   │   │   ├── server.ts            # Cliente Supabase SSR para Server Components/Actions
│   │   │   └── types.ts             # Tipos TypeScript sincronizados com o PostgreSQL
│   │   └── validations/
│   │       ├── auth.ts              # Esquemas Zod para login
│   │       ├── order-management.ts # Esquemas Zod e validadores de transição KDS
│   │       └── order.ts             # Esquemas Zod para criação de pedidos
│   ├── services/
│   │   └── restaurantService.ts     # Camada de acesso a dados públicos do menu
│   └── types/
│       └── restaurant.ts            # Definições de tipos centrais da aplicação
├── supabase/
│   ├── migrations/
│   │   ├── 20260928_initial_schema.sql       # Schema inicial, tabelas, índices e RLS
│   │   ├── 20260928_create_order_atomic.sql  # RPC transacional para criação de pedidos
│   │   └── 20260929_enable_orders_realtime.sql # Configuração Realtime e REPLICA IDENTITY
│   └── seed.sql                     # Dados reais de teste (Gulas)
├── package.json
├── tsconfig.json
└── next.config.ts
```

---

## 7. Instalação e Execução Local

### Pré-requisitos
* Node.js >= 18.17.0
* npm >= 9.0.0
* Projeto ativo no Supabase

### Passo 1: Instalar Dependências
```bash
npm install
```

### Passo 2: Configurar Variáveis de Ambiente
Crie um ficheiro `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sua-chave-publica-aqui
NEXT_PUBLIC_DEFAULT_RESTAURANT_SLUG=gulas
```

### Passo 3: Iniciar o Servidor de Desenvolvimento
```bash
npm run dev
```

Aceda a [http://localhost:3000](http://localhost:3000).

---

## 8. Rotas Disponíveis

### Menu Público (Cliente)
* **`/`** — Apresentação da plataforma e atalhos para os menus.
* **`/menu/gulas`** — Menu digital completo do Gulas com seleção de mesa no carrinho.
* **`/menu/gulas/table/4`** — Menu digital com a Mesa 4 pré-selecionada e bloqueada por contexto de URL/QR code.

### Administração & Cozinha (Staff)
* **`/admin/login`** — Página de autenticação de staff.
* **`/admin/orders`** — Monitor KDS de cozinha e sala em tempo real (Área Protegida).
* **`/admin/orders/history`** — Histórico e arquivo de pedidos finalizados com inspeção de detalhes (Área Protegida).

---

## 9. Validação e Qualidade de Código

Para validar tipos TypeScript, regras de linter e integridade do bundle de produção:

```bash
# Executar verificação estática com ESLint
npm run lint

# Executar compilação TypeScript e build de produção Next.js
npm run build
```

---

## 10. Segurança e Boas Práticas Implementadas

1. **Isolamento de Credenciais:** A chave privilegiada `service_role` nunca é importada no projeto frontend nem em Server Actions. Toda a comunicação respeita estritamente o princípio do menor privilégio.
2. **Multi-Tenant Server-Driven:** O identificador `restaurant_id` é sempre determinado no servidor através de `getAuthenticatedStaff()`, impedindo manipulação de dados entre restaurantes.
3. **Padrão Signal & Fetch no Realtime:** O WebSocket do Realtime é utilizado apenas como gatilho de sinalização; a obtenção dos dados de pedidos é sempre executada via Server Action autorizada (`getActiveOrders()`), preservando a consistência das regras de negócio e de RLS.
4. **Proteção de Dados e Sanitização:** Mensagens de erro internas da base de dados e estruturas SQL são intercetadas e convertidas em mensagens semânticas e amigáveis antes de chegarem ao utilizador.
