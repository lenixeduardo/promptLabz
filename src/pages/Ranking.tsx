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
  { id: "mock-6", full_name: "Rafael Nunes", avatar_url: null, xp: 1700 },
  { id: "mock-7", full_name: "Thais Ferreira", avatar_url: null, xp: 1200 },
]

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
  const dim = size === "md" ? "h-7 w-7 text-[11px]" : "h-5 w-5 text-[9px]"
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-extrabold text-white shadow-sm",
        dim,
      )}
      style={getLevelStyle(level)}
      aria-label={`Nível ${level}`}
    >
      {level}
    </div>
  )
}

function XpProgressBar({ xp }: { xp: number }) {
  const { currentXP, targetXP } = getLevelProgress(xp)
  const pct = Math.min(100, Math.round((currentXP / targetXP) * 100))
  return (
    <div className="mt-1.5 flex items-center gap-1.5">
      <div className="h-1 flex-1 overflow-hidden rounded-full bg-stroke-muted">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald to-emerald-dark transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-[9px] tabular-nums text-foregroundTertiary">
        {currentXP}/{targetXP}
      </span>
    </div>
  )
}

function getAvatarImage(avatarUrl: string | null): string {
  if (!avatarUrl) return "/assets/avatar-cat.png"
  const found = getAvatarById(avatarUrl)
  return found?.image ?? "/assets/avatar-cat.png"
}

function PodiumSpot({ user, rank }: { user: RankedUser | undefined; rank: 1 | 2 | 3 }) {
  if (!user) return <div className="flex-1" />

  const config = {
    1: { avatar: "h-16 w-16", pedestal: "h-20", order: "order-2", badgeSize: "md" as const },
    2: { avatar: "h-12 w-12", pedestal: "h-14", order: "order-1", badgeSize: "sm" as const },
    3: { avatar: "h-12 w-12", pedestal: "h-10", order: "order-3", badgeSize: "sm" as const },
  }[rank]

  const medals = { 1: "🥇", 2: "🥈", 3: "🥉" }
  const pedestalClass = {
    1: "bg-gradient-to-t from-primary-dark to-emerald",
    2: "bg-gradient-to-t from-emerald to-foregroundMuted",
    3: "bg-gradient-to-t from-emerald to-foregroundMuted",
  }[rank]

  return (
    <div className={cn("flex flex-1 flex-col items-center gap-1", config.order)}>
      <span className="text-lg">{medals[rank]}</span>

      <div className="relative">
        <div
          className={cn(
            "overflow-hidden rounded-full border-2",
            user.isCurrentUser ? "border-primary-dark ring-2 ring-emerald ring-offset-1" : "border-white",
            config.avatar,
          )}
        >
          <img
            src={getAvatarImage(user.avatar_url)}
            alt={user.full_name ?? ""}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute -bottom-1 -right-1">
          <LevelBadge level={user.level} size={config.badgeSize} />
        </div>
      </div>

      <p className="mt-1.5 max-w-[80px] text-center text-[11px] font-bold leading-tight text-foregroundDark">
        {user.full_name ?? "Usuário"}
      </p>
      <p className="text-[10px] font-semibold text-emerald">
        {user.xp.toLocaleString("pt-BR")} XP
      </p>
      <p className="text-[9px] text-foregroundTertiary">{user.levelTitle}</p>

      <div className={cn("w-full rounded-t-xl", config.pedestal, pedestalClass)} />
    </div>
  )
}

export default function Ranking() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [rankedUsers, setRankedUsers] = useState<RankedUser[]>([])
  const [loading, setLoading] = useState(true)
  const [userAvatarImage, setUserAvatarImage] = useState("/assets/avatar-cat.png")

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

      // Sync local XP/gems so the current user appears in the live leaderboard.
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

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-pageBgLight via-gradient-mid to-gradient-end">
      <div className="mx-auto flex w-full max-w-[420px] flex-col px-5 pb-24 pt-8">

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-primary-dark">Ranking</h1>
            {!loading && currentUser && (
              <p className="mt-0.5 text-xs text-foregroundTertiary">
                #{currentUser.position} · {currentUser.levelTitle} · Nível {currentUser.level}
              </p>
            )}
          </div>
          <button
            onClick={() => navigate("/profile")}
            className="h-9 w-9 overflow-hidden rounded-full border-2 border-stroke-light shadow-sm"
            aria-label="Ir para perfil"
          >
            <img
              src={userAvatarImage}
              alt="Perfil"
              className="h-full w-full object-cover"
            />
          </button>
        </div>

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
            {/* Pódio */}
            <div className="mb-6 rounded-2xl border border-stroke-muted bg-white p-4 shadow-sm">
              <p className="mb-4 text-center text-xs font-semibold text-foregroundMuted">
                🏆 Top 3 do PromptLab
              </p>
              <div className="flex items-end justify-center gap-2">
                <PodiumSpot user={top3[1]} rank={2} />
                <PodiumSpot user={top3[0]} rank={1} />
                <PodiumSpot user={top3[2]} rank={3} />
              </div>
            </div>

            {/* Lista posições 4+ */}
            {rest.length > 0 && (
              <div className="flex flex-col gap-2">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-foregroundMuted">
                  Classificação geral
                </p>
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
                    <span className="w-6 shrink-0 text-center text-sm font-bold text-foregroundTertiary">
                      {entry.position}
                    </span>

                    <div className="relative h-9 w-9 shrink-0">
                      <div className="h-full w-full overflow-hidden rounded-full border border-stroke-muted">
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

                    <div className="min-w-0 flex-1">
                      <p
                        className={cn(
                          "truncate text-sm font-bold",
                          entry.isCurrentUser ? "text-primary-dark" : "text-foregroundDark",
                        )}
                      >
                        {entry.full_name ?? "Usuário"}
                        {entry.isCurrentUser && (
                          <span className="ml-1 text-xs font-normal text-foregroundMuted">
                            (você)
                          </span>
                        )}
                      </p>
                      <p className="text-[10px] text-foregroundTertiary">{entry.levelTitle}</p>
                      {entry.isCurrentUser && <XpProgressBar xp={entry.xp} />}
                    </div>

                    <div className="flex shrink-0 flex-col items-end gap-0.5">
                      <div className="flex items-center gap-1">
                        <Icons.Zap className="h-3.5 w-3.5 text-yellow-400" />
                        <span className="text-sm font-bold text-primary-dark">
                          {entry.xp.toLocaleString("pt-BR")}
                        </span>
                      </div>
                      <span className="text-[9px] text-foregroundTertiary">XP · Nv {entry.level}</span>
                    </div>
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
