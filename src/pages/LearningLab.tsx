import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import * as Icons from "@/lib/icons"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { HelpButton } from "@/components/HelpButton"
import { LivesBar } from "@/components/LivesBar"
import { MAX_LIVES } from "@/contexts/lives-config"
import { useLives } from "@/contexts/useLives"
import { useAuth } from "@/hooks/useAuth"
import { useAchievements } from "@/hooks/useAchievements"
import { cn } from "@/lib/utils"
import { lessonsData } from "@/data/lessonsData"
import { loadProgress, type CategoryProgress } from "@/lib/db"

function getIcon(name: string) {
  const iconMap = Icons as unknown as Record<string, Icons.LucideIcon>
  const IconComponent = iconMap[name]
  return IconComponent || Icons.BookOpen
}

function useCountdown(getMsLeft: () => number) {
  const [msLeft, setMsLeft] = useState(getMsLeft)

  useEffect(() => {
    setMsLeft(getMsLeft())
    const timer = setInterval(() => setMsLeft(getMsLeft()), 1000)
    return () => clearInterval(timer)
  }, [getMsLeft])

  const totalSec = Math.max(0, Math.ceil(msLeft / 1000))
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60

  return h > 0
    ? `${h}h ${String(m).padStart(2, "0")}min`
    : `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
}

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
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-[#CDEAD8]" />

        <div className="mb-4 flex justify-center gap-1.5">
          {Array.from({ length: MAX_LIVES }).map((_, index) => (
            <Icons.Heart key={index} className="h-7 w-7 fill-none text-[#D1D5D3]" />
          ))}
        </div>

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
          VocÃª precisa de pelo menos 1 vida para comeÃ§ar uma liÃ§Ã£o.
        </p>

        <div className="mt-5 flex items-center justify-between rounded-2xl bg-[#EAF7EF] px-4 py-3.5">
          <div className="flex items-center gap-2 text-sm text-[#2F6B45]">
            <Icons.Clock className="h-4 w-4 shrink-0" />
            <span>PrÃ³xima vida em</span>
          </div>
          <span className="text-lg font-bold text-[#2F6B45]">{countdown}</span>
        </div>

        <p className="mt-3 text-center text-xs text-[#9AB0A4]">
          Vidas recarregam 1 por hora. Acerte 100% para ganhar 1 extra por dia.
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

export default function LearningLab() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { user } = useAuth()
  const { lives, canPlay, consumeLife, msUntilNextLife } = useLives()
  const achievements = useAchievements()
  const [showNoLives, setShowNoLives] = useState(false)
  const countdown = useCountdown(msUntilNextLife)

  const activeCategoryKey = searchParams.get("category") || "trending-skills"
  const activeCategory = lessonsData[activeCategoryKey] || lessonsData["trending-skills"]

  // Track visited categories for achievements
  useEffect(() => {
    achievements.visitCategory(activeCategoryKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategoryKey])

  const [progress, setProgress] = useState<Record<string, CategoryProgress>>({})

  useEffect(() => {
    async function initProgress() {
      const data = await loadProgress(user?.id || "")
      setProgress(data)
    }
    initProgress()
  }, [user])

  const getProgressForCategory = (catId: string): CategoryProgress => {
    return progress[catId] || {
      currentModuleIndex: 0,
      currentLessonIndex: 0,
      completedLessonIds: [],
    }
  }

  const currentCatProgress = getProgressForCategory(activeCategory.id)

  let totalLessonsCount = 0
  let completedCount = 0
  activeCategory.modules.forEach((mod) => {
    mod.lessons.forEach((lesson) => {
      totalLessonsCount++
      if (currentCatProgress.completedLessonIds.includes(lesson.id)) {
        completedCount++
      }
    })
  })

  const progressPercent = totalLessonsCount > 0 ? Math.round((completedCount / totalLessonsCount) * 100) : 0

  const handleCategoryChange = (key: string) => {
    setSearchParams({ category: key })
  }

  const getNextLessonToPlay = () => {
    const currentMod = activeCategory.modules[currentCatProgress.currentModuleIndex]
    if (!currentMod) return null

    const currentLesson = currentMod.lessons[currentCatProgress.currentLessonIndex]
    if (!currentLesson) return null

    return {
      moduleIndex: currentCatProgress.currentModuleIndex,
      lessonIndex: currentCatProgress.currentLessonIndex,
    }
  }

  const nextLessonInfo = getNextLessonToPlay()

  const handleStartLesson = (modIndex: number, lessonIndex: number) => {
    if (!canPlay) {
      setShowNoLives(true)
      return
    }

    consumeLife()
    navigate(`/lesson?category=${activeCategory.id}&moduleIndex=${modIndex}&lessonIndex=${lessonIndex}`)
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#EAF7EF] to-[#D2EEDD] px-5 py-6">
      <div className="mx-auto w-full max-w-[460px]">
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

        <Card className="relative mt-8 overflow-visible border-[#C6E7D2] bg-gradient-to-b from-[#D9F0E1] to-[#C2E8D0] p-5 pt-14 shadow-md">
          <div className="absolute -top-[55px] left-1/2 -translate-x-1/2">
            <img
              src="/assets/mascot-learn-new.png"
              alt="PromptLabz mascot"
              className="h-24 w-auto object-contain drop-shadow-md"
            />
          </div>

          <h1 className="text-center text-xl font-extrabold text-[#1F2A24]">
            {activeCategory.title}
          </h1>

          <div className="mt-4 flex items-center justify-between">
            <LivesBar />
            {!canPlay ? (
              <span className="flex items-center gap-1 text-xs font-medium text-[#9A7B22]">
                <Icons.Clock className="h-3.5 w-3.5" />
                {countdown}
              </span>
            ) : (
              <span className="text-xs font-medium text-[#3E8E5E]">
                {lives}/{MAX_LIVES} vidas
              </span>
            )}
          </div>

          <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-white/70">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#3E8E5E] to-[#2E7048] transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-[#3A4B40]">
            <span>{completedCount} de {totalLessonsCount} liÃ§Ãµes concluÃ­das ({progressPercent}%)</span>
            <span className="font-semibold">
              {nextLessonInfo
                ? `Atual: Mod. ${nextLessonInfo.moduleIndex + 1}, LiÃ§Ã£o ${nextLessonInfo.lessonIndex + 1}`
                : "ConcluÃ­do!"}
            </span>
          </div>
        </Card>

        <div className="no-scrollbar mt-6 flex gap-2 overflow-x-auto pb-1">
          {Object.entries(lessonsData).map(([key, cat]) => {
            const isActive = key === activeCategoryKey
            const catProgress = getProgressForCategory(cat.id)
            const isCompleted = cat.modules.every((mod) =>
              mod.lessons.every((lesson) => catProgress.completedLessonIds.includes(lesson.id))
            )

            return (
              <button
                key={key}
                onClick={() => handleCategoryChange(key)}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold shadow-sm transition-all",
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

        <div className="mt-6 flex flex-col gap-6">
          {activeCategory.modules.map((mod, modIndex) => (
            <div key={mod.id} className="flex flex-col gap-3">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#2B5D3A]">
                  {mod.title}
                </h2>
                <span className="text-xs font-medium text-[#6B7A70]">
                  MÃ³dulo {modIndex + 1}
                </span>
              </div>

              <div className="flex flex-col gap-3">
                {mod.lessons.map((lesson, lessonIndex) => {
                  const isDone = currentCatProgress.completedLessonIds.includes(lesson.id)
                  const isCurrent =
                    currentCatProgress.currentModuleIndex === modIndex &&
                    currentCatProgress.currentLessonIndex === lessonIndex
                  const isLocked = !isDone && !isCurrent && (
                    modIndex > currentCatProgress.currentModuleIndex ||
                    (modIndex === currentCatProgress.currentModuleIndex &&
                      lessonIndex > currentCatProgress.currentLessonIndex)
                  )
                  const Icon = getIcon(lesson.icon)

                  return (
                    <div
                      key={lesson.id}
                      className={cn(
                        "flex items-center gap-3 rounded-2xl border bg-white px-4 py-3.5 shadow-sm transition-all",
                        isCurrent ? "border-2 border-[#3E9A63] ring-2 ring-[#DCF1E4]" : "border-[#CDEAD8]",
                        isLocked && "opacity-60"
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-6 w-6 shrink-0 items-center justify-center rounded-md border",
                          isDone ? "border-[#3E9A63] bg-[#3E9A63]" : "border-[#BFE3CC] bg-white"
                        )}
                      >
                        {isDone && <Icons.Check className="h-4 w-4 text-white" strokeWidth={3} />}
                      </span>

                      <Icon className="h-5 w-5 shrink-0 text-[#3E8E5E]" strokeWidth={2} />

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold leading-snug text-[#1F2A24]">
                          {lesson.title}
                        </p>
                        <p className="text-xs text-[#6B7A70]">
                          DuraÃ§Ã£o: {lesson.duration}
                        </p>
                      </div>

                      {isCurrent ? (
                        <button
                          onClick={() => handleStartLesson(modIndex, lessonIndex)}
                          className={cn(
                            "flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold transition-all",
                            canPlay
                              ? "bg-[#DCF1E4] text-[#1E6B3A] hover:bg-[#cbeed7]"
                              : "bg-[#EEF1EF] text-[#8A998F]"
                          )}
                        >
                          <Icons.Play className="h-3.5 w-3.5 fill-current" /> ComeÃ§ar
                        </button>
                      ) : isDone ? (
                        <button
                          onClick={() => handleStartLesson(modIndex, lessonIndex)}
                          className={cn(
                            "flex items-center gap-1 text-xs font-bold",
                            canPlay ? "text-[#3E8E5E] hover:underline" : "text-[#8A998F]"
                          )}
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
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          {nextLessonInfo ? (
            <Button
              size="lg"
              className={cn("w-full shadow-md transition-transform hover:scale-[1.01]", !canPlay && "opacity-60")}
              onClick={() => handleStartLesson(nextLessonInfo.moduleIndex, nextLessonInfo.lessonIndex)}
            >
              {canPlay ? (
                <><Icons.Play className="h-5 w-5 fill-current" /> Continuar Aprendizado</>
              ) : (
                <><Icons.Heart className="h-5 w-5" /> Sem vidas</>
              )}
            </Button>
          ) : (
            <Button
              size="lg"
              variant="outline"
              className="w-full border-[#3E9A63] bg-white text-[#3E8E5E] hover:bg-[#F0FAF3]"
              onClick={() => handleCategoryChange("trending-skills")}
            >
              <Icons.Sparkles className="h-5 w-5" /> Explorar Outros
            </Button>
          )}
        </div>

        {!canPlay && (
          <p className="mt-3 text-center text-xs text-[#9AB0A4]">
            PrÃ³xima vida em {countdown}. 1 vida/hora
          </p>
        )}
      </div>

      <HelpButton />

      {showNoLives && <NoLivesModal onClose={() => setShowNoLives(false)} />}
    </div>
  )
}

