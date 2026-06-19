import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bell, Heart, CalendarCheck, Award, Star, Gift, Settings } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { getNotifications, markNotificationsRead } from "@/lib/db";

type Notif = {
  id: number;
  icon: typeof Bell;
  iconBg: string;
  iconColor: string;
  title: string;
  desc: string;
  time: string;
  unread: boolean;
};

const NOTIFS: Notif[] = [
  {
    id: 1, icon: Heart, iconBg: "bg-rose-100", iconColor: "text-rose-500",
    title: "Corações recuperados! ❤️", desc: "Seus 3 corações foram recarregados.",
    time: "Agora", unread: true,
  },
  {
    id: 2, icon: CalendarCheck, iconBg: "bg-emerald-100", iconColor: "text-emerald-600",
    title: "Lembrete diário", desc: "Que tal uma dose de conhecimento hoje? Continue sua sequência!",
    time: "2h", unread: true,
  },
  {
    id: 3, icon: Award, iconBg: "bg-emerald-100", iconColor: "text-emerald-700",
    title: "Parabéns! 🎉", desc: "Você alcançou o nível 24. Continue evoluindo!",
    time: "5h", unread: true,
  },
  {
    id: 4, icon: Star, iconBg: "bg-amber-100", iconColor: "text-amber-500",
    title: "Quase lá! 🔥", desc: "Falta apenas 1 missão para o baú de missões diárias!",
    time: "8h", unread: true,
  },
  {
    id: 5, icon: Gift, iconBg: "bg-violet-100", iconColor: "text-violet-600",
    title: "Baú de missões disponível! 🎁", desc: "Seu baú de missões diárias está pronto para ser resgatado!",
    time: "10h", unread: true,
  },
];

export function NotificationsBell() {
  const [items, setItems] = useState(NOTIFS);
  const unreadCount = items.filter((i) => i.unread).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative" aria-label="Notificações">
          <Bell className="h-6 w-6 text-primary-dark" strokeWidth={2} />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={10}
        className="w-[340px] rounded-2xl border border-stroke-light bg-card p-0 shadow-xl"
      >
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <h3 className="text-base font-extrabold text-primary-dark">Notificações</h3>
          <button
            onClick={() => setItems((prev) => prev.map((i) => ({ ...i, unread: false })))}
            className="text-xs font-bold text-emerald hover:text-emerald-dark"
          >
            Marcar todas como lidas
          </button>
        </div>

        <div className="max-h-[380px] overflow-y-auto px-3 pb-2">
          {items.length === 0 ? (
            <div className="px-2 py-8 text-center">
              <Bell className="mx-auto h-8 w-8 text-stroke-light" />
              <p className="mt-2 text-sm text-foreground-tertiary">Sem notificações.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2 py-1">
              {items.map((n) => {
                const Icon = n.icon;
                return (
                  <div
                    key={n.id}
                    className={cn(
                      "flex items-start gap-3 rounded-xl p-2.5 transition-colors",
                      n.unread ? "bg-surface-soft/60" : "bg-card",
                    )}
                  >
                    <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", n.iconBg)}>
                      <Icon className={cn("h-5 w-5", n.iconColor)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-foreground-dark leading-tight">{n.title}</p>
                      <p className="mt-0.5 text-xs text-foreground-tertiary leading-snug">{n.desc}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 pt-0.5">
                      <span className="text-[10px] text-foreground-placeholder">{n.time}</span>
                      {n.unread && <span className="h-2 w-2 rounded-full bg-emerald" />}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <Link
          to="/notifications"
          className="flex items-center justify-center gap-2 border-t border-stroke-muted px-4 py-3 text-sm font-bold text-emerald hover:bg-surface-soft/50 rounded-b-2xl"
        >
          <Settings className="h-4 w-4" />
          Ver todas as notificações
        </Link>
      </PopoverContent>
    </Popover>
  );
}
