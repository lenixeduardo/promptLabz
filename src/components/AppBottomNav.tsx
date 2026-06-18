import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutGrid,
  GraduationCap,
  Code2,
  Target,
  Newspaper,
  User,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  key: string;
  label: string;
  href: string;
  icon: LucideIcon;
}

const ITEMS: NavItem[] = [
  { key: "home", label: "Início", href: "/home", icon: LayoutGrid },
  { key: "tracks", label: "Trilha", href: "/learn", icon: GraduationCap },
  { key: "lab", label: "Laboratório", href: "/prompt-lab", icon: Code2 },
  { key: "challenges", label: "Missões", href: "/missions", icon: Target },
  { key: "news", label: "Notícias", href: "/news", icon: Newspaper },
  { key: "profile", label: "Perfil", href: "/profile", icon: User },
];

export function AppBottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-stroke-muted bg-card/95 backdrop-blur-md"
      aria-label="Navegação principal"
    >
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-1">
        {ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.key}
              to={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 transition-colors",
                isActive
                  ? "text-primary-dark"
                  : "text-foreground-muted hover:text-forest",
              )}
              aria-label={item.label}
            >
              <Icon
                className="h-6 w-6"
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
          );
        })}
      </div>
    </nav>
  );
}
