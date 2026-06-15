// ═══════════════════════════════════════════════════════════════════════════
// Notifications — Mock Data
// ═══════════════════════════════════════════════════════════════════════════

export type NotificationType =
  | "achievement"
  | "mention"
  | "system"
  | "reminder"

export interface AppNotification {
  id: string
  type: NotificationType
  title: string
  description: string
  createdAt: string // ISO date
  unread: boolean
  mention: boolean
  actionLabel?: string
  href?: string
}

export const NOTIFICATIONS_MOCK: AppNotification[] = [
  // ── Hoje ───────────────────────────────────────────────────────────────
  {
    id: "n1",
    type: "achievement",
    title: "Conquista desbloqueada! 🏆",
    description: "Você completou 'Primeira Lição' — continue assim!",
    createdAt: new Date(Date.now() - 1_800_000).toISOString(), // 30 min ago
    unread: true,
    mention: false,
  },
  {
    id: "n2",
    type: "mention",
    title: "Mencionaram você no fórum",
    description: "Carlos respondeu seu comentário sobre prompts avançados.",
    createdAt: new Date(Date.now() - 3_600_000).toISOString(), // 1h ago
    unread: true,
    mention: true,
  },
  {
    id: "n3",
    type: "system",
    title: "Nova skill disponível",
    description: "A skill 'Design Systems com Tailwind' foi adicionada ao catálogo.",
    createdAt: new Date(Date.now() - 7_200_000).toISOString(), // 2h ago
    unread: false,
    mention: false,
  },
  {
    id: "n4",
    type: "reminder",
    title: "Hora de estudar! ⏰",
    description: "Sua lição 'Introdução à Engenharia de Prompts' está te esperando.",
    createdAt: new Date(Date.now() - 14_400_000).toISOString(), // 4h ago
    unread: true,
    mention: false,
    actionLabel: "Continuar",
    href: "/learn?category=trending-skills",
  },

  // ── Anterior ───────────────────────────────────────────────────────────
  {
    id: "n5",
    type: "achievement",
    title: "3 dias consecutivos! 🔥",
    description: "Você manteve uma sequência de 3 dias de aprendizado.",
    createdAt: new Date(Date.now() - 36_000_000).toISOString(), // 10h ago
    unread: false,
    mention: false,
  },
  {
    id: "n6",
    type: "mention",
    title: "@você foi marcado em um comentário",
    description: "Mariana mencionou você no tópico 'Melhores práticas de prompt'.",
    createdAt: new Date(Date.now() - 86_400_000).toISOString(), // 1 day ago
    unread: false,
    mention: true,
  },
  {
    id: "n7",
    type: "system",
    title: "Atualização da plataforma",
    description: "Novo recurso de favoritos está disponível! Salve prompts e templates.",
    createdAt: new Date(Date.now() - 172_800_000).toISOString(), // 2 days ago
    unread: false,
    mention: false,
  },
  {
    id: "n8",
    type: "achievement",
    title: "Perfeição em lição 🎯",
    description: "Você acertou 100% na lição 'Prompt para Storytelling'.",
    createdAt: new Date(Date.now() - 259_200_000).toISOString(), // 3 days ago
    unread: false,
    mention: false,
  },
  {
    id: "n9",
    type: "reminder",
    title: "Explore novas categorias",
    description: "Você ainda não visitou a categoria 'Agentes & Workflows'.",
    createdAt: new Date(Date.now() - 345_600_000).toISOString(), // 4 days ago
    unread: false,
    mention: false,
  },
  {
    id: "n10",
    type: "system",
    title: "Premium liberado para teste",
    description: "Seu período de teste de 7 dias do Premium começou! Aproveite.",
    createdAt: new Date(Date.now() - 432_000_000).toISOString(), // 5 days ago
    unread: false,
    mention: false,
  },
]

// ── Helpers ──────────────────────────────────────────────────────────────

export type NotificationsFilter = "all" | "unread" | "mentions"

export function getNotificationsCounts(
  notifications: AppNotification[],
): Record<NotificationsFilter, number> {
  const all = notifications.length
  const unread = notifications.filter((n) => n.unread).length
  const mentions = notifications.filter((n) => n.mention).length
  return { all, unread, mentions }
}

export function filterNotifications(
  notifications: AppNotification[],
  filter: NotificationsFilter,
): AppNotification[] {
  switch (filter) {
    case "unread":
      return notifications.filter((n) => n.unread)
    case "mentions":
      return notifications.filter((n) => n.mention)
    default:
      return notifications
  }
}

export type NotificationGroup = {
  label: string
  items: AppNotification[]
}

/**
 * Group notifications into "Hoje" and "Anterior" based on their createdAt date.
 */
export function groupNotifications(notifications: AppNotification[]): NotificationGroup[] {
  const today = new Date()
  const todayStr = today.toISOString().slice(0, 10) // YYYY-MM-DD
  const yesterdayStr = new Date(today.getTime() - 86_400_000).toISOString().slice(0, 10)

  const todayItems: AppNotification[] = []
  const olderItems: AppNotification[] = []

  for (const n of notifications) {
    const dateStr = n.createdAt.slice(0, 10)
    if (dateStr === todayStr || dateStr === yesterdayStr) {
      todayItems.push(n)
    } else {
      olderItems.push(n)
    }
  }

  const groups: NotificationGroup[] = []
  if (todayItems.length > 0) groups.push({ label: "Hoje", items: todayItems })
  if (olderItems.length > 0) groups.push({ label: "Anterior", items: olderItems })
  return groups
}
