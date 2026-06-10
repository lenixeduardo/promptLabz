import { useState } from "react"
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
  type LucideIcon,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { HelpButton } from "@/components/HelpButton"
import { cn } from "@/lib/utils"

const tabs = [
  { label: "Main Path", icon: BookOpen },
  { label: "Supplemental Lessons", icon: Pencil },
  { label: "Mini-Assignments", icon: Settings },
]

type LessonStatus = "done" | "in-progress" | "locked"

interface Lesson {
  title: string
  icon: LucideIcon
  duration: string
  status: LessonStatus
}

const lessons: Lesson[] = [
  { title: "Lesson 1: Core Concepts", icon: Settings, duration: "10 min", status: "done" },
  { title: "Lesson 2: Simple Input/Output", icon: ArrowRightLeft, duration: "12 min", status: "done" },
  { title: "Lesson 3: Introduction to Prompt Structures", icon: Code, duration: "15 min", status: "done" },
  { title: "Lesson 4: Chain-of-Thought Prompting", icon: Lightbulb, duration: "15 min", status: "in-progress" },
  { title: "Lesson 5: Zero-Shot vs Few-Shot", icon: Lightbulb, duration: "12 min", status: "locked" },
  { title: "Lesson 6: Zero-Shot Chain-of-Thought", icon: Share2, duration: "14 min", status: "locked" },
  { title: "Lesson 7: Role Playing and Persona Adoption", icon: Drama, duration: "18 min", status: "locked" },
  { title: "Lesson 8: Structuring Complex Tasks", icon: Network, duration: "25 min", status: "locked" },
]

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

function LessonRow({ lesson, onPlay }: { lesson: Lesson; onPlay: () => void }) {
  const { title, icon: Icon, duration, status } = lesson
  const done = status === "done"
  const inProgress = status === "in-progress"

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-2xl border bg-white px-4 py-3.5 shadow-sm",
        inProgress ? "border-[#3E9A63] border-2" : "border-[#CDEAD8]"
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
            className="flex items-center gap-1 text-sm font-semibold text-[#2E8B57] hover:text-[#1E6B3A] transition-colors"
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

export default function LearningLab() {
  const [active, setActive] = useState(0)
  const navigate = useNavigate()

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

          {/* Progress bar */}
          <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-white/70">
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
              onClick={() => setActive(i)}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                i === active
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
            <LessonRow key={lesson.title} lesson={lesson} onPlay={() => navigate("/lesson")} />
          ))}
        </div>

        {/* Start Lesson button */}
        <div className="mt-6 flex justify-center">
          <Button size="lg" className="w-full max-w-xs" onClick={() => navigate("/lesson")}>
            <Play className="h-5 w-5 fill-current" /> Start Lesson
          </Button>
        </div>
      </div>

      <HelpButton />
    </div>
  )
}
