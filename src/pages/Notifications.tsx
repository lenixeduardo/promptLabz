import { useMemo, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Settings } from "lucide-react"
import { AppPageHeader } from "@/components/AppPageHeader"
import { PillTabs, type PillTabItem } from "@/components/PillTabs"
import { NotificationItem } from "@/components/notifications/NotificationItem"
import {
  getNotificationsCounts,
  filterNotifications,
  groupNotifications,
  type NotificationsFilter,
  type AppNotification,
} from "@/data/notificationsData"
import { getNotifications, markNotificationsRead, type DbNotification } from "@/lib/db"
import { useAuth } from "@/hooks/useAuth"
import { AppBottomNav } from "@/components/AppBottomNav"
import { sileo } from "sileo"

function mapDbToLocal(row: DbNotification): AppNotification {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    description: row.description,
    createdAt: row.created_at,
    unread: row.read_at === null,
    mention: row.mention,
    actionLabel: row.action_label ?? undefined,
    href: row.href ?? undefined,
  }
}

export default function Notifications() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [activeFilter, setActiveFilter] = useState<NotificationsFilter>("all")
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) {
      setLoading(false)
      return
    }

    getNotifications(user.id).then(({ data }) => {
      setNotifications(data ? data.map(mapDbToLocal) : [])
      setLoading(false)
      if (data && data.some((n) => n.read_at === null)) {
        markNotificationsRead(user.id!)
      }
    })
  }, [user?.id])

  const counts = useMemo(() => getNotificationsCounts(notifications), [notifications])
  const filtered = useMemo(
    () => filterNotifications(notifications, activeFilter),
    [notifications, activeFilter],
  )
  const groups = useMemo(() => groupNotifications(filtered), [filtered])

  const filterItemsWithCounts: PillTabItem<NotificationsFilter>[] = [
    { key: "all", label: "Todas", count: counts.all },
    { key: "unread", label: "Não lidas", count: counts.unread },
    { key: "mentions", label: "Mentions", count: counts.mentions },
  ]

  const handleSettingsClick = () => {
    sileo.info({
      title: "Configurações de notificações",
      description: "Em breve você poderá personalizar suas notificações.",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pageBgLight to-white px-4 py-6 pb-24">
      <div className="mx-auto w-full max-w-md">
        <AppPageHeader
          title="Notificações"
          onBack={() => navigate("/home")}
          rightSlot={
            <button
              onClick={handleSettingsClick}
              className="flex h-10 w-10 items-center justify-center rounded-full text-forest transition-colors hover:bg-surface-success"
              aria-label="Configurações"
            >
              <Settings className="h-5 w-5" strokeWidth={2.2} />
            </button>
          }
        />

        <PillTabs
          items={filterItemsWithCounts}
          activeKey={activeFilter}
          onChange={(key) => setActiveFilter(key as NotificationsFilter)}
          className="mb-5"
          scrollable
        />

        {loading ? (
          <div className="flex flex-col gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-2xl bg-stroke-muted/30" />
            ))}
          </div>
        ) : groups.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <img
              src="/assets/mascot-home.png"
              alt="Sem notificações"
              className="h-24 w-auto object-contain opacity-50"
              style={{ mixBlendMode: "multiply" }}
            />
            <p className="text-base font-semibold text-foregroundMuted">
              Nenhuma notificação
            </p>
            <p className="text-sm text-foregroundMuted">
              {activeFilter === "unread"
                ? "Você já leu todas as notificações! 🎉"
                : activeFilter === "mentions"
                  ? "Ninguém mencionou você ainda."
                  : "Você está em dia!"}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {groups.map((group) => (
              <section key={group.label}>
                <h2 className="mb-2.5 text-xs font-bold uppercase tracking-wider text-emerald">
                  {group.label}
                </h2>
                <div className="flex flex-col gap-2">
                  {group.items.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

      <AppBottomNav />
    </div>
  )
}
