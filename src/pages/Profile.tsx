import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import { Settings, ChevronRight, Zap, BookOpen, Edit2, Heart, Crown, Sparkles, User, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BottomNav } from "@/components/BottomNav"
import { useAuth } from "@/hooks/useAuth"
import { useAchievements } from "@/hooks/useAchievements"
import { useFavorites } from "@/hooks/useFavorites"
import { updateUserProfile, getUserProfile } from "@/lib/db"
import { supabase } from "@/lib/supabase"
import { getAvatarById } from "@/data/avatarsData"
import { getProgressCount } from "@/lib/achievements"
import { getLocalXP, getLocalGems, getLevel, getLevelProgress } from "@/lib/xp"
import { getLevelTitle } from "@/lib/levelTitles"
import * as Icons from "@/lib/icons"
import { cn } from "@/lib/utils"
import { sileo } from "sileo"

const SAMPLE_CERTIFICATE = {
  courseName: "Engenharia de Prompts para Iniciantes",
  hours: 4,
}

function HexBadge({
  icon: IconComp,
  isUnlocked,
}: {
  icon: React.ComponentType<{ className?: string }> | undefined
  isUnlocked: boolean
}) {
  return (
    <div
      className={cn(
        "flex h-12 w-12 shrink-0 items-center justify-center",
        isUnlocked
          ? "bg-gradient-to-br from-emerald to-emerald-dark"
          : "bg-gradient-to-br from-[#E8EEE9] to-[#DCEAE3]",
      )}
      style={{ clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)" }}
      aria-hidden="true"
    >
      {isUnlocked && IconComp ? (
        <IconComp className="h-5 w-5 text-white" />
      ) : (
        <Icons.Lock className="h-4 w-4 text-neutral" />
      )}
    </div>
  )
}

function StatCard({ value, label, icon: Icon }: {
  value: number | string
  label: string
  icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <div className="flex flex-1 flex-col items-center gap-1 rounded-2xl border border-stroke-muted bg-white px-2 py-3 shadow-sm">
      <Icon className="h-4 w-4 text-emerald" />
      <span className="text-lg font-extrabold leading-none text-primary-dark">{value}</span>
      <span className="text-[10px] font-medium text-neutral">{label}</span>
    </div>
  )
}

function SectionHeader({ title, onSeeAll }: { title: string; onSeeAll?: () => void }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-sm font-extrabold uppercase tracking-wider text-primary-dark">{title}</h2>
      {onSeeAll && (
        <button
          onClick={onSeeAll}
          className="flex items-center gap-0.5 text-xs font-semibold text-emerald hover:text-primary-dark"
        >
          Ver tudo <ChevronRight className="h-3 w-3" />
        </button>
      )}
    </div>
  )
}

export default function Profile() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { allAchievements, unlocked, data } = useAchievements()
  const { favorites } = useFavorites()

  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || "")
  const [loading, setLoading] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [avatarImage, setAvatarImage] = useState("/assets/avatar-cat.png")

  const xp = user?.id ? getLocalXP(user.id) : 0
  const gems = user?.id ? getLocalGems(user.id) : 0
  const level = getLevel(xp)
  const { currentXP, targetXP } = getLevelProgress(xp)
  const levelTitle = getLevelTitle(level)

  useEffect(() => {
    if (!user?.id) return
    getUserProfile(user.id).then(({ data: profile }) => {
      if (profile?.avatar_url) {
        const found = getAvatarById(profile.avatar_url)
        if (found) setAvatarImage(found.image)
      }
    })
  }, [user?.id])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    if (!user?.id) {
      sileo.error({ title: "Usuário não encontrado" })
      setLoading(false)
      return
    }
    try {
      const [dbResult, authResult] = await Promise.all([
        updateUserProfile(user.id, fullName),
        supabase.auth.updateUser({ data: { full_name: fullName } }),
      ])
      if (dbResult.error) throw new Error(dbResult.error)
      if (authResult.error) throw authResult.error
      sileo.success({ title: "Perfil atualizado com sucesso!" })
      setEditOpen(false)
    } catch (err: any) {
      sileo.error({ title: err?.message || "Erro ao atualizar perfil" })
    } finally {
      setLoading(false)
    }
  }

  const recentAchievements = allAchievements
    .filter((a) => unlocked.includes(a.id))
    .slice(-4)
    .concat(
      allAchievements.filter((a) => !unlocked.includes(a.id)).slice(0, Math.max(0, 4 - unlocked.length)),
    )
    .slice(0, 4)

  const lessonsPct = Math.min(100, Math.round((data.totalLessonsCompleted / 50) * 100))
  const streakPct = Math.min(100, Math.round((data.consecutiveDays / 30) * 100))
  const xpPct = Math.round((currentXP / targetXP) * 100)

  return (
    <div className="min-h-screen bg-gradient-to-b from-pageBgLight via-gradient-mid to-white pb-28">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-pageBgLight bg-pageBgLight/95 px-5 pb-3 pt-5 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-[420px] items-center justify-between">
          <div>
            <h1 className="text-xl font-extrabold text-primary-dark">{levelTitle}</h1>
            <p className="text-xs text-foregroundMuted">{user?.email}</p>
          </div>
          <button
            onClick={() => setEditOpen((v) => !v)}
            className="rounded-full p-2 text-emerald hover:bg-surface-success"
            aria-label="Editar perfil"
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[420px] px-5 pt-5">
        {/* Avatar */}
        <div className="mb-5 flex flex-col items-center gap-2">
          <div className="relative">
            <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-emerald shadow-md">
              <img src={avatarImage} alt="Avatar" className="h-full w-full object-cover" />
            </div>
            <button
              onClick={() => navigate("/avatars")}
              className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-emerald shadow-sm"
              aria-label="Trocar avatar"
            >
              <Edit2 className="h-3 w-3 text-white" />
            </button>
          </div>
          <p className="text-base font-bold text-primary-dark">
            {user?.user_metadata?.full_name || levelTitle}
          </p>
        </div>

        {/* Stats row */}
        <div className="mb-5 flex gap-2">
          <StatCard value={level} label="Nível" icon={Icons.Star} />
          <StatCard value={xp.toLocaleString("pt-BR")} label="XP" icon={Zap} />
          <StatCard value={gems} label="Gemas" icon={Icons.Diamond} />
          <StatCard value={data.totalLessonsCompleted} label="Lições" icon={BookOpen} />
        </div>

        {/* Edit form */}
        {editOpen && (
          <div className="mb-5 rounded-2xl border border-stroke-light bg-white p-5 shadow-sm">
            <form className="flex flex-col gap-4" onSubmit={handleUpdate}>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-emerald">
                  Nome completo
                </label>
                <Input
                  type="text"
                  placeholder="Insira seu nome"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  icon={<User className="h-5 w-5" strokeWidth={2.2} />}
                  disabled={loading}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-emerald">
                  E-mail
                </label>
                <Input
                  type="email"
                  value={user?.email || ""}
                  icon={<Mail className="h-5 w-5" strokeWidth={2.2} />}
                  disabled
                />
              </div>
              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </form>
          </div>
        )}

        {/* Progress summary */}
        <div className="mb-5 rounded-2xl border border-stroke-muted bg-white p-5 shadow-sm">
          <SectionHeader title="Resumo de progresso" />
          <div className="flex flex-col gap-3.5">
            {[
              { label: "Lições concluídas", value: data.totalLessonsCompleted, max: 50, pct: lessonsPct },
              { label: "Sequência", value: `${data.consecutiveDays} dias`, max: 30, pct: streakPct },
              { label: "XP do nível", value: `${currentXP}/${targetXP}`, max: targetXP, pct: xpPct },
            ].map((item) => (
              <div key={item.label}>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs font-semibold text-foregroundSecondary">{item.label}</span>
                  <span className="text-xs font-bold text-primary-dark">{item.value}</span>
                </div>
                <div
                  className="h-2 w-full overflow-hidden rounded-full bg-pageBgLight"
                  role="progressbar"
                  aria-valuenow={item.pct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald to-[#7CC79A] transition-all duration-500"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent achievements */}
        <div className="mb-5">
          <SectionHeader title="Conquistas recentes" onSeeAll={() => navigate("/achievements")} />
          <div className="flex gap-3">
            {recentAchievements.map((ach) => {
              const isUnlocked = unlocked.includes(ach.id)
              const IconComp = Icons[ach.icon as keyof typeof Icons] as
                | React.ComponentType<{ className?: string }>
                | undefined
              return (
                <div key={ach.id} className="flex flex-col items-center gap-1">
                  <HexBadge icon={IconComp} isUnlocked={isUnlocked} />
                  <span className="max-w-[56px] text-center text-[9px] font-medium leading-tight text-foregroundMuted">
                    {ach.title}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Certificates */}
        <div className="mb-5">
          <SectionHeader title="Certificados" />
          <button
            onClick={() =>
              navigate("/certificate", {
                state: {
                  courseName: SAMPLE_CERTIFICATE.courseName,
                  hours: SAMPLE_CERTIFICATE.hours,
                  completionDate: new Date().toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  }),
                },
              })
            }
            className="flex w-full items-center gap-3 rounded-2xl border border-stroke-muted bg-white p-4 shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pageBgLight">
              <Icons.Award className="h-5 w-5 text-emerald" />
            </div>
            <div className="min-w-0 flex-1 text-left">
              <p className="truncate text-sm font-bold text-foregroundDark">
                {SAMPLE_CERTIFICATE.courseName}
              </p>
              <p className="text-xs text-foregroundMuted">{SAMPLE_CERTIFICATE.hours}h • Ver certificado</p>
            </div>
            <ChevronRight className="h-4 w-4 shrink-0 text-stroke-light" />
          </button>
        </div>

        {/* Skills unlocked */}
        <div className="mb-5">
          <SectionHeader title="Skills desbloqueadas" onSeeAll={() => navigate("/achievements")} />
          {unlocked.length === 0 ? (
            <p className="text-sm text-neutral">Complete lições para desbloquear skills.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {allAchievements
                .filter((a) => unlocked.includes(a.id))
                .slice(0, 8)
                .map((ach) => (
                  <span
                    key={ach.id}
                    className="rounded-full border border-stroke-light bg-pageBgLight px-3 py-1 text-xs font-semibold text-primary-dark"
                  >
                    {ach.title}
                  </span>
                ))}
              {unlocked.length > 8 && (
                <span className="rounded-full border border-stroke-light bg-pageBgLight px-3 py-1 text-xs font-semibold text-foregroundMuted">
                  +{unlocked.length - 8}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Favorite prompts */}
        <button
          onClick={() => navigate("/prompts")}
          className="mb-3 flex w-full items-center gap-3 rounded-2xl border border-stroke-muted bg-white p-4 shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pageBgLight">
            <Icons.Heart className="h-5 w-5 text-emerald" />
          </div>
          <div className="min-w-0 flex-1 text-left">
            <p className="text-sm font-bold text-foregroundDark">Prompts favoritos</p>
            <p className="text-xs text-foregroundMuted">
              {favorites.length > 0 ? `${favorites.length} salvos` : "Nenhum favorito ainda"}
            </p>
          </div>
          <ChevronRight className="h-4 w-4 shrink-0 text-stroke-light" />
        </button>

        {/* My Favorites (general) */}
        <Link
          to="/favorites"
          className="mb-3 flex w-full items-center gap-3 rounded-2xl border border-stroke-muted bg-white p-4 shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pageBgLight">
            <Heart className="h-5 w-5 text-emerald" />
          </div>
          <div className="min-w-0 flex-1 text-left">
            <p className="text-sm font-bold text-foregroundDark">Meus Favoritos</p>
            <p className="text-xs text-foregroundMuted">Prompts, templates, notícias e trilhas</p>
          </div>
          <ChevronRight className="h-4 w-4 shrink-0 text-stroke-light" />
        </Link>

        {/* Premium link */}
        <Link
          to="/premium"
          className="mb-3 flex w-full items-center gap-3 rounded-2xl border border-stroke-muted bg-white p-4 shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent/20 to-[#C67A00]/10">
            <Crown className="h-5 w-5 text-accent" />
          </div>
          <div className="min-w-0 flex-1 text-left">
            <p className="flex items-center gap-1.5 text-sm font-bold text-foregroundDark">
              Premium
              <Sparkles className="h-3.5 w-3.5 text-accent" fill="#F5A623" />
            </p>
            <p className="text-xs text-foregroundMuted">Desbloqueie IA ilimitada e conteúdo exclusivo</p>
          </div>
          <ChevronRight className="h-4 w-4 shrink-0 text-stroke-light" />
        </Link>

        {/* Quick nav cards */}
        {[
          { label: "Meu Inventário", sub: "Power-ups e avatares", icon: Icons.Box, path: "/inventory" },
          { label: "Loja", sub: "Comprar com gemas", icon: Icons.ShoppingBag, path: "/store" },
          { label: "Gerenciar assinaturas", sub: "Plano atual", icon: Icons.CreditCard, path: "/subscription" },
        ].map(({ label, sub, icon: Icon, path }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className="mb-3 flex w-full items-center gap-3 rounded-2xl border border-stroke-muted bg-white px-5 py-4 shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pageBgLight">
              <Icon className="h-5 w-5 text-emerald" />
            </div>
            <div className="min-w-0 flex-1 text-left">
              <p className="text-sm font-bold text-foregroundDark">{label}</p>
              <p className="text-xs text-foregroundMuted">{sub}</p>
            </div>
            <ChevronRight className="h-4 w-4 shrink-0 text-stroke-light" />
          </button>
        ))}
      </div>

      <BottomNav active="perfil" />
    </div>
  )
}
