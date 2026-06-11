import { useCallback, useEffect, useState } from "react"

const STORAGE_KEY = "promptlabz_favorite_skills"

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
      const next = prev.includes(skillName)
        ? prev.filter((n) => n !== skillName)
        : [...prev, skillName]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const isFavorite = useCallback(
    (skillName: string) => favorites.includes(skillName),
    [favorites]
  )

  return { favorites, toggleFavorite, isFavorite }
}
