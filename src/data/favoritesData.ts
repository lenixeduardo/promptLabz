// ═══════════════════════════════════════════════════════════════════════════
// Favorites — Mock Data (Empty State + Suggestions)
// ═══════════════════════════════════════════════════════════════════════════

export type FavoriteTabKey = "prompts" | "templates" | "news" | "tracks"

export interface FavoriteTab {
  key: FavoriteTabKey
  label: string
}

export const FAVORITES_TABS: FavoriteTab[] = [
  { key: "prompts", label: "Prompts" },
  { key: "templates", label: "Templates" },
  { key: "news", label: "Notícias" },
  { key: "tracks", label: "Trilhas" },
]

// ── Suggestions (Dicas para você) ────────────────────────────────────────

export interface FavoriteSuggestion {
  id: string
  title: string
  description: string
  icon: string // lucide-react icon name
  to: string
}

export const FAVORITES_SUGGESTIONS: FavoriteSuggestion[] = [
  {
    id: "s1",
    title: "Explorar conteúdos",
    description: "Descubra novos prompts e habilidades",
    icon: "Search",
    to: "/lab",
  },
  {
    id: "s2",
    title: "Ver trilhas de aprendizado",
    description: "Complete módulos e ganhe conquistas",
    icon: "GraduationCap",
    to: "/learn",
  },
  {
    id: "s3",
    title: "Ler novidades",
    description: "Fique por dentro das atualizações",
    icon: "Newspaper",
    to: "/notifications",
  },
]

// ── Empty state data per tab ─────────────────────────────────────────────
// In the MVP all tabs are empty. This structure allows easy future expansion.

export interface FavoriteTabContent {
  tabKey: FavoriteTabKey
  isEmpty: boolean
  /** In the future, this would hold actual favorite items */
  items: unknown[]
}

export function getFavoritesByTab(): Record<FavoriteTabKey, unknown[]> {
  return {
    prompts: [],
    templates: [],
    news: [],
    tracks: [],
  }
}
