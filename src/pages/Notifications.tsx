import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Settings } from "lucide-react"
import { AppPageHeader } from "@/components/AppPageHeader"
import { PillTabs, type PillTabItem } from "@/components/PillTabs"
import { NotificationItem } from "@/components/notifications/NotificationItem"
import {
  NOTIFICATIONS_MOCK,
  getNotificationsCounts,
  filterNotifications,
  groupNotifications,
  type NotificationsFilter,
} from "@/data/notificationsData"
import { AppBottomNav } from "@/components/AppBottomNav"
import { sileo } from "sileo"

export default function Notifications() {
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState<NotificationsFilter>("all")

  // Dynamic counts derived from mock data
  const counts = useMemo(() => getNotificationsCounts(NOTIFICATIONS_MOCK), [])

  // Filtered + grouped notifications
  const filtered = useMemo(
    () => filterNotifications(NOTIFICATIONS_MOCK, activeFilter),
    [activeFilter],
  )
  const groups = useMemo(() => groupNotifications(filtered), [filtered])

  // Update filter tab counts
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
    <div className="min-h-screen bg-gradient-to-b from-[#EAF7EF] to-white px-4 py-6 pb-24">
      <div className="mx-auto w-full max-w-md">
        {/* Header */}
        <AppPageHeader
          title="Notificações"
          onBack={() => navigate("/home")}
          rightSlot={
            <button
              onClick={handleSettingsClick}
              className="flex h-10 w-10 items-center justify-center rounded-full text-[#2F6B45] transition-colors hover:bg-[#DCF1E4]"
              aria-label="Configurações"
            >
              <Settings className="h-5 w-5" strokeWidth={2.2} />
            </button>
          }
        />

        {/* Filter tabs */}
        <PillTabs
          items={filterItemsWithCounts}
          activeKey={activeFilter}
          onChange={(key) => setActiveFilter(key as NotificationsFilter)}
          className="mb-5"
          scrollable
        />

        {/* Notification groups */}
        {groups.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <img
              src="/assets/mascot-home.png"
              alt="Sem notificações"
              className="h-24 w-auto object-contain opacity-50"
              style={{ mixBlendMode: "multiply" }}
            />
            <p className="text-base font-semibold text-[#6B9E7E]">
              Nenhuma notificação
            </p>
            <p className="text-sm text-[#8AB89A]">
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
                <h2 className="mb-2.5 text-xs font-bold uppercase tracking-wider text-[#3E8E5E]">
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
