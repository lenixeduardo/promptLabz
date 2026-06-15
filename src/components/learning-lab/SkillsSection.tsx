import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import * as Icons from "@/lib/icons"
import {
  TRENDING_SKILLS,
  type TrendingSkill,
  type SkillCategory,
} from "@/data/trendingSkillsData"
import { useFavorites } from "@/hooks/useFavorites"
import { useAchievements } from "@/hooks/useAchievements"
import { trackSkillFavorited } from "@/lib/analytics"
import {
  SKILL_CATEGORIES,
  SkillsGridView,
} from "@/components/skills/shared"

export default function SkillsSection() {
  const navigate = useNavigate()
  const { favorites, toggleFavorite, isFavorite } = useFavorites()
  const achievements = useAchievements()
  const [activeCategory, setActiveCategory] = useState<SkillCategory | "Todas">("Todas")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredByCat =
    activeCategory === "Todas"
      ? TRENDING_SKILLS
      : TRENDING_SKILLS.filter((s) => s.category === activeCategory)

  const searched = useMemo(() => {
    if (!searchQuery.trim()) return filteredByCat
    const q = searchQuery.toLowerCase()
    return filteredByCat.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.author.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.tags.some((t) => t.includes(q))
    )
  }, [searchQuery, filteredByCat])

  const handleToggleFav = (skillName: string) => {
    const wasFav = isFavorite(skillName)
    toggleFavorite(skillName)
    if (!wasFav) {
      trackSkillFavorited(skillName)
      const newAchs = achievements.checkFavorites(favorites.length + 1)
      if (newAchs.length > 0 && import.meta.env.DEV) {
        console.log("[DEV] Novas conquistas desbloqueadas:", newAchs.map((a) => a.title))
      }
    }
  }

  const goToDetail = (skill: TrendingSkill) => {
    navigate(`/skill/${encodeURIComponent(skill.name)}`, { state: { skill } })
  }

  return (
    <div className="px-4 pt-8 pb-24">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-lg font-extrabold text-foregroundDark">
          ⚡ Central de Skills
        </h2>
        <button
          onClick={() => navigate("/skills")}
          className="text-xs font-semibold text-primary-dark"
        >
          Ver todas &gt;
        </button>
      </div>

      {/* Search bar */}
      <div className="relative mb-4">
        <div className="flex items-center gap-2 rounded-full border border-stroke-light bg-white px-5 py-2.5 shadow-sm ring-2 ring-pageBgLight">
          <Icons.Search className="h-4 w-4 text-foregroundMuted" strokeWidth={2} />
          <input
            type="text"
            placeholder="Buscar skills por nome, autor ou tag…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-foregroundDark placeholder:text-foregroundPlaceholder focus:outline-none"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="rounded-full p-1 text-foregroundMuted hover:bg-pageBgLight">
              <Icons.X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Category filter */}
      <div className="no-scrollbar mb-4 flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveCategory("Todas")}
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
            activeCategory === "Todas"
              ? "border-primary-dark bg-primary-dark text-white"
              : "border-stroke-light bg-white text-primary-dark hover:bg-pageBgLight"
          }`}
        >
          <Icons.LayoutGrid className="h-3.5 w-3.5" />
          Todas
        </button>
        {SKILL_CATEGORIES.map(({ label, icon }) => {
          const isActive = activeCategory === label
          return (
            <button
              key={label}
              onClick={() => setActiveCategory(label)}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                isActive
                  ? "border-primary-dark bg-primary-dark text-white"
                  : "border-stroke-light bg-white text-primary-dark hover:bg-pageBgLight"
              }`}
            >
              {icon}
              {label}
            </button>
          )
        })}
      </div>

      {/* Skills grid */}
      <SkillsGridView
        skills={searched}
        favorites={favorites}
        onToggleFav={handleToggleFav}
        onSkillClick={goToDetail}
      />
    </div>
  )
}
