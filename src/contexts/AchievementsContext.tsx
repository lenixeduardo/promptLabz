import { useCallback, useEffect, useRef, useState } from "react"
import {
  ACHIEVEMENTS,
  checkAchievements,
  loadAchievements,
  saveAchievements,
  updateStreak,
} from "@/lib/achievements"
import { loadStreak, saveStreak } from "@/lib/db"
import { AchievementsContext } from "./achievementsContextDef"

export type { AchievementsCtx } from "./achievementsContextDef"
export { AchievementsContext } from "./achievementsContextDef"

import type { AchievementsData, Achievement } from "@/lib/achievements"
import type { ReactNode } from "react"

export function AchievementsProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AchievementsData>(loadAchievements)
  const dataRef = useRef(data)
  useEffect(() => { dataRef.current = data }, [data])

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
    async (userId?: string, favoritesCount?: number): Promise<Achievement[]> => {
      const existing = dataRef.current

      // Calculate new streak locally first (optimistic)
      const { newLastVisit, newConsecutive } = updateStreak(existing.lastVisitDate, existing.consecutiveDays)

      let finalConsecutive = newConsecutive
      let finalLongest = Math.max(existing.longestStreak, newConsecutive)

      // Sync with Supabase if authenticated
      if (userId) {
        const { data: remote } = await loadStreak(userId)
        if (remote) {
          // Use the highest value between local and remote to avoid data loss
          finalConsecutive = Math.max(finalConsecutive, remote.currentStreak)
          // If remote last_visit_date is today, trust remote streak
          if (remote.lastVisitDate === newLastVisit) {
            finalConsecutive = remote.currentStreak
          }
          finalLongest = Math.max(finalLongest, remote.longestStreak, finalConsecutive)
        }

        // Persist updated streak to Supabase (fire-and-forget)
        saveStreak(userId, {
          currentStreak: finalConsecutive,
          longestStreak: finalLongest,
          lastVisitDate: newLastVisit,
        }).catch(() => {/* silent — localStorage is the fallback */})
      }

      const streakData: AchievementsData = {
        ...existing,
        lastVisitDate: newLastVisit,
        consecutiveDays: finalConsecutive,
        longestStreak: finalLongest,
      }

      const { newUnlocks, data: next } = checkAchievements(streakData, {
        consecutiveDays: finalConsecutive,
        favoritesCount,
      })

      if (newLastVisit !== existing.lastVisitDate || newUnlocks.length > 0 || finalConsecutive !== existing.consecutiveDays) {
        setData({ ...next, longestStreak: finalLongest })
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
