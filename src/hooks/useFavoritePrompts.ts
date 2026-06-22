import { useCallback, useEffect, useState } from "react"
import { completeMission } from "@/lib/missions"

const STORAGE_KEY = "promptlabz_favorite_prompts"

function readFavoritePrompts(): string[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
  } catch {
    return []
  }
}

export function useFavoritePrompts() {
  const [favorites, setFavorites] = useState<string[]>(readFavoritePrompts)

  useEffect(() => {
    const onStorage = () => setFavorites(readFavoritePrompts())
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  const toggleFavoritePrompt = useCallback((promptId: string) => {
    setFavorites((prev) => {
      const isAdding = !prev.includes(promptId)
      const next = isAdding ? [...prev, promptId] : prev.filter((id) => id !== promptId)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      if (isAdding) completeMission("share")
      return next
    })
  }, [])

  const isFavoritePrompt = useCallback(
    (promptId: string) => favorites.includes(promptId),
    [favorites],
  )

  return { favoritePrompts: favorites, toggleFavoritePrompt, isFavoritePrompt }
}
