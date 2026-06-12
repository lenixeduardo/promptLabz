import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Lock, Diamond, Home, ShoppingBag, User } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { updateUserAvatar, getUserProfile } from "@/lib/db"
import { AVATARS, getAvatarById } from "@/data/avatarsData"
import { sileo } from "sileo"

const DIAMOND_BALANCE = 35

export default function AvatarScreen() {
  const { user } = useAuth()
  const [currentAvatarId, setCurrentAvatarId] = useState<string>("graduation")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user?.id) return
    getUserProfile(user.id).then(({ data, error }) => {
      if (!error && data?.avatar_url) setCurrentAvatarId(data.avatar_url)
    })
  }, [user])

  const handleSelect = async (avatarId: string) => {
    const avatar = getAvatarById(avatarId)
    if (!avatar) return

    if (avatar.price > DIAMOND_BALANCE && avatarId !== currentAvatarId) {
      sileo.error({
        title: "Diamantes insuficientes",
        description: `Faltam ${avatar.price - DIAMOND_BALANCE} diamantes.`,
      })
      return
    }

    setLoading(true)
    try {
      if (!user?.id) throw new Error("Usuário não encontrado")
      const { error } = await updateUserAvatar(user.id, avatarId)
      if (error) throw new Error(error)
      setCurrentAvatarId(avatarId)
      sileo.success({ title: `${avatar.name} selecionado!` })
    } catch (err: any) {
      sileo.error({ title: err?.message || "Erro ao selecionar avatar" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#EAF7EF] via-[#E0F3E7] to-[#D2EEDD]">
      {/* Header */}
      <div className="px-5 pt-10 pb-4">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-3xl font-extrabold text-[#2B5D3A]">Avatares</h1>
        </div>
        <p className="text-sm text-[#4A5E52]">
          Escolha seu personagem, O primeiro é grátis!
        </p>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto px-4 pb-6">
        <div className="grid grid-cols-4 gap-3">
          {AVATARS.map((avatar) => {
            const isOwned = avatar.price === 0 || avatar.id === currentAvatarId
            const canAfford = avatar.price <= DIAMOND_BALANCE
            const isSelected = avatar.id === currentAvatarId
            const locked = !isOwned && !canAfford

            return (
              <button
                key={avatar.id}
                onClick={() => handleSelect(avatar.id)}
                disabled={loading || locked}
                className={`relative flex flex-col items-center rounded-2xl border-2 p-2 transition-all
                  ${isSelected
                    ? "border-[#2E8B57] bg-[#D4EDDF] shadow-md"
                    : "border-[#C6E7D2] bg-white/90 hover:border-[#2E8B57]"
                  }
                  ${locked ? "opacity-70" : ""}
                `}
              >
                {/* Lock overlay */}
                {locked && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/20">
                    <Lock className="h-5 w-5 text-white drop-shadow" />
                  </div>
                )}

                {/* Avatar image */}
                <div className="mb-1 flex h-14 w-14 items-center justify-center rounded-xl bg-[#EAF7EF] p-1">
                  <img
                    src={avatar.image}
                    alt={avatar.name}
                    className="h-full w-full object-contain"
                  />
                </div>

                {/* Price */}
                {avatar.price === 0 ? (
                  <span className="text-[10px] font-bold text-[#2E8B57]">Grátis</span>
                ) : (
                  <div className="flex items-center gap-0.5">
                    <Diamond className="h-3 w-3 text-[#2E8B57]" strokeWidth={2} />
                    <span className="text-[10px] font-bold text-[#2B5D3A]">{avatar.price}</span>
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Bottom bar — diamond balance + navigation */}
      <div className="border-t border-[#BFE3CC] bg-white/95 backdrop-blur-sm">
        {/* Diamond balance */}
        <div className="flex items-center justify-center gap-2 border-b border-[#E1F2E7] py-2">
          <Diamond className="h-4 w-4 text-[#2E8B57]" strokeWidth={2} />
          <span className="text-sm font-semibold text-[#2B5D3A]">
            Seus diamantes: <strong>{DIAMOND_BALANCE}</strong>
          </span>
        </div>

        {/* Navigation tabs */}
        <div className="mx-auto flex w-full max-w-[420px] items-center justify-around px-5 py-3">
          <Link
            to="/home"
            className="flex flex-col items-center gap-1 rounded-lg p-2 text-center transition-all hover:bg-[#F0FAF3]"
          >
            <Home className="h-6 w-6 text-[#9BB8A7]" strokeWidth={2.2} />
            <span className="text-xs font-semibold text-[#9BB8A7]">Início</span>
          </Link>

          <div className="flex flex-col items-center gap-1 rounded-lg p-2 text-center">
            <ShoppingBag className="h-6 w-6 text-[#2E8B57]" strokeWidth={2.2} />
            <span className="text-xs font-bold text-[#2E8B57]">Loja</span>
          </div>

          <Link
            to="/profile"
            className="flex flex-col items-center gap-1 rounded-lg p-2 text-center transition-all hover:bg-[#F0FAF3]"
          >
            <User className="h-6 w-6 text-[#9BB8A7]" strokeWidth={2.2} />
            <span className="text-xs font-semibold text-[#9BB8A7]">Perfil</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
