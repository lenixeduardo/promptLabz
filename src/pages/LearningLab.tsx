import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  BookOpen,
  Pencil,
  Settings,
  ArrowRightLeft,
  Code,
  Lightbulb,
  Share2,
  Drama,
  Network,
  Check,
  Play,
  Heart,
  Clock,
  type LucideIcon,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { HelpButton } from "@/components/HelpButton"
import { LivesBar } from "@/components/LivesBar"
import { useLives, MAX_LIVES, RECHARGE_MS } from "@/contexts/LivesContext"
import { cn } from "@/lib/utils"

// ── Static data ─────────────────────────────────────────────────────────────

const tabs = [
  { label: "Main Path",            icon: BookOpen },
  { label: "Supplemental Lessons", icon: Pencil   },
  { label: "Mini-Assignments",     icon: Settings },
]

type LessonStatus = "done" | "in-progress" | "locked"

interface Lesson {
  title: string
  icon: LucideIcon
  duration: string
  status: LessonStatus
}

const lessons: Lesson[] = [
  { title: "Lesson 1: Core Concepts",                    icon: Settings,      duration: "10 min", status: "done"        },
  { title: "Lesson 2: Simple Input/Output",              icon: ArrowRightLeft, duration: "12 min", status: "done"        },
  { title: "Lesson 3: Introduction to Prompt Structures",icon: Code,          duration: "15 min", status: "done"        },
  { title: "Lesson 4: Chain-of-Thought Prompting",       icon: Lightbulb,     duration: "15 min", status: "in-progress" },
  { title: "Lesson 5: Zero-Shot vs Few-Shot",            icon: Lightbulb,     duration: "12 min", status: "locked"      },
  { title: "Lesson 6: Zero-Shot Chain-of-Thought",       icon: Share2,        duration: "14 min", status: "locked"      },
  { title: "Lesson 7: Role Playing and Persona Adoption",icon: Drama,         duration: "18 min", status: "locked"      },
  { title: "Lesson 8: Structuring Complex Tasks",        icon: Network,       duration: "25 min", status: "locked"      },
]

// ── Countdown hook ──────────────────────────────────────────────────────────

function useCountdown(getMsLeft: () => number) {
  const [msLeft, setMsLeft] = useState(getMsLeft)

  useEffect(() => {
    setMsLeft(getMsLeft())
    const t = setInterval(() => setMsLeft(getMsLeft()), 1000)
    return () => clearInterval(t)
  }, [getMsLeft])

  const totalSec = Math.max(0, Math.ceil(msLeft / 1000))
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  const label = h > 0
    ? `${h}h ${String(m).padStart(2, "0")}min`
    : `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`

  return label
}

// ── NoLivesModal ────────────────────────────────────────────────────────────

function NoLivesModal({ onClose }: { onClose: () => void }) {
  const { msUntilNextLife } = useLives()
  const countdown = useCountdown(msUntilNextLife)

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md animate-slide-up rounded-t-3xl bg-white px-6 pb-10 pt-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-[#CDEAD8]" />

        {/* Depleted hearts */}
        <div className="mb-4 flex justify-center gap-1.5">
          {Array.from({ length: MAX_LIVES }).map((_, i) => (
            <Heart key={i} className="h-7 w-7 fill-none text-[#D1D5D3]" />
          ))}
        </div>

        {/* Mascot */}
        <div className="flex justify-center">
          <img
            src="/assets/mascot-home.png"
            alt="Mascot esperando"
            className="h-28 w-auto object-contain opacity-80"
            style={{ mixBlendMode: "multiply" }}
          />
        </div>

        <h2 className="mt-3 text-center text-2xl font-extrabold text-[#1F2A24]">
          Suas vidas acabaram!
        </h2>
        <p className="mt-1 text-center text-sm text-[#6B9E7E]">
          Você precisa de pelo menos 1 vida para começar uma lição.
        </p>

        {/* Recharge info */}
        <div className="mt-5 flex items-center justify-between rounded-2xl bg-[#EAF7EF] px-4 py-3.5">
          <div className="flex items-center gap-2 text-sm text-[#2F6B45]">
            <Clock className="h-4 w-4 shrink-0" />
            <span>Próxima vida em</span>
          </div>
          <span className="text-lg font-bold text-[#2F6B45]">{countdown}</span>
        </div>

        <p className="mt-3 text-center text-xs text-[#9AB0A4]">
          Vidas recarregam 1 por hora · Acerte 100% para ganhar 1 extra por dia
        </p>

        <Button
          size="lg"
          variant="outline"
          className="mt-5 w-full border-[#CDEAD8] text-[#2F6B45]"
          onClick={onClose}
        >
          Entendi
        </Button>
      </div>
    </div>
  )
}

// ── Sub-components ──────────────────────────────────────────────────────────

function Checkbox({ checked }: { checked: boolean }) {
  return (
    <span
      className={cn(
        "flex h-6 w-6 shrink-0 items-center justify-center rounded-md border",
        checked ? "border-[#3E9A63] bg-[#3E9A63]" : "border-[#BFE3CC] bg-white"
      )}
    >
      {checked && <Check className="h-4 w-4 text-white" strokeWidth={3} />}
    </span>
  )
}

function LessonRow({
  lesson,
  onPlay,
  canPlay,
}: {
  lesson: Lesson
  onPlay: () => void
  canPlay: boolean
}) {
  const { title, icon: Icon, duration, status } = lesson
  const done = status === "done"
  const inProgress = status === "in-progress"

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-2xl border bg-white px-4 py-3.5 shadow-sm",
        inProgress ? "border-2 border-[#3E9A63]" : "border-[#CDEAD8]"
      )}
    >
      <Checkbox checked={done || inProgress} />
      <Icon className="h-5 w-5 shrink-0 text-[#3E8E5E]" strokeWidth={2} />
      <span className="flex-1 text-sm font-semibold leading-snug text-[#1F2A24]">
        {title}
      </span>

      {inProgress ? (
        <div className="flex shrink-0 items-center gap-2">
          <span className="rounded-full bg-[#FCE9B8] px-3 py-1 text-xs font-semibold text-[#9A7B22]">
            In Progress
          </span>
          <button
            onClick={onPlay}
            className={cn(
              "flex items-center gap-1 text-sm font-semibold transition-colors",
              canPlay
                ? "text-[#2E8B57] hover:text-[#1E6B3A]"
                : "cursor-not-allowed text-[#A0A8A3]"
            )}
          >
            <Play className="h-4 w-4 fill-current" /> Play
          </button>
        </div>
      ) : (
        <span
          className={cn(
            "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
            status === "locked"
              ? "bg-[#E6E8E6] text-[#7A807A]"
              : "bg-[#DCF1E4] text-[#2E7A4E]"
          )}
        >
          <span
            className={cn(
              "h-2 w-2 rounded-full",
              status === "locked" ? "bg-[#A6ACA6]" : "bg-[#3E9A63]"
            )}
          />
          {duration}
        </span>
      )}
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function LearningLab() {
  const [activeTab, setActiveTab] = useState(0)
  const [showNoLives, setShowNoLives] = useState(false)
  const navigate = useNavigate()
  const { lives, canPlay, consumeLife, msUntilNextLife } = useLives()
  const countdown = useCountdown(msUntilNextLife)

  function handleStartLesson() {
    if (!canPlay) { setShowNoLives(true); return }
    consumeLife()
    navigate("/lesson")
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#EAF7EF] to-[#D2EEDD] px-5 py-6">
      <div className="mx-auto w-full max-w-[440px]">

        {/* Header hero card */}
        <Card className="relative mt-12 overflow-visible border-[#C6E7D2] bg-gradient-to-b from-[#D9F0E1] to-[#C2E8D0] p-5 pt-16 shadow-md">
          <div className="absolute -top-[68px] left-1/2 -translate-x-1/2">
            <img
              src="/assets/mascot-learn-new.png"
              alt="PromptLab mascot"
              className="h-28 w-auto object-contain drop-shadow-md"
            />
          </div>

          <h1 className="text-center text-2xl font-extrabold text-[#1F2A24]">
            Advanced Prompt Engineering <span aria-hidden>🚀</span>
          </h1>

          {/* Lives row */}
          <div className="mt-4 flex items-center justify-between">
            <LivesBar />
            {!canPlay ? (
              <span className="flex items-center gap-1 text-xs font-medium text-[#9A7B22]">
                <Clock className="h-3.5 w-3.5" />
                {countdown}
              </span>
            ) : (
              <span className="text-xs font-medium text-[#3E8E5E]">
                {lives}/{MAX_LIVES} vidas
              </span>
            )}
          </div>

          {/* Progress bar */}
          <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-white/70">
            <div className="h-full w-[37%] rounded-full bg-gradient-to-r from-[#3E8E5E] to-[#2E7048]" />
          </div>
          <div className="mt-2 flex items-center justify-between text-sm text-[#3A4B40]">
            <span>3 of 8 lessons completed</span>
            <span className="font-medium">Total: 2h 15m</span>
          </div>
        </Card>

        {/* Tabs */}
        <div className="no-scrollbar mt-5 flex gap-2.5 overflow-x-auto pb-1">
          {tabs.map(({ label, icon: Icon }, i) => (
            <button
              key={label}
              onClick={() => setActiveTab(i)}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                i === activeTab
                  ? "border-[#3E9A63] bg-[#3E8E5E] text-white"
                  : "border-[#CDEAD8] bg-white text-[#2A3B30] hover:bg-[#F0FAF3]"
              )}
            >
              <Icon className="h-4 w-4" strokeWidth={2.2} />
              {label}
            </button>
          ))}
        </div>

        {/* Lesson list */}
        <div className="mt-4 flex flex-col gap-3">
          {lessons.map((lesson) => (
            <LessonRow
              key={lesson.title}
              lesson={lesson}
              canPlay={canPlay}
              onPlay={handleStartLesson}
            />
          ))}
        </div>

        {/* Start Lesson button */}
        <div className="mt-6 flex justify-center">
          <Button
            size="lg"
            className={cn(
              "w-full max-w-xs transition-opacity",
              !canPlay && "opacity-60"
            )}
            onClick={handleStartLesson}
          >
            {canPlay ? (
              <><Play className="h-5 w-5 fill-current" /> Start Lesson</>
            ) : (
              <><Heart className="h-5 w-5" /> Sem vidas</>
            )}
          </Button>
        </div>

        {/* Recharge hint when out of lives */}
        {!canPlay && (
          <p className="mt-3 text-center text-xs text-[#9AB0A4]">
            Próxima vida em {countdown} · 1 vida/hora
          </p>
        )}
      </div>

      <HelpButton />

      {showNoLives && <NoLivesModal onClose={() => setShowNoLives(false)} />}
    </div>
  )
}
