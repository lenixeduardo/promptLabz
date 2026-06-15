// ═══════════════════════════════════════════════════════════════════════════
// ThemeToggle — Dark/Light mode switch button
// ═══════════════════════════════════════════════════════════════════════════

import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/contexts/ThemeContext"

interface ThemeToggleProps {
  /** Show label text alongside icon (default: false) */
  showLabel?: boolean
  /** Size variant */
  size?: "sm" | "md"
}

export function ThemeToggle({ showLabel = false, size = "md" }: ThemeToggleProps) {
  const { theme, toggleTheme, isDark } = useTheme()

  const sizeClasses = size === "sm" ? "h-8 w-8" : "h-9 w-9"
  const iconSize = size === "sm" ? "h-4 w-4" : "h-5 w-5"

  return (
    <button
      onClick={toggleTheme}
      className={`flex items-center justify-center gap-1.5 rounded-full transition-all hover:scale-105 active:scale-95 ${sizeClasses} ${
        isDark
          ? "bg-[#2A3A30] text-[#FFD93D] hover:bg-[#345040]"
          : "bg-pageBgLight text-emerald-dark hover:bg-surface-success"
      }`}
      aria-label={isDark ? "Ativar modo claro" : "Ativar modo escuro"}
      title={isDark ? "Modo claro" : "Modo escuro"}
    >
      {isDark ? <Sun className={iconSize} /> : <Moon className={iconSize} />}
      {showLabel && (
        <span className="text-xs font-semibold">
          {isDark ? "Claro" : "Escuro"}
        </span>
      )}
    </button>
  )
}
