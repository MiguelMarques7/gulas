# Gulas — Pizza, Burger & Coffee (Digital Menu Platform)

Plataforma digital para o restaurante **Gulas — Pizza, Burger & Coffee** (Vila das Aves, Portugal).

Aplicação mobile-first moderna construída com **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS**, **Supabase** e **PostgreSQL**.

---

## 🚀 Instalação e Execução

### 1. Pré-requisitos
* Node.js >= 18.x
* npm >= 9.x
* Projeto Supabase (opcional para desenvolvimento com fallback offline)

### 2. Instalar Dependências
```bash
npm install
```

### 3. Configurar Variáveis de Ambiente
Crie um ficheiro `.env.local` na raiz do projeto baseado no `.env.example`:

```bash
cp .env.example .env.local
```

Preencha as variáveis com as credenciais do seu projeto Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key-here
```

> **Nota sobre o modo Offline:** Se estas variáveis não estiverem configuradas, a aplicação executa automaticamente em modo de desenvolvimento offline utilizando o dataset local em `src/data/mockRestaurant.ts`. Se estiverem configuradas e ocorrer um erro na base de dados, o erro é explicitamente registado.

### 4. Iniciar Servidor de Desenvolvimento
```bash
npm run dev
```
Aceda a [http://localhost:3000](http://localhost:3000).

---

## 🗄️ Base de Dados (Supabase + PostgreSQL)

### 1. Estrutura do Backend
* `supabase/migrations/20260928_initial_schema.sql`: Schema completo da base de dados, constraints, índices, triggers de `updated_at`, função de numeração de pedidos sequencial e políticas completas de Row Level Security (RLS).
* `supabase/seed.sql`: Seed fiel dos dados do Gulas (1 restaurante, 10 categorias, 57 produtos com `cost = NULL` e 10 mesas com QR codes).
* `src/lib/supabase/client.ts`: Cliente Supabase para Client Components (`@supabase/ssr`).
* `src/lib/supabase/server.ts`: Cliente Supabase para Server Components e Server Actions (`@supabase/ssr`).
* `src/lib/supabase/types.ts`: Tipos TypeScript gerados a partir do schema PostgreSQL.
* `src/services/restaurantService.ts`: Camada de acesso a dados isolada (Data Access Layer).

### 2. Como Aplicar a Migration no Supabase
Execute o script de migration no **SQL Editor** do Supabase Studio ou através da CLI do Supabase:

```bash
# Via Supabase CLI (se configurada localmente)
supabase db push
# ou execute o conteúdo de supabase/migrations/20260928_initial_schema.sql no SQL Editor do Supabase
```

### 3. Como Executar o Seed no Supabase
Execute o conteúdo de `supabase/seed.sql` no **SQL Editor** do painel do Supabase.

Isto irá inserir:
- **1 Restaurante**: `gulas` (Gulas — Pizza, Burger & Coffee)
- **10 Categorias**: Entradas, Caracoizzz, Panuozzos, Novidades, Burgers, Pregos, Pizzas Clássicas, Pizzas Especiais, Sobremesas, Bebidas
- **57 Produtos**: Todos os itens do cardápio com preços, badges, alergénios, notas e `cost = NULL`
- **10 Mesas**: Mesas 1 a 10 para testes de rotas `/menu/gulas/table/[tableNumber]`

---

## 🔒 Row Level Security (RLS)

Todas as tabelas têm RLS ativado (`ENABLE ROW LEVEL SECURITY`):
* **`restaurants`**: Leitura pública permitida apenas para restaurantes com `is_active = true`. Gestão restrita à equipa associada (`profiles`).
* **`categories`**: Leitura pública apenas de categorias ativas de restaurantes ativos.
* **`products`**: Leitura pública apenas de produtos disponíveis pertencentes a categorias e restaurantes ativos.
* **`tables`**: Leitura pública apenas de mesas ativas para resolução de rotas de QR code.
* **`profiles`**: Leitura e escrita restritas estritamente ao utilizador autenticado (`auth.uid() = id`).
* **`orders` / `order_items`**: Escrita pública desativada nesta fase.
* **`restaurant_counters`**: Acesso público direto bloqueado; numeração gerada via função `get_next_order_number()` protegida com `SECURITY DEFINER` e `SET search_path = public`.

---

## 📱 Rotas Disponíveis

* `/`: Redirecionamento para o menu do Gulas
* `/menu/gulas`: Menu Digital completo do Gulas
* `/menu/gulas/table/4`: Menu Digital com mesa pré-selecionada e bloqueada (Mesa 4)
* `/menu/gulas?table=2`: Menu Digital com mesa pré-selecionada via query string

---

## 🛠️ Build e Validação

Para validar o código e verificar tipos TypeScript e linting:

```bash
npm run build
```
