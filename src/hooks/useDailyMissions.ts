import { useCallback, useEffect, useState } from "react"
import { USER_SCOPE_EVENT, getUserId } from "@/lib/userScope"
import {
  MISSIONS,
  MISSION_UPDATE_EVENT,
  CHEST_THRESHOLD,
  CHEST_REWARD_GEMS,
  CHEST_REWARD_XP,
  SPECIAL_QUEST_COOLDOWN_DAYS,
  getDailySpecialQuest,
  isSpecialQuestAvailable,
  isSpecialQuestCompletedToday,
  readMissionsStorage,
  openDailyChest,
  completeMission,
} from "@/lib/missions"

export type { Mission, SpecialQuest } from "@/lib/missions"

export function useDailyMissions() {
  const [state, setState] = useState(readMissionsStorage)
  const [questCompleted, setQuestCompleted] = useState(isSpecialQuestCompletedToday)
  const [questAvailable, setQuestAvailable] = useState(isSpecialQuestAvailable)

  const refresh = useCallback(() => {
    setState(readMissionsStorage())
    setQuestCompleted(isSpecialQuestCompletedToday())
    setQuestAvailable(isSpecialQuestAvailable())
  }, [])

  // Auto-complete visit mission if user is logged in
  useEffect(() => {
    if (getUserId()) completeMission("visit")
  }, [])

  // Re-read on MISSION_UPDATE_EVENT (fired by completeMission / openDailyChest / tryCompleteSpecialQuest)
  useEffect(() => {
    window.addEventListener(MISSION_UPDATE_EVENT, refresh)
    return () => window.removeEventListener(MISSION_UPDATE_EVENT, refresh)
  }, [refresh])

  // Re-read on user scope change (login/logout)
  useEffect(() => {
    const onScope = () => {
      refresh()
      // Also try to auto-complete visit if user is now logged in
      if (getUserId()) completeMission("visit")
    }
    window.addEventListener(USER_SCOPE_EVENT, onScope)
    return () => window.removeEventListener(USER_SCOPE_EVENT, onScope)
  }, [refresh])

  // Periodic daily-reset check
  useEffect(() => {
    const interval = setInterval(refresh, 60_000)
    return () => clearInterval(interval)
  }, [refresh])

  const handleOpenChest = useCallback(() => {
    openDailyChest()
  }, [])

  const doneCount = MISSIONS.filter((m) => state.completed[m.id]).length
  const chestUnlocked = doneCount >= CHEST_THRESHOLD
  const specialQuest = getDailySpecialQuest()

  return {
    missions: MISSIONS,
    completed: state.completed,
    doneCount,
    chestUnlocked,
    chestOpened: state.chestOpened,
    handleOpenChest,
    specialQuest,
    questCompleted,
    questAvailable,
    CHEST_THRESHOLD,
    CHEST_REWARD_GEMS,
    CHEST_REWARD_XP,
    SPECIAL_QUEST_COOLDOWN_DAYS,
  }
}
