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
  const { user, logout } = useAuth()
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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#EAF7EF] via-[#E0F3E7] to-[#D2EEDD] pb-28">
      <div className="mx-auto w-full max-w-[420px] px-5 py-8">
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

        {/* Profile link */}
        <Link
          to="/profile"
          className="mb-4 flex items-center gap-3 rounded-2xl border border-[#C6E7D2] bg-[#E1F2E7] px-4 py-3 transition-all hover:shadow-md"
        >
          <div className="h-10 w-10 overflow-hidden rounded-full border border-[#BFE3CC] bg-white">
            <img
              src="/assets/avatar-cat.png"
              alt="Avatar"
              className="h-full w-full object-contain"
            />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-wider text-[#3E8E5E]">Meu Perfil</p>
            <p className="text-sm font-semibold text-[#2B5D3A]">{user?.email?.split("@")[0] || "Usuário"}</p>
          </div>
        </Link>

        {/* Logout button */}
        <button
          onClick={async () => {
            const result = await logout()
            if (result.success) {
              sileo.success({ title: "Até logo!" })
            }
          }}
          className="w-full rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition-all hover:bg-red-100"
        >
          Sair da Conta
        </button>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 border-t border-[#BFE3CC] bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-[420px] items-center justify-around px-5 py-3">
          {navigationItems.map(({ label, icon: Icon, to }) => (
            <Link
              key={label}
              to={to}
              className="flex flex-col items-center gap-1 rounded-lg p-2 text-center transition-all hover:bg-[#F0FAF3]"
            >
              <Icon className="h-6 w-6 text-[#2E8B57]" strokeWidth={2.2} />
              <span className="text-xs font-semibold text-[#2B5D3A]">{label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  )
}

