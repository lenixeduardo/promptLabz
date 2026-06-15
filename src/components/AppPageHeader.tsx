import { useNavigate } from "react-router-dom"
import { ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"

interface AppPageHeaderProps {
  title: string
  /** Optional right-side element (icons, buttons, menu) */
  rightSlot?: React.ReactNode
  /** Override default back navigation */
  onBack?: () => void
  className?: string
}

/**
 * Shared page header for authenticated screens.
 * Renders a back arrow, centered/left-aligned title, and optional right slot.
 */
export function AppPageHeader({
  title,
  rightSlot,
  onBack,
  className,
}: AppPageHeaderProps) {
  const navigate = useNavigate()

  const handleBack = onBack ?? (() => navigate(-1))

  return (
    <header
      className={cn(
        "mb-6 flex items-center justify-between",
        className,
      )}
    >
      <button
        onClick={handleBack}
        className="flex h-10 w-10 items-center justify-center rounded-full text-[#2F6B45] transition-colors hover:bg-[#DCF1E4]"
        aria-label="Voltar"
      >
        <ChevronLeft className="h-6 w-6" strokeWidth={2.2} />
      </button>

      <h1 className="text-lg font-extrabold text-[#1F2A24]">
        {title}
      </h1>

      <div className="flex h-10 w-10 items-center justify-center">
        {rightSlot ?? (
          <span className="inline-block w-6" /> /* spacer */
        )}
      </div>
    </header>
  )
}
