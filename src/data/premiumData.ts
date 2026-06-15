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
  },
  {
    id: "monthly",
    title: "Mensal",
    monthlyPrice: "R$ 49,90",
    fullPrice: "R$ 49,90",
    description: "Cobrado mensalmente",
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
    icon: "Sparkles",
    title: "IA Ilimitada",
    description: "Sem limites de uso da inteligência artificial",
  },
  {
    id: "f2",
    icon: "FileText",
    title: "Templates Premium",
    description: "Acesse templates exclusivos de prompts",
  },
  {
    id: "f3",
    icon: "Award",
    title: "Certificados",
    description: "Receba certificados ao concluir trilhas",
  },
  {
    id: "f4",
    icon: "GraduationCap",
    title: "Skills Avançadas",
    description: "Desbloqueie skills exclusivas",
  },
  {
    id: "f5",
    icon: "MessageCircle",
    title: "Suporte Prioritário",
    description: "Atendimento prioritário via chat",
  },
  {
    id: "f6",
    icon: "Rocket",
    title: "Acesso Antecipado",
    description: "Novidades e recursos em primeira mão",
  },
]

// ── Trust Badges ─────────────────────────────────────────────────────────

export interface PremiumTrustItem {
  id: string
  icon: string // lucide-react icon name
  label: string
}

export const PREMIUM_TRUST_ITEMS: PremiumTrustItem[] = [
  {
    id: "t1",
    icon: "ShieldCheck",
    label: "Cancele fácil",
  },
  {
    id: "t2",
    icon: "Shield",
    label: "Ambiente seguro",
  },
  {
    id: "t3",
    icon: "Users",
    label: "Mais de 50 mil usuários",
  },
]
