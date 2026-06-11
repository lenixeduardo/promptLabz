import { useContext } from "react"
import { AchievementsContext, type AchievementsCtx } from "@/contexts/AchievementsContext"

export function useAchievements(): AchievementsCtx {
  const ctx = useContext(AchievementsContext)
  if (!ctx) throw new Error("useAchievements must be used inside <AchievementsProvider>")
  return ctx
}
