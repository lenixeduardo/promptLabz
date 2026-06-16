import { useState, useEffect } from "react"
import { getTrendingSkills, DbTrendingSkill } from "@/lib/db"
import { TRENDING_SKILLS, TrendingSkill } from "@/data/trendingSkillsData"

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

  useEffect(() => {
    setLoading(true)
    getTrendingSkills(category).then(({ data, error }) => {
      if (data && data.length > 0) setSkills(data.map(mapDbSkill))
      if (error) setError(error)
      setLoading(false)
    })
  }, [category])

  return { skills, loading, error }
}
