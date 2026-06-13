import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ChevronLeft, Search, X, Copy, Check, Wand2 } from "lucide-react"
import { PROMPTS, type PromptCard } from "@/data/promptsData"
import { sileo } from "sileo"

type PromptCategory = PromptCard["category"] | "Todas"

const CATEGORIES: PromptCard["category"][] = [
  "Criatividade",
  "Marketing",
  "Programacao",
  "Educacao",
  "Produtividade",
  "Gestao de Produto",
]

const DIFFICULTY_COLORS: Record<PromptCard["difficulty"], string> = {
  Iniciante: "bg-[#EAF7EF] text-[#2B5D3A]",
  Intermediario: "bg-[#FFF7ED] text-[#92400E]",
  Avancado: "bg-[#FEF2F2] text-[#991B1B]",
}

function PromptCardItem({ prompt }: { prompt: PromptCard }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.promptText)
      setCopied(true)
      sileo.success({ title: "Prompt copiado!" })
      setTimeout(() => setCopied(false), 2000)
    } catch {
      sileo.error({ title: "Erro ao copiar" })
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[#CDEAD8] bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-[#1F2A24] leading-snug">{prompt.title}</p>
          <p className="mt-0.5 text-xs text-[#6B9E7E]">{prompt.category}</p>
        </div>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${DIFFICULTY_COLORS[prompt.difficulty]}`}>
          {prompt.difficulty}
        </span>
      </div>

      <p className="text-xs leading-relaxed text-[#4A5E52]">{prompt.description}</p>

      <div className="rounded-xl bg-[#F4F9F5] px-3 py-2.5">
        <p className="line-clamp-3 whitespace-pre-wrap text-[11px] leading-relaxed text-[#2B5D3A]">
          {prompt.promptText}
        </p>
      </div>

      <button
        onClick={handleCopy}
        className="flex items-center justify-center gap-1.5 rounded-xl border border-[#BFE3CC] bg-white py-2 text-xs font-semibold text-[#2B5D3A] transition-colors hover:bg-[#EAF7EF] active:scale-95"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-[#2B5D3A]" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
        {copied ? "Copiado!" : "Copiar prompt"}
      </button>
    </div>
  )
}

export default function Prompts() {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState<PromptCategory>("Todas")
  const [searchQuery, setSearchQuery] = useState("")

  const filtered = useMemo(() => {
    let result = activeCategory === "Todas" ? PROMPTS : PROMPTS.filter((p) => p.category === activeCategory)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      )
    }
    return result
  }, [activeCategory, searchQuery])

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
            <ChevronLeft className="h-6 w-6" />
          </button>
        </div>

        {/* Hero banner */}
        <div className="relative mb-8 w-full overflow-hidden rounded-3xl bg-gradient-to-r from-[#D5EFE0] to-[#C2E8D0] px-6 py-8 shadow-sm">
          <div className="flex justify-center mb-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/60">
              <Wand2 className="h-6 w-6 text-[#2B5D3A]" strokeWidth={2} />
            </span>
          </div>
          <h1 className="text-center text-xl font-extrabold text-[#1F2A24]">
            Laboratório de Prompts
          </h1>
          <p className="mt-0.5 text-center text-sm font-medium text-[#2F6B45]">
            {PROMPTS.length} prompts prontos para usar
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <div className="flex items-center gap-2 rounded-full border border-[#BFE3CC] bg-white px-5 py-3 shadow-sm ring-2 ring-[#EAF7EF]">
            <Search className="h-5 w-5 text-[#6B9E7E]" strokeWidth={2} />
            <input
              type="text"
              placeholder="Buscar prompts por nome, categoria…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm text-[#1F2A24] placeholder:text-[#8A998F] focus:outline-none"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="rounded-full p-1 text-[#6B9E7E] hover:bg-[#EAF7EF]">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category filter */}
        <div className="no-scrollbar mb-5 flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveCategory("Todas")}
            className={`inline-flex shrink-0 items-center rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              activeCategory === "Todas"
                ? "border-[#2B5D3A] bg-[#2B5D3A] text-white"
                : "border-[#BFE3CC] bg-white text-[#2B5D3A] hover:bg-[#EAF7EF]"
            }`}
          >
            Todas
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`inline-flex shrink-0 items-center rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                activeCategory === cat
                  ? "border-[#2B5D3A] bg-[#2B5D3A] text-white"
                  : "border-[#BFE3CC] bg-white text-[#2B5D3A] hover:bg-[#EAF7EF]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="mb-4 text-xs font-medium text-[#6B9E7E]">
          {filtered.length} {filtered.length === 1 ? "prompt" : "prompts"} encontrado{filtered.length !== 1 ? "s" : ""}
        </p>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-[#6B9E7E]">
            <Search className="h-16 w-16 text-[#CDEAD8]" />
            <p className="text-base font-semibold">Nenhum prompt encontrado</p>
            <p className="text-sm opacity-70">Tente ajustar o filtro ou a busca.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((prompt, idx) => (
              <PromptCardItem key={`${prompt.title}-${idx}`} prompt={prompt} />
            ))}
          </div>
        )}

        <div className="mt-10 mb-4 text-center text-xs text-[#8AB89A]">
          {PROMPTS.length} prompts catalogados
        </div>
      </div>
    </div>
  )
}
