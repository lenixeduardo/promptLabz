import { useState } from "react"
import { Link } from "react-router-dom"
import { Bell, Search, Home as HomeIcon, User, Award, Layers2, MessageSquare, Palette } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { useAchievements } from "@/hooks/useAchievements"
import { sileo } from "sileo"

const navigationItems = [
  { label: "Home", icon: HomeIcon, to: "/home" },
  { label: "Perfil", icon: User, to: "/profile" },
  { label: "Conquistas", icon: Award, to: "/achievements" },
]

const features = [
  { title: "Skills", icon: Layers2, to: "/skills" },
  { title: "Agentes", icon: MessageSquare, to: "/learn" },
  { title: "Comunicação", icon: MessageSquare, to: "/learn" },
  { title: "Design", icon: Palette, to: "/learn" },
]

export default function Home() {
  const { user } = useAuth()
  const achievements = useAchievements()
  const [searchQuery, setSearchQuery] = useState("")

  // Check daily streak
  const [streakChecked, setStreakChecked] = useState(false)
  if (!streakChecked) {
    const newAchs = achievements.checkDailyVisit()
    if (newAchs.length > 0 && import.meta.env.DEV) {
      console.log("[DEV] Novas conquistas desbloqueadas:", newAchs.map((a) => a.title))
    }
    setStreakChecked(true)
  }

  const handleSearch = () => {
    if (searchQuery.trim()) {
      sileo.success({ title: "Buscando: " + searchQuery })
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#EAF7EF] via-[#E0F3E7] to-[#D2EEDD]">
      <div className="flex-1 overflow-y-auto px-5 py-8">
        <div className="mx-auto w-full max-w-[420px]">
        {/* Header with greeting and notification */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#2B5D3A]">Olá, Aluno!</h1>
            <p className="text-sm text-[#4A5E52]">Bem-vindo ao PromptLabz</p>
          </div>
          <button className="rounded-full p-2 hover:bg-white/50 transition-colors">
            <Bell className="h-6 w-6 text-[#2B5D3A]" strokeWidth={2.2} />
          </button>
        </div>

        {/* Search bar */}
        <div className="mb-8 flex items-center gap-2 rounded-full border border-[#BFE3CC] bg-white px-4 py-3 shadow-sm">
          <Search className="h-5 w-5 text-[#3E8E5E]" strokeWidth={2.2} />
          <input
            type="text"
            placeholder="Explorar Habilidades"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1 bg-transparent text-sm text-[#1F2A24] placeholder:text-[#8A998F] focus:outline-none"
          />
        </div>

        {/* Features Grid 2x2 */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {features.map(({ title, icon: Icon, to }) => (
            <Link
              key={title}
              to={to}
              className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-[#2E8B57] bg-white/80 px-4 py-6 transition-all hover:bg-[#E1F2E7] hover:shadow-md"
            >
              <Icon className="h-8 w-8 text-[#2E8B57]" strokeWidth={2.2} />
              <span className="text-sm font-semibold text-[#2B5D3A]">{title}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="border-t border-[#BFE3CC] bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-[420px] items-center justify-around px-5 py-3">
          <div className="flex flex-col items-center gap-1 rounded-lg p-2 text-center">
            <HomeIcon className="h-6 w-6 text-[#2E8B57]" strokeWidth={2.2} />
            <span className="text-xs font-bold text-[#2E8B57]">Início</span>
          </div>

          <Link
            to="/profile"
            className="flex flex-col items-center gap-1 rounded-lg p-2 text-center transition-all hover:bg-[#F0FAF3]"
          >
            <User className="h-6 w-6 text-[#9BB8A7]" strokeWidth={2.2} />
            <span className="text-xs font-semibold text-[#9BB8A7]">Perfil</span>
          </Link>

          <Link
            to="/achievements"
            className="flex flex-col items-center gap-1 rounded-lg p-2 text-center transition-all hover:bg-[#F0FAF3]"
          >
            <Award className="h-6 w-6 text-[#9BB8A7]" strokeWidth={2.2} />
            <span className="text-xs font-semibold text-[#9BB8A7]">Conquistas</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}

