import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  ChevronLeft,
  Palette,
  Megaphone,
  Code2,
  BookOpen,
  ClipboardList,
} from "lucide-react"

// ── Types ──────────────────────────────────────────────────────────────────

type Difficulty = "Beginner" | "Intermediate" | "Advanced"
type DotColor = "green" | "yellow" | "red"

interface PromptCard {
  title: string
  difficulty: Difficulty
  color: DotColor
}

// ── Data ───────────────────────────────────────────────────────────────────

const PROMPTS: PromptCard[] = [
  { title: "Prompt for Storytelling",  difficulty: "Beginner",     color: "green"  },
  { title: "Customer Support Prompt",  difficulty: "Intermediate", color: "yellow" },
  { title: "Data Analysis Script",     difficulty: "Advanced",     color: "green"  },
  { title: "Graphic Design Prompts",   difficulty: "Advanced",     color: "green"  },
  { title: "Resume Writing",           difficulty: "Advanced",     color: "red"    },
  { title: "Graphic Design Prompts",   difficulty: "Beginner",     color: "green"  },
  { title: "Prompt itor Prompt",       difficulty: "Intermediate", color: "yellow" },
  { title: "Resources Prompt",         difficulty: "Advanced",     color: "green"  },
  { title: "Precountaien Learning",    difficulty: "Beginner",     color: "green"  },
  { title: "Customer Prompt",          difficulty: "Advanced",     color: "red"    },
]

type Category = "Creativity" | "Marketing" | "Coding" | "Education" | "Productivity"

const CATEGORIES: { label: Category; icon: React.ReactNode }[] = [
  { label: "Creativity",   icon: <Palette className="h-4 w-4" /> },
  { label: "Marketing",    icon: <Megaphone className="h-4 w-4" /> },
  { label: "Coding",       icon: <Code2 className="h-4 w-4" /> },
  { label: "Education",    icon: <BookOpen className="h-4 w-4" /> },
  { label: "Productivity", icon: <ClipboardList className="h-4 w-4" /> },
]

// ── Difficulty badge ────────────────────────────────────────────────────────

const BADGE_STYLES: Record<DotColor, { dot: string; text: string; bg: string }> = {
  green:  { dot: "bg-green-500",  text: "text-[#2E7A4E]", bg: "bg-[#DCF1E4]" },
  yellow: { dot: "bg-yellow-400", text: "text-[#8A6A00]", bg: "bg-[#FEF3C7]" },
  red:    { dot: "bg-red-500",    text: "text-[#991B1B]", bg: "bg-[#FEE2E2]" },
}

function DifficultyBadge({ difficulty, color }: { difficulty: Difficulty; color: DotColor }) {
  const styles = BADGE_STYLES[color]
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${styles.bg} ${styles.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} />
      {difficulty}
    </span>
  )
}

// ── Prompt card ─────────────────────────────────────────────────────────────

function PromptCardItem({ card }: { card: PromptCard }) {
  return (
    <div className="rounded-2xl border border-[#CDEAD8] bg-white p-4 flex flex-col items-center gap-2 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
      <p className="text-center text-sm font-bold text-[#1F2A24] leading-tight line-clamp-2 min-h-[2.5rem] flex items-center">
        {card.title}
      </p>
      <img
        src="/assets/mascot-login-new.png"
        alt="prompt illustration"
        className="h-20 w-auto object-contain opacity-80"
      />
      <DifficultyBadge difficulty={card.difficulty} color={card.color} />
    </div>
  )
}

// ── Page ────────────────────────────────────────────────────────────────────

export default function Skills() {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState<Category>("Creativity")

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EAF7EF] to-white px-4 py-6">
      <div className="mx-auto w-full max-w-[1200px]">

        {/* Top bar */}
        <div className="relative flex items-center justify-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-0 flex items-center gap-1 rounded-full p-1.5 text-[#2F6B45] hover:bg-[#DCF1E4] transition-colors"
            aria-label="Voltar"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-bold text-[#1F2A24]">Prompt Library</h1>
        </div>

        {/* Hero banner with mascot overflowing top */}
        <div className="relative mb-8 flex justify-center">
          {/* Mascot floating above banner */}
          <img
            src="/assets/mascot-login-new.png"
            alt="PromptLab mascot"
            className="absolute -top-8 z-10 h-24 w-auto object-contain drop-shadow-md"
          />
          {/* Banner background */}
          <div className="w-full rounded-3xl bg-gradient-to-r from-[#D5EFE0] to-[#C2E8D0]"
            style={{ height: 140 }}
          />
        </div>

        {/* Category filter chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-6">
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

        {/* Prompt cards grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {PROMPTS.map((card, idx) => (
            <PromptCardItem key={idx} card={card} />
          ))}
        </div>
      </div>
    </div>
  )
}
