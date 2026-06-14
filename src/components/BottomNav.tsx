import { useNavigate } from "react-router-dom"
import * as Icons from "@/lib/icons"
import { cn } from "@/lib/utils"

export type NavTab = "home" | "trilha" | "lab" | "desafios" | "perfil"

const NAV_ITEMS = [
  { key: "home" as const,    label: "Início",      icon: Icons.Home,         path: "/home" },
  { key: "trilha" as const,  label: "Trilha",      icon: Icons.Scissors,     path: "/learn" },
  { key: "lab" as const,     label: "Laboratório", icon: Icons.FlaskConical, path: "/skills" },
  { key: "desafios" as const,label: "Desafios",    icon: Icons.Trophy,       path: "/achievements" },
  { key: "perfil" as const,  label: "Perfil",      icon: Icons.UserCircle,   path: "/profile" },
]

export function BottomNav({ active }: { active: NavTab }) {
  const navigate = useNavigate()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#E5F5EB] bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div className="mx-auto flex max-w-[460px] items-center justify-around px-1 pb-5 pt-2">
        {NAV_ITEMS.map(({ key, label, icon: Icon, path }) => (
          <button
            key={key}
            onClick={() => navigate(path)}
            className={cn(
              "flex flex-col items-center gap-0.5 px-3 py-1 transition-colors",
              active === key ? "text-[#2B5D3A]" : "text-[#B0C8B8] hover:text-[#3E8E5E]"
            )}
          >
            <Icon className="h-6 w-6" strokeWidth={active === key ? 2.5 : 1.8} />
            <span className={cn("text-[10px]", active === key ? "font-bold" : "font-medium")}>
              {label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  )
}
