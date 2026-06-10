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
} from "lucide-react"

// ── Types ──────────────────────────────────────────────────────────────────

type Difficulty = "Beginner" | "Intermediate" | "Advanced"
type DotColor   = "green" | "yellow" | "red"
type Category   = "Creativity" | "Marketing" | "Coding" | "Education" | "Productivity" | "Product Management"
type FilterState = "All" | Category

interface PromptCard {
  title: string
  difficulty: Difficulty
  color: DotColor
  category: Category
}

// ── Data ───────────────────────────────────────────────────────────────────

const PROMPTS: PromptCard[] = [
  // ── Creativity ───────────────────────────────────────────────────────────
  { title: "Prompt for Storytelling",    difficulty: "Beginner",     color: "green",  category: "Creativity" },
  { title: "Graphic Design Prompts",     difficulty: "Advanced",     color: "green",  category: "Creativity" },
  { title: "UX Research Prompt",         difficulty: "Advanced",     color: "red",    category: "Creativity" },
  { title: "Character Development",      difficulty: "Beginner",     color: "green",  category: "Creativity" },
  { title: "World Building",             difficulty: "Intermediate", color: "yellow", category: "Creativity" },
  { title: "Brand Identity Design",      difficulty: "Intermediate", color: "yellow", category: "Creativity" },
  { title: "Creative Brief Generator",   difficulty: "Beginner",     color: "green",  category: "Creativity" },
  { title: "Visual Concept Board",       difficulty: "Advanced",     color: "red",    category: "Creativity" },

  // ── Marketing ────────────────────────────────────────────────────────────
  { title: "Customer Support Prompt",    difficulty: "Intermediate", color: "yellow", category: "Marketing" },
  { title: "Social Media Copy",          difficulty: "Beginner",     color: "green",  category: "Marketing" },
  { title: "Email Campaign",             difficulty: "Intermediate", color: "yellow", category: "Marketing" },
  { title: "Ad Copywriting",             difficulty: "Intermediate", color: "yellow", category: "Marketing" },
  { title: "Landing Page Copy",          difficulty: "Advanced",     color: "red",    category: "Marketing" },
  { title: "Content Calendar",           difficulty: "Beginner",     color: "green",  category: "Marketing" },
  { title: "Brand Voice Guide",          difficulty: "Intermediate", color: "yellow", category: "Marketing" },
  { title: "Influencer Brief",           difficulty: "Beginner",     color: "green",  category: "Marketing" },

  // ── Coding ───────────────────────────────────────────────────────────────
  { title: "Data Analysis Script",       difficulty: "Advanced",     color: "green",  category: "Coding" },
  { title: "Code Review Prompt",         difficulty: "Intermediate", color: "yellow", category: "Coding" },
  { title: "API Design Pattern",         difficulty: "Advanced",     color: "red",    category: "Coding" },
  { title: "Unit Test Generator",        difficulty: "Intermediate", color: "yellow", category: "Coding" },
  { title: "Bug Report Template",        difficulty: "Beginner",     color: "green",  category: "Coding" },
  { title: "Database Schema",            difficulty: "Advanced",     color: "red",    category: "Coding" },
  { title: "Regex Builder",              difficulty: "Intermediate", color: "yellow", category: "Coding" },
  { title: "Refactor Assistant",         difficulty: "Advanced",     color: "red",    category: "Coding" },

  // ── Education ────────────────────────────────────────────────────────────
  { title: "Study Plan Generator",       difficulty: "Intermediate", color: "yellow", category: "Education" },
  { title: "Quiz Maker",                 difficulty: "Beginner",     color: "green",  category: "Education" },
  { title: "Lesson Plan Builder",        difficulty: "Intermediate", color: "yellow", category: "Education" },
  { title: "Explain Like I'm 5",         difficulty: "Beginner",     color: "green",  category: "Education" },
  { title: "Flashcard Generator",        difficulty: "Beginner",     color: "green",  category: "Education" },
  { title: "Essay Feedback",             difficulty: "Intermediate", color: "yellow", category: "Education" },
  { title: "Research Summary",           difficulty: "Advanced",     color: "red",    category: "Education" },
  { title: "Concept Map",                difficulty: "Intermediate", color: "yellow", category: "Education" },

  // ── Productivity ─────────────────────────────────────────────────────────
  { title: "Resume Writing",             difficulty: "Advanced",     color: "red",    category: "Productivity" },
  { title: "Email Writing",              difficulty: "Beginner",     color: "green",  category: "Productivity" },
  { title: "Daily Planner",              difficulty: "Beginner",     color: "green",  category: "Productivity" },
  { title: "Meeting Agenda",             difficulty: "Beginner",     color: "green",  category: "Productivity" },
  { title: "Decision Matrix",            difficulty: "Intermediate", color: "yellow", category: "Productivity" },
  { title: "Task Prioritization",        difficulty: "Intermediate", color: "yellow", category: "Productivity" },
  { title: "Performance Review",         difficulty: "Advanced",     color: "red",    category: "Productivity" },
  { title: "SOPs & Checklists",          difficulty: "Intermediate", color: "yellow", category: "Productivity" },

  // ── Product Management ───────────────────────────────────────────────────
  { title: "Build vs Buy vs Partner",    difficulty: "Advanced",     color: "red",    category: "Product Management" },
  { title: "AI Data Strategy",           difficulty: "Advanced",     color: "red",    category: "Product Management" },
  { title: "AI Feature Definition",      difficulty: "Intermediate", color: "yellow", category: "Product Management" },
  { title: "AI Incident Response",       difficulty: "Advanced",     color: "red",    category: "Product Management" },
  { title: "AI Model Evaluation",        difficulty: "Intermediate", color: "yellow", category: "Product Management" },
  { title: "AI User Research",           difficulty: "Intermediate", color: "yellow", category: "Product Management" },
  { title: "Prompt Engineering",         difficulty: "Intermediate", color: "yellow", category: "Product Management" },
  { title: "Responsible AI",             difficulty: "Intermediate", color: "yellow", category: "Product Management" },
  { title: "A/B Test Analysis",          difficulty: "Intermediate", color: "yellow", category: "Product Management" },
  { title: "Cohort Analysis",            difficulty: "Intermediate", color: "yellow", category: "Product Management" },
  { title: "Event Tracking Plan",        difficulty: "Beginner",     color: "green",  category: "Product Management" },
  { title: "Funnel Analysis",            difficulty: "Intermediate", color: "yellow", category: "Product Management" },
  { title: "Metric Definition",          difficulty: "Beginner",     color: "green",  category: "Product Management" },
  { title: "Product Metrics",            difficulty: "Intermediate", color: "yellow", category: "Product Management" },
  { title: "SQL Queries for PMs",        difficulty: "Intermediate", color: "yellow", category: "Product Management" },
  { title: "Brainstorm OKRs",            difficulty: "Intermediate", color: "yellow", category: "Product Management" },
  { title: "Create PRD",                 difficulty: "Intermediate", color: "yellow", category: "Product Management" },
  { title: "Job Stories",                difficulty: "Beginner",     color: "green",  category: "Product Management" },
  { title: "Meeting Prep",               difficulty: "Beginner",     color: "green",  category: "Product Management" },
  { title: "Outcome Roadmap",            difficulty: "Intermediate", color: "yellow", category: "Product Management" },
  { title: "Pre-Mortem Analysis",        difficulty: "Intermediate", color: "yellow", category: "Product Management" },
  { title: "Prioritization",             difficulty: "Intermediate", color: "yellow", category: "Product Management" },
  { title: "Release Notes",              difficulty: "Beginner",     color: "green",  category: "Product Management" },
  { title: "Sprint Retrospective",       difficulty: "Beginner",     color: "green",  category: "Product Management" },
  { title: "Sprint Plan",                difficulty: "Intermediate", color: "yellow", category: "Product Management" },
  { title: "Stakeholder Map",            difficulty: "Intermediate", color: "yellow", category: "Product Management" },
  { title: "Stakeholder Update",         difficulty: "Beginner",     color: "green",  category: "Product Management" },
  { title: "Summarize Meeting",          difficulty: "Beginner",     color: "green",  category: "Product Management" },
  { title: "Test Scenarios",             difficulty: "Intermediate", color: "yellow", category: "Product Management" },
  { title: "User Stories",               difficulty: "Beginner",     color: "green",  category: "Product Management" },
  { title: "Growth Loops",               difficulty: "Advanced",     color: "red",    category: "Product Management" },
  { title: "GTM Strategy",               difficulty: "Advanced",     color: "red",    category: "Product Management" },
  { title: "Ideal Customer Profile",     difficulty: "Intermediate", color: "yellow", category: "Product Management" },
  { title: "Competitor Analysis",        difficulty: "Intermediate", color: "yellow", category: "Product Management" },
  { title: "Customer Journey Map",       difficulty: "Intermediate", color: "yellow", category: "Product Management" },
  { title: "Market Sizing",              difficulty: "Advanced",     color: "red",    category: "Product Management" },
  { title: "Business Model Canvas",      difficulty: "Intermediate", color: "yellow", category: "Product Management" },
  { title: "Product Vision",             difficulty: "Intermediate", color: "yellow", category: "Product Management" },
  { title: "SWOT Analysis",             difficulty: "Intermediate", color: "yellow", category: "Product Management" },
  { title: "Value Proposition Canvas",   difficulty: "Intermediate", color: "yellow", category: "Product Management" },
  { title: "Vibe Coding Spec",           difficulty: "Beginner",     color: "green",  category: "Product Management" },
]

const CATEGORY_MASCOT: Record<Category, { src: string; flip?: boolean }> = {
  Creativity:           { src: "/assets/mascot-creativity.png" },
  Coding:               { src: "/assets/mascot-coding.png" },
  Marketing:            { src: "/assets/mascot-login-new.png", flip: true },
  Education:            { src: "/assets/mascot-learn-new.png" },
  Productivity:         { src: "/assets/mascot-home.png" },
  "Product Management": { src: "/assets/mascot-teacher.png" },
}

const CATEGORIES: { label: Category; icon: React.ReactNode }[] = [
  { label: "Creativity",         icon: <Palette className="h-4 w-4" /> },
  { label: "Marketing",          icon: <Megaphone className="h-4 w-4" /> },
  { label: "Coding",             icon: <Code2 className="h-4 w-4" /> },
  { label: "Education",          icon: <BookOpen className="h-4 w-4" /> },
  { label: "Productivity",       icon: <ClipboardList className="h-4 w-4" /> },
  { label: "Product Management", icon: <Target className="h-4 w-4" /> },
]

const BADGE: Record<DotColor, { dot: string; text: string; bg: string }> = {
  green:  { dot: "bg-green-500",  text: "text-[#2E7A4E]", bg: "bg-[#DCF1E4]" },
  yellow: { dot: "bg-yellow-400", text: "text-[#8A6A00]", bg: "bg-[#FEF3C7]" },
  red:    { dot: "bg-red-500",    text: "text-[#991B1B]", bg: "bg-[#FEE2E2]" },
}

// ── Sub-components ──────────────────────────────────────────────────────────

function DifficultyBadge({ difficulty, color }: { difficulty: Difficulty; color: DotColor }) {
  const s = BADGE[color]
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${s.bg} ${s.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {difficulty}
    </span>
  )
}

function PromptCardItem({ card }: { card: PromptCard }) {
  const mascot = CATEGORY_MASCOT[card.category]
  return (
    <div className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border border-[#CDEAD8] bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md active:scale-95">
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

// ── Page ────────────────────────────────────────────────────────────────────

export default function Skills() {
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState<FilterState>("All")

  const countFor = (cat: Category) => PROMPTS.filter(p => p.category === cat).length

  const filtered =
    activeFilter === "All"
      ? PROMPTS
      : PROMPTS.filter(p => p.category === activeFilter)

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EAF7EF] to-white px-4 py-6">
      <div className="mx-auto w-full max-w-[1200px]">

        {/* Back button */}
        <div className="mb-4 flex items-center">
          <button
            onClick={() => navigate(-1)}
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
            Prompt Library
          </h1>
        </div>

        {/* Category filter chips */}
        <div className="no-scrollbar mb-6 flex gap-2 overflow-x-auto pb-2">
          {/* All chip */}
          <button
            onClick={() => setActiveFilter("All")}
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              activeFilter === "All"
                ? "border-[#2B5D3A] bg-[#2B5D3A] text-white"
                : "border-[#BFE3CC] bg-white text-[#2B5D3A] hover:bg-[#EAF7EF]"
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
            All
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
            {activeFilter !== "All" && <span>em <strong className="text-[#2F6B45]">{activeFilter}</strong></span>}
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {filtered.length === 0 ? (
            <EmptyState category={activeFilter} />
          ) : (
            filtered.map((card, idx) => (
              <PromptCardItem key={`${card.category}-${idx}`} card={card} />
            ))
          )}
        </div>

      </div>
    </div>
  )
}
