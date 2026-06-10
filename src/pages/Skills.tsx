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
  /** Which cat asset to use */
  mascot: string
  /** Flip horizontally for visual variety */
  flip?: boolean
}

// ── Cat assets — each card uses a distinct pose / orientation ──────────────

const CATS = [
  { src: "/assets/mascot-login-new.png", flip: false },  // 0 standing + phone
  { src: "/assets/mascot-learn-new.png", flip: false },  // 1 at desk writing
  { src: "/assets/mascot-home.png",      flip: false },  // 2 running
  { src: "/assets/mascot-login-new.png", flip: true  },  // 3 standing + phone (mirrored)
  { src: "/assets/mascot-learn-new.png", flip: true  },  // 4 at desk (mirrored)
  { src: "/assets/mascot-home.png",      flip: true  },  // 5 running (mirrored)
  { src: "/assets/mascot-login.png",     flip: false },  // 6 seated cat
  { src: "/assets/mascot-login.png",     flip: true  },  // 7 seated cat (mirrored)
  { src: "/assets/mascot-learn-new.png", flip: false },  // 8 at desk
  { src: "/assets/mascot-home.png",      flip: true  },  // 9 running (mirrored)
]

// ── Data ───────────────────────────────────────────────────────────────────

const PROMPTS: PromptCard[] = [
  { title: "Prompt for Storytelling",  difficulty: "Beginner",     color: "green",  ...CATS[0] },
  { title: "Customer Support Prompt",  difficulty: "Intermediate", color: "yellow", ...CATS[1] },
  { title: "Data Analysis Script",     difficulty: "Advanced",     color: "green",  ...CATS[2] },
  { title: "Graphic Design Prompts",   difficulty: "Advanced",     color: "green",  ...CATS[3] },
  { title: "Resume Writing",           difficulty: "Advanced",     color: "red",    ...CATS[4] },
  { title: "Graphic Design Prompts",   difficulty: "Beginner",     color: "green",  ...CATS[5] },
  { title: "Prompt itor Prompt",       difficulty: "Intermediate", color: "yellow", ...CATS[6] },
  { title: "Resources Prompt",         difficulty: "Advanced",     color: "green",  ...CATS[7] },
  { title: "Precountaien Learning",    difficulty: "Beginner",     color: "green",  ...CATS[8] },
  { title: "Customer Prompt",          difficulty: "Advanced",     color: "red",    ...CATS[9] },
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
  const s = BADGE_STYLES[color]
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${s.bg} ${s.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {difficulty}
    </span>
  )
}

// ── Prompt card ─────────────────────────────────────────────────────────────

function PromptCardItem({ card }: { card: PromptCard }) {
  return (
    <div className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border border-[#CDEAD8] bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <p className="flex min-h-[2.5rem] items-center text-center text-sm font-bold leading-tight text-[#1F2A24] line-clamp-2">
        {card.title}
      </p>
      <img
        src={card.src}
        alt="prompt illustration"
        className="h-20 w-auto object-contain"
        style={card.flip ? { transform: "scaleX(-1)" } : undefined}
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
        <div className="relative mb-6 flex items-center justify-center">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-0 flex items-center gap-1 rounded-full p-1.5 text-[#2F6B45] transition-colors hover:bg-[#DCF1E4]"
            aria-label="Voltar"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-bold text-[#1F2A24]">Prompt Library</h1>
        </div>

        {/* Hero banner — professor cat overflows the top center */}
        <div className="relative mb-10 flex justify-center">
          <img
            src="/assets/mascot-teacher.png"
            alt="Professor cat"
            className="absolute -top-10 left-1/2 z-10 h-28 w-auto -translate-x-1/2 object-contain drop-shadow-md"
          />
          <div
            className="w-full rounded-3xl bg-gradient-to-r from-[#D5EFE0] to-[#C2E8D0]"
            style={{ height: 140 }}
          />
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
