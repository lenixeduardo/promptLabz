import { useNavigate } from "react-router-dom"
import { useAchievements } from "@/hooks/useAchievements"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import * as Icons from "@/lib/icons"

export default function Achievements() {
  const navigate = useNavigate()
  const { allAchievements, unlocked, data } = useAchievements()

  const progressPct = Math.round(
    (data.totalLessonsCompleted / 50) * 100,
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EAF7EF] to-white px-4 py-6">
      <div className="mx-auto w-full max-w-lg">
        {/* Header */}
        <div className="mb-6 flex items-center gap-2">
          <button
            onClick={() => navigate("/home")}
            className="rounded-full p-1.5 text-[#2F6B45] transition-colors hover:bg-[#DCF1E4]"
            aria-label="Voltar"
          >
            <Icons.ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-[#1F2A24]">Conquistas</h1>
            <p className="text-xs font-medium text-[#6B9E7E]">
              {unlocked.length} / {allAchievements.length} desbloqueadas
            </p>
          </div>
        </div>

        {/* Stats overview */}
        <div className="mb-6 grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-[#CDEAD8] bg-white p-3 text-center shadow-sm">
            <p className="text-2xl font-extrabold text-[#2B5D3A]">{data.totalLessonsCompleted}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#6B9E7E]">Lições</p>
          </div>
          <div className="rounded-2xl border border-[#CDEAD8] bg-white p-3 text-center shadow-sm">
            <p className="text-2xl font-extrabold text-[#2B5D3A]">{data.perfectCount}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#6B9E7E]">100%</p>
          </div>
          <div className="rounded-2xl border border-[#CDEAD8] bg-white p-3 text-center shadow-sm">
            <p className="text-2xl font-extrabold text-[#2B5D3A]">{data.consecutiveDays}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#6B9E7E]">Dias</p>
          </div>
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
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#EAF7EF]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#3E8E5E] to-[#2E7048] transition-all duration-500"
              style={{ width: `${Math.min(progressPct, 100)}%` }}
            />
          </div>
        </div>

        {/* Achievement cards */}
        <div className="flex flex-col gap-3">
          {allAchievements.map((ach) => {
            const isUnlocked = unlocked.includes(ach.id)
            const IconComp = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[ach.icon]

            return (
              <div
                key={ach.id}
                className={cn(
                  "flex items-center gap-3 rounded-2xl border bg-white p-3.5 shadow-sm transition-all",
                  isUnlocked
                    ? "border-[#CDEAD8]"
                    : "border-[#EAF2ED] opacity-60",
                )}
              >
                {/* Icon */}
                <span
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                    isUnlocked ? "bg-[#EAF7EF]" : "bg-[#F4F9F5]",
                  )}
                >
                  {isUnlocked && IconComp ? (
                    <IconComp className="h-5 w-5 text-[#3E8E5E]" />
                  ) : (
                    <Icons.Lock className="h-4 w-4 text-[#9AB0A4]" />
                  )}
                </span>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      "text-sm font-bold leading-snug",
                      isUnlocked ? "text-[#1F2A24]" : "text-[#6B7A70]",
                    )}
                  >
                    {ach.title}
                  </p>
                  <p className="text-xs text-[#6B7A70]">{ach.description}</p>
                </div>

                {/* Badge */}
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                    isUnlocked
                      ? "bg-[#DCF1E4] text-[#1E6B3A]"
                      : "bg-[#EEF1EF] text-[#8A998F]",
                  )}
                >
                  {isUnlocked ? "✔" : ach.category}
                </span>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <Button
            variant="outline"
            className="border-[#CDEAD8] text-[#2F6B45]"
            onClick={() => navigate("/home")}
          >
            <Icons.ArrowLeft className="h-4 w-4" /> Voltar
          </Button>
        </div>
      </div>
    </div>
  )
}
