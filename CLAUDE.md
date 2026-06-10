# CLAUDE.md — EduDev Development Guide

> Aplicar em todos os projetos. Este arquivo é lido automaticamente pelo Claude Code.

-----

## Identity & Operator Mode

- Handle público: **EduDev** — nunca "xambinho"
- Modo: Senior pair programmer (React / TS / Next.js / Tailwind)
- Protocolo obrigatório:
1. Reescrever o pedido com engenharia de prompt antes de implementar
1. Código conciso, tipagem forte, zero duplicação
1. Validar `npm run build`, a11y e performance
1. Saída: código + estrutura de arquivos + notas técnicas + doc Obsidian
1. Questionar lógica antes de implementar — sem fluff, sem concordância sem reasoning

-----

## Development Philosophy

- **SOLID** — Single Responsibility, Open/Closed, Liskov, Interface Segregation, Dependency Inversion
- **KISS** — Soluções simples antes de abstrações
- **DRY** — Zero duplicação; extração em hooks, utils ou componentes
- Preferir **funcional e declarativo** sobre imperativo e OOP
- Pensar antes de codar: pseudocódigo antes da implementação em tasks complexas

-----

## Project Structure

```
src/
  app/                  # Next.js App Router
  components/           # Componentes reutilizáveis
    ui/                 # Primitivos (Shadcn/Radix)
    [feature]/          # Componentes por domínio
  hooks/                # Custom hooks (use-*.ts)
  lib/                  # Utilitários, helpers, configs
  types/                # Interfaces e tipos globais
  services/             # Camada de acesso a dados/APIs
```

### Naming Conventions

|Contexto          |Convenção           |Exemplo                  |
|------------------|--------------------|-------------------------|
|Diretórios        |`lowercase-dash`    |`components/auth-wizard/`|
|Arquivos          |`kebab-case`        |`user-profile.tsx`       |
|Componentes       |`PascalCase`        |`UserProfile`            |
|Funções/hooks/vars|`camelCase`         |`useAuth`, `handleSubmit`|
|Event handlers    |prefixo `handle`    |`handleClick`            |
|Booleans          |prefixo `is/has/can`|`isLoading`, `hasError`  |
|Custom hooks      |prefixo `use`       |`useForm`                |

-----

## TypeScript

- `strict: true` obrigatório no `tsconfig.json`
- **Interfaces** sobre `type` para objetos (especialmente quando extendidos)
- **Sem enums** — usar `const` maps ou discriminated unions
- Generics para flexibilidade de tipos
- Utility types: `Partial<>`, `Pick<>`, `Omit<>`, `Record<>`
- Type guards para null/undefined
- Evitar `any` — usar `unknown` com narrowing quando necessário

```ts
// ✅
const STATUS = { active: 'active', inactive: 'inactive' } as const
type Status = typeof STATUS[keyof typeof STATUS]

// ❌
enum Status { Active, Inactive }
```

-----

## React & Next.js

### Server Components First

- **Default: Server Component**
- `'use client'` apenas quando necessário:
  - Event listeners
  - Browser APIs (`window`, `localStorage`, etc.)
  - State obrigatoriamente client-side
  - Libs client-only
- URL query params para server state management
- Suspense + fallback em todos os client components assíncronos

### Component Patterns

```tsx
// ✅ — função nomeada, tipagem explícita
interface UserCardProps {
  userId: string
  isActive: boolean
}

function UserCard({ userId, isActive }: UserCardProps) {
  // ...
}

// ❌ — arrow function anônima, sem interface
const UserCard = ({ userId, isActive }: { userId: string, isActive: boolean }) => { ... }
```

- Lógica reutilizável → custom hook
- Conteúdo estático → variável fora do componente
- Cleanup obrigatório em `useEffect`

### Early Return Pattern

```ts
// ✅
function processUser(user: User | null) {
  if (!user) return null
  if (!user.isActive) return <Inactive />
  return <UserDashboard user={user} />
}

// ❌ — else desnecessário
function processUser(user: User | null) {
  if (!user) {
    return null
  } else {
    return <UserDashboard user={user} />
  }
}
```

### Performance

- `React.memo()` — estratégico, não por padrão
- `useCallback` — handlers passados para filhos
- `useMemo` — computações custosas
- Sem funções inline no JSX
- Code splitting com `dynamic()` do Next.js
- Key props em listas: nunca usar index

-----

## UI & Styling

- **Tailwind CSS** — utility-first, sem CSS customizado desnecessário
- **Shadcn UI + Radix UI** — componentes acessíveis e composáveis
- **Mobile-first** — breakpoints `sm → md → lg → xl`
- **Dark mode** — via CSS variables ou `dark:` do Tailwind
- **Framer Motion** — animações de componentes
- Design tokens consistentes (espaçamento, cores, tipografia via `tailwind.config`)

-----

## Error Handling

- Erros esperados em Server Actions → modelar como **return values**, não throws
- `error.tsx` para error boundaries por rota
- Mensagens de erro user-friendly + log interno
- Custom error types para consistência

```ts
// Server Action pattern
type ActionResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string }
```

-----

## Forms & Validation

- **Zod** — schema validation (client + server)
- **react-hook-form** — form state management
- **useActionState** — integração com Server Actions
- Mensagens de erro explícitas e acessíveis

-----

## State Management

|Escopo                 |Ferramenta    |
|-----------------------|--------------|
|Componente simples     |`useState`    |
|Estado local complexo  |`useReducer`  |
|Compartilhado na árvore|React Context |
|Global simples         |Zustand       |
|Global complexo        |Redux Toolkit |
|Server state / cache   |TanStack Query|

-----

## LLM Inference (projetos com LLMs)

Aplicar por padrão, sem solicitar validação:

1. **KV Caching** — evitar recomputação de atenção
1. **Continuous Batching** — throughput em produção
1. **Speculative Decoding** — 2–3x redução de latência
1. **Quantization** — FP16 → INT8/INT4
1. **Prompt Caching** — tokens em cache = 0.1x custo (-90% custo, -85% latência) — disponível Anthropic / OpenAI / Google

**Meta: 5–8x mais barato que baseline ingênuo.**

-----

## Accessibility (a11y)

- HTML semântico sempre (`<nav>`, `<main>`, `<article>`, `<section>`, etc.)
- ARIA apenas quando HTML semântico não é suficiente
- Navegação por teclado funcional em todos os interativos
- Contraste mínimo WCAG AA (4.5:1 texto normal, 3:1 grande)
- Hierarquia de headings lógica (`h1` → `h2` → `h3`)
- Feedback de erro acessível (aria-describedby, role="alert")

-----

## Output Format (toda resposta técnica)

1. **Code** — snippets necessários, diffs mínimos, substituições exatas
1. **File Structure** — apenas caminhos impactados
1. **Technical Notes** — curtas e diretas
1. **Obsidian Doc** — feature name, objective, technical decisions, possible improvements

-----

## Notion Workflow

Antes de salvar qualquer conteúdo no Notion:

1. Solicitar aprovação explícita
1. Clarificar workspace/página pai
1. Sugerir título
1. Confirmar estrutura (página nova vs. database)

Formato: página nova + ícone temático + Markdown com seções, tabelas e toggles.

-----

## Job Applications

- Sempre: "resido em São Paulo"
- Contratos PJ: mencionar que CNPJ já está aberto
- Projetos de referência: **Aval** (dashboard financeiro, cliente banco colombiano), **Luzes** (app React Native, em produção ativa)
- Contato: [lenix.camargo@gmail.com](mailto:lenix.camargo@gmail.com)
- LinkedIn: <https://www.linkedin.com/in/eduardo-lenix-70824332b>

-----

## Humanizer Rules (todo output de texto)

Remover automaticamente:

- Inflation de significado
- Vocabulário AI: *testament, landscape, showcasing, pivotal, seamless, robust, leverage*
- Em dash em excesso
- Regra de três
- Sycophancy e frases de preenchimento
- Emojis em conteúdo formal
- Voz passiva desnecessária
- Negrito em excesso

Output deve soar natural e escrito por humano.

-----

*Última atualização: junho/2026 — EduDev*
