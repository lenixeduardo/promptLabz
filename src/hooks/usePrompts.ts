import { useState, useEffect } from "react"
import { getPrompts, DbPrompt } from "@/lib/db"
import { PROMPTS, PromptCard } from "@/data/promptsData"

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

  useEffect(() => {
    setLoading(true)
    getPrompts(category, difficulty).then(({ data, error }) => {
      if (data && data.length > 0) setPrompts(data.map(mapDbPrompt))
      if (error) setError(error)
      setLoading(false)
    })
  }, [category, difficulty])

  return { prompts, loading, error }
}
