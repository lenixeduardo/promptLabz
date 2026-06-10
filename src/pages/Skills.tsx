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
} from "lucide-react"
// ── Types ──────────────────────────────────────────────────────────────────

type Difficulty = "Beginner" | "Intermediate" | "Advanced"
type DotColor   = "green" | "yellow" | "red"
type Category   = "Creativity" | "Marketing" | "Coding" | "Education" | "Productivity" | "Product Management"

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

  // ── AI Product Management ─────────────────────────────────────────────────
  { title: "Build vs Buy vs Partner",       difficulty: "Advanced",     color: "red",    category: "Product Management" },
  { title: "AI Data Strategy",              difficulty: "Advanced",     color: "red",    category: "Product Management" },
  { title: "AI Feature Definition",         difficulty: "Intermediate", color: "yellow", category: "Product Management" },
  { title: "AI Incident Response",          difficulty: "Advanced",     color: "red",    category: "Product Management" },
  { title: "AI Model Evaluation",           difficulty: "Intermediate", color: "yellow", category: "Product Management" },
  { title: "AI User Research",              difficulty: "Intermediate", color: "yellow", category: "Product Management" },
  { title: "Prompt Engineering",            difficulty: "Intermediate", color: "yellow", category: "Product Management" },
  { title: "Responsible AI",               difficulty: "Intermediate", color: "yellow", category: "Product Management" },

  // ── Data & Analytics ──────────────────────────────────────────────────────
  { title: "A/B Test Analysis",            difficulty: "Intermediate", color: "yellow", category: "Product Management" },
  { title: "Cohort Analysis",              difficulty: "Intermediate", color: "yellow", category: "Product Management" },
  { title: "Event Tracking Plan",          difficulty: "Beginner",     color: "green",  category: "Product Management" },
  { title: "Funnel Analysis",              difficulty: "Intermediate", color: "yellow", category: "Product Management" },
  { title: "Metric Definition",            difficulty: "Beginner",     color: "green",  category: "Product Management" },
  { title: "Product Metrics",              difficulty: "Intermediate", color: "yellow", category: "Product Management" },
  { title: "SQL Queries for PMs",          difficulty: "Intermediate", color: "yellow", category: "Product Management" },

  // ── Execution ─────────────────────────────────────────────────────────────
  { title: "Brainstorm OKRs",              difficulty: "Intermediate", color: "yellow", category: "Product Management" },
  { title: "Create PRD",                   difficulty: "Intermediate", color: "yellow", category: "Product Management" },
  { title: "Job Stories",                  difficulty: "Beginner",     color: "green",  category: "Product Management" },
  { title: "Meeting Prep",                 difficulty: "Beginner",     color: "green",  category: "Product Management" },
  { title: "Outcome Roadmap",              difficulty: "Intermediate", color: "yellow", category: "Product Management" },
  { title: "Pre-Mortem Analysis",          difficulty: "Intermediate", color: "yellow", category: "Product Management" },
  { title: "Prioritization",              difficulty: "Intermediate", color: "yellow", category: "Product Management" },
  { title: "Release Notes",               difficulty: "Beginner",     color: "green",  category: "Product Management" },
  { title: "Sprint Retrospective",         difficulty: "Beginner",     color: "green",  category: "Product Management" },
  { title: "Sprint Plan",                  difficulty: "Intermediate", color: "yellow", category: "Product Management" },
  { title: "Stakeholder Map",              difficulty: "Intermediate", color: "yellow", category: "Product Management" },
  { title: "Stakeholder Update",           difficulty: "Beginner",     color: "green",  category: "Product Management" },
  { title: "Summarize Meeting",            difficulty: "Beginner",     color: "green",  category: "Product Management" },
  { title: "Test Scenarios",              difficulty: "Intermediate", color: "yellow", category: "Product Management" },
  { title: "User Stories",                difficulty: "Beginner",     color: "green",  category: "Product Management" },
  { title: "PM Writing",                  difficulty: "Beginner",     color: "green",  category: "Product Management" },
  { title: "Why-What-Acceptance",          difficulty: "Beginner",     color: "green",  category: "Product Management" },

  // ── Go-to-Market ──────────────────────────────────────────────────────────
  { title: "Growth Loops",                 difficulty: "Advanced",     color: "red",    category: "Product Management" },
  { title: "GTM Motions",                  difficulty: "Intermediate", color: "yellow", category: "Product Management" },
  { title: "GTM Strategy",                 difficulty: "Advanced",     color: "red",    category: "Product Management" },
  { title: "Ideal Customer Profile",       difficulty: "Intermediate", color: "yellow", category: "Product Management" },
  { title: "Marketing Ideas",              difficulty: "Beginner",     color: "green",  category: "Product Management" },
  { title: "Positioning Ideas",            difficulty: "Intermediate", color: "yellow", category: "Product Management" },
  { title: "Product Name",                 difficulty: "Beginner",     color: "green",  category: "Product Management" },

  // ── Market Research ───────────────────────────────────────────────────────
  { title: "Competitor Analysis",          difficulty: "Intermediate", color: "yellow", category: "Product Management" },
  { title: "Customer Journey Map",         difficulty: "Intermediate", color: "yellow", category: "Product Management" },
  { title: "Market Sizing",               difficulty: "Advanced",     color: "red",    category: "Product Management" },
  { title: "Research Personas",            difficulty: "Intermediate", color: "yellow", category: "Product Management" },
  { title: "Sentiment Analysis",           difficulty: "Intermediate", color: "yellow", category: "Product Management" },
  { title: "User Segmentation",            difficulty: "Intermediate", color: "yellow", category: "Product Management" },

  // ── Product Discovery ─────────────────────────────────────────────────────
  { title: "Analyze Feature Requests",     difficulty: "Intermediate", color: "yellow", category: "Product Management" },
  { title: "Experiments for Existing",     difficulty: "Intermediate", color: "yellow", category: "Product Management" },
  { title: "Experiments for New Products", difficulty: "Intermediate", color: "yellow", category: "Product Management" },
  { title: "Ideas for Existing Products",  difficulty: "Beginner",     color: "green",  category: "Product Management" },
  { title: "Ideas for New Products",       difficulty: "Beginner",     color: "green",  category: "Product Management" },
  { title: "Assumptions for Feature",      difficulty: "Intermediate", color: "yellow", category: "Product Management" },
  { title: "Assumptions for New Product",  difficulty: "Intermediate", color: "yellow", category: "Product Management" },
  { title: "Interview Script",             difficulty: "Beginner",     color: "green",  category: "Product Management" },
  { title: "Opportunity Solution Tree",    difficulty: "Advanced",     color: "red",    category: "Product Management" },
  { title: "Summarize Interview",          difficulty: "Beginner",     color: "green",  category: "Product Management" },

  // ── Product Strategy ──────────────────────────────────────────────────────
  { title: "Ansoff Matrix",               difficulty: "Advanced",     color: "red",    category: "Product Management" },
  { title: "Business Model Canvas",        difficulty: "Intermediate", color: "yellow", category: "Product Management" },
  { title: "Devil's Advocate",             difficulty: "Intermediate", color: "yellow", category: "Product Management" },
  { title: "Lean Canvas",                 difficulty: "Intermediate", color: "yellow", category: "Product Management" },
  { title: "Monetization Models",          difficulty: "Advanced",     color: "red",    category: "Product Management" },
  { title: "PESTLE Analysis",             difficulty: "Intermediate", color: "yellow", category: "Product Management" },
  { title: "Porter's Five Forces",         difficulty: "Intermediate", color: "yellow", category: "Product Management" },
  { title: "Pricing Strategy",            difficulty: "Advanced",     color: "red",    category: "Product Management" },
  { title: "Product Strategy Canvas",     difficulty: "Advanced",     color: "red",    category: "Product Management" },
  { title: "Product Vision",              difficulty: "Intermediate", color: "yellow", category: "Product Management" },
  { title: "Startup Canvas",              difficulty: "Advanced",     color: "red",    category: "Product Management" },
  { title: "SWOT Analysis",              difficulty: "Intermediate", color: "yellow", category: "Product Management" },
  { title: "Value Proposition Canvas",    difficulty: "Intermediate", color: "yellow", category: "Product Management" },

  // ── Vibe Coding ───────────────────────────────────────────────────────────
  { title: "Code Review for PMs",         difficulty: "Intermediate", color: "yellow", category: "Product Management" },
  { title: "Debug with AI",               difficulty: "Intermediate", color: "yellow", category: "Product Management" },
  { title: "Deploy Checklist",            difficulty: "Intermediate", color: "yellow", category: "Product Management" },
  { title: "Prototype Plan",              difficulty: "Intermediate", color: "yellow", category: "Product Management" },
  { title: "Technical Analysis",          difficulty: "Beginner",     color: "green",  category: "Product Management" },
  { title: "Technical Decision Guide",    difficulty: "Intermediate", color: "yellow", category: "Product Management" },
  { title: "Vibe Coding Spec",            difficulty: "Beginner",     color: "green",  category: "Product Management" },
]

/** Maps each card category to a specific cat mascot image */
const CATEGORY_MASCOT: Record<Category, { src: string; flip?: boolean }> = {
  Creativity:          { src: "/assets/mascot-creativity.png" },
  Coding:              { src: "/assets/mascot-coding.png"     },
  Marketing:           { src: "/assets/mascot-login-new.png", flip: true  },
  Education:           { src: "/assets/mascot-learn-new.png"  },
  Productivity:        { src: "/assets/mascot-home.png"       },
  "Product Management":{ src: "/assets/mascot-teacher.png"   },
}

const CATEGORIES: { label: Category; icon: React.ReactNode }[] = [
  { label: "Creativity",          icon: <Palette className="h-4 w-4" /> },
  { label: "Marketing",           icon: <Megaphone className="h-4 w-4" /> },
  { label: "Coding",              icon: <Code2 className="h-4 w-4" /> },
  { label: "Education",           icon: <BookOpen className="h-4 w-4" /> },
  { label: "Productivity",        icon: <ClipboardList className="h-4 w-4" /> },
  { label: "Product Management",  icon: <Target className="h-4 w-4" /> },
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

        </div>
      </div>
    </div>
  )
}
