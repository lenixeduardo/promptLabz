import * as Icons from "@/lib/icons"
import type { PremiumTrustItem } from "@/data/premiumData"

interface PremiumTrustBadgeProps {
  item: PremiumTrustItem
}

/**
 * Small trust badge row shown at the bottom of the premium screen.
 * Icon + label combo (e.g., shield + "Ambiente seguro").
 */
export function PremiumTrustBadge({ item }: PremiumTrustBadgeProps) {
  const IconComp = (Icons as unknown as Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>>)[
    item.icon
  ]

  return (
    <div className="flex items-center gap-1.5">
      {IconComp ? (
        <IconComp className="h-4 w-4 text-foregroundMuted" strokeWidth={2} />
      ) : (
        <Icons.Shield className="h-4 w-4 text-foregroundMuted" strokeWidth={2} />
      )}
      <span className="text-[11px] font-medium text-foregroundMuted">{item.label}</span>
    </div>
  )
}
