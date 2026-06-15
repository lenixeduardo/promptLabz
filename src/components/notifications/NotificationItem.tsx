import { useNavigate } from "react-router-dom"
import * as Icons from "@/lib/icons"
import { cn } from "@/lib/utils"
import type { AppNotification } from "@/data/notificationsData"

/**
 * Map notification type to an icon component name from the icon library.
 */
const NOTIFICATION_ICON_MAP: Record<string, string> = {
  achievement: "Award",
  mention: "MessageCircle",
  system: "Settings",
  reminder: "Bell",
}

interface NotificationItemProps {
  notification: AppNotification
}

/**
 * Single notification row.
 * Renders a type-based icon, title, description, relative timestamp,
 * and a green unread dot for new notifications.
 */
export function NotificationItem({ notification }: NotificationItemProps) {
  const navigate = useNavigate()
  const iconName = NOTIFICATION_ICON_MAP[notification.type] || "Bell"
  const IconComp = (Icons as unknown as Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>>)[iconName]

  const handleClick = () => {
    if (notification.href) {
      navigate(notification.href)
    }
  }

  return (
    <div
      onClick={handleClick}
      className={cn(
        "flex items-start gap-3 rounded-2xl border bg-white px-4 py-3.5 shadow-sm transition-all hover:bg-[#F0FAF3]",
        notification.href ? "cursor-pointer" : "",
        notification.unread ? "border-[#CDEAD8]" : "border-[#EAF2ED]",
      )}
    >
      {/* Icon */}
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EAF7EF]">
        {IconComp ? (
          <IconComp
            className="h-5 w-5 text-[#3E8E5E]"
            strokeWidth={2}
          />
        ) : (
          <Icons.Bell className="h-5 w-5 text-[#3E8E5E]" strokeWidth={2} />
        )}
      </span>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "text-sm leading-snug",
            notification.unread
              ? "font-bold text-[#1F2A24]"
              : "font-semibold text-[#3A4B40]",
          )}
        >
          {notification.title}
        </p>
        <p className="mt-0.5 text-xs leading-relaxed text-[#6B7A70]">
          {notification.description}
        </p>
        <p className="mt-1 text-[11px] font-medium text-[#8AB89A]">
          {formatRelativeTime(notification.createdAt)}
        </p>
      </div>

      {/* Unread dot */}
      {notification.unread && (
        <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#3E9A63] ring-2 ring-[#DCF1E4]" />
      )}
    </div>
  )
}

/**
 * Format an ISO date string into a human-readable relative time.
 */
function formatRelativeTime(isoDate: string): string {
  const now = Date.now()
  const then = new Date(isoDate).getTime()
  const diffMs = now - then

  const minutes = Math.floor(diffMs / 60000)
  const hours = Math.floor(diffMs / 3600000)
  const days = Math.floor(diffMs / 86400000)

  if (minutes < 1) return "agora mesmo"
  if (minutes < 60) return `há ${minutes}min`
  if (hours < 24) return `há ${hours}h`
  if (days < 7) return `há ${days}d`
  return new Date(isoDate).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  })
}
