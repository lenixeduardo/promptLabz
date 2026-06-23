import { useState, useEffect } from "react"
import { getTrendingSkills, DbTrendingSkill } from "@/lib/db"
import { TRENDING_SKILLS, TrendingSkill } from "@/data/trendingSkillsData"
import { errorLogger } from "@/lib/errorLogging"

function mapDbSkill(s: DbTrendingSkill): TrendingSkill {
  return {
    name: s.name,
    description: s.description,
    category: s.category as TrendingSkill["category"],
    author: s.author,
    installs: s.installs,
    installsCount: s.installs_count,
    tags: s.tags,
    icon: s.icon,
  }
}

export function useTrendingSkills(category?: string) {
  const [skills, setSkills] = useState<TrendingSkill[]>(TRENDING_SKILLS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSkills = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await getTrendingSkills(category)
      if (result.data && result.data.length > 0) {
        setSkills(result.data.map(mapDbSkill))
      }
      if (result.error) {
        setError(result.error)
        errorLogger.logApiError("/db/getTrendingSkills", 500, result.error)
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Falha ao carregar habilidades em trending"
      setError(errorMsg)
      errorLogger.logError(err, "useTrendingSkills.fetchSkills")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSkills()
  }, [category])

  return { skills, loading, error, refetch: fetchSkills }
}
