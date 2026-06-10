import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  ChevronLeft,
  Palette,
  Megaphone,
  Code2,
  BookOpen,
  ClipboardList,
  Target,
  LayoutGrid,
  X,
  Copy,
} from "lucide-react"
import { sileo } from "sileo"
import { Button } from "@/components/ui/button"
import { PROMPTS, PromptCard } from "@/data/promptsData"

type Category = "Criatividade" | "Marketing" | "Programacao" | "Educacao" | "Produtividade" | "Gestao de Produto"
type FilterState = "Todos" | Category

const CATEGORY_MASCOT: Record<Category, { src: string; flip?: boolean }> = {
  Criatividade:         { src: "/assets/mascot-creativity.png" },
  Programacao:          { src: "/assets/mascot-coding.png" },
  Marketing:            { src: "/assets/mascot-login-new.png", flip: true },
  Educacao:             { src: "/assets/mascot-learn-new.png" },
  Produtividade:        { src: "/assets/mascot-home.png" },
  "Gestao de Produto": { src: "/assets/mascot-teacher.png" },
}

const CATEGORIES: { label: Category; icon: React.ReactNode }[] = [
  { label: "Criatividade",         icon: <Palette className="h-4 w-4" /> },
  { label: "Marketing",          icon: <Megaphone className="h-4 w-4" /> },
  { label: "Programacao",             icon: <Code2 className="h-4 w-4" /> },
  { label: "Educacao",          icon: <BookOpen className="h-4 w-4" /> },
  { label: "Produtividade",       icon: <ClipboardList className="h-4 w-4" /> },
  { label: "Gestao de Produto", icon: <Target className="h-4 w-4" /> },
]

const BADGE: Record<string, { dot: string; text: string; bg: string }> = {
  green:  { dot: "bg-green-500",  text: "text-[#2E7A4E]", bg: "bg-[#DCF1E4]" },
  yellow: { dot: "bg-yellow-400", text: "text-[#8A6A00]", bg: "bg-[#FEF3C7]" },
  red:    { dot: "bg-red-500",    text: "text-[#991B1B]", bg: "bg-[#FEE2E2]" },
}

function DifficultyBadge({ difficulty, color }: { difficulty: string; color: string }) {
  const s = BADGE[color] || BADGE.green
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.bg} ${s.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {difficulty}
    </span>
  )
}

interface PromptCardItemProps {
  card: PromptCard
  onClick: () => void
}

function PromptCardItem({ card, onClick }: PromptCardItemProps) {
  const mascot = CATEGORY_MASCOT[card.category]
  return (
    <div 
      onClick={onClick}
      className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border border-[#CDEAD8] bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md active:scale-95"
    >
      <p className="flex min-h-[2.5rem] items-center text-center text-sm font-bold leading-tight text-[#1F2A24] line-clamp-2">
        {card.title}
      </p>
      <img
        src={mascot.src}
        alt={card.category}
        className="h-20 w-auto object-contain"
        style={mascot.flip ? { transform: "scaleX(-1)", mixBlendMode: "multiply" } : { mixBlendMode: "multiply" }}
      />
      <DifficultyBadge difficulty={card.difficulty} color={card.color} />
    </div>
  )
}

function CountBadge({ count }: { count: number }) {
  return (
    <span className="ml-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-white/30 px-1 text-[10px] font-bold leading-none">
      {count}
    </span>
  )
}

function EmptyState({ category }: { category: string }) {
  return (
    <div className="col-span-full flex flex-col items-center gap-3 py-16 text-[#6B9E7E]">
      <img
        src="/assets/mascot-home.png"
        alt="sem resultados"
        className="h-24 w-auto opacity-50"
        style={{ mixBlendMode: "multiply" }}
      />
      <p className="text-base font-semibold">Nenhum prompt em "{category}" ainda</p>
      <p className="text-sm opacity-70">Em breve novos prompts serão adicionados aqui.</p>
    </div>
  )
}

export default function Skills() {
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState<FilterState>("Todos")
  const [selectedPrompt, setSelectedPrompt] = useState<PromptCard | null>(null)

  const countFor = (cat: Category) => PROMPTS.filter(p => p.category === cat).length

  const filtered =
    activeFilter === "Todos"
      ? PROMPTS
      : PROMPTS.filter(p => p.category === activeFilter)

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    sileo.success({ title: "Copiado!", description: "Prompt copiado para a área de transferência." })
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
            <ChevronLeft className="h-6 w-6" />
          </button>
        </div>

        {/* Hero banner */}
        <div className="relative mb-8 w-full overflow-hidden rounded-3xl bg-gradient-to-r from-[#D5EFE0] to-[#C2E8D0] pb-5 pt-4 shadow-sm">
          <div className="flex justify-center">
            <img
              src="/assets/mascot-teacher.png"
              alt="Professor cat"
              className="h-32 w-auto object-contain"
              style={{ mixBlendMode: "multiply" }}
            />
          </div>
          <h1 className="mt-2 text-center text-xl font-extrabold text-[#1F2A24]">
            Biblioteca de Prompts
          </h1>
        </div>

        {/* Category filter chips */}
        <div className="no-scrollbar mb-6 flex gap-2 overflow-x-auto pb-2">
          {/* Todos chip */}
          <button
            onClick={() => setActiveFilter("Todos")}
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              activeFilter === "Todos"
                ? "border-[#2B5D3A] bg-[#2B5D3A] text-white"
                : "border-[#BFE3CC] bg-white text-[#2B5D3A] hover:bg-[#EAF7EF]"
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
            Todos
            <CountBadge count={PROMPTS.length} />
          </button>

          {CATEGORIES.map(({ label, icon }) => {
            const isActive = activeFilter === label
            const count = countFor(label)
            return (
              <button
                key={label}
                onClick={() => setActiveFilter(label)}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
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

        {/* Results header */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-medium text-[#6B9E7E]">
            {filtered.length} prompt{filtered.length !== 1 ? "s" : ""}{" "}
            {activeFilter !== "Todos" && <span>em <strong className="text-[#2F6B45]">{activeFilter}</strong></span>}
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {filtered.length === 0 ? (
            <EmptyState category={activeFilter} />
          ) : (
            filtered.map((card, idx) => (
              <PromptCardItem 
                key={`${card.category}-${idx}`} 
                card={card} 
                onClick={() => setSelectedPrompt(card)}
              />
            ))
          )}
        </div>

        {/* Prompt detail Modal */}
        {selectedPrompt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-all">
            <div className="relative w-full max-w-2xl rounded-3xl border border-[#BFE3CC] bg-white p-6 shadow-xl max-h-[85vh] overflow-y-auto flex flex-col gap-4 animate-in zoom-in-95 duration-150">
              
              {/* Header */}
              <div className="flex items-start justify-between border-b border-[#EAF2ED] pb-3">
                <div>
                  <h2 className="text-lg font-bold text-[#1F2A24]">{selectedPrompt.title}</h2>
                  <div className="flex items-center gap-2 mt-1.5">
                    <DifficultyBadge difficulty={selectedPrompt.difficulty} color={selectedPrompt.color} />
                    <span className="text-xs font-bold text-[#6B9E7E] uppercase tracking-wider">{selectedPrompt.category}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedPrompt(null)}
                  className="rounded-full p-1.5 text-[#1F2A24] hover:bg-[#EAF7EF] transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#2B5D3A] mb-1">Descrição</h3>
                <p className="text-sm text-[#4A5E52] leading-relaxed">{selectedPrompt.description}</p>
              </div>

              {/* Template */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#2B5D3A]">Template do Prompt</h3>
                  <button 
                    onClick={() => handleCopy(selectedPrompt.promptText)}
                    className="flex items-center gap-1 text-xs font-bold text-[#2E8B57] hover:underline"
                  >
                    <Copy className="h-3 w-3" /> Copiar Prompt
                  </button>
                </div>
                <pre className="w-full overflow-x-auto rounded-2xl bg-[#F4F9F5] border border-[#CDEAD8] p-4 text-xs font-mono text-[#2B5D3A] whitespace-pre-wrap leading-relaxed">
                  {selectedPrompt.promptText}
                </pre>
              </div>

              {/* Input Example */}
              {selectedPrompt.exampleInput && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#2B5D3A] mb-1">Exemplo de Entrada</h3>
                  <div className="w-full rounded-2xl bg-[#F9FCFA] border border-[#E1F2E7] p-3 text-xs text-[#3A4B40] italic">
                    {selectedPrompt.exampleInput}
                  </div>
                </div>
              )}

              {/* Output Example */}
              {selectedPrompt.exampleOutput && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#2B5D3A] mb-1">Saída Esperada</h3>
                  <div className="w-full rounded-2xl bg-[#F9FCFA] border border-[#E1F2E7] p-3 text-xs text-[#3A4B40] whitespace-pre-wrap font-sans">
                    {selectedPrompt.exampleOutput}
                  </div>
                </div>
              )}

              {/* Close footer */}
              <div className="flex justify-end pt-2 border-t border-[#EAF2ED]">
                <Button onClick={() => setSelectedPrompt(null)}>Fechar</Button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  )
}
