import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  Globe,
  Volume2,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  Map,
  Award,
  Sparkles,
} from "lucide-react";
import { AppBottomNav } from "@/components/AppBottomNav";
import { AppPageHeader } from "@/components/AppPageHeader";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { getReminderEnabled, setReminderEnabled } from "@/hooks/useInactiveReminder";
import { ReviewModal } from "@/components/ReviewModal";
import { BackTapSetupCard } from "@/components/BackTapSetupCard";
import { useAuth } from "@/hooks/useAuth";

const NOTIF_KEY = "promptlabz:settings:notif";
const SOUND_KEY = "promptlabz:settings:sound";

export default function SettingsPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [notif, setNotifState] = useState(() => localStorage.getItem(NOTIF_KEY) !== "false");
  const [sound, setSoundState] = useState(() => localStorage.getItem(SOUND_KEY) !== "false");
  const [reminders, setReminders] = useState(() => getReminderEnabled());
  const [loggingOut, setLoggingOut] = useState(false);

  function setNotif(value: boolean) {
    setNotifState(value);
    localStorage.setItem(NOTIF_KEY, String(value));
  }

  function setSound(value: boolean) {
    setSoundState(value);
    localStorage.setItem(SOUND_KEY, String(value));
  }

  async function handleLogout() {
    setLoggingOut(true);
    await logout();
    navigate("/login");
  }
  const [showReviewModal, setShowReviewModal] = useState(false);

  useEffect(() => {
    setReminderEnabled(reminders);
  }, [reminders]);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-page-bg-light to-page-bg pb-24">
      <AppPageHeader title="Configurações" back="/profile" />

      <div className="mx-auto w-full max-w-lg space-y-5 px-4 py-5">
        <section className="rounded-2xl border-2 border-stroke-light bg-card">
          <p className="px-4 pt-4 text-[11px] font-extrabold uppercase tracking-wider text-foreground-tertiary">
            Preferências
          </p>
          <div className="divide-y divide-stroke-muted">
            <div className="flex items-center gap-3 px-4 py-3">
              <Bell className="h-5 w-5 text-emerald" />
              <span className="flex-1 text-sm font-semibold text-foreground-dark">
                Notificações push
              </span>
              <Switch checked={notif} onCheckedChange={setNotif} />
            </div>
            <div className="flex items-center gap-3 px-4 py-3">
              <Volume2 className="h-5 w-5 text-emerald" />
              <span className="flex-1 text-sm font-semibold text-foreground-dark">
                Sons e efeitos
              </span>
              <Switch checked={sound} onCheckedChange={setSound} />
            </div>
            <div className="flex items-center gap-3 px-4 py-3">
              <Sparkles className="h-5 w-5 text-emerald" />
              <span className="flex-1 text-sm font-semibold text-foreground-dark">
                Lembrete diário (streak)
              </span>
              <Switch checked={reminders} onCheckedChange={setReminders} />
            </div>
            <div className="flex items-center gap-3 px-4 py-3">
              <Globe className="h-5 w-5 text-emerald" />
              <span className="flex-1 text-sm font-semibold text-foreground-dark">
                Idioma
              </span>
              <span className="text-xs font-semibold text-foreground-tertiary">
                Português (BR)
              </span>
            </div>
            <div className="flex items-center gap-3 px-4 py-3">
              <span className="flex-1 text-sm font-semibold text-foreground-dark">
                Tema
              </span>
              <ThemeToggle />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border-2 border-stroke-light bg-card">
          <p className="px-4 pt-4 text-[11px] font-extrabold uppercase tracking-wider text-foreground-tertiary">
            Conta
          </p>
          <div className="divide-y divide-stroke-muted">
            <Link
              to="/certificates"
              className="flex items-center gap-3 px-4 py-3 hover:bg-surface-soft"
            >
              <Award className="h-5 w-5 text-emerald" />
              <span className="flex-1 text-sm font-semibold text-foreground-dark">
                Meus certificados
              </span>
              <ChevronRight className="h-4 w-4 text-foreground-tertiary" />
            </Link>
            <Link
              to="/roadmap"
              className="flex items-center gap-3 px-4 py-3 hover:bg-surface-soft"
            >
              <Map className="h-5 w-5 text-emerald" />
              <span className="flex-1 text-sm font-semibold text-foreground-dark">
                Roadmap do produto
              </span>
              <ChevronRight className="h-4 w-4 text-foreground-tertiary" />
            </Link>
            <Link
              to="/premium"
              className="flex items-center gap-3 px-4 py-3 hover:bg-surface-soft"
            >
              <Shield className="h-5 w-5 text-luxury" />
              <span className="flex-1 text-sm font-semibold text-foreground-dark">
                Assinatura Premium
              </span>
              <ChevronRight className="h-4 w-4 text-foreground-tertiary" />
            </Link>
            <button className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-surface-soft">
              <HelpCircle className="h-5 w-5 text-emerald" />
              <span className="flex-1 text-sm font-semibold text-foreground-dark">
                Ajuda e suporte
              </span>
              <ChevronRight className="h-4 w-4 text-foreground-tertiary" />
            </button>
          </div>
        </section>

        <section>
          <p className="mb-3 px-1 text-[11px] font-extrabold uppercase tracking-wider text-foreground-tertiary">
            Acesso Rápido
          </p>
          <BackTapSetupCard />
        </section>

        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-red-500/30 bg-card py-3 text-sm font-bold text-red-500 hover:bg-red-500/5 disabled:opacity-60"
        >
          <LogOut className="h-4 w-4" /> {loggingOut ? "Saindo..." : "Sair da conta"}
        </button>

        <p className="text-center text-[11px] text-foreground-tertiary">
          PromptLabz · v0.3 MVP
        </p>

        {/* Review Section */}
        <div className="mx-auto w-full max-w-lg px-4 py-6">
          <section className="rounded-2xl border-2 border-stroke-light bg-card">
            <p className="px-4 pt-4 text-[11px] font-extrabold uppercase tracking-wider text-foreground-tertiary">
              Feedback
            </p>
            <div className="flex items-center gap-3 px-4 py-6">
              <Button
                variant="outline"
                onClick={() => setShowReviewModal(true)}
                className="w-full"
              >
                Avalie nosso projeto
              </Button>
            </div>
          </section>
        </div>

        {/* Review Modal */}
        <ReviewModal
          open={showReviewModal}
          onOpenChange={setShowReviewModal}
        />

      </div>

      <AppBottomNav />
    </div>
  );
}
