import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import {
  Lightbulb, Megaphone, Code2, Apple, ClipboardList, BarChart3,
  MessageSquare, Settings, Briefcase, Palette, Headphones, Users,
  type LucideIcon,
} from "lucide-react"
import { LAB_CATEGORIES, PROMPT_OF_THE_DAY, type LabCategory } from "@/data/labCategoriesData"
import { BottomNav } from "@/components/BottomNav"

type DiffFilter = "Todos" | "Iniciante" | "Intermediario" | "Avancado"

const DIFF_TABS: DiffFilter[] = ["Todos", "Iniciante", "Intermediario", "Avancado"]
const DIFF_LABELS: Record<DiffFilter, string> = {
  Todos: "Todos",
  Iniciante: "Iniciante",
  Intermediario: "Intermediário",
  Avancado: "Avançado",
}

const ICON_MAP: Record<string, LucideIcon> = {
  Lightbulb, Megaphone, Code2, Apple, ClipboardList, BarChart3,
  MessageSquare, Settings, Briefcase, Palette, Headphones, Users,
}

function CategoryCard({ cat, onClick }: { cat: LabCategory; onClick: () => void }) {
  const Icon = ICON_MAP[cat.icon] ?? Lightbulb
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 rounded-2xl border border-[#CDEAD8] bg-white p-3 text-center shadow-sm transition-all active:scale-95 hover:bg-[#F0FAF3]"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF7EF]">
        <Icon className="h-5 w-5 text-[#2B5D3A]" strokeWidth={1.8} />
      </div>
      <p className="text-[10px] font-semibold leading-tight text-[#1F2A24]">{cat.label}</p>
      <p className="text-[9px] text-[#6B9E7E]">{cat.promptCount} prompts</p>
    </button>
  )
}

export default function Prompts() {
  const navigate = useNavigate()
  const [activeDiff, setActiveDiff] = useState<DiffFilter>("Todos")

  return (
    <div className="min-h-screen bg-[#F0FAF3] pb-24">
      {/* Hero banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#C8EDD8] via-[#D5F0E2] to-[#EAF7EF] px-5 pb-6 pt-12">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-extrabold leading-tight text-[#1F2A24]">
              Laboratório de<br />Prompts
            </h1>
            <p className="mt-1.5 text-sm text-[#3E6B50]">
              Experimente, aprimore e domine a arte<br />de criar prompts incríveis.
            </p>
          </div>
          <img
            src="/assets/mascot-login-new.png"
            alt="Mascote"
            className="h-28 w-auto object-contain"
          />
        </div>
      </div>

      <div className="px-4 pt-4">
        {/* Difficulty filter tabs */}
        <div className="no-scrollbar mb-5 flex gap-2 overflow-x-auto pb-1">
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

        {/* Categories section */}
        <h2 className="mb-3 text-base font-bold text-[#1F2A24]">Categorias</h2>
        <div className="mb-6 grid grid-cols-4 gap-2.5">
          {LAB_CATEGORIES.map((cat) => (
            <CategoryCard
              key={cat.id}
              cat={cat}
              onClick={() => navigate(`/prompts/category/${cat.id}`)}
            />
          ))}
        </div>

        {/* Em destaque */}
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-base font-bold text-[#1F2A24]">Em destaque</h2>
          <button
            onClick={() => navigate("/prompts/category/Criatividade")}
            className="text-xs font-semibold text-[#2B5D3A]"
          >
            Ver todos &gt;
          </button>
        </div>

        <div className="rounded-2xl border border-[#CDEAD8] bg-white p-4 shadow-sm">
          <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-[#6B9E7E]">
            Prompt do Dia
          </div>
          <div className="flex items-start gap-3">
            <img
              src={PROMPT_OF_THE_DAY.mascotIcon}
              alt="Mascote"
              className="h-16 w-16 shrink-0 object-contain"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#1F2A24]">{PROMPT_OF_THE_DAY.title}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-[#4A5E52]">
                {PROMPT_OF_THE_DAY.description}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate(`/prompts/category/${PROMPT_OF_THE_DAY.categoryId}`)}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#2B5D3A] py-3 text-sm font-semibold text-white transition-all active:scale-95 hover:bg-[#3E8E5E]"
          >
            Usar prompt
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <BottomNav active="lab" />
    </div>
  )
}
