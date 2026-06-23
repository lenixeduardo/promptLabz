import { useState, useEffect } from "react"
import { getLabCategories, getLabConfig, DbLabCategory, DbLabConfig } from "@/lib/db"
import { LAB_CATEGORIES, PROMPT_OF_THE_DAY, LabCategory } from "@/data/labCategoriesData"
import { errorLogger } from "@/lib/errorLogging"

type PromptOfTheDay = typeof PROMPT_OF_THE_DAY

function mapDbCategory(c: DbLabCategory): LabCategory {
  return {
    id: c.category_id,
    label: c.label,
    icon: c.icon,
    promptCount: c.prompt_count,
  }
}

function mapDbConfig(cfg: DbLabConfig): PromptOfTheDay {
  return {
    title: cfg.potd_title,
    description: cfg.potd_description,
    categoryId: cfg.potd_category_id,
  } as PromptOfTheDay
}

export function useLabCategories() {
  const [categories, setCategories] = useState<LabCategory[]>(LAB_CATEGORIES)
  const [promptOfTheDay, setPromptOfTheDay] = useState<PromptOfTheDay>(PROMPT_OF_THE_DAY)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [catRes, cfgRes] = await Promise.all([getLabCategories(), getLabConfig()])
      if (catRes.data && catRes.data.length > 0) {
        setCategories(catRes.data.map(mapDbCategory))
      }
      if (cfgRes.data) {
        setPromptOfTheDay(mapDbConfig(cfgRes.data))
      }
      if (catRes.error || cfgRes.error) {
        const errorMsg = catRes.error || cfgRes.error || "Falha ao carregar dados"
        setError(errorMsg)
        if (catRes.error) {
          errorLogger.logApiError("/db/getLabCategories", 500, catRes.error)
        }
        if (cfgRes.error) {
          errorLogger.logApiError("/db/getLabConfig", 500, cfgRes.error)
        }
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Falha ao carregar categorias"
      setError(errorMsg)
      errorLogger.logError(err, "useLabCategories.fetchData")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return { categories, promptOfTheDay, loading, error, refetch: fetchData }
}
