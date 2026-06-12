import { createContext } from "react"
import type { Achievement, AchievementsData } from "@/lib/achievements"

export interface AchievementsCtx {
  allAchievements: Achievement[]
  unlocked: string[]
  data: AchievementsData
  checkLessonComplete: (wasPerfect: boolean) => Achievement[]
  checkDailyVisit: (favoritesCount?: number) => Achievement[]
  visitCategory: (categoryId: string) => void
  checkFavorites: (count: number) => Achievement[]
  getAchievement: (id: string) => Achievement | undefined
}

export const AchievementsContext = createContext<AchievementsCtx | undefined>(undefined)
