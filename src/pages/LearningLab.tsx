import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import * as Icons from "@/lib/icons"
import { Button } from "@/components/ui/button"
import { BottomNav } from "@/components/BottomNav"
import { LivesBar } from "@/components/LivesBar"
import { MAX_LIVES } from "@/contexts/lives-config"
import { useLives } from "@/contexts/useLives"
import { useAuth } from "@/hooks/useAuth"
import { useAchievements } from "@/hooks/useAchievements"
import { cn } from "@/lib/utils"
import { lessonsData, type Category, type Lesson } from "@/data/lessonsData"
import { loadProgress, type CategoryProgress } from "@/lib/db"

// ─── Trail SVG constants ────────────────────────────────────────────────────
const TRAIL_W = 340
const STEP_H = 140
const FIRST_Y = 90
const LEFT_X = 90
const RIGHT_X = 250
const CIRCLE_R = 22
const CARD_GAP = 10
const EDGE_PAD = 14

// ─── Types ──────────────────────────────────────────────────────────────────
type FlatLesson = Lesson & { moduleIndex: number; lessonIndex: number }

// ─── Category icon/meta map ─────────────────────────────────────────────────
const CATEGORY_META: Record<string, { icon: Icons.LucideIcon }> = {
  "trending-skills":     { icon: Icons.MessageSquare },
  "community-hub":       { icon: Icons.Users },
  "design":              { icon: Icons.Palette },
  "prompt-science":      { icon: Icons.Sparkles },
  "prompt-engineering":  { icon: Icons.BookOpen },
  "advanced-science":    { icon: Icons.Zap },
  "hour-of-focus":       { icon: Icons.Clock },
  "agent-orchestration": { icon: Icons.Workflow },
  "ai-finance":          { icon: Icons.TrendingUp },
  "ai-marketing":        { icon: Icons.Megaphone },
}

function getCatIcon(key: string): Icons.LucideIcon {
  return CATEGORY_META[key]?.icon ?? Icons.BookOpen
}

// ─── Helpers ────────────────────────────────────────────────────────────────
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

function flattenLessons(cat: Category): FlatLesson[] {
  return cat.modules.flatMap((mod, mi) =>
    mod.lessons.map((lesson, li) => ({ ...lesson, moduleIndex: mi, lessonIndex: li }))
  )
}

function getNodeX(index: number): number {
  return index % 2 === 0 ? RIGHT_X : LEFT_X
}

function getNodeY(index: number): number {
  return FIRST_Y + index * STEP_H
}

function buildTrailPath(count: number): string {
  if (count === 0) return ""
  const coords = Array.from({ length: count }, (_, i) => ({ x: getNodeX(i), y: getNodeY(i) }))
  let d = `M ${TRAIL_W / 2} 24 L ${coords[0].x} ${coords[0].y}`
  for (let i = 1; i < coords.length; i++) {
    const prev = coords[i - 1]
    const curr = coords[i]
    const midY = (prev.y + curr.y) / 2
    d += ` C ${prev.x} ${midY} ${curr.x} ${midY} ${curr.x} ${curr.y}`
  }
  return d
}

function getCoursePct(cat: Category, progress: CategoryProgress): number {
  let total = 0
  let done = 0
  cat.modules.forEach((mod) =>
    mod.lessons.forEach((l) => {
      total++
      if (progress.completedLessonIds.includes(l.id)) done++
    })
  )
  return total > 0 ? Math.round((done / total) * 100) : 0
}

// ─── NoLivesModal ───────────────────────────────────────────────────────────
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
        <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-[#CDEAD8]" />

        <div className="mb-4 flex justify-center gap-1.5">
          {Array.from({ length: MAX_LIVES }).map((_, i) => (
            <Icons.Heart key={i} className="h-7 w-7 fill-none text-[#D1D5D3]" />
          ))}
        </div>

        <div className="flex justify-center">
          <img
            src="/assets/mascot-home.png"
            alt="Mascot"
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

        <div className="mt-5 flex items-center justify-between rounded-2xl bg-[#EAF7EF] px-4 py-3.5">
          <div className="flex items-center gap-2 text-sm text-[#2F6B45]">
            <Icons.Clock className="h-4 w-4 shrink-0" />
            <span>Próxima vida em</span>
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

// ─── CircularProgress ───────────────────────────────────────────────────────
function CircularProgress({ pct }: { pct: number }) {
  const r = 16
  const circ = 2 * Math.PI * r
  const filled = (pct / 100) * circ

  return (
    <div className="relative flex items-center justify-center">
      <svg width="46" height="46" viewBox="0 0 46 46">
        <circle cx="23" cy="23" r={r} fill="none" stroke="#DCF1E4" strokeWidth="4" />
        <circle
          cx="23"
          cy="23"
          r={r}
          fill="none"
          stroke="#2B5D3A"
          strokeWidth="4"
          strokeDasharray={`${filled} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 23 23)"
        />
      </svg>
      <span className="absolute text-[9px] font-extrabold text-[#2B5D3A]">{pct}%</span>
    </div>
  )
}

// ─── CoursesListView ("Trilha de Aprendizado") ─────────────────────────────
function CoursesListView({
  getProgressForCategory,
  onSelect,
}: {
  getProgressForCategory: (catId: string) => CategoryProgress
  onSelect: (key: string) => void
}) {
  const navigate = useNavigate()
  const allEntries = Object.entries(lessonsData)

  function isCourseComplete(cat: Category): boolean {
    return getCoursePct(cat, getProgressForCategory(cat.id)) === 100
  }

  function isCourseAccessible(index: number): boolean {
    if (index === 0) return true
    const [, prevCat] = allEntries[index - 1]
    return isCourseComplete(prevCat)
  }

  return (
    <div className="min-h-screen bg-[#FAFCFA] pb-32">
      {/* Header */}
      <div className="bg-white px-5 pb-5 pt-14 shadow-sm">
        <div className="mx-auto flex max-w-[460px] items-center gap-3">
          <button
            onClick={() => navigate("/home")}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F0FAF3] text-[#2B5D3A] transition-colors hover:bg-[#DCF1E4]"
          >
            <Icons.ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-[#1A2E22]">Trilha de Aprendizado</h1>
            <p className="text-sm text-[#6B9E7E]">Aprenda do básico ao avançado</p>
          </div>
        </div>
      </div>

      {/* Course cards */}
      <div className="mx-auto flex max-w-[460px] flex-col gap-3 px-5 pt-5">
        {allEntries.map(([key, cat], index) => {
          const progress = getProgressForCategory(cat.id)
          const pct = getCoursePct(cat, progress)
          const accessible = isCourseAccessible(index)
          const inProgress = progress.completedLessonIds.length > 0 && pct < 100
          const complete = pct === 100
          const CatIcon = getCatIcon(key)
          const totalModules = cat.modules.length

          return (
            <button
              key={key}
              onClick={() => accessible && onSelect(key)}
              disabled={!accessible}
              className={cn(
                "flex items-center gap-4 rounded-2xl border bg-white p-4 text-left shadow-sm transition-all",
                accessible && "hover:bg-[#F8FBF8] active:scale-[0.99]",
                inProgress ? "border-2 border-[#2B5D3A]" : "border-[#EAF7EF]"
              )}
            >
              {/* Icon box */}
              <div
                className={cn(
                  "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl",
                  complete
                    ? "bg-[#2B5D3A]"
                    : inProgress
                      ? "bg-[#EAF7EF]"
                      : accessible
                        ? "bg-[#EAF7EF]"
                        : "bg-[#F3F5F3]"
                )}
              >
                <CatIcon
                  className={cn(
                    "h-7 w-7",
                    complete
                      ? "text-white"
                      : inProgress
                        ? "text-[#2B5D3A]"
                        : accessible
                          ? "text-[#2B5D3A]"
                          : "text-[#B0C8B8]"
                  )}
                />
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    "font-bold leading-tight",
                    accessible ? "text-[#1A2E22]" : "text-[#9AB0A4]"
                  )}
                >
                  {cat.title}
                </p>
                <p className="mt-0.5 text-xs text-[#6B9E7E]">
                  {totalModules} módulo{totalModules !== 1 ? "s" : ""}
                </p>
              </div>

              {/* Right status */}
              {!accessible ? (
                <Icons.Lock className="h-5 w-5 shrink-0 text-[#B0C8B8]" />
              ) : complete ? (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2B5D3A]">
                  <Icons.Check className="h-4 w-4 text-white" strokeWidth={2.5} />
                </div>
              ) : inProgress ? (
                <div className="flex shrink-0 items-center gap-1">
                  <CircularProgress pct={pct} />
                  <Icons.ChevronRight className="h-5 w-5 text-[#BFE3CC]" />
                </div>
              ) : (
                <Icons.ChevronRight className="h-5 w-5 shrink-0 text-[#BFE3CC]" />
              )}
            </button>
          )
        })}
      </div>

      <BottomNav active="trilha" />
    </div>
  )
}

// ─── TrailView (winding path) ───────────────────────────────────────────────
function TrailView({
  flatLessons,
  catProgress,
  effectiveCurrentIdx,
}: {
  flatLessons: FlatLesson[]
  catProgress: CategoryProgress
  effectiveCurrentIdx: number
}) {
  const count = flatLessons.length
  const containerH = count > 0 ? FIRST_Y + (count - 1) * STEP_H + 80 : 200
  const pathD = buildTrailPath(count)

  // Decorative tree positions (only if they fit in the container)
  const treePositions = [
    { x: 14, y: 50 },
    { x: TRAIL_W - 38, y: 200 },
    { x: 18, y: 360 },
    { x: TRAIL_W - 40, y: 500 },
  ]

  return (
    <div className="relative mx-auto" style={{ width: TRAIL_W, height: containerH }}>
      {/* SVG winding path */}
      <svg
        className="absolute inset-0"
        width={TRAIL_W}
        height={containerH}
        viewBox={`0 0 ${TRAIL_W} ${containerH}`}
        aria-hidden="true"
      >
        {/* Shadow layer */}
        <path
          d={pathD}
          stroke="#3A7050"
          strokeWidth="22"
          fill="none"
          strokeLinecap="round"
          strokeOpacity="0.15"
        />
        {/* Main path */}
        <path
          d={pathD}
          stroke="#5CBB7A"
          strokeWidth="17"
          fill="none"
          strokeLinecap="round"
        />
        {/* Inner highlight */}
        <path
          d={pathD}
          stroke="#A8DFB8"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          strokeOpacity="0.55"
        />
      </svg>

      {/* Flag at top */}
      <div
        className="absolute select-none text-2xl"
        style={{ left: TRAIL_W / 2 - 10, top: -8 }}
        aria-hidden="true"
      >
        🚩
      </div>

      {/* Decorative trees */}
      {treePositions
        .filter((t) => t.y < containerH - 50)
        .map((pos, i) => (
          <div
            key={i}
            className="pointer-events-none absolute select-none text-xl opacity-80"
            style={{ left: pos.x, top: pos.y }}
            aria-hidden="true"
          >
            🌲
          </div>
        ))}

      {/* Lesson nodes */}
      {flatLessons.map((lesson, i) => {
        const nodeX = getNodeX(i)
        const nodeY = getNodeY(i)
        const isCompleted = catProgress.completedLessonIds.includes(lesson.id)
        const isCurrent = i === effectiveCurrentIdx
        const isLocked = !isCompleted && !isCurrent

        const isRightNode = i % 2 === 0
        const cardLeft = isRightNode ? EDGE_PAD : nodeX + CIRCLE_R + CARD_GAP
        const cardRight = isRightNode ? nodeX - CIRCLE_R - CARD_GAP : TRAIL_W - EDGE_PAD
        const cardWidth = cardRight - cardLeft

        return (
          <div key={lesson.id}>
            {/* Node circle */}
            <div
              className={cn(
                "absolute z-10 flex items-center justify-center rounded-full text-sm font-bold shadow-md",
                isCompleted
                  ? "bg-[#2B5D3A] text-white"
                  : isCurrent
                    ? "border-4 border-[#2B5D3A] bg-white text-[#2B5D3A]"
                    : "bg-[#B0C8B8] text-white"
              )}
              style={{
                left: nodeX - CIRCLE_R,
                top: nodeY - CIRCLE_R,
                width: CIRCLE_R * 2,
                height: CIRCLE_R * 2,
              }}
            >
              {i + 1}
            </div>

            {/* Lesson card */}
            <div
              className={cn(
                "absolute z-[5] flex items-center rounded-2xl bg-white px-3 py-3",
                isCurrent
                  ? "border-2 border-[#2B5D3A] shadow-lg"
                  : "border border-[#E4F0E8] shadow-sm",
                isLocked && "opacity-75"
              )}
              style={{
                left: cardLeft,
                width: cardWidth,
                top: nodeY - 26,
                minHeight: 52,
              }}
            >
              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    "line-clamp-2 text-xs font-bold leading-snug",
                    isLocked ? "text-[#9AB0A4]" : "text-[#1A2E22]"
                  )}
                >
                  {lesson.title}
                </p>
              </div>
              <div className="ml-2 shrink-0">
                {isCompleted ? (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2B5D3A]">
                    <Icons.Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
                  </div>
                ) : isLocked ? (
                  <Icons.Lock className="h-4 w-4 text-[#B0C8B8]" />
                ) : (
                  <div className="h-6 w-6 rounded-full border-2 border-[#2B5D3A]" />
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function LearningLab() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { user } = useAuth()
  const { lives, canPlay, consumeLife, msUntilNextLife } = useLives()
  const achievements = useAchievements()
  const [showNoLives, setShowNoLives] = useState(false)
  const countdown = useCountdown(msUntilNextLife)

  const categoryParam = searchParams.get("category")
  const activeCategoryKey = categoryParam || "trending-skills"
  const activeCategory = lessonsData[activeCategoryKey] || lessonsData["trending-skills"]

  useEffect(() => {
    if (categoryParam) achievements.visitCategory(activeCategoryKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategoryKey, categoryParam])

  const [progress, setProgress] = useState<Record<string, CategoryProgress>>({})

  useEffect(() => {
    async function initProgress() {
      const data = await loadProgress(user?.id || "")
      setProgress(data)
    }
    initProgress()
  }, [user])

  const getProgressForCategory = (catId: string): CategoryProgress =>
    progress[catId] || { currentModuleIndex: 0, currentLessonIndex: 0, completedLessonIds: [] }

  const handleCategoryChange = (key: string) => setSearchParams({ category: key })

  const currentCatProgress = getProgressForCategory(activeCategory.id)
  const flatLessons = flattenLessons(activeCategory)

  // Determine current flat lesson index
  const currentFlatIdx = flatLessons.findIndex(
    (l) =>
      l.moduleIndex === currentCatProgress.currentModuleIndex &&
      l.lessonIndex === currentCatProgress.currentLessonIndex
  )
  const effectiveCurrentIdx = currentFlatIdx === -1 ? flatLessons.length : currentFlatIdx

  // Progress stats
  const totalLessonsCount = flatLessons.length
  const completedCount = flatLessons.filter((l) =>
    currentCatProgress.completedLessonIds.includes(l.id)
  ).length
  const progressPercent =
    totalLessonsCount > 0 ? Math.round((completedCount / totalLessonsCount) * 100) : 0

  const nextLesson =
    effectiveCurrentIdx < flatLessons.length ? flatLessons[effectiveCurrentIdx] : null

  const handleStartLesson = (modIndex: number, lessonIndex: number) => {
    if (!canPlay) {
      setShowNoLives(true)
      return
    }
    consumeLife()
    navigate(
      `/lesson?category=${activeCategory.id}&moduleIndex=${modIndex}&lessonIndex=${lessonIndex}`
    )
  }

  // ── Courses list (no category selected) ──
  if (!categoryParam) {
    return (
      <CoursesListView
        getProgressForCategory={getProgressForCategory}
        onSelect={handleCategoryChange}
      />
    )
  }

  // ── Teaching track detail ──
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F2FAF5] via-[#EAF7EE] to-[#DCF1E4]">
      {/* Header */}
      <div className="mx-auto max-w-[460px] px-5 pb-3 pt-12">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSearchParams({})}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/80 text-[#2B5D3A] shadow-sm transition-colors hover:bg-white"
            >
              <Icons.ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="max-w-[200px] text-lg font-extrabold leading-tight text-[#1A2E22]">
                {activeCategory.title}
              </h1>
              <p className="text-xs text-[#6B9E7E]">
                {totalLessonsCount} lições · {activeCategory.modules.length} módulo
                {activeCategory.modules.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {/* Mascot */}
          <img
            src="/assets/mascot-learn-new.png"
            alt="Mascot"
            className="h-24 w-auto -translate-y-2 object-contain drop-shadow-lg"
          />
        </div>
      </div>

      {/* Progress card */}
      <div className="mx-auto max-w-[460px] px-5 pb-5">
        <div className="rounded-2xl border border-[#DCF1E4] bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-[#1A2E22]">Seu progresso na trilha</p>
            <div className="flex items-center gap-1.5">
              <LivesBar />
              {!canPlay && (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-[#9A7B22]">
                  <Icons.Clock className="h-3.5 w-3.5" />
                  {countdown}
                </span>
              )}
            </div>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-[#EAF7EF]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#4EA86B] to-[#2B5D3A] transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="mt-1.5 flex items-center justify-between">
            <span className="text-[11px] text-[#6B9E7E]">
              {completedCount}/{totalLessonsCount} concluídas
            </span>
            <span className="text-sm font-extrabold text-[#2B5D3A]">{progressPercent}%</span>
          </div>
        </div>
      </div>

      {/* Winding trail */}
      <div className="flex justify-center px-4 pb-44">
        <TrailView
          flatLessons={flatLessons}
          catProgress={currentCatProgress}
          effectiveCurrentIdx={effectiveCurrentIdx}
        />
      </div>

      {/* Fixed bottom: CTA + BottomNav */}
      <div className="fixed bottom-0 left-0 right-0 z-30">
        <div className="mx-auto max-w-[460px] px-5 pb-1 pt-3">
          {nextLesson ? (
            <Button
              size="lg"
              className={cn(
                "w-full shadow-lg transition-transform active:scale-[0.98]",
                canPlay
                  ? "bg-[#2B5D3A] text-white hover:bg-[#234D30]"
                  : "bg-[#9AB0A4] text-white"
              )}
              onClick={() =>
                handleStartLesson(nextLesson.moduleIndex, nextLesson.lessonIndex)
              }
            >
              {canPlay ? (
                <>
                  Continuar aula {effectiveCurrentIdx + 1}
                  <Icons.ArrowRight className="ml-2 h-5 w-5" />
                </>
              ) : (
                <>
                  <Icons.Clock className="mr-2 h-5 w-5" />
                  Próxima vida em {countdown}
                </>
              )}
            </Button>
          ) : (
            <Button
              size="lg"
              variant="outline"
              className="w-full border-[#2B5D3A] bg-white text-[#2B5D3A] hover:bg-[#F0FAF3]"
              onClick={() => setSearchParams({})}
            >
              <Icons.Sparkles className="mr-2 h-5 w-5" />
              Explorar outros cursos
            </Button>
          )}
        </div>
        <BottomNav active="trilha" />
      </div>

      {showNoLives && <NoLivesModal onClose={() => setShowNoLives(false)} />}
    </div>
  )
}
