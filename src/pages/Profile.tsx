import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { ArrowLeft, User, Mail, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/useAuth"
import { useAchievements } from "@/hooks/useAchievements"
import { updateUserProfile, getUserProfile } from "@/lib/db"
import { getAvatarById } from "@/data/avatarsData"
import { getProgressCount } from "@/lib/achievements"
import * as Icons from "@/lib/icons"
import { cn } from "@/lib/utils"
import { sileo } from "sileo"

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
        "flex h-14 w-14 shrink-0 items-center justify-center",
        isUnlocked
          ? "bg-gradient-to-br from-[#3E8E5E] to-[#2E7048]"
          : "bg-gradient-to-br from-[#E8EEE9] to-[#DCEAE3]",
      )}
      style={{ clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)" }}
      aria-hidden="true"
    >
      {isUnlocked && IconComp ? (
        <IconComp className="h-6 w-6 text-white" />
      ) : (
        <Icons.Lock className="h-5 w-5 text-[#9AB0A4]" />
      )}
    </div>
  )
}

export default function Profile() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { allAchievements, unlocked, data } = useAchievements()

  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || "")
  const [loading, setLoading] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [avatarImage, setAvatarImage] = useState("/assets/avatar-cat.png")

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
      const { error } = await updateUserProfile(user.id, fullName)
      if (error) throw new Error(error)
      sileo.success({ title: "Perfil atualizado com sucesso!" })
    } catch (err: any) {
      sileo.error({ title: err?.message || "Erro ao atualizar perfil" })
    } finally {
      setLoading(false)
    }
  }

  const registrationDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : ""

  const previewAchievements = allAchievements.slice(0, 3)

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#EAF7EF] via-[#E0F3E7] to-[#D2EEDD] px-5 py-8">
      <div className="mx-auto flex w-full max-w-[420px] flex-col">
        {/* Back */}
        <Link
          to="/home"
          className="mb-2 flex w-fit items-center text-[#2E8B57] hover:text-primary"
        >
          <ArrowLeft className="h-6 w-6" strokeWidth={2.2} />
        </Link>

        {/* Title */}
        <h1 className="mb-6 text-center text-3xl font-extrabold text-[#2B5D3A]">
          Perfil &amp; Conquistas
        </h1>

        {/* Avatar + name */}
        <div className="mb-5 flex flex-col items-center gap-3">
          <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-[#BFE3CC] shadow-md">
            <img
              src={avatarImage}
              alt="Avatar"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="text-center">
            <p className="text-base font-bold text-[#2B5D3A]">
              {user?.user_metadata?.full_name || "Seu Perfil"}
            </p>
            <Link
              to="/avatars"
              className="text-xs font-medium text-[#3E8E5E] underline-offset-2 hover:underline"
            >
              Trocar avatar
            </Link>
          </div>
        </div>

        {/* Streak card */}
        <div className="mb-4 flex items-center justify-between rounded-2xl border border-[#CDEAD8] bg-white px-5 py-4 shadow-sm">
          <span className="text-sm font-bold uppercase tracking-wider text-[#6B7A70]">
            Streak
          </span>
          <span className="text-2xl font-extrabold text-[#2B5D3A]">
            {data.consecutiveDays} dias 🔥
          </span>
        </div>

        {/* Achievement preview cards */}
        <div className="mb-4 flex flex-col gap-3">
          {previewAchievements.map((ach) => {
            const isUnlocked = unlocked.includes(ach.id)
            const IconComp = Icons[ach.icon as keyof typeof Icons] as
              | React.ComponentType<{ className?: string }>
              | undefined
            const progress = getProgressCount(ach.id, data)
            const pct = progress
              ? Math.round((progress.current / progress.max) * 100)
              : 0

            return (
              <button
                key={ach.id}
                onClick={() => {
                  if (import.meta.env.DEV) navigate("/achievements")
                }}
                className="flex w-full items-center gap-3 rounded-2xl border border-[#CDEAD8] bg-white p-4 text-left shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
              >
                <HexBadge icon={IconComp} isUnlocked={isUnlocked} />

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold leading-snug text-[#1F2A24]">
                    {ach.title}
                  </p>
                  {progress && (
                    <div className="mt-1.5">
                      <div
                        className="h-1.5 w-full overflow-hidden rounded-full bg-[#EAF7EF]"
                        role="progressbar"
                        aria-valuenow={progress.current}
                        aria-valuemin={0}
                        aria-valuemax={progress.max}
                        aria-label={`Progresso: ${progress.current} de ${progress.max}`}
                      >
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#3E8E5E] to-[#2E7048] transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <p className="mt-0.5 text-xs text-[#6B9E7E]">
                        {progress.current}/{progress.max}
                      </p>
                    </div>
                  )}
                </div>

                <Icons.ChevronRight className="h-4 w-4 shrink-0 text-[#BFE3CC]" />
              </button>
            )
          })}
        </div>

        {/* Share button */}
        <button className="mb-3 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-[#BFE3CC] bg-white px-5 py-3 font-semibold text-[#2B5D3A] transition-all hover:bg-[#F0FAF3] hover:shadow-sm">
          <Icons.Share2 className="h-5 w-5" />
          Compartilhar
        </button>

        {/* Edit profile toggle */}
        <button
          onClick={() => setEditOpen((v) => !v)}
          className="mb-3 flex w-full items-center justify-center gap-1 text-sm text-[#3E8E5E] hover:text-[#2B5D3A]"
        >
          {editOpen ? (
            <Icons.ChevronUp className="h-4 w-4" />
          ) : (
            <Icons.ChevronDown className="h-4 w-4" />
          )}
          {editOpen ? "Fechar edição" : "Editar Perfil"}
        </button>

        {/* Collapsible edit form */}
        {editOpen && (
          <div className="rounded-2xl border border-[#BFE3CC] bg-[#E1F2E7] p-6 shadow-md">
            <form className="flex flex-col gap-4" onSubmit={handleUpdate}>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#3E8E5E]">
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
                <label className="text-xs font-bold uppercase tracking-wider text-[#3E8E5E]">
                  E-mail
                </label>
                <Input
                  type="email"
                  value={user?.email || ""}
                  icon={<Mail className="h-5 w-5" strokeWidth={2.2} />}
                  disabled
                />
              </div>

              <div className="flex items-center gap-2 px-2 py-1 text-sm text-[#4A5E52]">
                <Calendar className="h-4 w-4" />
                <span>Cadastrado em: {registrationDate}</span>
              </div>

              <Button type="submit" size="lg" className="mt-2 w-full" disabled={loading}>
                {loading ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
