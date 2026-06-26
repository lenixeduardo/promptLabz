import { useMemo, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AlertCircle, RotateCw, Loader2 } from "lucide-react"
import * as Icons from "@/lib/icons"
import { sileo } from "sileo"
import { Button } from "@/components/ui/button"
import { type TrendingSkill, type SkillCategory } from "@/data/trendingSkillsData"
import { useTrendingSkills } from "@/hooks/useTrendingSkills"
import { useFavorites } from "@/hooks/useFavorites"
import { useAchievements } from "@/hooks/useAchievements"
import { trackSkillFavorited } from "@/lib/analytics"
import {
  SKILL_CATEGORIES,
  SkillIcon,
  CountBadge,
  SkillCard,
  SkillsGridView,
} from "@/components/skills/shared"

type ViewMode = "all" | "favorites" | "ranking"

// ─── Ranking View ─────────────────────────────────────────────────────────
function RankingView({
  skills,
  favorites,
  onToggleFav,
  onSkillClick,
}: {
  skills: TrendingSkill[]
  favorites: string[]
  onToggleFav: (name: string) => void
  onSkillClick: (s: TrendingSkill) => void
}) {
  const ranked = useMemo(() => [...skills].sort((a, b) => b.installsCount - a.installsCount), [skills])

  return (
    <div className="flex flex-col gap-2">
      <p className="mb-2 text-xs font-medium text-foregroundMuted">
        {ranked.length} skills ordenadas por número de instalações
      </p>
      {ranked.map((skill, idx) => {
        const rank = idx + 1
        const medal = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : null
        const isFav = favorites.includes(skill.name)

        return (
          <div
            key={skill.name}
            onClick={() => onSkillClick(skill)}
            className="group flex cursor-pointer items-center gap-3 rounded-2xl border border-stroke-muted bg-white px-4 py-3 shadow-sm transition-all hover:bg-surface-soft active:scale-[0.99]"
          >
            {/* Favorite heart */}
            <button
              onClick={(e) => { e.stopPropagation(); onToggleFav(skill.name) }}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-red-100"
              aria-label={isFav ? "Remover dos favoritos" : "Favoritar"}
            >
              <Icons.Heart
                className={`h-4 w-4 transition-all ${
                  isFav ? "fill-red-500 text-red-500" : "text-stroke-light group-hover:text-red-300"
                }`}
                strokeWidth={isFav ? 2.5 : 2}
              />
            </button>

            {/* Rank */}
            <div className="flex h-8 w-8 shrink-0 items-center justify-center">
              {medal ? (
                <span className="text-lg">{medal}</span>
              ) : (
                <span className="text-sm font-extrabold text-foregroundMuted">{rank}</span>
              )}
            </div>

            {/* Icon */}
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-pageBgLight">
              <SkillIcon iconName={skill.icon} />
            </span>

            {/* Info */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-foregroundDark">{skill.name}</p>
              <p className="text-[11px] font-medium text-foregroundMuted">{skill.category} · por {skill.author}</p>
            </div>

            {/* Installs badge */}
            <div className="flex shrink-0 flex-col items-end gap-0.5">
              <span className="text-sm font-extrabold text-emerald">{skill.installs}</span>
              <span className="text-[10px] font-medium text-foregroundMuted">instalações</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────
export default function Skills() {
  const navigate = useNavigate()
  const { skills: allSkills, loading, error, refetch } = useTrendingSkills()
  const { favorites, toggleFavorite, isFavorite } = useFavorites()
  const achievements = useAchievements()
  const [viewMode, setViewMode] = useState<ViewMode>("all")
  const [activeSkillCat, setActiveSkillCat] = useState<SkillCategory | "Todas">("Todas")
  const [searchQuery, setSearchQuery] = useState("")
  const [isRetrying, setIsRetrying] = useState(false)

  useEffect(() => {
    if (error) {
      sileo.error({ title: `Erro ao carregar skills: ${error}` })
    }
  }, [error])

  const handleRetry = async () => {
    setIsRetrying(true)
    await refetch()
    setIsRetrying(false)
  }

  const filteredByCat =
    activeSkillCat === "Todas"
      ? allSkills
      : allSkills.filter((s) => s.category === activeSkillCat)

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

  const favoritedSkills = useMemo(
    () => allSkills.filter((s) => favorites.includes(s.name)),
    [allSkills, favorites]
  )

  const displaySkills = viewMode === "favorites" ? favoritedSkills : searched

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
    <div className="min-h-screen bg-gradient-to-b from-pageBgLight to-white px-4 py-6">
      <div className="mx-auto w-full max-w-[1200px]">
        {/* Back button */}
        <div className="mb-4 flex items-center">
          <button
            onClick={() => navigate("/home")}
            className="flex items-center gap-1 rounded-full p-1.5 text-forest transition-colors hover:bg-surface-success"
            aria-label="Voltar"
          >
            <Icons.ChevronLeft className="h-6 w-6" />
          </button>
        </div>

        {/* Hero banner */}
        <div className="relative mb-8 w-full overflow-hidden rounded-3xl bg-gradient-to-r from-stroke-muted to-stroke-light px-6 py-8 shadow-sm">
          <h1 className="text-center text-xl font-extrabold text-foregroundDark">
            Central de Skills
          </h1>
          <p className="mt-0.5 text-center text-sm font-medium text-forest">
            Skills reais do{" "}
            <a href="https://www.skills.sh/" target="_blank" rel="noopener noreferrer" className="underline hover:text-foregroundDark">
              skills.sh
            </a>
          </p>
        </div>

        {/* Search bar */}
        <div className="relative mb-5">
          <div className="flex items-center gap-2 rounded-full border border-stroke-light bg-white px-5 py-3 shadow-sm ring-2 ring-pageBgLight">
            <Icons.Search className="h-5 w-5 text-foregroundMuted" strokeWidth={2} />
            <input
              type="text"
              placeholder="Buscar skills por nome, autor, categoria ou tag…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm text-foregroundDark placeholder:text-foregroundPlaceholder focus:outline-none"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} aria-label="Limpar busca" className="rounded-full p-1 text-foregroundMuted hover:bg-pageBgLight">
                <Icons.X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* View mode tabs */}
        <div className="no-scrollbar mb-3 flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => { setViewMode("all"); setActiveSkillCat("Todas") }}
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
              viewMode === "all"
                ? "border-primary-dark bg-primary-dark text-white dark:border-emerald dark:bg-emerald dark:text-[#0A1F12]"
                : "border-stroke-light bg-white text-primary-dark hover:bg-pageBgLight"
            }`}
          >
            <Icons.Grid3x3 className="h-4 w-4" />
            Todas
            <CountBadge count={allSkills.length} />
          </button>
          <button
            onClick={() => setViewMode("favorites")}
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
              viewMode === "favorites"
                ? "border-primary-dark bg-primary-dark text-white dark:border-emerald dark:bg-emerald dark:text-[#0A1F12]"
                : "border-stroke-light bg-white text-primary-dark hover:bg-pageBgLight"
            }`}
          >
            <Icons.Heart
              className={`h-4 w-4 ${viewMode === "favorites" ? "fill-white dark:fill-[#0A1F12]" : ""}`}
            />
            Favoritas
            <CountBadge count={favorites.length} />
          </button>
          <button
            onClick={() => setViewMode("ranking")}
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
              viewMode === "ranking"
                ? "border-primary-dark bg-primary-dark text-white dark:border-emerald dark:bg-emerald dark:text-[#0A1F12]"
                : "border-stroke-light bg-white text-primary-dark hover:bg-pageBgLight"
            }`}
          >
            <Icons.Trophy className="h-4 w-4" />
            Mais Instaladas
          </button>
        </div>

        {/* Step indicator bar */}
        <div className="mb-5 flex items-center gap-2">
          {(["all", "favorites", "ranking"] as ViewMode[]).map((mode) => (
            <div
              key={mode}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                viewMode === mode ? "bg-primary-dark" : "bg-stroke-muted opacity-50"
              }`}
            />
          ))}
        </div>

        {/* Error recovery UI */}
        {error && allSkills.length === 0 && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <AlertCircle className="mx-auto mb-3 h-12 w-12 text-red-500" />
            <h3 className="mb-1 text-base font-bold text-red-900">Erro ao carregar skills</h3>
            <p className="mb-4 text-sm text-red-700">{error}</p>
            <Button
              onClick={handleRetry}
              disabled={isRetrying}
              className="bg-red-600 hover:bg-red-700"
            >
              {isRetrying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Tentando novamente...
                </>
              ) : (
                <>
                  <RotateCw className="mr-2 h-4 w-4" />
                  Tentar novamente
                </>
              )}
            </Button>
          </div>
        )}

        {/* Category filter — only show in "all" mode */}
        {viewMode === "all" && (
          <div className="no-scrollbar mb-5 flex gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveSkillCat("Todas")}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                activeSkillCat === "Todas"
                  ? "border-primary-dark bg-primary-dark text-white dark:border-emerald dark:bg-emerald dark:text-[#0A1F12]"
                  : "border-stroke-light bg-white text-primary-dark hover:bg-pageBgLight"
              }`}
            >
              <Icons.LayoutGrid className="h-3.5 w-3.5" />
              Todas
              <CountBadge count={searched.length} />
            </button>
            {SKILL_CATEGORIES.map(({ label, icon }) => {
              const isActive = activeSkillCat === label
              const count = searched.filter((s) => s.category === label).length
              return (
                <button
                  key={label}
                  onClick={() => setActiveSkillCat(label)}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                    isActive
                      ? "border-primary-dark bg-primary-dark text-white dark:border-emerald dark:bg-emerald dark:text-[#0A1F12]"
                      : "border-stroke-light bg-white text-primary-dark hover:bg-pageBgLight"
                  }`}
                >
                  {icon}
                  {label}
                  <CountBadge count={count} />
                </button>
              )
            })}
          </div>
        )}

        {/* Favorites empty state */}
        {viewMode === "favorites" && favoritedSkills.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-16 text-foregroundMuted">
            <Icons.Heart className="h-16 w-16 text-stroke-muted" />
            <p className="text-base font-semibold">Nenhuma skill favoritada</p>
            <p className="text-sm opacity-70">Clique no ♡ dos cards para favoritar suas skills preferidas.</p>
          </div>
        )}

        {/* Content */}
        {viewMode === "ranking" ? (
          <RankingView
            skills={searched}
            favorites={favorites}
            onToggleFav={handleToggleFav}
            onSkillClick={goToDetail}
          />
        ) : (
          viewMode !== "favorites" || favoritedSkills.length > 0 ? (
            <SkillsGridView
              skills={displaySkills}
              favorites={favorites}
              onToggleFav={handleToggleFav}
              onSkillClick={goToDetail}
            />
          ) : null
        )}

        {/* Footer */}
        <div className="mt-10 mb-4 text-center text-xs text-foregroundMuted">
          Fonte:{" "}
          <a href="https://www.skills.sh/" target="_blank" rel="noopener noreferrer" className="font-semibold text-link hover:underline">
            skills.sh
          </a>{" "}
          · {allSkills.length} skills catalogadas
          {favorites.length > 0 && ` · ${favorites.length} favoritadas`}
        </div>
      </div>
    </div>
  )
}
