import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  ChevronLeft,
  Palette,
  Megaphone,
  Code2,
  BookOpen,
  ClipboardList,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"

// ── Types ──────────────────────────────────────────────────────────────────

type Difficulty = "Beginner" | "Intermediate" | "Advanced"
type DotColor   = "green" | "yellow" | "red"
type Category   = "Creativity" | "Marketing" | "Coding" | "Education" | "Productivity"

interface PromptCard {
  title: string
  difficulty: Difficulty
  color: DotColor
  category: Category
}

// ── Data ───────────────────────────────────────────────────────────────────

const PROMPTS: PromptCard[] = [
  { title: "Prompt for Storytelling",   difficulty: "Beginner",     color: "green",  category: "Creativity"   },
  { title: "Customer Support Prompt",   difficulty: "Intermediate", color: "yellow", category: "Marketing"    },
  { title: "Data Analysis Script",      difficulty: "Advanced",     color: "green",  category: "Coding"       },
  { title: "Graphic Design Prompts",    difficulty: "Advanced",     color: "green",  category: "Creativity"   },
  { title: "Resume Writing",            difficulty: "Advanced",     color: "red",    category: "Productivity" },
  { title: "Social Media Copy",         difficulty: "Beginner",     color: "green",  category: "Marketing"    },
  { title: "Code Review Prompt",        difficulty: "Intermediate", color: "yellow", category: "Coding"       },
  { title: "Study Plan Generator",      difficulty: "Intermediate", color: "yellow", category: "Education"    },
  { title: "Email Writing",             difficulty: "Beginner",     color: "green",  category: "Productivity" },
  { title: "UX Research Prompt",        difficulty: "Advanced",     color: "red",    category: "Creativity"   },
]

/** Maps each card category to a specific cat mascot image */
const CATEGORY_MASCOT: Record<Category, { src: string; flip?: boolean }> = {
  Creativity:   { src: "/assets/mascot-creativity.png" },
  Coding:       { src: "/assets/mascot-coding.png"     },
  Marketing:    { src: "/assets/mascot-login-new.png", flip: true  },
  Education:    { src: "/assets/mascot-learn-new.png"  },
  Productivity: { src: "/assets/mascot-home.png"       },
}

const CATEGORIES: { label: Category; icon: React.ReactNode }[] = [
  { label: "Creativity",   icon: <Palette className="h-4 w-4" /> },
  { label: "Marketing",    icon: <Megaphone className="h-4 w-4" /> },
  { label: "Coding",       icon: <Code2 className="h-4 w-4" /> },
  { label: "Education",    icon: <BookOpen className="h-4 w-4" /> },
  { label: "Productivity", icon: <ClipboardList className="h-4 w-4" /> },
]

// ── Badge ──────────────────────────────────────────────────────────────────

const BADGE: Record<DotColor, { dot: string; text: string; bg: string }> = {
  green:  { dot: "bg-green-500",  text: "text-[#2E7A4E]", bg: "bg-[#DCF1E4]" },
  yellow: { dot: "bg-yellow-400", text: "text-[#8A6A00]", bg: "bg-[#FEF3C7]" },
  red:    { dot: "bg-red-500",    text: "text-[#991B1B]", bg: "bg-[#FEE2E2]" },
}

function DifficultyBadge({ difficulty, color }: { difficulty: Difficulty; color: DotColor }) {
  const s = BADGE[color]
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${s.bg} ${s.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {difficulty}
    </span>
  )
}

// ── Prompt card ─────────────────────────────────────────────────────────────

function PromptCardItem({ card }: { card: PromptCard }) {
  const mascot = CATEGORY_MASCOT[card.category]
  return (
    <div className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border border-[#CDEAD8] bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <p className="flex min-h-[2.5rem] items-center text-center text-sm font-bold leading-tight text-[#1F2A24] line-clamp-2">
        {card.title}
      </p>
      <img
        src={mascot.src}
        alt={card.category}
        className="h-20 w-auto object-contain"
        style={mascot.flip ? { transform: "scaleX(-1)" } : undefined}
      />
      <DifficultyBadge difficulty={card.difficulty} color={card.color} />
    </div>
  )
}

// ── Promo banner ────────────────────────────────────────────────────────────

function PromoBanner() {
  return (
    <div className="relative col-span-2 sm:col-span-3 lg:col-span-5 overflow-hidden rounded-3xl border border-[#BFE3CC] bg-gradient-to-br from-[#E6F8EE] via-[#D4F0E0] to-[#BFE8D0] shadow-lg">

      {/* Sparkle decorations */}
      <Sparkles className="animate-twinkle absolute left-4 top-4 h-5 w-5 text-[#F5A623]/70" style={{ animationDelay:"0s" }} />
      <Sparkles className="animate-twinkle absolute right-8 top-5 h-4 w-4 text-[#F5A623]/60" style={{ animationDelay:"0.8s" }} />
      <Sparkles className="animate-twinkle absolute left-10 bottom-4 h-3 w-3 text-[#7CC79A]"  style={{ animationDelay:"1.4s" }} />
      <Sparkles className="animate-twinkle absolute right-4 bottom-6 h-4 w-4 text-[#F5A623]/50" style={{ animationDelay:"0.4s" }} />

      {/* FREE corner badges */}
      <span className="absolute left-3 top-3 rounded-lg bg-[#2F6B45] px-2.5 py-0.5 text-xs font-extrabold text-white shadow">FREE</span>
      <span className="absolute right-3 top-3 rounded-lg bg-[#2F6B45] px-2.5 py-0.5 text-xs font-extrabold text-white shadow">FREE</span>
      <span className="absolute bottom-3 left-3 rounded-lg bg-[#2F6B45] px-2.5 py-0.5 text-xs font-extrabold text-white shadow">FREE</span>
      <span className="absolute bottom-3 right-3 rounded-lg bg-[#2F6B45] px-2.5 py-0.5 text-xs font-extrabold text-white shadow">FREE</span>

      <div className="relative flex flex-col items-center gap-4 px-8 py-6 sm:flex-row sm:justify-center sm:gap-10">
        {/* Cat mascot */}
        <img
          src="/assets/mascot-promo.png"
          alt="Promo cat"
          className="h-36 w-auto object-contain drop-shadow-lg sm:h-32"
        />

        {/* Text + CTA */}
        <div className="flex flex-col items-center gap-3 text-center sm:items-start sm:text-left">
          <p className="flex items-center gap-2 text-3xl font-extrabold text-[#2F6B45]">
            🎁 1 MÊS GRÁTIS
          </p>
          <p className="max-w-xs text-sm text-[#3A5A45]">
            Teste a IA do PromptLab sem custos por 30 dias 🧪🐱
          </p>
          <Button size="default" className="w-full max-w-xs text-base font-bold sm:w-auto">
            Ativar Oferta
          </Button>
        </div>
      </div>
    </div>
  )
}

// ── Page ────────────────────────────────────────────────────────────────────

export default function Skills() {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState<Category>("Creativity")

  const filtered = activeCategory === "Creativity"
    ? PROMPTS
    : PROMPTS.filter(p => p.category === activeCategory)

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EAF7EF] to-white px-4 py-6">
      <div className="mx-auto w-full max-w-[1200px]">

        {/* Nav — back button only */}
        <div className="mb-4 flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 rounded-full p-1.5 text-[#2F6B45] transition-colors hover:bg-[#DCF1E4]"
            aria-label="Voltar"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        </div>

        {/* Hero banner — cat centered inside, title below it */}
        <div className="relative mb-8 w-full overflow-hidden rounded-3xl bg-gradient-to-r from-[#D5EFE0] to-[#C2E8D0] pb-5 pt-4 shadow-sm">
          {/* Professor cat — multiply blend removes any residual white bg */}
          <div className="flex justify-center">
            <img
              src="/assets/mascot-teacher.png"
              alt="Professor cat"
              className="h-32 w-auto object-contain"
              style={{ mixBlendMode: "multiply" }}
            />
          </div>
          {/* Title clearly below the cat, inside the banner */}
          <h1 className="mt-2 text-center text-xl font-extrabold text-[#1F2A24]">
            Prompt Library
          </h1>
        </div>

        {/* Category filter chips */}
        <div className="no-scrollbar mb-6 flex gap-2 overflow-x-auto pb-2">
          {CATEGORIES.map(({ label, icon }) => {
            const isActive = activeCategory === label
            return (
              <button
                key={label}
                onClick={() => setActiveCategory(label)}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-[#2B5D3A] bg-[#2B5D3A] text-white"
                    : "border-[#BFE3CC] bg-white text-[#2B5D3A] hover:bg-[#EAF7EF]"
                }`}
              >
                {icon}
                {label}
              </button>
            )
          })}
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {filtered.map((card, idx) => (
            <PromptCardItem key={idx} card={card} />
          ))}

          {/* Promo banner always visible, spans full row */}
          <PromoBanner />
        </div>
      </div>
    </div>
  )
}
