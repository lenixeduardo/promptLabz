export interface DailyMission {
  id: string
  title: string
  description: string
  xpReward: number
  icon: string
  type: "lesson" | "challenge" | "news" | "visit" | "quiz"
  actionLabel: string
  actionHref: string
}

export const DAILY_MISSIONS: DailyMission[] = [
  {
    id: "daily-visit",
    title: "Visita diária",
    description: "Entre no app e mantenha sua sequência ativa.",
    xpReward: 5,
    icon: "🔥",
    type: "visit",
    actionLabel: "Já concluído",
    actionHref: "/home",
  },
  {
    id: "complete-lesson",
    title: "Completar uma lição",
    description: "Finalize qualquer lição da trilha de aprendizado.",
    xpReward: 20,
    icon: "📚",
    type: "lesson",
    actionLabel: "Ir para a Trilha",
    actionHref: "/learn",
  },
  {
    id: "prompt-challenge",
    title: "Desafio de prompt",
    description: "Pratique criando um prompt no Laboratório.",
    xpReward: 15,
    icon: "⚡",
    type: "challenge",
    actionLabel: "Ir ao Laboratório",
    actionHref: "/skills",
  },
  {
    id: "read-news",
    title: "Ler uma notícia de IA",
    description: "Fique por dentro das novidades sobre IA e LLMs.",
    xpReward: 10,
    icon: "📰",
    type: "news",
    actionLabel: "Ver Notícias",
    actionHref: "/news",
  },
  {
    id: "quick-quiz",
    title: "Quiz rápido",
    description: "Responda ao quiz diário para testar seus conhecimentos.",
    xpReward: 25,
    icon: "🎯",
    type: "quiz",
    actionLabel: "Fazer Quiz",
    actionHref: "/quiz",
  },
]

export const TOTAL_DAILY_XP = DAILY_MISSIONS.reduce((sum, m) => sum + m.xpReward, 0)
