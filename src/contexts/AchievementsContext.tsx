import { createContext, useCallback, useEffect, useRef, useState } from "react"
import {
  ACHIEVEMENTS,
  type Achievement,
  type AchievementsData,
  checkAchievements,
  loadAchievements,
  saveAchievements,
  updateStreak,
} from "@/lib/achievements"

import type { ReactNode } from "react"

export interface AchievementsCtx {
  /** All achievement definitions */
  allAchievements: Achievement[]
  /** IDs of unlocked achievements */
  unlocked: string[]
  /** Raw data object (for condition checks) */
  data: AchievementsData
  /** Check achievements after a lesson completion */
  checkLessonComplete: (wasPerfect: boolean) => Achievement[]
  /** Check streak achievements on daily visit */
  checkDailyVisit: (favoritesCount?: number) => Achievement[]
  /** Add a visited category and check exploration achievements */
  visitCategory: (categoryId: string) => void
  /** Check favorites-based achievements */
  checkFavorites: (count: number) => Achievement[]
  /** Returns the Achievement object for an ID */
  getAchievement: (id: string) => Achievement | undefined
}

export const AchievementsContext = createContext<AchievementsCtx | undefined>(undefined)

export function AchievementsProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AchievementsData>(loadAchievements)
  const dataRef = useRef(data)
  useEffect(() => { dataRef.current = data }, [data])

  // Persist on changes
  useEffect(() => {
    saveAchievements(data)
  }, [data])

  const checkLessonComplete = useCallback(
    (wasPerfect: boolean): Achievement[] => {
      const prev = dataRef.current
      const { newUnlocks, data: next } = checkAchievements(prev, {
        totalLessonsCompleted: prev.totalLessonsCompleted + 1,
        perfectCount: prev.perfectCount + (wasPerfect ? 1 : 0),
      })
      if (newUnlocks.length > 0) {
        setData(next)
      }
      return newUnlocks
    },
    [],
  )

  const checkDailyVisit = useCallback(
    (favoritesCount?: number): Achievement[] => {
      const existing = dataRef.current
      const { newLastVisit, newConsecutive } = updateStreak(existing.lastVisitDate, existing.consecutiveDays)
      const streakData = { ...existing, lastVisitDate: newLastVisit, consecutiveDays: newConsecutive }

      const { newUnlocks, data: next } = checkAchievements(streakData, {
        consecutiveDays: newConsecutive,
        favoritesCount,
      })
      if (newLastVisit !== existing.lastVisitDate || newUnlocks.length > 0) {
        setData(next)
      }
      return newUnlocks
    },
    [],
  )

  const visitCategory = useCallback(
    (categoryId: string) => {
      const existing = dataRef.current
      if (existing.visitedCategories.includes(categoryId)) return

      const { newUnlocks, data: next } = checkAchievements(existing, {
        visitedCategories: [...existing.visitedCategories, categoryId],
      })
      if (newUnlocks.length > 0) {
        setData(next)
      } else {
        // Still save the visited category even if no new unlocks
        setData({ ...existing, visitedCategories: [...existing.visitedCategories, categoryId] })
      }
    },
    [],
  )

  const checkFavorites = useCallback(
    (count: number): Achievement[] => {
      const { newUnlocks, data: next } = checkAchievements(dataRef.current, { favoritesCount: count })
      if (newUnlocks.length > 0) {
        setData(next)
      }
      return newUnlocks
    },
    [],
  )

  const getAchievement = useCallback((id: string) => {
    return ACHIEVEMENTS.find((a) => a.id === id)
  }, [])

  return (
    <AchievementsContext.Provider
      value={{
        allAchievements: ACHIEVEMENTS,
        unlocked: data.unlocked,
        data,
        checkLessonComplete,
        checkDailyVisit,
        visitCategory,
        checkFavorites,
        getAchievement,
      }}
    >
      {children}
    </AchievementsContext.Provider>
  )
}
