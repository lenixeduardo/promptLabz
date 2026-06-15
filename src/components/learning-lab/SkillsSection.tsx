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
import { cn } from "@/lib/utils"
import { trackSkillFavorited } from "@/lib/analytics"

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
  return <Icon className={className || "h-5 w-5 text-emerald"} strokeWidth={2} />
}

function CountBadge({ count }: { count: number }) {
  return (
    <span className="ml-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-white/30 px-1 text-[10px] font-bold leading-none">
      {count}
    </span>
  )
}

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
    <div className="group relative flex flex-col gap-2 rounded-2xl border border-stroke-muted bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md active:scale-95">
      <button
        onClick={(e) => { e.stopPropagation(); onToggleFav() }}
        className="absolute right-2.5 top-2.5 z-10 flex h-7 w-7 items-center justify-center rounded-full transition-colors hover:bg-red-100"
        aria-label={isFav ? "Remover dos favoritos" : "Favoritar"}
      >
        <Icons.Heart
          className={`h-4 w-4 transition-all ${
            isFav
              ? "fill-red-500 text-red-500"
              : "text-stroke-light group-hover:text-red-300"
          }`}
          strokeWidth={isFav ? 2.5 : 2}
        />
      </button>

      <div onClick={onClick} className="flex cursor-pointer flex-col gap-2">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-pageBgLight">
            <SkillIcon iconName={skill.icon} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold leading-tight text-foregroundDark line-clamp-2">{skill.name}</p>
            <p className="text-[11px] font-medium text-foregroundMuted">por {skill.author}</p>
          </div>
        </div>
        <p className="text-xs leading-relaxed text-foregroundSecondary line-clamp-2">{skill.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {skill.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="rounded-full bg-[#F4F9F5] px-2 py-0.5 text-[10px] font-medium text-primary-dark">
                {tag}
              </span>
            ))}
          </div>
          <span className="flex items-center gap-0.5 text-[11px] font-semibold text-foregroundMuted">
            <Icons.Download className="h-3 w-3" />
            {skill.installs}
          </span>
        </div>
      </div>
    </div>
  )
}

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
      <div className="col-span-full flex flex-col items-center gap-3 py-16 text-foregroundMuted">
        <Icons.Search className="h-16 w-16 text-stroke-muted" />
        <p className="text-base font-semibold">Nenhuma skill encontrada</p>
        <p className="text-sm opacity-70">Tente ajustar o filtro ou a busca.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
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
      achievements.checkFavorites(favorites.length + 1)
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
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
            activeCategory === "Todas"
              ? "border-primary-dark bg-primary-dark text-white"
              : "border-stroke-light bg-white text-primary-dark hover:bg-pageBgLight"
          )}
        >
          <Icons.LayoutGrid className="h-3.5 w-3.5" />
          Todas
        </button>
        {SKILL_CATEGORIES.map(({ label, icon }) => (
          <button
            key={label}
            onClick={() => setActiveCategory(label)}
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
              activeCategory === label
                ? "border-primary-dark bg-primary-dark text-white"
                : "border-stroke-light bg-white text-primary-dark hover:bg-pageBgLight"
            )}
          >
            {icon}
            {label}
          </button>
        ))}
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
