import { useCallback, useEffect, useState } from "react"
import { completeMission } from "@/lib/missions"

const STORAGE_KEY = "promptlabz_favorite_skills"
const SKILL_MISSION_THRESHOLD = 3

function readFavorites(): string[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
  } catch {
    return []
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(readFavorites)

  // Sync across tabs via the "storage" event
  useEffect(() => {
    const onStorage = () => setFavorites(readFavorites())
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  const toggleFavorite = useCallback((skillName: string) => {
    setFavorites((prev) => {
      const isAdding = !prev.includes(skillName)
      const next = isAdding ? [...prev, skillName] : prev.filter((n) => n !== skillName)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      if (isAdding && next.length >= SKILL_MISSION_THRESHOLD) {
        completeMission("skill")
      }
      return next
    })
  }, [])

  const isFavorite = useCallback(
    (skillName: string) => favorites.includes(skillName),
    [favorites]
  )

  return { favorites, toggleFavorite, isFavorite }
}
