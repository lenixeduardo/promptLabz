import { cn } from "@/lib/utils"

interface BrandLogoProps {
  className?: string
}

/** Two-tone "PromptLabz" wordmark: "Prompt" dark forest green, "Lab" light mint-green. */
export function BrandLogo({ className }: BrandLogoProps) {
  return (
    <span className={cn("font-extrabold tracking-tight", className)}>
      <span className="text-forest">Prompt</span>
      <span className="text-[#7CC79A]">Lab</span>
      <span className="text-forest">z</span>
    </span>
  )
}

