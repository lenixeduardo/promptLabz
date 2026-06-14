import { Flame } from "lucide-react"

interface StreakWidgetProps {
  streak: number
  longestStreak: number
  loading?: boolean
  streakBroken?: boolean
}

export function StreakWidget({ streak, longestStreak, loading = false, streakBroken = false }: StreakWidgetProps) {
  if (loading) {
    return (
      <div className="rounded-2xl border-2 border-[#BFE3CC] bg-[#F0FAF3] px-4 py-3 animate-pulse">
        <div className="h-4 w-32 rounded bg-[#BFE3CC]" />
        <div className="mt-1 h-3 w-24 rounded bg-[#D4EFE0]" />
      </div>
    )
  }

  if (streakBroken) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border-2 border-[#E5C9B0] bg-[#FFF8F3] px-4 py-3">
        <span className="text-2xl">💔</span>
        <div>
          <p className="text-sm font-bold text-[#7A4A2A]">Streak zerado — recomeça hoje!</p>
          {longestStreak > 0 && (
            <p className="text-xs text-[#A0714A]">Seu recorde foi de {longestStreak} {longestStreak === 1 ? "dia" : "dias"}</p>
          )}
        </div>
      </div>
    )
  }

  if (streak === 0) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border-2 border-[#BFE3CC] bg-[#F0FAF3] px-4 py-3">
        <Flame className="h-6 w-6 text-[#3E8E5E]" strokeWidth={2.5} />
        <p className="text-sm font-semibold text-[#2B5D3A]">Comece hoje e inicie seu streak!</p>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3 rounded-2xl border-2 border-[#BFE3CC] bg-[#F0FAF3] px-4 py-3">
      <Flame className="h-7 w-7 shrink-0 text-orange-500" strokeWidth={2.5} />
      <div>
        <p className="text-sm font-bold text-[#1F2A24]">
          {streak} {streak === 1 ? "dia seguido" : "dias seguidos"}
        </p>
        {longestStreak > streak && (
          <p className="text-xs text-[#6B7A70]">Recorde: {longestStreak} dias</p>
        )}
      </div>
    </div>
  )
}
