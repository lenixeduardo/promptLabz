import { createContext, useCallback, useEffect, useRef, useState } from "react"
import {
  ACHIEVEMENTS,
  type Achievement,
  type AchievementsData,
  checkAchievements,
  updateStreak,
} from "@/lib/achievements"
import {
  loadAchievements,
  saveAchievements,
  loadAchievementsFromDb,
  saveAchievementsToDb,
  syncLocalAchievementsToSupabase,
} from "@/lib/achievements-db"
import { useAuthContext } from "@/contexts/AuthContext"

import type { ReactNode } from "react"

export interface AchievementsCtx {
  /** All achievement definitions */
  allAchievements: Achievement[]
  /** IDs of unlocked achievements */
  unlocked: string[]
  /** Raw data object (for condition checks) */
  data: AchievementsData
  /** Whether we're still loading from DB on first mount */
  initialLoading: boolean
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
  const { user } = useAuthContext()
  const userId = user?.id ?? null

  // Start with localStorage data (fast, works offline, no flash)
  const [initialLoading, setInitialLoading] = useState(true)
  const [data, setData] = useState<AchievementsData>(loadAchievements)
  const dataRef = useRef(data)
  useEffect(() => { dataRef.current = data }, [data])

  // ── Load from DB on mount / on user change ──────────────────────────────
  const loadedUserIdRef = useRef<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setInitialLoading(false)
      return
    }

    // Only load from DB once per userId (handles user switching correctly)
    if (loadedUserIdRef.current === userId) return
    loadedUserIdRef.current = userId

    let cancelled = false

    ;(async () => {
      // 1. Try loading from DB
      const { data: dbData } = await loadAchievementsFromDb(userId)

      if (cancelled) return

      if (dbData) {
        // DB has data — use it as source of truth, overwrite localStorage
        setData(dbData)
        saveAchievements(dbData)
      } else {
        // No DB data yet — sync localStorage → DB (first login or new user)
        await syncLocalAchievementsToSupabase(userId)
      }

      setInitialLoading(false)
    })()

    return () => { cancelled = true }
  }, [userId])

  // ── Persist: always localStorage (offline-safe), DB when user is logged in ──
  const lastSavedRef = useRef("")

  useEffect(() => {
    // Always persist to localStorage (fast, no network needed)
    saveAchievements(data)

    // Write to DB when user is logged in (debounced via string diff)
    const json = JSON.stringify(data)
    if (userId && json !== lastSavedRef.current) {
      lastSavedRef.current = json
      saveAchievementsToDb(userId, data).catch(() => {
        // Silently fail — localStorage is the fallback
      })
    }
  }, [data, userId])

  // ── Methods ──────────────────────────────────────────────────────────────

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
        initialLoading,
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
