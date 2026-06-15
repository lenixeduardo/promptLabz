import { cn } from "@/lib/utils"
import type { PremiumPlan } from "@/data/premiumData"

interface PremiumPlanCardProps {
  plan: PremiumPlan
  selected: boolean
  onSelect: () => void
}

/**
 * Pricing plan card with radio-style selection.
 * Highlights the selected plan with a green border + ring.
 * Shows an optional "Mais escolhido" badge for the yearly plan.
 */
export function PremiumPlanCard({ plan, selected, onSelect }: PremiumPlanCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "relative w-full rounded-2xl border bg-white px-5 py-4 text-left shadow-sm transition-all",
        selected
          ? "border-[#2B5D3A] ring-2 ring-[#DCF1E4]"
          : "border-[#CDEAD8] hover:border-[#8AB89A]",
      )}
    >
      {/* Badge */}
      {plan.badge && (
        <span className="absolute -top-2.5 right-4 rounded-full bg-gradient-to-r from-[#3E8E5E] to-[#2E7048] px-3 py-0.5 text-[10px] font-bold text-white shadow-sm">
          {plan.badge}
        </span>
      )}

      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-bold text-[#1F2A24]">{plan.title}</p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-[#1F2A24]">
              {plan.monthlyPrice}
            </span>
            <span className="text-xs font-medium text-[#6B7A70]">/mês</span>
          </div>
          {plan.oldPrice && (
            <p className="text-xs text-[#8AB89A] line-through">{plan.oldPrice}/mês</p>
          )}
        </div>

        {/* Radio circle */}
        <span
          className={cn(
            "mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all",
            selected
              ? "border-[#2B5D3A] bg-[#2B5D3A]"
              : "border-[#BFE3CC]",
          )}
        >
          {selected && (
            <span className="h-2.5 w-2.5 rounded-full bg-white" />
          )}
        </span>
      </div>

      <p className="mt-2 text-[11px] font-medium text-[#6B7A70]">
        {plan.description}
      </p>
    </button>
  )
}
