import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ArrowLeft, Lock, Check, Sparkles, Zap } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { updateUserAvatar, getUserProfile } from "@/lib/db"
import { AVATARS, getAvatarById, getRarityColor, getRarityBg } from "@/data/avatarsData"
import { sileo } from "sileo"

export default function AvatarScreen() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [selectedAvatarId, setSelectedAvatarId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [userBalance, setUserBalance] = useState(0)
  const [currentAvatar, setCurrentAvatar] = useState<string | null>(null)

  // Load current avatar on mount
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

  // TODO: Load user balance from database
  useEffect(() => {
    setUserBalance(500) // Placeholder
  }, [])

  const handleSelectAvatar = async (avatarId: string) => {
    setSelectedAvatarId(avatarId)
    const avatar = getAvatarById(avatarId)

    if (!avatar) return

    // Check if user can afford it
    if (avatar.price > 0 && userBalance < avatar.price) {
      sileo.error({
        title: "Diamantes insuficientes",
        description: `Você precisa de ${avatar.price - userBalance} diamantes a mais.`,
      })
      return
    }

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

  // Group avatars by rarity for better display
  const avatarsByRarity = {
    common: AVATARS.filter((a) => a.rarity === "common"),
    rare: AVATARS.filter((a) => a.rarity === "rare"),
    epic: AVATARS.filter((a) => a.rarity === "epic"),
    legendary: AVATARS.filter((a) => a.rarity === "legendary"),
  }

  const rarityLabels = {
    common: "Comum",
    rare: "Raro",
    epic: "Épico",
    legendary: "Lendário",
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#EAF7EF] via-[#E0F3E7] to-[#D2EEDD] px-5 py-8">
      <div className="mx-auto flex w-full max-w-[600px] flex-col">
        {/* Back */}
        <Link
          to="/profile"
          className="mb-2 flex w-fit items-center text-[#2E8B57] hover:text-primary"
        >
          <ArrowLeft className="h-6 w-6" strokeWidth={2.2} />
        </Link>

        {/* Title */}
        <h1 className="mb-2 text-center text-4xl font-extrabold text-[#2B5D3A]">
          Avatares
        </h1>
        <p className="mb-6 text-center text-sm text-[#4A5E52]">
          Escolha seu personagem favorito! ✨
        </p>

        {/* Balance Card */}
        <div className="mb-6 flex items-center justify-between rounded-2xl border border-[#BFE3CC] bg-white/80 px-4 py-3 shadow-md">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            <span className="text-sm font-semibold text-[#2B5D3A]">Diamantes</span>
          </div>
          <span className="text-lg font-bold text-[#2B5D3A]">{userBalance}</span>
        </div>

        {/* Avatars by Rarity */}
        <div className="space-y-8">
          {(Object.entries(avatarsByRarity) as Array<[keyof typeof avatarsByRarity, typeof AVATARS]>).map(
            ([rarity, avatars]) =>
              avatars.length > 0 && (
                <div key={rarity}>
                  <h2 className={`mb-4 text-sm font-bold uppercase tracking-wider ${getRarityColor(rarity)}`}>
                    {rarityLabels[rarity]}
                  </h2>

                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {avatars.map((avatar) => {
                      const canAfford = avatar.price === 0 || userBalance >= avatar.price
                      const isSelected = selectedAvatarId === avatar.id
                      const isOwned = currentAvatar === avatar.id

                      return (
                        <button
                          key={avatar.id}
                          onClick={() => handleSelectAvatar(avatar.id)}
                          disabled={loading || (!canAfford && !isOwned)}
                          className={`group relative rounded-2xl border-2 p-4 transition-all ${
                            isSelected
                              ? "border-[#3E8E5E] bg-[#E1F2E7] shadow-lg"
                              : "border-[#C6E7D2] bg-white/80 hover:border-[#3E8E5E]"
                          } ${!canAfford && !isOwned ? "opacity-60" : ""}`}
                        >
                          {/* Lock overlay for unaffordable items */}
                          {!canAfford && !isOwned && (
                            <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/30">
                              <Lock className="h-6 w-6 text-white" />
                            </div>
                          )}

                          {/* Owned checkmark */}
                          {isOwned && (
                            <div className="absolute -right-2 -top-2 rounded-full bg-[#3E8E5E] p-1 shadow-md">
                              <Check className="h-4 w-4 text-white" strokeWidth={3} />
                            </div>
                          )}

                          {/* Avatar image */}
                          <div className="mb-3 aspect-square overflow-hidden rounded-xl bg-[#F0FAF3]">
                            <img
                              src={avatar.image}
                              alt={avatar.name}
                              className="h-full w-full object-contain p-2"
                            />
                          </div>

                          {/* Avatar info */}
                          <div className="text-left">
                            <p className="text-xs font-bold text-[#2B5D3A]">{avatar.name}</p>
                            <div className="mt-2 flex items-center gap-1">
                              {avatar.price === 0 ? (
                                <span className="text-xs font-semibold text-[#3E8E5E]">Grátis</span>
                              ) : (
                                <>
                                  <Sparkles className="h-3 w-3 text-yellow-500" />
                                  <span className="text-xs font-semibold text-[#2B5D3A]">{avatar.price}</span>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Selection indicator */}
                          {isSelected && (
                            <div className="absolute bottom-2 right-2 h-2 w-2 rounded-full bg-[#3E8E5E]" />
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
          )}
        </div>

        {/* Info section */}
        <div className="mt-10 rounded-2xl border border-[#BFE3CC] bg-[#E1F2E7] p-4">
          <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-[#2B5D3A]">
            <Sparkles className="h-4 w-4" />
            Como ganhar diamantes?
          </h3>
          <ul className="space-y-2 text-xs text-[#4A5E52]">
            <li>✅ Complete desafios diários</li>
            <li>✅ Alcance marcos de aprendizado</li>
            <li>✅ Ganhe prêmios em torneios</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
