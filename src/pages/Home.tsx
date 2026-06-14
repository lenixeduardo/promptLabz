import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import {
  Home as HomeIcon,
  User,
  Trophy,
  BarChart2,
  Map,
  Bell,
  Flame,
  Brain,
  ArrowRight,
  Clock,
} from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { useAchievements } from "@/hooks/useAchievements"
import { ProgressCard } from "@/components/ProgressCard"
import { LearningPathTrail, DEFAULT_TRAIL_MODULES, type TrailModule } from "@/components/LearningPathTrail"
import { getUserProfile, loadProgress } from "@/lib/db"
import { getLevelProgress, getLocalXP, getLocalGems } from "@/lib/xp"
import { lessonsData } from "@/data/lessonsData"
import { computeTrailModules } from "@/lib/trail"

const CATEGORIES = Object.values(lessonsData)
const TOTAL_COUNT = CATEGORIES.length

const NAV_ITEMS = [
  { label: "Início", icon: HomeIcon, to: "/home" },
  { label: "Trilha", icon: Map, to: "/learn" },
  { label: "Desafios", icon: Trophy, to: "/achievements" },
  { label: "Leaderboard", icon: BarChart2, to: "/leaderboard" },
  { label: "Perfil", icon: User, to: "/profile" },
]

export default function Home() {
  const { user } = useAuth()
  const { checkDailyVisit, data } = useAchievements()
  const location = useLocation()

  const [streakLoading, setStreakLoading] = useState(true)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [xp, setXp] = useState(0)
  const [gems, setGems] = useState(0)
  const [trailModules, setTrailModules] = useState<TrailModule[]>(DEFAULT_TRAIL_MODULES)

  useEffect(() => {
    setStreakLoading(true)
    checkDailyVisit(user?.id).then(() => setStreakLoading(false))
  }, [checkDailyVisit, user?.id])

  useEffect(() => {
    if (!user?.id) return

    // Load avatar + xp/gems from profile, fallback to localStorage
    getUserProfile(user.id).then(({ data: profile }) => {
      if (profile?.avatar_url) setAvatarUrl(profile.avatar_url)
      setXp(profile?.xp ?? getLocalXP(user.id!))
      setGems(profile?.gems ?? getLocalGems(user.id!))
    })

    // Load progress and compute trail modules dynamically
    loadProgress(user.id).then((progress) => {
      setTrailModules(computeTrailModules(progress, CATEGORIES))
    })
  }, [user?.id])

  const { level, currentXP, targetXP } = getLevelProgress(xp)

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#EAF7EF] to-white pb-24">

      {/* Header */}
      <div className="bg-white border-b border-[#CDEAD8] px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="text-lg font-bold text-[#2B5D3A]">Olá, Explorador! 👋</h1>
          <p className="text-xs text-[#6B7A70]">Pronto para mais um desafio?</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell className="h-6 w-6 text-[#2B5D3A]" strokeWidth={2} />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500" />
          </div>
          <img
            src={avatarUrl || "/assets/mascot-login-new.png"}
            alt="Avatar"
            className="w-9 h-9 rounded-full object-cover border-2 border-[#BFE3CC]"
          />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 px-4 py-5 flex flex-col gap-5">

        {/* Progress card */}
        <ProgressCard level={level} currentXP={currentXP} targetXP={targetXP} />

        {/* Stats row: streak + gems */}
        <div className="grid grid-cols-2 gap-3">
          {/* Streak card */}
          <div className="rounded-2xl border-2 border-[#BFE3CC] bg-white px-4 py-3">
            <p className="text-[11px] font-semibold text-[#6B7A70] mb-1">Sequência diária</p>
            {streakLoading ? (
              <div className="h-7 w-16 rounded bg-[#D4EFE0] animate-pulse" />
            ) : (
              <>
                <div className="flex items-center gap-1.5">
                  <Flame className="h-6 w-6 text-orange-500 flex-shrink-0" strokeWidth={2.5} />
                  <span className="text-xl font-extrabold text-[#1F2A24]">
                    {data.consecutiveDays} dias
                  </span>
                </div>
                <p className="text-[11px] text-[#8A998F] mt-0.5">
                  Recorde: {data.longestStreak} dias
                </p>
              </>
            )}
          </div>

          {/* Gems card */}
          <div className="rounded-2xl border-2 border-[#BFE3CC] bg-white px-4 py-3">
            <p className="text-[11px] font-semibold text-[#6B7A70] mb-1">Gemas</p>
            <div className="flex items-center gap-1.5">
              <span className="text-2xl">💎</span>
              <span className="text-xl font-extrabold text-[#1F2A24]">{gems}</span>
            </div>
            <p className="text-[11px] text-[#8A998F] mt-0.5">Use para desbloquear</p>
          </div>
        </div>

        {/* Learning path trail */}
        <LearningPathTrail
          modules={trailModules}
          completedCount={trailModules.filter((m) => m.status === "completed").length}
          totalCount={TOTAL_COUNT}
        />

        {/* Featured lesson */}
        <div>
          <h2 className="text-base font-bold text-[#1F2A24] mb-3">Aula em destaque</h2>
          <div className="rounded-2xl border-2 border-[#BFE3CC] bg-white p-4">
            <div className="flex gap-4 mb-4">
              <div className="w-20 h-20 flex-shrink-0 rounded-xl bg-[#EAF7EF] flex items-center justify-center">
                <Brain className="h-9 w-9 text-[#2B5D3A]" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-[#1F2A24] leading-snug">
                  Como dar contexto para a IA entender o que você quer
                </p>
                <div className="flex items-center gap-1 mt-2 text-[#6B7A70]">
                  <Clock className="h-3.5 w-3.5" strokeWidth={2} />
                  <span className="text-xs">10 min</span>
                </div>
              </div>
            </div>
            <Link
              to="/learn"
              className="flex items-center justify-center gap-2 w-full rounded-xl bg-[#2B5D3A] text-white text-sm font-semibold py-3 hover:bg-[#1F4A2D] transition-colors"
            >
              Continuar aula
              <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#CDEAD8] px-2 py-2 flex items-center justify-around">
        {NAV_ITEMS.map(({ label, icon: Icon, to }) => {
          const isActive = location.pathname === to
          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 ${
                isActive ? "text-[#2B5D3A]" : "text-[#8A998F]"
              }`}
              aria-label={label}
            >
              <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[10px] ${isActive ? "font-bold" : "font-medium"}`}>
                {label}
              </span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
