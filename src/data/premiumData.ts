// ═══════════════════════════════════════════════════════════════════════════
// Premium / Paywall — Mock Data
// ═══════════════════════════════════════════════════════════════════════════

export type BillingCycle = "monthly" | "yearly"

// ── Plans ────────────────────────────────────────────────────────────────

export interface PremiumPlan {
  id: BillingCycle
  title: string
  monthlyPrice: string
  fullPrice: string
  oldPrice?: string
  badge?: string
  description: string
  icon: string // lucide-react icon name
}

export const PREMIUM_PLANS: PremiumPlan[] = [
  {
    id: "yearly",
    title: "Anual",
    monthlyPrice: "R$ 29,90",
    fullPrice: "R$ 358,80",
    oldPrice: "R$ 69,90",
    badge: "Mais escolhido",
    description: "Cobrado anualmente",
    icon: "Star",
  },
  {
    id: "monthly",
    title: "Mensal",
    monthlyPrice: "R$ 49,90",
    fullPrice: "R$ 49,90",
    description: "Cobrado mensalmente",
    icon: "CalendarCheck",
  },
]

// ── Features ─────────────────────────────────────────────────────────────

export interface PremiumFeature {
  id: string
  icon: string // lucide-react icon name
  title: string
  description?: string
}

export const PREMIUM_FEATURES: PremiumFeature[] = [
  {
    id: "f1",
    icon: "InfinityIcon",
    title: "IA ilimitada",
    description: "Gere prompts e respostas sem limites",
  },
  {
    id: "f2",
    icon: "Trophy",
    title: "Gamificação",
    description: "Ganhe XP, conquistas e suba de nível",
  },
  {
    id: "f3",
    icon: "BookOpen",
    title: "Conteúdo Premium",
    description: "Acesso a livros, guias e templates exclusivos",
  },
  {
    id: "f4",
    icon: "ShieldCheck",
    title: "Suporte Prioritário",
    description: "Atendimento rápido e dedicado",
  },
]
