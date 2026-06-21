import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import {
  Settings, ChevronRight, Zap, BookOpen, Edit2, Heart, Crown, Flame,
  Lock, Award, GraduationCap, Trophy, Target, Sparkles, Globe, Star,
  Users, Map, User,
} from "lucide-react"
import { ThemeToggle } from "@/components/ThemeToggle"
import { BottomNav } from "@/components/BottomNav"
import { useAuth } from "@/hooks/useAuth"
import { useAchievements } from "@/hooks/useAchievements"
import { getUserProfile } from "@/lib/db"
import { getAvatarById } from "@/data/avatarsData"
import { getLocalXP, getLevel, getLevelProgress } from "@/lib/xp"
import { getLevelTitle } from "@/lib/levelTitles"
import { usePremium } from "@/components/PremiumProvider"
import { cn } from "@/lib/utils"

const ACHIEVEMENT_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  BookOpen, GraduationCap, Trophy, Target, Award, Zap, Sparkles, Heart, Globe, Star,
}

const CERTIFICATES = [
  {
    id: "a1",
    title: "Engenharia de Prompts para Iniciantes",
    hours: 4,
    trailLabel: "Trilha A1",
  },
  {
    id: "a2",
    title: "Criatividade com IA",
    hours: 3,
    trailLabel: "Trilha A2",
  },
]

function StatCard({
  value,
  label,
  icon: Icon,
  iconClass,
}: {
  value: number | string
  label: string
  icon: React.ComponentType<{ className?: string }>
  iconClass?: string
}) {
  return (
    <div className="flex flex-1 flex-col items-center gap-1 rounded-2xl bg-white px-2 py-3 shadow-sm">
      <Icon className={cn("h-4 w-4", iconClass ?? "text-emerald")} />
      <span className="text-lg font-extrabold leading-none text-primary-dark">{value}</span>
      <span className="text-[10px] font-medium text-foregroundMuted">{label}</span>
    </div>
  )
}

export default function Profile() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { allAchievements, unlocked, data } = useAchievements()
  const { isPremium, toggle } = usePremium()

  const [avatarImage, setAvatarImage] = useState("/assets/avatar-cat.png")
  const [loadingAvatar, setLoadingAvatar] = useState(true)

  const xp = user?.id ? getLocalXP(user.id) : 0
  const level = getLevel(xp)
  const { currentXP, targetXP } = getLevelProgress(xp)
  const levelTitle = getLevelTitle(level)
  const xpToNext = targetXP - currentXP
  const xpPct = Math.round((currentXP / targetXP) * 100)
  const skillsCount = unlocked.length

  useEffect(() => {
    if (!user?.id) {
      setLoadingAvatar(false)
      return
    }
    getUserProfile(user.id).then(({ data: profile }) => {
      if (profile?.avatar_url) {
        const found = getAvatarById(profile.avatar_url)
        if (found) setAvatarImage(found.image)
      }
      setLoadingAvatar(false)
    })
  }, [user?.id])

  return (
    <div className="min-h-screen bg-pageBg pb-28">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-stroke-muted bg-pageBg/95 px-5 pb-3 pt-5 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-[420px] items-center justify-between">
          <h1 className="text-xl font-extrabold text-primary-dark">Perfil</h1>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              to="/settings"
              className="rounded-full p-2 text-foregroundMuted hover:bg-surface-soft"
              aria-label="Configurações"
            >
              <Settings className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[420px] px-4 pt-4">
        <div className="flex flex-col gap-4">

          {/* Hero card verde */}
          <div className="rounded-2xl bg-emerald p-5">
            <div className="mb-4 flex items-center gap-4">
              {/* Avatar */}
              <div className="relative shrink-0">
                {loadingAvatar ? (
                  <div className="h-16 w-16 animate-pulse rounded-full bg-white/30" />
                ) : (
                  <>
                    <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-white/40 shadow-md">
                      <img src={avatarImage} alt="Avatar" className="h-full w-full object-cover" />
                    </div>
                    <button
                      onClick={() => navigate("/avatars")}
                      className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-emerald-dark shadow"
                      aria-label="Trocar avatar"
                    >
                      <Edit2 className="h-3 w-3 text-white" />
                    </button>
                  </>
                )}
              </div>

              {/* Dados do usuário */}
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-xl font-extrabold text-white">
                  {user?.user_metadata?.full_name || levelTitle}
                </h2>
                <p className="truncate text-sm text-white/75">{user?.email}</p>
                <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-bold text-white">
                  <Crown className="h-3 w-3 text-accent" />
                  {levelTitle} · Nível {level}
                </span>
              </div>
            </div>

            {/* Barra de progresso XP */}
            <div
              className="h-2.5 w-full overflow-hidden rounded-full bg-white/25"
              role="progressbar"
              aria-valuenow={xpPct}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full rounded-full bg-white transition-all duration-500"
                style={{ width: `${xpPct}%` }}
              />
            </div>
            <p className="mt-2 text-xs font-semibold text-white/80">
              {xp} XP · {xpToNext} para o próximo nível
            </p>
          </div>

          {/* Card Torne-se Premium (oculto quando já é premium) */}
          {!isPremium && (
            <Link
              to="/premium"
              className="flex items-center gap-3 rounded-2xl border border-accent bg-white p-4 shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent">
                <Crown className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-primary-dark">Torne-se Premium</p>
                <p className="text-xs text-foregroundMuted">
                  Lições ilimitadas, sem anúncios e baús exclusivos
                </p>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-accent" />
            </Link>
          )}

          {/* Modo teste Premium */}
          <div
            className="flex items-center gap-3 rounded-2xl border-2 border-dashed border-accent bg-white p-4 shadow-sm"
            style={{ borderColor: "rgba(245, 166, 35, 0.45)" }}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pageBgLight">
              <Crown className="h-5 w-5 text-foregroundMuted" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-primary-dark">Modo teste Premium</p>
              <p className="text-xs text-foregroundMuted">
                Ative para testar recursos Premium localmente
              </p>
            </div>
            <button
              role="switch"
              aria-checked={isPremium}
              onClick={toggle}
              className={cn(
                "relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200",
                isPremium ? "bg-emerald" : "bg-stroke-muted",
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200",
                  isPremium ? "translate-x-5" : "translate-x-0.5",
                )}
              />
            </button>
          </div>

          {/* Stats row */}
          <div className="flex gap-2">
            <StatCard
              value={data.totalLessonsCompleted}
              label="Lições"
              icon={BookOpen}
              iconClass="text-emerald"
            />
            <StatCard
              value={data.consecutiveDays}
              label="Sequência"
              icon={Flame}
              iconClass="text-brand-orange"
            />
            <StatCard
              value={xp}
              label="XP"
              icon={Zap}
              iconClass="text-emerald"
            />
            <StatCard
              value={skillsCount}
              label="Skills"
              icon={Heart}
              iconClass="text-rose-500"
            />
          </div>

        </div>

        {/* CONQUISTAS */}
        <div className="flex flex-col gap-3 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-primary-dark">
              Conquistas
            </h2>
            <Link
              to="/achievements"
              className="text-xs font-bold text-emerald"
            >
              Ver tudo &rsaquo;
            </Link>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {allAchievements.slice(0, 5).map((ach) => {
              const isUnlocked = unlocked.includes(ach.id)
              const IconComp = ACHIEVEMENT_ICON_MAP[ach.icon]
              return (
                <div key={ach.id} className="flex flex-shrink-0 flex-col items-center gap-1.5">
                  <div
                    className="flex h-14 w-14 items-center justify-center transition-opacity duration-200"
                    style={{
                      clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                      backgroundColor: isUnlocked ? "#1E5631" : "#D1D5DB",
                    }}
                  >
                    {isUnlocked
                      ? IconComp && <IconComp className="h-5 w-5 text-white" />
                      : <Lock className="h-4 w-4 text-white/60" />
                    }
                  </div>
                  <span className="w-16 text-center text-[10px] font-semibold leading-tight text-foregroundMuted line-clamp-2">
                    {ach.title}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* CERTIFICADOS */}
        <div className="flex flex-col gap-3 pt-2">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-primary-dark">
            Certificados
          </h2>

          <div className="flex flex-col gap-2">
            {CERTIFICATES.map((cert) => (
              <Link
                key={cert.id}
                to="/certificate"
                state={{ courseName: cert.title, hours: cert.hours }}
                className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 transition-all active:scale-[0.98] dark:border-amber-800 dark:bg-amber-950/30"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-400">
                  <Award className="h-5 w-5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold leading-snug text-primary-dark">{cert.title}</p>
                  <p className="text-xs text-foregroundMuted">
                    {cert.hours}h &middot; Conclua a {cert.trailLabel} para emitir
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-foregroundMuted" />
              </Link>
            ))}
          </div>
        </div>

        {/* Quick links grid */}
        <div className="grid grid-cols-2 gap-3 pt-2 pb-4">
          {([
            { label: "Avatares",   sub: "Customize",    icon: User,   href: "/avatars"   },
            { label: "Comunidade", sub: "Conecte-se",   icon: Users,  href: "/community" },
            { label: "Ranking",    sub: "Hall da Fama", icon: Trophy, href: "/ranking"   },
            { label: "Roadmap",    sub: "O que vem aí", icon: Map,    href: "/roadmap"   },
          ] as const).map(({ label, sub, icon: Icon, href }) => (
            <Link
              key={label}
              to={href}
              className="flex items-center gap-3 rounded-2xl border border-stroke-muted bg-white p-4 shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface-soft">
                <Icon className="h-4 w-4 text-emerald" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-primary-dark">{label}</p>
                <p className="text-xs text-foregroundMuted">{sub}</p>
              </div>
            </Link>
          ))}
        </div>

      </div>

      <BottomNav active="perfil" />
    </div>
  )
}
