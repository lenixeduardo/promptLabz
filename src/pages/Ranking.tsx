import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { getLeaderboard, updateUserXP } from "@/lib/db"
import type { LeaderboardEntry } from "@/lib/db"
import { getLocalXP, getLocalGems, getLevel } from "@/lib/xp"
import { getStreak } from "@/lib/streak"
import { BottomNav } from "@/components/BottomNav"
import * as Icons from "@/lib/icons"
import { cn } from "@/lib/utils"

interface ExtendedEntry extends LeaderboardEntry {
  streak: number
}

const MOCK_ENTRIES: ExtendedEntry[] = [
  { id: "mock-1", full_name: "Ana Lima",       avatar_url: null, xp: 4200, streak: 14 },
  { id: "mock-2", full_name: "Pedro Silva",    avatar_url: null, xp: 3800, streak:  7 },
  { id: "mock-3", full_name: "Julia Mendes",   avatar_url: null, xp: 3500, streak: 21 },
  { id: "mock-4", full_name: "Carlos Rocha",   avatar_url: null, xp: 2900, streak:  5 },
  { id: "mock-5", full_name: "Beatriz Costa",  avatar_url: null, xp: 2200, streak:  3 },
  { id: "mock-6", full_name: "Rafael Nunes",   avatar_url: null, xp: 1700, streak:  9 },
  { id: "mock-7", full_name: "Thais Ferreira", avatar_url: null, xp: 1200, streak:  2 },
]

interface RankedUser extends ExtendedEntry {
  position: number
  isCurrentUser: boolean
  level: number
}

// League name derived from user's total XP
function getLeagueName(xp: number): string {
  if (xp >= 15000) return "Liga Diamante"
  if (xp >= 6000)  return "Liga Esmeralda"
  if (xp >= 2500)  return "Liga Ouro"
  if (xp >= 800)   return "Liga Prata"
  return "Liga Bronze"
}

function getDaysUntilSunday(): number {
  const day = new Date().getDay() // 0 = Sunday
  return day === 0 ? 7 : 7 - day
}

function getInitial(name: string | null): string {
  return (name?.trim() ?? "?")[0]?.toUpperCase() ?? "?"
}

// Deterministic avatar color based on name
const COLOR_PALETTE = [
  "#10B981", "#3B82F6", "#8B5CF6", "#F59E0B",
  "#EF4444", "#EC4899", "#14B8A6", "#6366F1",
]

function avatarColor(name: string | null): string {
  if (!name) return COLOR_PALETTE[0]
  const hash = [...name].reduce((s, c) => s + c.charCodeAt(0), 0)
  return COLOR_PALETTE[hash % COLOR_PALETTE.length]
}

// ── Avatar circle with initial letter ──────────────────────────────────────

interface InitialAvatarProps {
  name: string | null
  size: "sm" | "md" | "lg"
  isCurrentUser?: boolean
  ringColor?: string // Tailwind ring class override
}

function InitialAvatar({ name, size, isCurrentUser, ringColor }: InitialAvatarProps) {
  const dim = {
    sm: "h-9 w-9 text-sm",
    md: "h-11 w-11 text-base",
    lg: "h-16 w-16 text-xl",
  }[size]

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center rounded-full font-extrabold text-white shadow-sm",
        dim,
        ringColor ?? (isCurrentUser ? "ring-2 ring-emerald ring-offset-1" : ""),
      )}
      style={{ backgroundColor: avatarColor(name) }}
    >
      {getInitial(name)}
    </div>
  )
}

// ── Podium spot ─────────────────────────────────────────────────────────────

const PODIUM_CFG = {
  1: {
    order: "order-2",
    avatarSize: "lg" as const,
    pedestalH: "h-24",
    pedestalBg: "bg-emerald",
    ringColor: "ring-4 ring-yellow-400 ring-offset-2",
    medal: "🥇",
  },
  2: {
    order: "order-1",
    avatarSize: "md" as const,
    pedestalH: "h-16",
    pedestalBg: "bg-foregroundMuted",
    ringColor: "ring-2 ring-slate-300",
    medal: "🥈",
  },
  3: {
    order: "order-3",
    avatarSize: "md" as const,
    pedestalH: "h-10",
    pedestalBg: "bg-brand-orange",
    ringColor: "ring-2 ring-orange-400",
    medal: "🥉",
  },
} as const

function PodiumSpot({ user, rank }: { user: RankedUser | undefined; rank: 1 | 2 | 3 }) {
  if (!user) return <div className="flex-1" />

  const cfg = PODIUM_CFG[rank]

  return (
    <div className={cn("flex flex-1 flex-col items-center gap-1", cfg.order)}>
      <span className="text-lg leading-none">{cfg.medal}</span>

      <div className="relative">
        <InitialAvatar
          name={user.full_name}
          size={cfg.avatarSize}
          ringColor={cfg.ringColor}
          isCurrentUser={user.isCurrentUser}
        />
        {user.isCurrentUser && (
          <span className="absolute -top-2 -right-1 text-sm leading-none">👑</span>
        )}
      </div>

      <p className="mt-1 max-w-[76px] text-center text-[11px] font-bold leading-tight text-foregroundDark">
        {user.full_name ?? "Usuário"}
      </p>
      <p className="text-[10px] font-semibold text-emerald">
        {user.xp.toLocaleString("pt-BR")} XP
      </p>

      {/* Pedestal */}
      <div
        className={cn(
          "mt-1 w-full rounded-t-xl flex items-center justify-center font-extrabold text-white text-xl",
          cfg.pedestalH,
          cfg.pedestalBg,
        )}
      >
        {rank}
      </div>
    </div>
  )
}

// ── Main page ───────────────────────────────────────────────────────────────

export default function Ranking() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [rankedUsers, setRankedUsers] = useState<RankedUser[]>([])
  const [loading, setLoading] = useState(true)
  const [leagueName, setLeagueName] = useState("Liga Esmeralda")

  useEffect(() => {
    if (!user?.id) return

    async function buildRanking() {
      const currentXP    = getLocalXP(user!.id)
      const currentGems  = getLocalGems(user!.id)
      const currentName  = user!.user_metadata?.full_name ?? user!.email?.split("@")[0] ?? "Você"
      const currentStreak = getStreak().count

      setLeagueName(getLeagueName(currentXP))

      // Sync local XP/gems so the current user appears correctly in the live leaderboard
      await updateUserXP(user!.id, currentXP, currentGems)

      const { data } = await getLeaderboard(20)
      const base: ExtendedEntry[] =
        data && data.length > 0
          ? data.map((e) => ({ ...e, streak: 0 }))
          : [...MOCK_ENTRIES]

      const others = base.filter((e) => e.id !== user!.id)

      const currentEntry: ExtendedEntry = {
        id: user!.id,
        full_name: currentName,
        avatar_url: null,
        xp: currentXP,
        streak: currentStreak,
      }

      const sorted = [...others, currentEntry].sort((a, b) => b.xp - a.xp)

      const ranked: RankedUser[] = sorted.map((entry, i) => ({
        ...entry,
        position: i + 1,
        isCurrentUser: entry.id === user!.id,
        level: getLevel(entry.xp),
      }))

      setRankedUsers(ranked)
      setLoading(false)
    }

    buildRanking()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  const top3  = rankedUsers.slice(0, 3) as [RankedUser?, RankedUser?, RankedUser?]
  const rest  = rankedUsers.slice(3)
  const daysLeft = getDaysUntilSunday()

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-pageBgLight via-gradient-mid to-gradient-end">
      <div className="mx-auto flex w-full max-w-[420px] flex-col px-4 pb-28 pt-8">

        {/* ── Header ── */}
        <div className="mb-5 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-foregroundMuted hover:bg-stroke-muted"
            aria-label="Voltar"
          >
            <Icons.ArrowLeft className="h-4 w-4" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-extrabold text-foregroundDark leading-tight">
              Ranking semanal
            </h1>
            <p className="text-[11px] text-foregroundMuted">
              {leagueName} · termina em {daysLeft} {daysLeft === 1 ? "dia" : "dias"}
            </p>
          </div>
          {/* XP-sort indicator */}
          <div className="flex shrink-0 items-center gap-1 rounded-full border border-stroke-muted bg-white px-2 py-1 shadow-sm">
            <Icons.Zap className="h-3 w-3 text-yellow-400" />
            <span className="text-[9px] font-bold text-foregroundMuted">por XP</span>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-24">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-stroke-muted border-t-emerald" />
            <p className="text-sm text-foregroundMuted">Carregando ranking...</p>
          </div>
        ) : (
          <>
            {/* ── Podium ── */}
            <div className="mb-4 overflow-hidden rounded-2xl border border-stroke-muted bg-white shadow-sm">
              {/* League banner */}
              <div className="flex items-center justify-center gap-1.5 border-b border-stroke-muted px-4 py-2.5">
                <Icons.Trophy className="h-3.5 w-3.5 text-yellow-500" />
                <span className="text-[11px] font-semibold text-foregroundMuted">
                  Top 3 · {leagueName}
                </span>
              </div>

              <div className="flex items-end gap-2 px-4 pb-0 pt-4">
                <PodiumSpot user={top3[1]} rank={2} />
                <PodiumSpot user={top3[0]} rank={1} />
                <PodiumSpot user={top3[2]} rank={3} />
              </div>
            </div>

            {/* ── XP-based ranking explanation ── */}
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-stroke-muted bg-white px-3 py-2.5 shadow-sm">
              <Icons.TrendingUp className="h-4 w-4 shrink-0 text-emerald" />
              <p className="text-[11px] text-foregroundMuted leading-snug">
                Posição calculada pelo <span className="font-bold text-foregroundDark">XP acumulado</span> na semana.
                Continue completando lições para subir!
              </p>
            </div>

            {/* ── List positions 4+ ── */}
            {rest.length > 0 && (
              <div className="flex flex-col gap-2">
                {rest.map((entry) => (
                  <div
                    key={entry.id}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-sm",
                      entry.isCurrentUser
                        ? "border-emerald bg-surface-success"
                        : "border-stroke-muted bg-white",
                    )}
                  >
                    {/* Position */}
                    <span className="w-5 shrink-0 text-center text-sm font-bold text-foregroundTertiary">
                      {entry.position}
                    </span>

                    {/* Avatar */}
                    <div className="relative">
                      <InitialAvatar
                        name={entry.full_name}
                        size="sm"
                        isCurrentUser={entry.isCurrentUser}
                      />
                      {entry.isCurrentUser && (
                        <span className="absolute -top-1.5 -right-1 text-xs leading-none">👑</span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <p
                        className={cn(
                          "truncate text-sm font-bold",
                          entry.isCurrentUser ? "text-primary-dark" : "text-foregroundDark",
                        )}
                      >
                        {entry.full_name ?? "Usuário"}
                        {entry.isCurrentUser && (
                          <span className="ml-1 text-[11px] font-normal text-foregroundMuted">(você)</span>
                        )}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1 text-[11px] text-foregroundMuted">
                        {entry.streak > 0 && (
                          <>
                            <Icons.Flame className="h-3 w-3 text-orange-400" />
                            <span className="font-semibold text-orange-500">{entry.streak}</span>
                            <span className="text-foregroundTertiary">·</span>
                          </>
                        )}
                        <Icons.Zap className="h-3 w-3 text-yellow-400" />
                        <span className="font-semibold text-foregroundDark">
                          {entry.xp.toLocaleString("pt-BR")}
                        </span>
                        <span>XP</span>
                      </p>
                    </div>

                    {/* Trophy placeholder for future rewards */}
                    <Icons.Trophy className="h-4 w-4 shrink-0 text-foregroundTertiary" />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <BottomNav active="ranking" />
    </div>
  )
}
