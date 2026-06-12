import { useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { useAchievements } from "@/hooks/useAchievements"
import { MascotGlow } from "@/components/MascotGlow"
import { cn } from "@/lib/utils"
import * as Icons from "@/lib/icons"

export default function Achievements() {
  const navigate = useNavigate()
  const { allAchievements, unlocked, data } = useAchievements()

  const progressPct = useMemo(
    () => Math.round((data.totalLessonsCompleted / 50) * 100),
    [data.totalLessonsCompleted],
  )

  const getProgressCount = (achId: string) => {
    switch (achId) {
      case "first-lesson":
        return { current: Math.min(data.totalLessonsCompleted, 1), max: 1 }
      case "ten-lessons":
        return { current: Math.min(data.totalLessonsCompleted, 10), max: 10 }
      case "fifty-lessons":
        return { current: Math.min(data.totalLessonsCompleted, 50), max: 50 }
      case "first-perfect":
        return { current: Math.min(data.perfectCount, 1), max: 1 }
      case "three-perfect":
        return { current: Math.min(data.perfectCount, 3), max: 3 }
      case "ten-perfect":
        return { current: Math.min(data.perfectCount, 10), max: 10 }
      case "streak-3":
        return { current: Math.min(data.consecutiveDays, 3), max: 3 }
      case "streak-7":
        return { current: Math.min(data.consecutiveDays, 7), max: 7 }
      case "streak-30":
        return { current: Math.min(data.consecutiveDays, 30), max: 30 }
      case "first-category":
        return { current: Math.min(data.visitedCategories.length, 1), max: 1 }
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EAF7EF] to-white px-4 py-6">
      <div className="mx-auto w-full max-w-lg">
        {/* Header com Mascote */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <button
            onClick={() => navigate("/home")}
            className="rounded-full p-1.5 text-[#2F6B45] transition-colors hover:bg-[#DCF1E4]"
            aria-label="Voltar para home"
          >
            <Icons.ArrowLeft className="h-5 w-5" />
          </button>

          <div className="flex flex-1 flex-col items-center">
            <MascotGlow size={120}>
              <img
                src="/assets/mascot-icons/mascot_celebrate.svg"
                alt="Mascote comemorando"
                className="h-16 w-16 object-contain"
              />
            </MascotGlow>
            <div className="mt-2 text-center">
              <p className="text-xs font-medium text-[#6B9E7E]">Parabéns!</p>
              <h1 className="text-2xl font-extrabold text-[#1F2A24]">Conquistas</h1>
              <p className="mt-1 text-sm font-semibold text-[#3E8E5E]">
                {unlocked.length} de {allAchievements.length}
              </p>
            </div>
          </div>

          <div className="w-12" />
        </div>

        {/* Stats overview */}
        <div className="mb-6 grid grid-cols-3 gap-3">
          {[
            { value: data.totalLessonsCompleted, label: "Lições" },
            { value: data.perfectCount, label: "100%" },
            { value: data.consecutiveDays, label: "Dias" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-[#CDEAD8] bg-white p-3 text-center shadow-sm"
            >
              <p className="text-2xl font-extrabold text-[#2B5D3A]">{stat.value}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#6B9E7E]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Progress to 50 lessons */}
        <div className="mb-6 rounded-2xl border border-[#CDEAD8] bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2B5D3A]">
              Progresso Total
            </span>
            <span className="text-xs font-semibold text-[#6B9E7E]">
              {data.totalLessonsCompleted} / 50 lições
            </span>
          </div>
          <div
            className="h-2.5 w-full overflow-hidden rounded-full bg-[#EAF7EF]"
            role="progressbar"
            aria-valuenow={Math.min(progressPct, 100)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Progresso de lições completadas"
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#3E8E5E] to-[#2E7048] transition-all duration-500"
              style={{ width: `${Math.min(progressPct, 100)}%` }}
            />
          </div>
        </div>

        {/* Achievement cards */}
        <div className="flex flex-col gap-3 pb-6">
          {allAchievements.map((ach) => {
            const isUnlocked = unlocked.includes(ach.id)
            const IconComp = Icons[ach.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }> | undefined
            const progress = getProgressCount(ach.id)

            return (
              <article
                key={ach.id}
                className={cn(
                  "flex items-center gap-3 rounded-2xl border bg-white p-4 shadow-sm transition-all duration-300",
                  isUnlocked
                    ? "border-[#CDEAD8] scale-100"
                    : "border-[#EAF2ED] opacity-65 scale-98",
                )}
              >
                {/* Icon Circle */}
                <div
                  className={cn(
                    "relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full transition-all duration-300",
                    isUnlocked
                      ? "bg-gradient-to-br from-[#3E8E5E] to-[#2E7048] shadow-md"
                      : "bg-gradient-to-br from-[#E8EEE9] to-[#DCEAE3]",
                  )}
                  aria-hidden="true"
                >
                  {isUnlocked ? (
                    <>
                      {IconComp && (
                        <IconComp className="h-6 w-6 text-white transition-transform duration-300" />
                      )}
                      <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-md">
                        <Icons.Check className="h-3 w-3 text-[#3E8E5E]" />
                      </div>
                    </>
                  ) : (
                    <Icons.Lock className="h-5 w-5 text-[#9AB0A4]" />
                  )}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <h2
                    className={cn(
                      "text-sm font-bold leading-snug",
                      isUnlocked ? "text-[#1F2A24]" : "text-[#6B7A70]",
                    )}
                  >
                    {ach.title}
                  </h2>
                  <p className="text-xs text-[#6B7A70]">{ach.description}</p>
                  {progress && (
                    <div className="mt-1.5 flex items-center gap-2">
                      <div
                        className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#EAF7EF]"
                        role="progressbar"
                        aria-valuenow={progress.current}
                        aria-valuemin={0}
                        aria-valuemax={progress.max}
                        aria-label={`Progresso: ${progress.current} de ${progress.max}`}
                      >
                        <div
                          className="h-full bg-gradient-to-r from-[#3E8E5E] to-[#2E7048] transition-all duration-500"
                          style={{ width: `${(progress.current / progress.max) * 100}%` }}
                        />
                      </div>
                      <span className="whitespace-nowrap text-xs font-semibold text-[#3E8E5E]">
                        {progress.current}/{progress.max}
                      </span>
                    </div>
                  )}
                </div>

                {/* Badge */}
                <div
                  className={cn(
                    "shrink-0 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors duration-300",
                    isUnlocked
                      ? "bg-[#DCF1E4] text-[#1E6B3A]"
                      : "bg-[#EEF1EF] text-[#8A998F]",
                  )}
                >
                  {isUnlocked ? "✔" : ach.category}
                </div>
              </article>
            )
          })}
        </div>

      </div>
    </div>
  )
}
