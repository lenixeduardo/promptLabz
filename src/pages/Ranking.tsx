import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { getLeaderboard, getUserProfile, updateUserXP } from "@/lib/db"
import type { LeaderboardEntry } from "@/lib/db"
import { getLocalXP, getLocalGems, getLevel, getLevelProgress } from "@/lib/xp"
import { getLevelTitle } from "@/lib/levelTitles"
import { getAvatarById } from "@/data/avatarsData"
import { BottomNav } from "@/components/BottomNav"
import * as Icons from "@/lib/icons"
import { cn } from "@/lib/utils"

const MOCK_ENTRIES: LeaderboardEntry[] = [
  { id: "mock-1", full_name: "Ana Lima", avatar_url: null, xp: 4200 },
  { id: "mock-2", full_name: "Pedro Silva", avatar_url: null, xp: 3800 },
  { id: "mock-3", full_name: "Julia Mendes", avatar_url: null, xp: 3500 },
  { id: "mock-4", full_name: "Carlos Rocha", avatar_url: null, xp: 2900 },
  { id: "mock-5", full_name: "Beatriz Costa", avatar_url: null, xp: 2200 },
  { id: "mock-6", full_name: "Lucas Ferreira", avatar_url: null, xp: 1950 },
  { id: "mock-7", full_name: "Mariana Alves", avatar_url: null, xp: 1700 },
  { id: "mock-8", full_name: "Rafael Sousa", avatar_url: null, xp: 1450 },
]

type Period = "semana" | "mes" | "geral"

interface RankedUser extends LeaderboardEntry {
  position: number
  isCurrentUser: boolean
  level: number
  levelTitle: string
}

function getLevelStyle(level: number): React.CSSProperties {
  if (level >= 9)
    return { background: "linear-gradient(135deg, var(--brand-gold), var(--brand-orange))" }
  if (level >= 7)
    return { background: "linear-gradient(135deg, var(--brand-purple), #7c3aed)" }
  if (level >= 5)
    return { background: "linear-gradient(135deg, var(--emerald), var(--emerald-dark))" }
  if (level >= 3)
    return { background: "linear-gradient(135deg, var(--brand-blue), #2563eb)" }
  return { background: "linear-gradient(135deg, #94a3b8, #64748b)" }
}

function LevelBadge({ level, size = "sm" }: { level: number; size?: "sm" | "md" }) {
  const dim = size === "md" ? "h-6 w-6 text-[10px]" : "h-5 w-5 text-[9px]"
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-extrabold text-white shadow",
        dim,
      )}
      style={getLevelStyle(level)}
      aria-label={`Nível ${level}`}
    >
      {level}
    </div>
  )
}

function getAvatarImage(avatarUrl: string | null): string {
  if (!avatarUrl) return "/assets/avatar-cat.png"
  const found = getAvatarById(avatarUrl)
  return found?.image ?? "/assets/avatar-cat.png"
}

const RANK_MEDAL_COLORS: Record<number, string> = {
  1: "#FBBF24",
  2: "#94A3B8",
  3: "#C97B3A",
}

function PodiumCard({ user, rank }: { user: RankedUser | undefined; rank: 1 | 2 | 3 }) {
  if (!user) return <div className="flex-1" />

  const isFirst = rank === 1
  const heights = { 1: "h-[88px]", 2: "h-[60px]", 3: "h-[44px]" }
  const avatarSizes = { 1: "h-[72px] w-[72px]", 2: "h-[56px] w-[56px]", 3: "h-[56px] w-[56px]" }
  const medalColors = { 1: "#FBBF24", 2: "#94A3B8", 3: "#C97B3A" }
  const pedestalColors = {
    1: "from-yellow-500/30 to-yellow-600/10",
    2: "from-slate-400/20 to-slate-500/10",
    3: "from-amber-700/20 to-amber-800/10",
  }

  return (
    <div className={cn("flex flex-1 flex-col items-center gap-1.5", isFirst ? "order-2 -mt-4" : rank === 2 ? "order-1" : "order-3")}>
      {isFirst && (
        <div className="mb-0.5 flex items-center justify-center">
          <span className="text-2xl drop-shadow-sm animate-bounce-slow">👑</span>
        </div>
      )}
      {!isFirst && <div className="h-8" />}

      <div className="relative">
        <div
          className={cn(
            "overflow-hidden rounded-full border-[3px] shadow-lg",
            avatarSizes[rank],
            isFirst
              ? "border-yellow-400 ring-4 ring-yellow-300/40"
              : rank === 2
              ? "border-slate-300"
              : "border-amber-600/60",
            user.isCurrentUser && "ring-2 ring-emerald ring-offset-2",
          )}
        >
          <img src={getAvatarImage(user.avatar_url)} alt={user.full_name ?? ""} className="h-full w-full object-cover" />
        </div>
        <div
          className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white shadow-md text-sm font-black"
          style={{ background: medalColors[rank] }}
        >
          <span className="text-white text-[10px] font-black">{rank}</span>
        </div>
      </div>

      <p className="mt-1 max-w-[76px] text-center text-[11px] font-bold leading-tight text-white drop-shadow-sm">
        {user.full_name?.split(" ")[0] ?? "Usuário"}
      </p>
      <div className="flex items-center gap-0.5">
        <Icons.Zap className="h-3 w-3 text-yellow-300" />
        <span className="text-[11px] font-extrabold text-yellow-200">
          {user.xp.toLocaleString("pt-BR")}
        </span>
      </div>
      <span className="text-[9px] text-white/50 -mt-0.5">{user.levelTitle}</span>

      <div className={cn("w-full rounded-t-2xl bg-gradient-to-t", heights[rank], pedestalColors[rank], "border-t border-white/10")} />
    </div>
  )
}

export default function Ranking() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [rankedUsers, setRankedUsers] = useState<RankedUser[]>([])
  const [loading, setLoading] = useState(true)
  const [userAvatarImage, setUserAvatarImage] = useState("/assets/avatar-cat.png")
  const [activePeriod, setActivePeriod] = useState<Period>("geral")

  useEffect(() => {
    if (!user?.id) return

    getUserProfile(user.id).then(({ data: profile }) => {
      if (profile?.avatar_url) {
        const found = getAvatarById(profile.avatar_url)
        if (found) setUserAvatarImage(found.image)
      }
    })

    async function buildRanking() {
      const currentXP = getLocalXP(user!.id)
      const currentGems = getLocalGems(user!.id)
      const currentName =
        user!.user_metadata?.full_name ?? user!.email?.split("@")[0] ?? "Você"

      await updateUserXP(user!.id, currentXP, currentGems)

      const { data } = await getLeaderboard(20)
      const base: LeaderboardEntry[] =
        data && data.length > 0 ? data : [...MOCK_ENTRIES]

      const others = base.filter((e) => e.id !== user!.id)

      const currentEntry: LeaderboardEntry = {
        id: user!.id,
        full_name: currentName,
        avatar_url: null,
        xp: currentXP,
      }

      const all = [...others, currentEntry].sort((a, b) => b.xp - a.xp)

      const ranked: RankedUser[] = all.map((entry, i) => {
        const level = getLevel(entry.xp)
        return {
          ...entry,
          position: i + 1,
          isCurrentUser: entry.id === user!.id,
          level,
          levelTitle: getLevelTitle(level),
        }
      })

      setRankedUsers(ranked)
      setLoading(false)
    }

    buildRanking()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  const top3 = [rankedUsers[0], rankedUsers[1], rankedUsers[2]]
  const rest = rankedUsers.slice(3)
  const currentUser = rankedUsers.find((u) => u.isCurrentUser)
  const { currentXP: progressXP, targetXP } = currentUser
    ? getLevelProgress(currentUser.xp)
    : { currentXP: 0, targetXP: 100 }
  const progressPct = currentUser ? Math.min(100, Math.round((progressXP / targetXP) * 100)) : 0

  const PERIOD_LABELS: Record<Period, string> = {
    semana: "Semana",
    mes: "Mês",
    geral: "Geral",
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-pageBgLight via-gradient-mid to-gradient-end">

      {/* Hero banner */}
      <div
        className="relative overflow-hidden px-5 pb-8 pt-10"
        style={{
          background: "linear-gradient(160deg, #0A1F12 0%, #14532d 55%, #166534 100%)",
        }}
      >
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-emerald/10 blur-2xl" />
        <div className="pointer-events-none absolute -left-8 top-20 h-32 w-32 rounded-full bg-yellow-400/8 blur-xl" />

        {/* Header row */}
        <div className="relative flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-white">Ranking</h1>
            <p className="mt-0.5 text-[11px] text-white/50">Top jogadores do PromptLabz</p>
          </div>
          <button
            onClick={() => navigate("/profile")}
            className="h-10 w-10 overflow-hidden rounded-full border-2 border-white/20 shadow-md ring-2 ring-emerald/40"
            aria-label="Ir para perfil"
          >
            <img src={userAvatarImage} alt="Perfil" className="h-full w-full object-cover" />
          </button>
        </div>

        {/* Current user stat card */}
        {!loading && currentUser && (
          <div className="relative mt-5 rounded-2xl border border-white/10 bg-white/8 p-4 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-xl font-black text-yellow-300">
                #{currentUser.position}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-white truncate">
                  {currentUser.full_name ?? "Você"}
                  <span className="ml-1.5 rounded-full bg-emerald/25 px-1.5 py-0.5 text-[9px] font-semibold text-emerald">
                    você
                  </span>
                </p>
                <p className="text-[10px] text-white/50">
                  {currentUser.levelTitle} · Nível {currentUser.level}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <div className="flex items-center gap-1 justify-end">
                  <Icons.Zap className="h-3.5 w-3.5 text-yellow-300" />
                  <span className="text-sm font-extrabold text-yellow-200">
                    {currentUser.xp.toLocaleString("pt-BR")}
                  </span>
                </div>
                <p className="text-[9px] text-white/40 mt-0.5">XP acumulado</p>
              </div>
            </div>
            {/* XP progress bar */}
            <div className="mt-3">
              <div className="flex justify-between mb-1">
                <span className="text-[9px] text-white/40">Progresso para Nível {currentUser.level + 1}</span>
                <span className="text-[9px] text-white/40">{progressXP}/{targetXP} XP</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald to-mint transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Period tabs */}
        <div className="relative mt-5 flex gap-1 rounded-xl bg-white/8 p-1">
          {(["semana", "mes", "geral"] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setActivePeriod(p)}
              className={cn(
                "flex-1 rounded-lg py-1.5 text-xs font-bold transition-all duration-200",
                activePeriod === p
                  ? "bg-emerald text-white shadow-sm"
                  : "text-white/50 hover:text-white/80",
              )}
            >
              {PERIOD_LABELS[p]}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-[420px] flex-col px-5 pb-24">

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <img
                src="/assets/mascot-login-new.png"
                alt="Carregando"
                className="mx-auto mb-3 h-20 w-auto"
              />
              <p className="text-sm text-emerald">Carregando ranking...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Podium */}
            <div
              className="-mt-2 mb-5 overflow-hidden rounded-b-3xl px-4 pb-0 pt-6 shadow-xl"
              style={{
                background: "linear-gradient(180deg, #166534 0%, #14532d 60%, #0f3d22 100%)",
              }}
            >
              <p className="mb-5 text-center text-[11px] font-semibold tracking-widest uppercase text-yellow-300/70">
                🏆 Top 3 do PromptLab
              </p>
              <div className="flex items-end justify-center gap-1">
                <PodiumCard user={top3[1]} rank={2} />
                <PodiumCard user={top3[0]} rank={1} />
                <PodiumCard user={top3[2]} rank={3} />
              </div>
            </div>

            {/* List — positions 4+ */}
            {rest.length > 0 && (
              <div className="flex flex-col gap-2">
                <p className="mb-1 text-[11px] font-bold uppercase tracking-widest text-foregroundMuted">
                  Classificação geral
                </p>
                {rest.map((entry) => (
                  <div
                    key={entry.id}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl border px-4 py-3 transition-all",
                      entry.isCurrentUser
                        ? "border-emerald/40 bg-surface-success shadow-md shadow-emerald/10"
                        : "border-stroke-muted bg-white shadow-sm hover:shadow-md",
                    )}
                  >
                    {/* Rank number */}
                    <div
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-sm font-black",
                        entry.position <= 6
                          ? "bg-primary-dark/8 text-primary-dark"
                          : "text-foregroundTertiary",
                      )}
                    >
                      {entry.position}
                    </div>

                    {/* Avatar */}
                    <div className="relative h-10 w-10 shrink-0">
                      <div
                        className={cn(
                          "h-full w-full overflow-hidden rounded-full border-2",
                          entry.isCurrentUser ? "border-emerald" : "border-stroke-light",
                        )}
                      >
                        <img
                          src={getAvatarImage(entry.avatar_url)}
                          alt={entry.full_name ?? ""}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5">
                        <LevelBadge level={entry.level} />
                      </div>
                    </div>

                    {/* Name + title */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p
                          className={cn(
                            "truncate text-sm font-bold",
                            entry.isCurrentUser ? "text-primary-dark" : "text-foregroundDark",
                          )}
                        >
                          {entry.full_name ?? "Usuário"}
                        </p>
                        {entry.isCurrentUser && (
                          <span className="shrink-0 rounded-full bg-emerald/15 px-1.5 py-px text-[9px] font-semibold text-emerald">
                            você
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-foregroundTertiary">{entry.levelTitle}</p>
                    </div>

                    {/* XP */}
                    <div className="flex shrink-0 items-center gap-1 rounded-xl bg-yellow-50 px-2.5 py-1.5">
                      <Icons.Zap className="h-3 w-3 text-yellow-500" />
                      <span className="text-[11px] font-extrabold text-yellow-700 tabular-nums">
                        {entry.xp.toLocaleString("pt-BR")}
                      </span>
                    </div>
                  </div>
                ))}

                <button className="mt-3 flex items-center justify-center gap-2 rounded-2xl border border-stroke-muted bg-white py-3 text-sm font-semibold text-foregroundMuted shadow-sm hover:bg-surface-soft transition-colors">
                  <Icons.ChevronDown className="h-4 w-4" />
                  Ver mais posições
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <BottomNav active="ranking" />
    </div>
  )
}
