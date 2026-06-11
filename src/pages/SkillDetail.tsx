import { useLocation, useNavigate, useParams } from "react-router-dom"
import * as Icons from "@/lib/icons"
import { Button } from "@/components/ui/button"
import { TRENDING_SKILLS, type TrendingSkill } from "@/data/trendingSkillsData"
import { useFavorites } from "@/hooks/useFavorites"

function SkillIcon({ iconName, className }: { iconName: string; className?: string }) {
  const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[iconName] || Icons.BookOpen
  return <Icon className={className || "h-6 w-6 text-[#3E8E5E]"} strokeWidth={2} />
}

export default function SkillDetail() {
  const navigate = useNavigate()
  const { skillName } = useParams()
  const location = useLocation()
  const { toggleFavorite, isFavorite } = useFavorites()

  const skill: TrendingSkill | null =
    (location.state as { skill?: TrendingSkill })?.skill ??
    TRENDING_SKILLS.find((s) => s.name === skillName) ??
    null

  if (!skill) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gradient-to-b from-[#EAF7EF] to-white px-6">
        <Icons.Frown className="h-16 w-16 text-[#6B9E7E]" />
        <h1 className="text-xl font-bold text-[#1F2A24]">Skill não encontrada</h1>
        <p className="text-sm text-[#6B9E7E]">A skill que você procura não está disponível.</p>
        <Button onClick={() => navigate("/skills")}>Voltar para Skills</Button>
      </div>
    )
  }

  const rankedIndex = [...TRENDING_SKILLS].sort((a, b) => b.installsCount - a.installsCount).findIndex(
    (s) => s.name === skill.name
  )
  const rank = rankedIndex + 1
  const total = TRENDING_SKILLS.length

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EAF7EF] to-white">
      {/* Top gradient bar */}
      <div className="bg-gradient-to-r from-[#C2E8D0] to-[#D5EFE0] px-4 pb-12 pt-6">
        <div className="mx-auto w-full max-w-3xl">
          <button
            onClick={() => navigate("/skills")}
            className="mb-4 flex items-center gap-1.5 text-sm font-semibold text-[#2F6B45] transition-colors hover:text-[#1F2A24]"
          >
            <Icons.ChevronLeft className="h-5 w-5" />
            Voltar para Skills
          </button>

          <div className="flex items-center gap-4">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white shadow-md">
              <SkillIcon iconName={skill.icon} className="h-8 w-8 text-[#3E8E5E]" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-extrabold text-[#1F2A24]">{skill.name}</h1>
                <button
                  onClick={() => toggleFavorite(skill.name)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-white/70"
                  aria-label={isFavorite(skill.name) ? "Remover dos favoritos" : "Favoritar"}
                >
                  <Icons.Heart
                    className={`h-5 w-5 transition-all ${
                      isFavorite(skill.name)
                        ? "fill-red-500 text-red-500"
                        : "text-[#5A7A68]"
                    }`}
                    strokeWidth={isFavorite(skill.name) ? 2.5 : 2}
                  />
                </button>
              </div>
              <div className="mt-1 flex items-center gap-2.5">
                <span className="rounded-full bg-white/70 px-3 py-0.5 text-xs font-semibold text-[#2E7A4E]">
                  {skill.category}
                </span>
                <span className="text-xs font-medium text-[#2F6B45]">por {skill.author}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto w-full max-w-3xl px-4 -mt-6 pb-12">
        <div className="flex flex-col gap-5">
          {/* Stats cards */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-2xl border border-[#CDEAD8] bg-white p-4 text-center shadow-sm">
              <Icons.Download className="mx-auto mb-1 h-5 w-5 text-[#3E8E5E]" />
              <p className="text-lg font-extrabold text-[#1F2A24]">{skill.installs}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#6B9E7E]">Instalações</p>
            </div>
            <div className="rounded-2xl border border-[#CDEAD8] bg-white p-4 text-center shadow-sm">
              <Icons.Trophy className="mx-auto mb-1 h-5 w-5 text-[#3E8E5E]" />
              <p className="text-lg font-extrabold text-[#1F2A24]">
                #{rank}
                <span className="text-sm font-medium text-[#6B9E7E]">/{total}</span>
              </p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#6B9E7E]">Ranking</p>
            </div>
            <div className="rounded-2xl border border-[#CDEAD8] bg-white p-4 text-center shadow-sm">
              <Icons.User className="mx-auto mb-1 h-5 w-5 text-[#3E8E5E]" />
              <p className="text-sm font-extrabold text-[#1F2A24] capitalize">{skill.author}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#6B9E7E]">Autor</p>
            </div>
            <div className="rounded-2xl border border-[#CDEAD8] bg-white p-4 text-center shadow-sm">
              <Icons.Tag className="mx-auto mb-1 h-5 w-5 text-[#3E8E5E]" />
              <p className="text-sm font-extrabold text-[#1F2A24] line-clamp-1">{skill.category}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#6B9E7E]">Categoria</p>
            </div>
          </div>

          {/* Description */}
          <div className="rounded-2xl border border-[#CDEAD8] bg-white p-5 shadow-sm">
            <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-[#2B5D3A]">Descrição</h2>
            <p className="text-sm leading-relaxed text-[#4A5E52]">{skill.description}</p>
          </div>

          {/* Tags */}
          <div className="rounded-2xl border border-[#CDEAD8] bg-white p-5 shadow-sm">
            <h2 className="mb-2.5 text-xs font-bold uppercase tracking-wider text-[#2B5D3A]">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {skill.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[#CDEAD8] bg-[#F9FCFA] px-3 py-1.5 text-xs font-medium text-[#2B5D3A] transition-colors hover:bg-[#DCF1E4] hover:border-[#3E9A63]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Install info */}
          <div className="rounded-2xl border border-[#CDEAD8] bg-white p-5 shadow-sm">
            <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-[#2B5D3A]">Como instalar</h2>
            <p className="text-sm text-[#4A5E52]">
              Esta skill está disponível no{" "}
              <a
                href="https://www.skills.sh/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[#2E8B57] hover:underline"
              >
                skills.sh
              </a>
              , o diretório oficial de skills para agentes de IA. Para instalar em seu agente:
            </p>
            <pre className="mt-3 overflow-x-auto rounded-xl bg-[#F4F9F5] border border-[#CDEAD8] p-3 text-xs font-mono text-[#2B5D3A]">
              npx skills add {skill.author}/{skill.name.toLowerCase().replace(/\s+/g, "-")}
            </pre>
            <p className="mt-2 text-xs text-[#6B9E7E]">
              Compatível com Claude Code, Cursor e outros agentes que suportam o protocolo de skills.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={() => navigate("/skills")}
              variant="outline"
              className="flex-1 border-[#CDEAD8] text-[#2F6B45]"
            >
              <Icons.ArrowLeft className="h-4 w-4" /> Voltar
            </Button>
            <Button
              onClick={() => navigate("/skills")}
              className="flex-1 bg-[#2E8B57] hover:bg-[#236b43]"
            >
              <Icons.Grid3x3 className="h-4 w-4" /> Explorar Skills
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
