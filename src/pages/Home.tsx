import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  Search,
  Home as HomeIcon,
  User,
  Users,
  Grid2x2,
  Cpu,
  MessageCircle,
  Wand2,
  Bell,
} from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { useAchievements } from "@/hooks/useAchievements"
import { StreakWidget } from "@/components/StreakWidget"
import { sileo } from "sileo"

const features = [
  { title: "Skills", icon: Grid2x2, to: "/skills" },
  { title: "Agentes", icon: Cpu, to: "/learn?category=agentes-workflows" },
  { title: "Comunicação", icon: MessageCircle, to: "/learn?category=desenvolvimento" },
  { title: "Lab de Prompts", icon: Wand2, to: "/prompts" },
]

export default function Home() {
  const { user, logout } = useAuth()
  const { checkDailyVisit, data } = useAchievements()
  const [searchQuery, setSearchQuery] = useState("")
  const [streakLoading, setStreakLoading] = useState(true)

  // Check daily streak on mount and sync with Supabase
  useEffect(() => {
    setStreakLoading(true)
    checkDailyVisit(user?.id).then((newAchs) => {
      setStreakLoading(false)
      if (newAchs.length > 0 && import.meta.env.DEV) {
        console.log("[DEV] Novas conquistas desbloqueadas:", newAchs.map((a) => a.title))
      }
    })
  }, [checkDailyVisit, user?.id])

  const handleLogout = async () => {
    const result = await logout()
    if (result.success) {
      sileo.success({ title: "Até logo!" })
    } else {
      sileo.error({ title: result.error || "Erro ao sair" })
    }
  }

  const userName = user?.email?.split("@")[0] || "Aluno"

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#EAF7EF] to-white pb-28">
      {/* Header */}
      <div className="bg-white border-b border-[#CDEAD8] px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <h1 className="text-lg font-bold text-[#2B5D3A]">Olá, {userName}!</h1>
        <button
          onClick={handleLogout}
          className="text-[#2B5D3A] hover:text-[#1F2A24]"
          aria-label="Sair da aplicação"
        >
          <Bell className="h-6 w-6" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 py-6">
        {/* Streak Widget */}
        <div className="mb-6">
          <StreakWidget
            streak={data.consecutiveDays}
            longestStreak={data.longestStreak}
            loading={streakLoading}
          />
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative flex items-center gap-3 rounded-2xl border-2 border-[#BFE3CC] bg-[#F0FAF3] px-4 py-3">
            <Search className="h-5 w-5 text-[#3E8E5E]" strokeWidth={2.5} />
            <input
              type="text"
              placeholder="Explore habilidades"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm placeholder:text-[#6B7A70] focus:outline-none font-medium"
            />
          </div>
        </div>

        {/* Feature Grid - 2x2 */}
        <div className="grid grid-cols-2 gap-4">
          {features.map(({ title, icon: Icon, to }) => (
            <Link
              key={title}
              to={to}
              className="flex flex-col items-center justify-center gap-3 rounded-3xl border-2 border-[#2B5D3A] bg-white p-6 aspect-square hover:bg-[#F0FAF3] transition-colors"
            >
              <Icon className="h-10 w-10 text-[#2B5D3A]" strokeWidth={2.5} />
              <span className="text-sm font-semibold text-[#1F2A24] text-center">{title}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#CDEAD8] px-4 py-3 flex items-center justify-around">
        <Link
          to="/home"
          className="flex flex-col items-center gap-1 text-[#2B5D3A] hover:text-[#1F2A24]"
          aria-label="Ir para Home"
        >
          <HomeIcon className="h-6 w-6" strokeWidth={2.5} />
          <span className="text-xs font-semibold">Home</span>
        </Link>

        <Link
          to="/profile"
          className="flex flex-col items-center gap-1 text-[#8A998F] hover:text-[#2B5D3A]"
          aria-label="Ir para Perfil"
        >
          <User className="h-6 w-6" strokeWidth={2.5} />
          <span className="text-xs font-semibold">Perfil</span>
        </Link>

        <span
          className="flex flex-col items-center gap-1 text-[#C4CFC8] cursor-not-allowed select-none"
          aria-label="Comunidade (em breve)"
          aria-disabled="true"
        >
          <Users className="h-6 w-6" strokeWidth={2.5} />
          <span className="text-xs font-semibold">Comunidade</span>
        </span>
      </nav>
    </div>
  )
}
