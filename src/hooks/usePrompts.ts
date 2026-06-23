import { useState, useEffect } from "react"
import { getPrompts, DbPrompt } from "@/lib/db"
import { PROMPTS, PromptCard } from "@/data/promptsData"
import { errorLogger } from "@/lib/errorLogging"

function mapDbPrompt(p: DbPrompt): PromptCard {
  return {
    title: p.title,
    difficulty: p.difficulty as PromptCard["difficulty"],
    color: p.color as PromptCard["color"],
    category: p.category as PromptCard["category"],
    promptText: p.prompt_text,
    description: p.description,
    exampleInput: p.example_input ?? undefined,
    exampleOutput: p.example_output ?? undefined,
  }
}

export function usePrompts(category?: string, difficulty?: string) {
  const fallback = category ? PROMPTS.filter(p => p.category === category) : PROMPTS
  const [prompts, setPrompts] = useState<PromptCard[]>(fallback)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPrompts = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await getPrompts(category, difficulty)
      if (result.data && result.data.length > 0) {
        setPrompts(result.data.map(mapDbPrompt))
      } else if (result.data && result.data.length === 0) {
        setPrompts(fallback)
      }
      if (result.error) {
        setError(result.error)
        errorLogger.logApiError("/db/getPrompts", 500, result.error)
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Falha ao carregar prompts"
      setError(errorMsg)
      errorLogger.logError(err, "usePrompts.fetchPrompts")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPrompts()
  }, [category, difficulty])

  return { prompts, loading, error, refetch: fetchPrompts }
}
