import * as Icons from "@/lib/icons"
import type { PremiumFeature } from "@/data/premiumData"

interface PremiumBenefitCardProps {
  feature: PremiumFeature
}

/**
 * A single benefit/feature item in the premium feature grid.
 * Renders an icon, title, and optional description.
 */
export function PremiumBenefitCard({ feature }: PremiumBenefitCardProps) {
  const IconComp = (Icons as unknown as Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>>)[
    feature.icon
  ]

  return (
    <div className="flex items-start gap-3 rounded-2xl border border-[#EAF2ED] bg-white px-4 py-3.5 shadow-sm">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EAF7EF]">
        {IconComp ? (
          <IconComp className="h-5 w-5 text-[#3E8E5E]" strokeWidth={2} />
        ) : (
          <Icons.Sparkles className="h-5 w-5 text-[#3E8E5E]" strokeWidth={2} />
        )}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-[#1F2A24]">{feature.title}</p>
        {feature.description && (
          <p className="text-xs text-[#6B7A70]">{feature.description}</p>
        )}
      </div>
    </div>
  )
}
