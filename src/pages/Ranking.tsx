import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { getLeaderboard, getUserProfile } from "@/lib/db"
import type { LeaderboardEntry } from "@/lib/db"
import { getLocalXP } from "@/lib/xp"
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
}

function getAvatarImage(avatarUrl: string | null): string {
  if (!avatarUrl) return "/assets/avatar-cat.png"
  const found = getAvatarById(avatarUrl)
  return found?.image ?? "/assets/avatar-cat.png"
}

function PodiumSpot({
  user,
  rank,
}: {
  user: RankedUser | undefined
  rank: 1 | 2 | 3
}) {
  if (!user) return <div className="flex-1" />

  const sizes = {
    1: { avatar: "h-16 w-16", pedestal: "h-20", order: "order-2" },
    2: { avatar: "h-12 w-12", pedestal: "h-14", order: "order-1" },
    3: { avatar: "h-12 w-12", pedestal: "h-10", order: "order-3" },
  }[rank]

  const medals = { 1: "🥇", 2: "🥈", 3: "🥉" }

  return (
    <div className={cn("flex flex-1 flex-col items-center gap-1", sizes.order)}>
      <span className="text-lg">{medals[rank]}</span>
      <div
        className={cn(
          "overflow-hidden rounded-full border-2",
          user.isCurrentUser ? "border-[#2B5D3A]" : "border-white",
          sizes.avatar
        )}
      >
        <img
          src={getAvatarImage(user.avatar_url)}
          alt={user.full_name ?? ""}
          className="h-full w-full object-cover"
        />
      </div>
      <p className="max-w-[80px] text-center text-[11px] font-bold leading-tight text-[#1F2A24]">
        {user.full_name ?? "Usuário"}
      </p>
      <p className="text-[10px] text-[#4A7A5A]">{user.xp.toLocaleString("pt-BR")} XP</p>
      <div
        className={cn(
          "w-full rounded-t-xl",
          sizes.pedestal,
          rank === 1
            ? "bg-gradient-to-t from-[#2B5D3A] to-[#3E8E5E]"
            : "bg-gradient-to-t from-[#4A7A5A] to-[#6B9E7E]"
        )}
      />
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
      const currentName =
        user!.user_metadata?.full_name ?? user!.email?.split("@")[0] ?? "Você"

      const { data } = await getLeaderboard(20)
      const base: LeaderboardEntry[] =
        data && data.length > 0 ? data : [...MOCK_ENTRIES]

      // Remove current user from base (will be re-injected with real XP)
      const others = base.filter((e) => e.id !== user!.id)

      const currentEntry: LeaderboardEntry = {
        id: user!.id,
        full_name: currentName,
        avatar_url: null,
        xp: currentXP,
      }

      const all = [...others, currentEntry].sort((a, b) => b.xp - a.xp)

      const ranked: RankedUser[] = all.map((entry, i) => ({
        ...entry,
        position: i + 1,
        isCurrentUser: entry.id === user!.id,
      }))

      setRankedUsers(ranked)
      setLoading(false)
    }

    buildRanking()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  const top3 = [rankedUsers[0], rankedUsers[1], rankedUsers[2]]
  const rest = rankedUsers.slice(3)

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#EAF7EF] via-[#E0F3E7] to-[#D2EEDD]">
      <div className="mx-auto flex w-full max-w-[420px] flex-col px-5 pb-24 pt-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-[#2B5D3A]">Ranking</h1>
          <button
            onClick={() => navigate("/profile")}
            className="h-9 w-9 overflow-hidden rounded-full border-2 border-[#BFE3CC] shadow-sm"
          >
            <img
              src={userAvatarImage}
              alt="Perfil"
              className="h-full w-full object-cover"
            />
          </button>
        </div>

        <p className="mb-6 text-center text-sm text-[#4A7A5A]">Os maiores tops do PromptLab</p>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <img
                src="/assets/mascot-login-new.png"
                alt="Carregando"
                className="mx-auto mb-3 h-20 w-auto"
              />
              <p className="text-sm text-[#4A7A5A]">Carregando ranking...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Pódio */}
            <div className="mb-6 rounded-2xl border border-[#CDEAD8] bg-white p-4 shadow-sm">
              <div className="flex items-end justify-center gap-2">
                <PodiumSpot user={top3[1]} rank={2} />
                <PodiumSpot user={top3[0]} rank={1} />
                <PodiumSpot user={top3[2]} rank={3} />
              </div>
            </div>

            {/* Lista posições 4+ */}
            {rest.length > 0 && (
              <div className="flex flex-col gap-2">
                {rest.map((entry) => (
                  <div
                    key={entry.id}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-sm",
                      entry.isCurrentUser
                        ? "border-[#3E8E5E] bg-[#DCF1E4]"
                        : "border-[#CDEAD8] bg-white"
                    )}
                  >
                    <span className="w-6 text-center text-sm font-bold text-[#6B7A70]">
                      {entry.position}
                    </span>
                    <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full border border-[#CDEAD8]">
                      <img
                        src={getAvatarImage(entry.avatar_url)}
                        alt={entry.full_name ?? ""}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className={cn(
                          "truncate text-sm font-bold",
                          entry.isCurrentUser ? "text-[#2B5D3A]" : "text-[#1F2A24]"
                        )}
                      >
                        {entry.full_name ?? "Usuário"}
                        {entry.isCurrentUser && (
                          <span className="ml-1 text-xs font-normal">(você)</span>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Icons.Zap className="h-3.5 w-3.5 text-yellow-400" />
                      <span className="text-sm font-bold text-[#2B5D3A]">
                        {entry.xp.toLocaleString("pt-BR")}
                      </span>
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
