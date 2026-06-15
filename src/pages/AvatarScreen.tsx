import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Home, ShoppingBag, User, Heart, Check } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { updateUserAvatar, getUserProfile } from "@/lib/db"
import { AVATARS, getAvatarById } from "@/data/avatarsData"
import { sileo } from "sileo"

export default function AvatarScreen() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [selectedAvatarId, setSelectedAvatarId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [userBalance, setUserBalance] = useState(0)
  const [currentAvatar, setCurrentAvatar] = useState<string | null>(null)

  useEffect(() => {
    const loadUserAvatar = async () => {
      if (!user?.id) return
      try {
        const { data, error } = await getUserProfile(user.id)
        if (!error && data?.avatar_url) {
          setCurrentAvatar(data.avatar_url)
          setSelectedAvatarId(data.avatar_url)
        } else {
          setSelectedAvatarId("cat-green")
        }
      } catch (err) {
        console.error("Error loading avatar:", err)
      }
    }
    loadUserAvatar()
  }, [user])

  useEffect(() => {
    setUserBalance(35) // Placeholder
  }, [])

  const handleSelectAvatar = async (avatarId: string) => {
    const avatar = getAvatarById(avatarId)
    if (!avatar) return

    if (avatar.price > 0 && userBalance < avatar.price) {
      sileo.error({
        title: "Diamantes insuficientes",
        description: `Você precisa de ${avatar.price - userBalance} diamantes a mais.`,
      })
      return
    }

    setSelectedAvatarId(avatarId)
    setLoading(true)
    try {
      if (!user?.id) throw new Error("Usuário não encontrado")

      const { error } = await updateUserAvatar(user.id, avatarId)
      if (error) throw new Error(error)

      setCurrentAvatar(avatarId)
      sileo.success({
        title: "Avatar selecionado!",
        description: `Você agora está usando ${avatar.name}`,
      })
    } catch (err: any) {
      sileo.error({ title: err?.message || "Erro ao selecionar avatar" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Content */}
      <div className="flex flex-1 flex-col px-4 pb-40 pt-6">
        {/* Header */}
        <div className="mb-1 flex items-center gap-3">
          <img
            src="/assets/avatar-cat.png"
            alt="logo"
            className="h-10 w-10 object-contain"
          />
          <h1 className="text-2xl font-extrabold text-[#1A3D2B]">Avatares</h1>
        </div>
        <p className="mb-6 text-sm text-[#4A5E52]">
          Escolha seu personagem. O primeiro é grátis!
        </p>

        {/* Avatar Grid — 5 columns */}
        <div className="grid grid-cols-5 gap-2">
          {AVATARS.map((avatar) => {
            const isSelected = selectedAvatarId === avatar.id
            const isOwned = currentAvatar === avatar.id
            const canAfford = avatar.price === 0 || userBalance >= avatar.price

            return (
              <button
                key={avatar.id}
                onClick={() => handleSelectAvatar(avatar.id)}
                disabled={loading}
                className="flex flex-col items-center gap-1"
              >
                {/* Avatar tile */}
                <div
                  className={`relative h-14 w-14 overflow-hidden rounded-xl border-2 transition-all ${
                    isSelected
                      ? "border-[#3E8E5E] bg-[#D9F0E4]"
                      : "border-[#E2E8E4] bg-[#F5F5F5]"
                  } ${!canAfford && !isOwned ? "opacity-40" : ""}`}
                >
                  <img
                    src={avatar.image}
                    alt={avatar.name}
                    className="h-full w-full object-contain p-1"
                  />
                  {/* Owned checkmark */}
                  {isOwned && (
                    <div className="absolute bottom-0.5 right-0.5 rounded-full bg-[#3E8E5E] p-0.5">
                      <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                    </div>
                  )}
                </div>

                {/* Price label */}
                <span className="text-[10px] font-semibold text-[#2B5D3A]">
                  {avatar.price === 0 ? (
                    "Grátis"
                  ) : (
                    <span className="flex items-center gap-0.5">
                      <Heart className="h-2.5 w-2.5 fill-[#3E8E5E] text-[#3E8E5E]" />
                      {avatar.price}
                    </span>
                  )}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Diamond bar + Bottom nav — fixed */}
      <div className="fixed bottom-0 left-0 right-0 bg-white">
        {/* Diamond balance */}
        <div className="flex items-center justify-center gap-1.5 border-t border-[#E2E8E4] py-2">
          <span className="text-xs font-medium text-[#4A5E52]">Seus diamantes:</span>
          <Heart className="h-3.5 w-3.5 fill-[#3E8E5E] text-[#3E8E5E]" />
          <span className="text-xs font-bold text-[#1A3D2B]">{userBalance}</span>
        </div>

        {/* Bottom nav */}
        <nav className="flex items-center justify-around border-t border-[#CDEAD8] px-4 py-3">
          <Link
            to="/home"
            className="flex flex-col items-center gap-0.5 text-[#4A5E52] hover:text-[#2E8B57]"
          >
            <Home className="h-5 w-5" />
            <span className="text-[10px] font-medium">Início</span>
          </Link>
          <Link
            to="/avatars"
            className="flex flex-col items-center gap-0.5 text-[#3E8E5E]"
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="text-[10px] font-medium">Loja</span>
          </Link>
          <Link
            to="/profile"
            className="flex flex-col items-center gap-0.5 text-[#4A5E52] hover:text-[#2E8B57]"
          >
            <User className="h-5 w-5" />
            <span className="text-[10px] font-medium">Perfil</span>
          </Link>
        </nav>
      </div>
    </div>
  )
}
