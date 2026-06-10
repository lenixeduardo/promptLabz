import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import * as Icons from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { HelpButton } from "@/components/HelpButton"
import { cn } from "@/lib/utils"
import { lessonsData } from "@/data/lessonsData"

function getIcon(name: string) {
  const IconComponent = (Icons as any)[name]
  return IconComponent || Icons.BookOpen
}

interface CategoryProgress {
  currentModuleIndex: number
  currentLessonIndex: number
  completedLessonIds: string[]
}

export default function LearningLab() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  
  // Get active category from URL or default to first category
  const activeCategoryKey = searchParams.get("category") || "trending-skills"
  const activeCategory = lessonsData[activeCategoryKey] || lessonsData["trending-skills"]

  const [progress, setProgress] = useState<Record<string, CategoryProgress>>(() => {
    const saved = localStorage.getItem("promptlab_progress")
    return saved ? JSON.parse(saved) : {}
  })

  // Synchronize search param changes or storage changes if any
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem("promptlab_progress")
      if (saved) {
        setProgress(JSON.parse(saved))
      }
    }
    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const getProgressForCategory = (catId: string, categoryObj: typeof activeCategory): CategoryProgress => {
    if (progress[catId]) {
      return progress[catId]
    }
    return {
      currentModuleIndex: 0,
      currentLessonIndex: 0,
      completedLessonIds: []
    }
  }

  const currentCatProgress = getProgressForCategory(activeCategory.id, activeCategory)

  // Calculate total lessons and completed lessons for the active category
  let totalLessonsCount = 0
  let completedCount = 0
  activeCategory.modules.forEach((mod) => {
    mod.lessons.forEach((les) => {
      totalLessonsCount++
      if (currentCatProgress.completedLessonIds.includes(les.id)) {
        completedCount++
      }
    })
  })

  const progressPercent = totalLessonsCount > 0 ? Math.round((completedCount / totalLessonsCount) * 100) : 0

  // Category change handler
  const handleCategoryChange = (key: string) => {
    setSearchParams({ category: key })
  }

  // Get current active lesson to play
  const getNextLessonToPlay = () => {
    const currentMod = activeCategory.modules[currentCatProgress.currentModuleIndex]
    if (currentMod) {
      const currentLes = currentMod.lessons[currentCatProgress.currentLessonIndex]
      if (currentLes) {
        return {
          moduleId: currentMod.id,
          lessonId: currentLes.id,
          moduleIndex: currentCatProgress.currentModuleIndex,
          lessonIndex: currentCatProgress.currentLessonIndex
        }
      }
    }
    // If completed everything or index out of bounds, return first lesson or null
    return null
  }

  const nextLessonInfo = getNextLessonToPlay()

  const handleStartLesson = (modIndex: number, lesIndex: number) => {
    navigate(`/lesson?category=${activeCategory.id}&moduleIndex=${modIndex}&lessonIndex=${lesIndex}`)
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#EAF7EF] to-[#D2EEDD] px-5 py-6">
      <div className="mx-auto w-full max-w-[460px]">
        
        {/* Top Back/Home button */}
        <div className="mb-2 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate("/home")}
            className="flex items-center gap-1.5 text-[#2E8B57] hover:text-[#1F2A24]"
          >
            <Icons.ArrowLeft className="h-4 w-4" /> Home
          </Button>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#3E8E5E]">
            Learning Lab
          </span>
        </div>

        {/* Header Hero Card */}
        <Card className="relative mt-8 overflow-visible border-[#C6E7D2] bg-gradient-to-b from-[#D9F0E1] to-[#C2E8D0] p-5 pt-14 shadow-md">
          <div className="absolute -top-[55px] left-1/2 -translate-x-1/2">
            <img
              src="/assets/mascot-learn-new.png"
              alt="PromptLab mascot"
              className="h-24 w-auto object-contain drop-shadow-md"
            />
          </div>

          <h1 className="text-center text-xl font-extrabold text-[#1F2A24]">
            {activeCategory.title}
          </h1>

          {/* Progress bar */}
          <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-white/70">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-[#3E8E5E] to-[#2E7048] transition-all duration-500" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-[#3A4B40]">
            <span>{completedCount} de {totalLessonsCount} lições concluídas ({progressPercent}%)</span>
            <span className="font-semibold">
              {nextLessonInfo 
                ? `Atual: Mód. ${nextLessonInfo.moduleIndex + 1}, Lição ${nextLessonInfo.lessonIndex + 1}` 
                : "Concluído! 🎉"}
            </span>
          </div>
        </Card>

        {/* Categories Selector list (Chips) */}
        <div className="no-scrollbar mt-6 flex gap-2 overflow-x-auto pb-1">
          {Object.entries(lessonsData).map(([key, cat]) => {
            const isActive = key === activeCategoryKey
            const catProg = getProgressForCategory(cat.id, cat)
            const isCompleted = cat.modules.every((m, mIdx) => 
              m.lessons.every((l, lIdx) => catProg.completedLessonIds.includes(l.id))
            )
            return (
              <button
                key={key}
                onClick={() => handleCategoryChange(key)}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all shadow-sm",
                  isActive
                    ? "border-[#3E9A63] bg-[#3E8E5E] text-white"
                    : "border-[#CDEAD8] bg-white text-[#2A3B30] hover:bg-[#F0FAF3]"
                )}
              >
                {isCompleted ? (
                  <Icons.Check className="h-3 w-3 text-emerald-400" />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-[#3E9A63]" />
                )}
                {cat.title}
              </button>
            )
          })}
        </div>

        {/* Modules & Lessons list */}
        <div className="mt-6 flex flex-col gap-6">
          {activeCategory.modules.map((mod, modIdx) => {
            return (
              <div key={mod.id} className="flex flex-col gap-3">
                <div className="flex items-center justify-between px-1">
                  <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#2B5D3A]">
                    {mod.title}
                  </h2>
                  <span className="text-xs font-medium text-[#6B7A70]">
                    Módulo {modIdx + 1}
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  {mod.lessons.map((lesson, lesIdx) => {
                    const isDone = currentCatProgress.completedLessonIds.includes(lesson.id)
                    const isCurrent = currentCatProgress.currentModuleIndex === modIdx && currentCatProgress.currentLessonIndex === lesIdx
                    const isLocked = !isDone && !isCurrent && (
                      modIdx > currentCatProgress.currentModuleIndex || 
                      (modIdx === currentCatProgress.currentModuleIndex && lesIdx > currentCatProgress.currentLessonIndex)
                    )

                    const Icon = getIcon(lesson.icon)

                    return (
                      <div
                        key={lesson.id}
                        className={cn(
                          "flex items-center gap-3 rounded-2xl border bg-white px-4 py-3.5 shadow-sm transition-all",
                          isCurrent ? "border-[#3E9A63] border-2 ring-2 ring-[#DCF1E4]" : "border-[#CDEAD8]",
                          isLocked && "opacity-60"
                        )}
                      >
                        {/* Status Checkbox */}
                        <span
                          className={cn(
                            "flex h-6 w-6 shrink-0 items-center justify-center rounded-md border",
                            isDone ? "border-[#3E9A63] bg-[#3E9A63]" : "border-[#BFE3CC] bg-white"
                          )}
                        >
                          {isDone && <Icons.Check className="h-4 w-4 text-white" strokeWidth={3} />}
                        </span>

                        <Icon className="h-5 w-5 shrink-0 text-[#3E8E5E]" strokeWidth={2} />

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold leading-snug text-[#1F2A24] truncate">
                            {lesson.title}
                          </p>
                          <p className="text-xs text-[#6B7A70]">
                            Duração: {lesson.duration}
                          </p>
                        </div>

                        {/* Action status */}
                        {isCurrent ? (
                          <button
                            onClick={() => handleStartLesson(modIdx, lesIdx)}
                            className="flex items-center gap-1 rounded-full bg-[#DCF1E4] px-3 py-1.5 text-xs font-bold text-[#1E6B3A] hover:bg-[#cbeed7] transition-all"
                          >
                            <Icons.Play className="h-3.5 w-3.5 fill-current" /> Começar
                          </button>
                        ) : isDone ? (
                          <button
                            onClick={() => handleStartLesson(modIdx, lesIdx)}
                            className="flex items-center gap-1 text-xs font-bold text-[#3E8E5E] hover:underline"
                          >
                            Rever
                          </button>
                        ) : (
                          <span className="flex items-center gap-1 text-xs font-semibold text-[#8A998F]">
                            <Icons.Lock className="h-3.5 w-3.5" /> Bloqueado
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Global Action button */}
        <div className="mt-8 flex justify-center">
          {nextLessonInfo ? (
            <Button
              size="lg"
              className="w-full shadow-md hover:scale-[1.01] transition-transform"
              onClick={() => handleStartLesson(nextLessonInfo.moduleIndex, nextLessonInfo.lessonIndex)}
            >
              <Icons.Play className="h-5 w-5 fill-current" /> Continuar Aprendizado
            </Button>
          ) : (
            <Button
              size="lg"
              variant="outline"
              className="w-full border-[#3E9A63] text-[#3E8E5E] bg-white hover:bg-[#F0FAF3]"
              onClick={() => handleCategoryChange("trending-skills")}
            >
              <Icons.Sparkles className="h-5 w-5" /> Todos Concluídos! Explorar Outros
            </Button>
          )}
        </div>
      </div>

      <HelpButton />
    </div>
  )
}
