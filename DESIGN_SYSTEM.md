# PromptLabz — Design System

## Fundamentos

PromptLabz usa **Tailwind CSS** com um conjunto de **CSS custom properties** (variáveis) definidas em `src/index.css`. Os tokens são expostos ao Tailwind via `tailwind.config.js` e mudam automaticamente entre modo claro e escuro.

---

## Paleta de Cores

### Tokens de Marca (invariantes)

| Token CSS | Hex | Uso |
|-----------|-----|-----|
| `--emerald` | `#22C55E` | Verde principal (botões, destaques) |
| `--mint` | `#4ADE80` | Verde claro (hover, highlights) |
| `--emerald-dark` | `#16A34A` | Verde pressionado |
| `--forest` | `#15803D` | Verde escuro (texto em fundo claro) |
| `--brand-purple` | `#9333EA` | Destaques secondários, tags premium |
| `--brand-blue` | `#2563EB` / `#3B82F6` | Ação secundária, links externos |
| `--brand-gold` | `#FBBF24` | Conquistas, estrelas, XP bônus |
| `--brand-orange` | `#F97316` | Alertas, missões especiais |
| `--duo-brand-green` | `#58CC02` | Variante Duolingo do verde (lição correta) |

### Tokens Semânticos (mudam com tema)

| Token | Light | Dark | Tailwind alias |
|-------|-------|------|----------------|
| `--page-bg` | `#F8FAF9` | `#05080A` | `bg-pageBg` |
| `--bg-primary` | `#F8FAF9` | `#05080A` | `bg-bgPrimary` |
| `--bg-secondary` | `#FFFFFF` | `#0E1513` | `bg-bgSecondary` |
| `--bg-card-dark` | `#EEF3F0` | `#14201B` | `bg-bgCardDark` |
| `--text-primary` | `#0A1F12` | `#F5F7F6` | `text-textPrimary` |
| `--text-secondary` | `#3A5A4B` | `#C2D1C8` | `text-textSecondary` |
| `--text-muted` | `#A0B5AA` | `#5E6F66` | `text-textMuted` |
| `--stroke-light` | `#DDE6E2` | `#1F2D27` | `border-stroke-light` |
| `--surface-soft` | `#F2F6F4` | `#10201A` | `bg-surface-soft` |
| `--surface-success` | `#E6F7ED` | `#052E16` | `bg-surface-success` |

### Tags de Dificuldade

| Nível | Background | Texto |
|-------|-----------|-------|
| Básico | `--tag-bg-basic` (`#FEF9C3`) | `--tag-text-basic` (`#92400E`) |
| Intermediário | `--tag-bg-intermediate` (`#F3E8FF`) | `--tag-text-intermediate` (`#7E22CE`) |
| Avançado | `--tag-bg-advanced` (`#E6F7ED`) | `--tag-text-advanced` (`#16A34A`) |

Classe Tailwind: `bg-tag-bgBasic text-tag-textBasic` (e variantes para os outros níveis).

---

## Tipografia

### Família de Fonte

Poppins carregada via Google Fonts em `index.html`. O alias `duolingo-sans` aponta para Poppins para compatibilidade.

```
font-sans → Poppins, duolingo-sans, -apple-system, ...
font-display → Poppins, duolingo-sans, sans-serif
```

### Hierarquia

| Uso | Classe Tailwind |
|-----|----------------|
| Título de página | `text-2xl font-bold` ou `text-3xl font-extrabold` |
| Seção / Card header | `text-lg font-semibold` |
| Corpo de texto | `text-sm` ou `text-base` |
| Caption / Auxilizar | `text-xs text-textMuted` |
| Botão | `text-sm font-semibold` ou `text-base font-bold` |

---

## Border Radius

| Token | Valor | Uso |
|-------|-------|-----|
| `rounded-sm` | `calc(var(--radius) - 4px)` ≈ `12px` | Badges pequenos |
| `rounded-md` | `calc(var(--radius) - 2px)` ≈ `14px` | Inputs, dropdowns |
| `rounded-lg` | `var(--radius)` = `16px` | Cards padrão |
| `rounded-xl` | `20px` (Tailwind padrão) | Cards destacados |
| `rounded-full` | `9999px` | Avatares, pills |
| `rounded-duo-btn` | `12px` | Botões estilo Duolingo |
| `rounded-duo-badge` | `2px` | Badges de status |

---

## Componentes UI (Radix + Shadcn)

Os primitivos em `src/components/ui/` são baseados em **shadcn/ui** com estilo `new-york` e base color `zinc`. Todos aceitam `className` para customização via Tailwind.

| Componente | Importação |
|-----------|-----------|
| `Button` | `@/components/ui/button` |
| `Input` | `@/components/ui/input` |
| `Card`, `CardHeader`, `CardContent` | `@/components/ui/card` |
| `Badge` | `@/components/ui/badge` |
| `Dialog`, `DialogContent`, `DialogHeader` | `@/components/ui/dialog` |
| `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` | `@/components/ui/tabs` |
| `Progress` | `@/components/ui/progress` |
| `Avatar`, `AvatarImage`, `AvatarFallback` | `@/components/ui/avatar` |
| `Tooltip`, `TooltipContent`, `TooltipTrigger` | `@/components/ui/tooltip` |

### Padrão de uso com `cn()`

```tsx
import { cn } from "@/lib/utils"

<button className={cn(
  "rounded-duo-btn px-6 py-3 font-bold text-sm",
  "bg-emerald text-white",
  isDisabled && "opacity-50 cursor-not-allowed"
)}>
```

---

## Componentes de Aplicação

Componentes de nível de aplicação construídos sobre os primitivos:

| Componente | Arquivo | Descrição |
|-----------|---------|-----------|
| `AppBottomNav` | `components/AppBottomNav.tsx` | Navegação inferior fixa (mobile-first) |
| `AppPageHeader` | `components/AppPageHeader.tsx` | Header de página com título e ações |
| `PillTabs` | `components/PillTabs.tsx` | Tabs estilo pill (filtros, abas) |
| `BrandLogo` | `components/BrandLogo.tsx` | Logo com tipografia da marca |
| `MascotGlow` | `components/MascotGlow.tsx` | Wrapper animado do mascote |
| `StreakWidget` | `components/StreakWidget.tsx` | Exibição de streak com chama |
| `StreakFlame` | `components/StreakFlame.tsx` | Ícone de chama animado |
| `LivesBar` | `components/LivesBar.tsx` | Barra de vidas (5 corações) |
| `ProgressCard` | `components/ProgressCard.tsx` | Card de progresso de categoria |
| `PageSEO` | `components/PageSEO.tsx` | Meta tags por página |
| `ErrorBoundary` | `components/ErrorBoundary.tsx` | Captura erros de renderização |
| `ScoreBurst` | `components/ScoreBurst.tsx` | Animação de pontuação |
| `ThemeToggle` | `components/ThemeToggle.tsx` | Botão de alternância de tema |

---

## Animações

As animações são definidas em `tailwind.config.js` e usadas via classe `animate-*`:

| Classe | Efeito | Uso |
|--------|--------|-----|
| `animate-flame-flicker` | Balanço de chama | `StreakFlame` |
| `animate-score-pop` | Pop de escala | Pontuação ao ganhar |
| `animate-level-badge-pop` | Pop com rotação | Badge de level up |
| `animate-achievement-unlock` | Brilho + escala | Conquista desbloqueada |
| `animate-podium-rise` | Sobe de baixo | Pódio de ranking |
| `animate-crown-float` | Float suave | Coroa do top 1 |
| `animate-mascot-float` | Float vertical | Mascote nas telas comemorativas |
| `animate-celebration-pop` | Pop de entrada | Telas de conclusão |
| `animate-fade-in` | Fade 0→1 | Transições de página |
| `animate-scale-in` | Scale + fade | Modais, popups |
| `animate-rank-entry` | Slide horizontal | Entrada de itens no ranking |
| `animate-ping-slow` | Pulse lento | Indicadores de atividade |

---

## Tema Dark/Light

### Implementação

- **Provider:** `ThemeProvider` em `src/components/ThemeProvider.tsx`
- **Persistência:** `localStorage` com chave `promptlabz-theme`
- **Detecção:** Respeita `prefers-color-scheme` do sistema se não houver preferência salva
- **Aplicação:** Classe `dark` ou `light` no `<html>` via `document.documentElement.classList`
- **Default:** Dark mode (sem preferência salva)

### Hook de uso

```tsx
import { useTheme } from "@/components/ThemeProvider"

function MyComponent() {
  const { theme, toggleTheme, setTheme } = useTheme()
  // theme: "dark" | "light"
}
```

---

## Estratégia Responsiva (Mobile vs Desktop)

### Abordagem: Mobile-First

O app é projetado **mobile-first**, com breakpoints Tailwind para expandir em telas maiores quando aplicável.

| Aspecto | Mobile | Desktop |
|---------|--------|---------|
| **Layout principal** | Coluna única, `max-w-md mx-auto` | Centralizado com `max-w-md` (SPA limitada) |
| **Navegação** | `AppBottomNav` fixo na base | Mesmo `AppBottomNav` (sem sidebar) |
| **Padding** | `px-4 pb-24` (espaço para bottom nav) | `px-4 pb-24` (consistente) |
| **Cards** | Full width | Full width dentro do container |
| **Tipografia** | Base: `text-sm` / `text-base` | Cresce com breakpoints `sm:` / `md:` |
| **Hero page** | Coluna única, mascote centralizado | Layout dois colunas (`md:flex-row`) |

### Viewport mínimo suportado: 320px

O app é testado e funcional a partir de 320px de largura (iPhone SE, dispositivos pequenos).

### Breakpoints utilizados

```
(default) — mobile: < 640px
sm: — 640px+  (tablets pequenos, usado esporadicamente)
md: — 768px+  (hero page, algumas seções de marketing)
lg: — 1024px+ (raramente utilizado — app é SPA mobile)
```

### Capacitor (Android)

Em builds Android via Capacitor, o WebView tem `androidScheme: https` para cookies seguros. A UI permanece a mesma — é o mesmo bundle React rodando em WebView. A resolução base alvo é `360x800` (Android médio).

---

## Ícones

Todos os ícones vêm da biblioteca **Lucide React**, importados via `src/lib/icons.ts` para garantir tree-shaking eficiente:

```ts
// src/lib/icons.ts — importe SEMPRE daqui, nunca direto de lucide-react
export { Star, Heart, Trophy, ... } from "lucide-react"
```

**Tamanhos padrão:**
- Ícone em botão: `size={16}` ou `size={18}`
- Ícone de navegação (bottom nav): `size={22}` ou `size={24}`
- Ícone de destaque / hero: `size={32}` ou maior

---

## Toast / Notificações de Sistema

Usa a biblioteca **Sileo** (`import { Toaster } from "sileo"`), posicionado no canto superior direito:

```tsx
// No App.tsx:
<Toaster position="top-right" />

// Uso nos componentes (via sonner API compatível):
import { toast } from "sileo"
toast.success("Lição concluída!")
toast.error("Erro ao salvar progresso")
toast("Dica: salve mais prompts para ganhar XP")
```

---

## Mascote

O mascote do PromptLabz é um gato-robô verde. Assets em `public/assets/`:

| Asset | Uso |
|-------|-----|
| `mascot-login-new.png` | Tela de loading / auth |
| `mascot-home.png` | Dashboard / home |
| `mascot-glow.png` | Telas comemorativas |
| `avatar-cat.png` | Avatar padrão de usuário |

O componente `MascotGlow` adiciona um halo animado ao mascote. Guia completo em `MASCOT_ICONS_GUIDE.md`.

---

## Utilitário `cn()`

```ts
// src/lib/utils.ts
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

Use sempre `cn()` para combinar classes Tailwind condicionalmente — garante que classes conflitantes sejam resolvidas corretamente pelo `tailwind-merge`.
