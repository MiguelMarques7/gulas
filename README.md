# Gulas Platform — Digital Menu & Real Ordering System

Plataforma digital para restauracao e pedidos de mesa, desenvolvida de raiz com arquitetura multi-tenant, zero-trust frontend, transacoes atomicas na base de dados e experiencia de utilizador mobile-first de alto desempenho.

Atualmente configurada para o restaurante **Gulas — Pizza, Burger & Coffee** (Vila das Aves, Portugal).

---

## 1. Visao Geral e Destaques Arquiteturais

A plataforma foi desenhada para resolver os principais desafios operacionais e de seguranca de menus digitais e pedidos no proprio restaurante:

* **Zero-Trust Frontend:** O browser do cliente nunca e a fonte de verdade para precos, nomes ou totais. O cliente envia apenas identificadores de produto, quantidades e observacoes. O servidor valida a existencia, disponibilidade, categoria ativa e calcula todos os montantes com precisao monetaria em base de dados.
* **Atomicidade Transacional:** Toda a submissao de pedidos e executada atraves de uma funcao PostgreSQL transacional `SECURITY DEFINER` (`create_order_atomic`). Nunca existira uma ordem sem itens, nem itens orfaos.
* **Seguranca por Defeito (RLS):** Todas as tabelas possuem Row Level Security ativado. As tabelas `orders` e `order_items` permanecem 100% blindadas contra comandos diretos de `INSERT` publico.
* **Multi-Tenant Nativo:** A identificacao do restaurante e resolvida server-side por slug, isolando completamente produtos, categorias, mesas e contadores de pedidos entre diferentes estabelecimentos.
* **Contador de Pedidos Sequencial e Atomico:** O numero do pedido (`order_number`) e gerado por restaurante atraves de operacao atomica `ON CONFLICT DO UPDATE`, eliminando condicoes de corrida mesmo sob submissoes concorrentes simultaneas.

---

## 2. Stack Tecnologica

* **Framework:** Next.js 16 (App Router com Turbopack)
* **Linguagem:** TypeScript 5 (com tipagem estrita de ponta a ponta)
* **Biblioteca UI:** React 19 (Server Components e Client Components otimizados)
* **Estilizacao:** Tailwind CSS v4 com sistema de design responsivo e tokens semanticos
* **Validacao de Esquemas:** Zod v4 (validacao server-side de payloads e rejeicao de duplicados)
* **Base de Dados e Autenticacao:** Supabase com PostgreSQL 15+
* **Integracao Supabase:** `@supabase/ssr` e `@supabase/supabase-js` (sem recurso a chaves privilegiadas de servico no frontend)
* **Iconografia:** Lucide React

---

## 3. Estado dos Milestones

| Milestone | Designacao | Estado | Descricao |
| :--- | :--- | :--- | :--- |
| **M1** | Digital Menu Interface | Concluido | Menu mobile-first, navegacao por categorias, drawer de carrinho, pesquisa com filtros e modais de detalhe. |
| **M2** | Supabase Multi-Tenant Integration | Concluido | Schema relacional, Row Level Security, seed de 57 produtos, 10 categorias e 10 mesas reais do Gulas. |
| **M3** | Real Ordering System | Concluido | Server Actions (`createOrder`), validacao Zod, RPC PostgreSQL atomica, protecao contra double-submit e confirmacao real de pedidos. |
| **M4** | Kitchen Display System (KDS) & Real-time | Planeado | Painel de cozinha em tempo real via Supabase Realtime, gestao de estados de preparacao e tempos de entrega. |
| **M5** | Backoffice & Analytics | Planeado | Gestao de ementa, controlo de disponibilidade, metricas de vendas e margem por artigo. |

---

## 4. Arquitetura de Dados (PostgreSQL Schema)

O esquema da base de dados e gerido atraves de migracoes versionadas em `supabase/migrations/`:

### Tabelas Principais

1. **`restaurants`**: Metadados do restaurante (nome, slug, morada, horario, timezone, estado ativo e aberto).
2. **`profiles`**: Associacao de utilizadores (`auth.users`) a restaurantes com papeis de gestao (`owner`, `manager`, `staff`).
3. **`categories`**: Categorias de menu ordenadas (`display_order`), associadas a cada restaurante.
4. **`products`**: Catalogo de artigos com precos (`NUMERIC(10,2)`), custo interno opcional, badges, alergénios, notas e disponibilidade (`is_available`).
5. **`tables`**: Mesas ativas do restaurante com numero, nome descritivo e identificador unico.
6. **`restaurant_counters`**: Registo de contadores incrementais para geracao do `order_number` sequencial por restaurante.
7. **`orders`**: Registo principal do pedido com `order_number`, `table_id`, `table_number`, `subtotal`, `total`, `status` (`pending`, `accepted`, `preparing`, `ready`, `completed`, `cancelled`) e notas do cliente.
8. **`order_items`**: Linhas do pedido com snapshots historicos imutaveis (`product_name`, `unit_price`, `unit_cost`, `quantity`, `notes`).

---

## 5. Fluxo de Criacao de Pedido (M3 Ordering Flow)

```
[ Cliente / Browser ]
       │
       │ 1. Submete pedido (restaurantSlug, tableNumber, customerNotes, items[{productId, quantity, notes}])
       ▼
[ Next.js Server Action: createOrder() ('use server') ]
       │
       ├─► 2. Validacao estrita Zod (tipos, limites, sanitizacao e rejeicao de product_id duplicados)
       ├─► 3. Inicializacao do Supabase SSR Server Client (chaves publicas/anon)
       │
       ▼
[ PostgreSQL RPC: create_order_atomic() (SECURITY DEFINER) ]
       │
       ├─► 4. Validacao do restaurante (existencia, is_active = true, is_open = true)
       ├─► 5. Validacao da mesa (existencia no restaurante, is_active = true)
       ├─► 6. Validacao dos produtos (pertencem ao restaurante, is_available = true, categoria is_active = true)
       ├─► 7. Snapshot de precos oficiais lidos diretamente da tabela products
       ├─► 8. Calculo de subtotal e total com precisao NUMERIC em PostgreSQL
       ├─► 9. Incremento atomico do contador de pedidos (get_next_order_number)
       ├─► 10. INSERT em orders (status = 'pending')
       ├─► 11. INSERT em order_items com snapshots historicos
       └─► 12. Retorno de payload estruturado do pedido
               (Qualquer excecao desencadeia ROLLBACK total automatico)
       ▼
[ Resposta ao Frontend ]
       │
       ├─► Sucesso: Limpa carrinho (memoria e localStorage), abre OrderConfirmationModal com numero real
       └─► Erro: Mantem o carrinho 100% intacto e exibe mensagem amigavel descritiva
```

---

## 6. Estrutura de Diretorios do Projeto

```
gulas/
├── src/
│   ├── actions/
│   │   └── orders.ts                # Server Action segura para submissao de pedidos
│   ├── app/
│   │   ├── globals.css              # Configuracoes globais de estilo e Tailwind v4
│   │   ├── layout.tsx               # Root Layout com injecao do CartProvider
│   │   ├── page.tsx                 # Pagina inicial de apresentacao
│   │   └── menu/
│   │       └── [restaurantSlug]/
│   │           ├── page.tsx         # Menu digital publico do restaurante
│   │           └── table/[tableNumber]/
│   │               └── page.tsx     # Menu digital com mesa bloqueada por URL
│   ├── components/
│   │   ├── menu/
│   │   │   ├── CartDrawer.tsx       # Gaveta lateral do carrinho e revisao do pedido
│   │   │   ├── CategoryNav.tsx      # Barra adesiva de navegacao por categorias
│   │   │   ├── FloatingCartBar.tsx  # Barra flutuante inferior com total e contagem
│   │   │   ├── OrderConfirmationModal.tsx # Modal de confirmacao com stepper de estado
│   │   │   ├── ProductCard.tsx      # Cartao de produto com imagem e badges
│   │   │   ├── ProductDetailModal.tsx # Modal com detalhes, observacoes e alergénios
│   │   │   ├── RestaurantHeader.tsx # Cabecalho com informacoes do restaurante
│   │   │   ├── RestaurantMenuView.tsx # Vista principal agregadora do menu
│   │   │   ├── SearchBar.tsx        # Pesquisa em tempo real com filtros por badge
│   │   │   └── TableSelector.tsx    # Seletor de mesa para pedidos manuais
│   │   └── ui/
│   │       ├── Badge.tsx            # Componente de tags (novidade, especialidade, etc.)
│   │       └── Toast.tsx            # Notificacoes temporarias de feedback
│   ├── context/
│   │   └── CartContext.tsx          # Gestao de estado do carrinho e ciclo de checkout
│   ├── data/
│   │   └── mockRestaurant.ts        # Dataset local para fallback de desenvolvimento
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts            # Cliente Supabase para Client Components
│   │   │   ├── server.ts            # Cliente Supabase SSR para Server Components/Actions
│   │   │   └── types.ts             # Tipos TypeScript sincronizados com o PostgreSQL
│   │   └── validations/
│   │       └── order.ts             # Esquemas de validacao Zod
│   ├── services/
│   │   └── restaurantService.ts     # Camada de acesso a dados (Data Access Layer)
│   └── types/
│       └── restaurant.ts            # Definicoes de tipos da aplicacao
├── supabase/
│   ├── migrations/
│   │   ├── 20260928_initial_schema.sql       # Schema inicial, tabelas, indices e RLS
│   │   └── 20260928_create_order_atomic.sql  # RPC transacional para criacao de pedidos
│   └── seed.sql                     # Dados reais de teste (Gulas)
├── package.json
├── tsconfig.json
└── next.config.ts
```

---

## 7. Instalacao e Execucao Local

### Pre-requisitos
* Node.js >= 18.17.0
* npm >= 9.0.0
* Conta ou projeto no Supabase (opcional para visualizacao do menu offline)

### Passo 1: Instalar Dependencias
```bash
npm install
```

### Passo 2: Configurar Variaveis de Ambiente
Crie um ficheiro `.env.local` na raiz do projeto com base no `.env.example`:

```bash
cp .env.example .env.local
```

Preencha com as credenciais do seu projeto Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sua-chave-publica-aqui
```

### Passo 3: Aplicar as Migracoes no Supabase
No painel do Supabase, execute sequencialmente no **SQL Editor**:
1. `supabase/migrations/20260928_initial_schema.sql` (Cria tabelas, indices, RLS e contador).
2. `supabase/migrations/20260928_create_order_atomic.sql` (Cria a funcao RPC transacional de pedidos).
3. `supabase/seed.sql` (Insere o restaurante Gulas, 10 categorias, 57 produtos e 10 mesas).

### Passo 4: Iniciar o Servidor de Desenvolvimento
```bash
npm run dev
```

Aceda a [http://localhost:3000](http://localhost:3000).

---

## 8. Rotas Disponiveis

* **`/`** — Apresentacao da plataforma e atalhos para os menus.
* **`/menu/gulas`** — Menu digital completo do Gulas com selecao livre de mesa no carrinho.
* **`/menu/gulas/table/4`** — Menu digital com a Mesa 4 pre-selecionada e bloqueada por contexto de URL/QR code.
* **`/menu/gulas?table=2`** — Menu digital com mesa pre-selecionada via parametro de pesquisa.

---

## 9. Validacao e Qualidade de Codigo

Para validar tipos TypeScript, regras de linter e integridade do bundle de producao:

```bash
# Executar verificacao estatica com ESLint
npm run lint

# Executar compilacao TypeScript e build de producao Next.js
npm run build
```

---

## 10. Seguranca e Boas Praticas Implementadas

1. **Isolamento de Credenciais:** A chave privilegiada `service_role` nunca e importada no projeto frontend nem em Server Actions. Toda a comunicacao utiliza permissoes `anon` com validacao de seguranca garantida por funcoes `SECURITY DEFINER` e politicas RLS restritivas.
2. **Imutabilidade de Precos:** O valor cobrado e estritamente o preco registado na tabela `products` no momento exato da submissao.
3. **Idempotencia e Prevencao de Multiplos Cliques:** O estado `isSubmitting` bloqueia novos disparos e desativa o botao de checkout ate que o servidor responda.
4. **Protecao de Dados e Sanitizacao:** Mensagens de erro internas da base de dados e estruturas SQL sao interceptadas e convertidas em mensagens semanticas e amigaveis antes de chegarem ao utilizador.
