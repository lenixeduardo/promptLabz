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

type ViewMode = "all" | "favorites" | "ranking"

const SKILL_CATEGORIES: { label: SkillCategory; icon: React.ReactNode }[] = [
  { label: "Desenvolvimento",    icon: <Icons.Code2 className="h-4 w-4" /> },
  { label: "Design & UI",        icon: <Icons.Palette className="h-4 w-4" /> },
  { label: "IA & Media",         icon: <Icons.Image className="h-4 w-4" /> },
  { label: "Cloud & Infra",      icon: <Icons.Server className="h-4 w-4" /> },
  { label: "Marketing",          icon: <Icons.TrendingUp className="h-4 w-4" /> },
  { label: "Produtividade",      icon: <Icons.ClipboardList className="h-4 w-4" /> },
  { label: "Agentes & Workflows",icon: <Icons.GitBranch className="h-4 w-4" /> },
]

function SkillIcon({ iconName, className }: { iconName: string; className?: string }) {
  const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[iconName] || Icons.BookOpen
  return <Icon className={className || "h-5 w-5 text-[#3E8E5E]"} strokeWidth={2} />
}

function CountBadge({ count }: { count: number }) {
  return (
    <span className="ml-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-white/30 px-1 text-[10px] font-bold leading-none">
      {count}
    </span>
  )
}

// ─── Skill Card ───────────────────────────────────────────────────────────
function SkillCard({
  skill,
  isFav,
  onToggleFav,
  onClick,
}: {
  skill: TrendingSkill
  isFav: boolean
  onToggleFav: () => void
  onClick: () => void
}) {
  return (
    <div className="group relative flex flex-col gap-2 rounded-2xl border border-[#CDEAD8] bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md active:scale-95">
      {/* Favorite heart button */}
      <button
        onClick={(e) => { e.stopPropagation(); onToggleFav() }}
        className="absolute right-2.5 top-2.5 z-10 flex h-7 w-7 items-center justify-center rounded-full transition-colors hover:bg-[#FEE2E2]"
        aria-label={isFav ? "Remover dos favoritos" : "Favoritar"}
      >
        <Icons.Heart
          className={`h-4 w-4 transition-all ${
            isFav
              ? "fill-red-500 text-red-500"
              : "text-[#BFE3CC] group-hover:text-red-300"
          }`}
          strokeWidth={isFav ? 2.5 : 2}
        />
      </button>

      <div onClick={onClick} className="flex flex-col gap-2 cursor-pointer">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EAF7EF]">
            <SkillIcon iconName={skill.icon} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold leading-tight text-[#1F2A24] line-clamp-2">{skill.name}</p>
            <p className="text-[11px] font-medium text-[#6B9E7E]">por {skill.author}</p>
          </div>
        </div>
        <p className="text-xs leading-relaxed text-[#4A5E52] line-clamp-2">{skill.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {skill.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="rounded-full bg-[#F4F9F5] px-2 py-0.5 text-[10px] font-medium text-[#2B5D3A]">
                {tag}
              </span>
            ))}
          </div>
          <span className="flex items-center gap-0.5 text-[11px] font-semibold text-[#8AB89A]">
            <Icons.Download className="h-3 w-3" />
            {skill.installs}
          </span>
        </div>
      </div>
    </div>
  )
}

// ─── Grid View (all / favorites) ──────────────────────────────────────────
function SkillsGridView({
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
  if (skills.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center gap-3 py-16 text-[#6B9E7E]">
        <Icons.Search className="h-16 w-16 text-[#CDEAD8]" />
        <p className="text-base font-semibold">Nenhuma skill encontrada</p>
        <p className="text-sm opacity-70">Tente ajustar o filtro ou a busca.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {skills.map((skill) => (
        <SkillCard
          key={skill.name}
          skill={skill}
          isFav={favorites.includes(skill.name)}
          onToggleFav={() => onToggleFav(skill.name)}
          onClick={() => onSkillClick(skill)}
        />
      ))}
    </div>
  )
}

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
      <p className="mb-2 text-xs font-medium text-[#6B9E7E]">
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
            className="group flex cursor-pointer items-center gap-3 rounded-2xl border border-[#CDEAD8] bg-white px-4 py-3 shadow-sm transition-all hover:bg-[#F0FAF3] active:scale-[0.99]"
          >
            {/* Favorite heart */}
            <button
              onClick={(e) => { e.stopPropagation(); onToggleFav(skill.name) }}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-[#FEE2E2]"
              aria-label={isFav ? "Remover dos favoritos" : "Favoritar"}
            >
              <Icons.Heart
                className={`h-4 w-4 transition-all ${
                  isFav ? "fill-red-500 text-red-500" : "text-[#BFE3CC] group-hover:text-red-300"
                }`}
                strokeWidth={isFav ? 2.5 : 2}
              />
            </button>

            {/* Rank */}
            <div className="flex h-8 w-8 shrink-0 items-center justify-center">
              {medal ? (
                <span className="text-lg">{medal}</span>
              ) : (
                <span className="text-sm font-extrabold text-[#8AB89A]">{rank}</span>
              )}
            </div>

            {/* Icon */}
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EAF7EF]">
              <SkillIcon iconName={skill.icon} />
            </span>

            {/* Info */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-[#1F2A24]">{skill.name}</p>
              <p className="text-[11px] font-medium text-[#6B9E7E]">{skill.category} · por {skill.author}</p>
            </div>

            {/* Installs badge */}
            <div className="flex shrink-0 flex-col items-end gap-0.5">
              <span className="text-sm font-extrabold text-[#2E7048]">{skill.installs}</span>
              <span className="text-[10px] font-medium text-[#8AB89A]">instalações</span>
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
  const { favorites, toggleFavorite, isFavorite } = useFavorites()
  const achievements = useAchievements()
  const [viewMode, setViewMode] = useState<ViewMode>("all")
  const [activeSkillCat, setActiveSkillCat] = useState<SkillCategory | "Todas">("Todas")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredByCat =
    activeSkillCat === "Todas"
      ? TRENDING_SKILLS
      : TRENDING_SKILLS.filter((s) => s.category === activeSkillCat)

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
    () => TRENDING_SKILLS.filter((s) => favorites.includes(s.name)),
    [favorites]
  )

  const displaySkills = viewMode === "favorites" ? favoritedSkills : searched

  const handleToggleFav = (skillName: string) => {
    const wasFav = isFavorite(skillName)
    toggleFavorite(skillName)
    // If we just added a favorite, check achievements
    if (!wasFav) {
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
    <div className="min-h-screen bg-gradient-to-b from-[#EAF7EF] to-white px-4 py-6">
      <div className="mx-auto w-full max-w-[1200px]">
        {/* Back button */}
        <div className="mb-4 flex items-center">
          <button
            onClick={() => navigate("/home")}
            className="flex items-center gap-1 rounded-full p-1.5 text-[#2F6B45] transition-colors hover:bg-[#DCF1E4]"
            aria-label="Voltar"
          >
            <Icons.ChevronLeft className="h-6 w-6" />
          </button>
        </div>

        {/* Hero banner */}
        <div className="relative mb-8 w-full overflow-hidden rounded-3xl bg-gradient-to-r from-[#D5EFE0] to-[#C2E8D0] px-6 py-8 shadow-sm">
          <h1 className="text-center text-xl font-extrabold text-[#1F2A24]">
            Central de Skills
          </h1>
          <p className="mt-0.5 text-center text-sm font-medium text-[#2F6B45]">
            Skills reais do{" "}
            <a href="https://www.skills.sh/" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#1F2A24]">
              skills.sh
            </a>
          </p>
        </div>

        {/* Search bar */}
        <div className="relative mb-5">
          <div className="flex items-center gap-2 rounded-full border border-[#BFE3CC] bg-white px-5 py-3 shadow-sm ring-2 ring-[#EAF7EF]">
            <Icons.Search className="h-5 w-5 text-[#6B9E7E]" strokeWidth={2} />
            <input
              type="text"
              placeholder="Buscar skills por nome, autor, categoria ou tag…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm text-[#1F2A24] placeholder:text-[#8A998F] focus:outline-none"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="rounded-full p-1 text-[#6B9E7E] hover:bg-[#EAF7EF]">
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
                ? "border-[#2B5D3A] bg-[#2B5D3A] text-white"
                : "border-[#BFE3CC] bg-white text-[#2B5D3A] hover:bg-[#EAF7EF]"
            }`}
          >
            <Icons.Grid3x3 className="h-4 w-4" />
            Todas
            <CountBadge count={TRENDING_SKILLS.length} />
          </button>
          <button
            onClick={() => setViewMode("favorites")}
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
              viewMode === "favorites"
                ? "border-[#2B5D3A] bg-[#2B5D3A] text-white"
                : "border-[#BFE3CC] bg-white text-[#2B5D3A] hover:bg-[#EAF7EF]"
            }`}
          >
            <Icons.Heart
              className={`h-4 w-4 ${viewMode === "favorites" ? "fill-white" : ""}`}
            />
            Favoritas
            <CountBadge count={favorites.length} />
          </button>
          <button
            onClick={() => setViewMode("ranking")}
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
              viewMode === "ranking"
                ? "border-[#2B5D3A] bg-[#2B5D3A] text-white"
                : "border-[#BFE3CC] bg-white text-[#2B5D3A] hover:bg-[#EAF7EF]"
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
                viewMode === mode ? "bg-[#2B5D3A]" : "bg-[#CDEAD8] opacity-50"
              }`}
            />
          ))}
        </div>

        {/* Category filter — only show in "all" mode */}
        {viewMode === "all" && (
          <div className="no-scrollbar mb-5 flex gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveSkillCat("Todas")}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                activeSkillCat === "Todas"
                  ? "border-[#2B5D3A] bg-[#2B5D3A] text-white"
                  : "border-[#BFE3CC] bg-white text-[#2B5D3A] hover:bg-[#EAF7EF]"
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
                      ? "border-[#2B5D3A] bg-[#2B5D3A] text-white"
                      : "border-[#BFE3CC] bg-white text-[#2B5D3A] hover:bg-[#EAF7EF]"
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
          <div className="flex flex-col items-center gap-3 py-16 text-[#6B9E7E]">
            <Icons.Heart className="h-16 w-16 text-[#CDEAD8]" />
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
        <div className="mt-10 mb-4 text-center text-xs text-[#8AB89A]">
          Fonte:{" "}
          <a href="https://www.skills.sh/" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#2E8B57] hover:underline">
            skills.sh
          </a>{" "}
          · {TRENDING_SKILLS.length} skills catalogadas
          {favorites.length > 0 && ` · ${favorites.length} favoritadas`}
        </div>
      </div>
    </div>
  )
}
