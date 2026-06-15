import { cn } from "@/lib/utils"

export interface PillTabItem<T extends string = string> {
  key: T
  label: string
  /** Optional count badge shown next to the label */
  count?: number
}

interface PillTabsProps<T extends string = string> {
  items: PillTabItem<T>[]
  activeKey: T
  onChange: (key: T) => void
  className?: string
  /** If true, the container scrolls horizontally */
  scrollable?: boolean
  /** Size variant */
  size?: "sm" | "md"
}

/**
 * Reusable pill-shaped tab bar.
 *
 * Supports active/inactive states and optional count badges.
 * Used by Notifications (filter tabs) and Favorites (category tabs).
 */
export function PillTabs<T extends string = string>({
  items,
  activeKey,
  onChange,
  className,
  scrollable = false,
  size = "sm",
}: PillTabsProps<T>) {
  return (
    <div
      className={cn(
        "flex gap-2",
        scrollable && "no-scrollbar overflow-x-auto pb-1",
        className,
      )}
    >
      {items.map((item) => {
        const isActive = item.key === activeKey
        return (
          <button
            key={item.key}
            onClick={() => onChange(item.key)}
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-full border font-semibold transition-colors",
              size === "sm"
                ? "px-3.5 py-1.5 text-xs"
                : "px-5 py-2 text-sm",
              isActive
                ? "border-[#2B5D3A] bg-[#2B5D3A] text-white"
                : "border-[#BFE3CC] bg-white text-[#2B5D3A] hover:bg-[#EAF7EF]",
            )}
          >
            {item.label}
            {item.count !== undefined && (
              <span
                className={cn(
                  "ml-0.5 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1 text-[10px] font-bold leading-none",
                  isActive
                    ? "bg-white/30 text-white"
                    : "bg-[#EAF7EF] text-[#2B5D3A]",
                )}
              >
                {item.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
