import { useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  ChevronLeft, ChevronRight, Search, SlidersHorizontal, X, Bookmark,
  Lightbulb, Megaphone, Code2, Apple, ClipboardList, BarChart3,
  MessageSquare, Settings, Briefcase, Palette, Headphones, Users,
  type LucideIcon,
} from "lucide-react"
import { PROMPTS, type PromptCard } from "@/data/promptsData"
import { LAB_CATEGORIES } from "@/data/labCategoriesData"
import { BottomNav } from "@/components/BottomNav"

type DiffFilter = "Todos" | PromptCard["difficulty"]

const DIFF_TABS: DiffFilter[] = ["Todos", "Iniciante", "Intermediario", "Avancado"]
const DIFF_LABELS: Record<DiffFilter, string> = {
  Todos: "Todos",
  Iniciante: "Iniciante",
  Intermediario: "Intermediário",
  Avancado: "Avançado",
}

const DIFF_BADGE: Record<PromptCard["difficulty"], { dot: string; label: string; bg: string; text: string }> = {
  Iniciante:    { dot: "bg-[#2B5D3A]", label: "Iniciante",     bg: "bg-[#EAF7EF]", text: "text-[#2B5D3A]" },
  Intermediario:{ dot: "bg-[#D97706]", label: "Intermediário",  bg: "bg-[#FFF7ED]", text: "text-[#92400E]" },
  Avancado:     { dot: "bg-[#DC2626]", label: "Avançado",       bg: "bg-[#FEF2F2]", text: "text-[#991B1B]" },
}

const ICON_MAP: Record<string, LucideIcon> = {
  Lightbulb, Megaphone, Code2, Apple, ClipboardList, BarChart3,
  MessageSquare, Settings, Briefcase, Palette, Headphones, Users,
}

function PromptListCard({
  prompt,
  saved,
  onToggleSave,
}: {
  prompt: PromptCard
  saved: boolean
  onToggleSave: () => void
}) {
  const badge = DIFF_BADGE[prompt.difficulty]

  return (
    <div className="flex items-start gap-3 rounded-2xl border border-[#CDEAD8] bg-white p-4 shadow-sm">
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold leading-snug text-[#1F2A24]">{prompt.title}</p>
            <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-[#4A5E52]">
              {prompt.description}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <button
              onClick={onToggleSave}
              className="rounded-full p-1 transition-colors hover:bg-[#EAF7EF]"
              aria-label={saved ? "Remover dos salvos" : "Salvar prompt"}
            >
              <Bookmark
                className={`h-4 w-4 ${saved ? "fill-[#2B5D3A] text-[#2B5D3A]" : "text-[#6B9E7E]"}`}
              />
            </button>
            <ChevronRight className="h-4 w-4 text-[#6B9E7E]" />
          </div>
        </div>
        <span
          className={`inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${badge.bg} ${badge.text}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${badge.dot}`} />
          {badge.label}
        </span>
      </div>
    </div>
  )
}

export default function PromptCategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>()
  const navigate = useNavigate()

  const [activeDiff, setActiveDiff] = useState<DiffFilter>("Todos")
  const [searchQuery, setSearchQuery] = useState("")
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())

  const catMeta = LAB_CATEGORIES.find((c) => c.id === categoryId)
  const label = catMeta?.label.replace("\n", " ") ?? categoryId ?? "Categoria"
  const CategoryIcon = ICON_MAP[catMeta?.icon ?? ""] ?? Lightbulb

  const basePrompts = useMemo(
    () => PROMPTS.filter((p) => p.category === categoryId),
    [categoryId],
  )

  const filtered = useMemo(() => {
    let result = activeDiff === "Todos" ? basePrompts : basePrompts.filter((p) => p.difficulty === activeDiff)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      )
    }
    return result
  }, [basePrompts, activeDiff, searchQuery])

  function toggleSave(title: string) {
    setSavedIds((prev) => {
      const next = new Set(prev)
      next.has(title) ? next.delete(title) : next.add(title)
      return next
    })
  }

  return (
    <div className="min-h-screen bg-[#F0FAF3] pb-24">
      {/* Header */}
      <div className="bg-white px-4 pb-4 pt-12 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-[#2B5D3A] transition-colors hover:bg-[#EAF7EF]"
              aria-label="Voltar"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-lg font-extrabold text-[#1F2A24]">{label}</h1>
              <p className="text-xs text-[#6B9E7E]">{basePrompts.length} prompts disponíveis</p>
            </div>
          </div>
          {catMeta && (
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EAF7EF]">
              <CategoryIcon className="h-6 w-6 text-[#2B5D3A]" strokeWidth={1.8} />
            </div>
          )}
        </div>

        {/* Search + Filtros */}
        <div className="flex gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-full border border-[#BFE3CC] bg-[#F4F9F5] px-4 py-2.5">
            <Search className="h-4 w-4 shrink-0 text-[#6B9E7E]" />
            <input
              type="text"
              placeholder="Buscar prompts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm text-[#1F2A24] placeholder:text-[#8A998F] focus:outline-none"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="rounded-full p-0.5 text-[#6B9E7E]">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <button className="flex items-center gap-1.5 rounded-full border border-[#BFE3CC] bg-white px-3 py-2 text-xs font-semibold text-[#2B5D3A] transition-colors hover:bg-[#EAF7EF]">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filtros
          </button>
        </div>
      </div>

      <div className="px-4 pt-4">
        {/* Difficulty tabs */}
        <div className="no-scrollbar mb-4 flex gap-2 overflow-x-auto pb-1">
          {DIFF_TABS.map((d) => (
            <button
              key={d}
              onClick={() => setActiveDiff(d)}
              className={`inline-flex shrink-0 items-center rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
                activeDiff === d
                  ? "border-[#2B5D3A] bg-[#2B5D3A] text-white"
                  : "border-[#BFE3CC] bg-white text-[#2B5D3A] hover:bg-[#EAF7EF]"
              }`}
            >
              {DIFF_LABELS[d]}
            </button>
          ))}
        </div>

        {/* Prompt list */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-[#6B9E7E]">
            <Search className="h-14 w-14 text-[#CDEAD8]" />
            <p className="text-base font-semibold">Nenhum prompt encontrado</p>
            <p className="text-sm opacity-70">Tente ajustar o filtro ou a busca.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((prompt, idx) => (
              <PromptListCard
                key={`${prompt.title}-${idx}`}
                prompt={prompt}
                saved={savedIds.has(prompt.title)}
                onToggleSave={() => toggleSave(prompt.title)}
              />
            ))}
          </div>
        )}
      </div>

      <BottomNav active="lab" />
    </div>
  )
}
