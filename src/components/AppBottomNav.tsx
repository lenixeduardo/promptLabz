import { Link, useLocation } from "react-router-dom"
import * as Icons from "@/lib/icons"
import { cn } from "@/lib/utils"

export interface BottomNavItem {
  key: string
  label: string
  href: string
  icon: string // lucide-react icon name
}

export const BOTTOM_NAV_ITEMS: BottomNavItem[] = [
  { key: "home", label: "Início", href: "/home", icon: "LayoutGrid" },
  { key: "tracks", label: "Trilha", href: "/learn", icon: "GraduationCap" },
  { key: "lab", label: "Laboratório", href: "/skills", icon: "Code2" },
  { key: "challenges", label: "Missões", href: "/daily-missions", icon: "Target" },
  { key: "news", label: "Notícias", href: "/news", icon: "Newspaper" },
  { key: "profile", label: "Perfil", href: "/profile", icon: "User" },
]

interface AppBottomNavProps {
  /** Optional custom items; defaults to BOTTOM_NAV_ITEMS */
  items?: BottomNavItem[]
}

/**
 * Mobile bottom navigation bar.
 * Shows 6 items with icons and labels. The active route is highlighted.
 */
export function AppBottomNav({ items = BOTTOM_NAV_ITEMS }: AppBottomNavProps) {
  const { pathname } = useLocation()

  const getIcon = (iconName: string) => {
    const IconComp = (Icons as unknown as Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>>)[
      iconName
    ]
    return IconComp
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-stroke-muted bg-card/95 backdrop-blur-md"
      aria-label="Navegação principal"
    >
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-1">
        {items.map((item) => {
          const isActive = pathname === item.href
          const IconComp = getIcon(item.icon)

          return (
            <Link
              key={item.key}
              to={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 transition-colors",
                isActive
                  ? "text-primary-dark"
                  : "text-foregroundMuted hover:text-forest",
              )}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
            >
              <IconComp
                className={cn(
                  "h-6 w-6",
                  isActive ? "fill-primary-dark/10" : "",
                )}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span
                className={cn(
                  "text-[10px] font-semibold leading-none",
                  isActive && "font-extrabold",
                )}
              >
                {item.label}
              </span>
              {isActive && (
                <span className="mt-0.5 h-1 w-1 rounded-full bg-primary-dark" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
