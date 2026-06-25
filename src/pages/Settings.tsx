import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  ChevronRight,
  ExternalLink,
  Link as LinkIcon,
  Settings as SettingsIcon,
  Hand,
  Star,
  Heart,
  Smartphone,
} from "lucide-react";
import { AppBottomNav } from "@/components/AppBottomNav";
import { AppPageHeader } from "@/components/AppPageHeader";
import { ReviewModal } from "@/components/ReviewModal";
import { useAuth } from "@/hooks/useAuth";

const BACK_TAP_STEPS = [
  {
    icon: <LinkIcon className="h-5 w-5 text-emerald" strokeWidth={2.5} />,
    text: "Abra o app Atalhos no iPhone",
  },
  {
    icon: <LinkIcon className="h-5 w-5 text-emerald" strokeWidth={2.5} />,
    text: "Novo atalho → Abrir URL → https://promptlabz.com/?action=enhance",
  },
  {
    icon: <SettingsIcon className="h-5 w-5 text-emerald" strokeWidth={2.5} />,
    text: "Ajustes → Acessibilidade → Toque",
  },
  {
    icon: <Hand className="h-5 w-5 text-emerald" strokeWidth={2.5} />,
    text: "Back Tap → Toque Duplo → seu atalho",
  },
];

export default function SettingsPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    await logout();
    navigate("/login");
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-page-bg-light to-page-bg pb-24">
      <AppPageHeader
        title="Configurações"
        back="/profile"
        right={
          <img
            src="/assets/mascot-settings.png"
            alt=""
            aria-hidden="true"
            className="h-14 w-14 object-contain"
          />
        }
      />

      <div className="mx-auto w-full max-w-lg space-y-4 px-4 py-5">
        {/* ACESSO RÁPIDO */}
        <section>
          <p className="mb-3 text-[11px] font-extrabold uppercase tracking-wider text-emerald">
            Acesso Rápido
          </p>

          <div className="rounded-2xl border-2 border-stroke-light bg-card">
            {/* Back Tap header card */}
            <button className="flex w-full items-center gap-3 px-4 py-4 text-left">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-surface-soft">
                <Smartphone className="h-5 w-5 text-foreground-dark" strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground-dark">Configurar Back Tap</p>
                <p className="mt-0.5 text-xs leading-relaxed text-foreground-muted">
                  Ative o aprimoramento rápido com 2 toques na parte traseira do iPhone
                </p>
              </div>
              <ChevronRight className="h-4 w-4 flex-shrink-0 text-foreground-tertiary" />
            </button>

            {/* Steps list */}
            <div className="space-y-3 border-t border-stroke-muted px-4 py-4">
              {BACK_TAP_STEPS.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald text-[11px] font-extrabold text-white">
                    {i + 1}
                  </div>
                  <p className="flex-1 pt-0.5 text-xs leading-relaxed text-foreground-dark">
                    {step.text}
                  </p>
                  <div className="flex-shrink-0 pt-0.5">{step.icon}</div>
                </div>
              ))}
            </div>

            {/* Open Settings button */}
            <div className="px-4 pb-4">
              <button
                onClick={() => window.open("App-prefs:", "_blank")}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-emerald py-3 text-sm font-bold text-emerald hover:bg-surface-success transition-colors"
              >
                Abrir Ajustes
                <ExternalLink className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>

        {/* Sign out */}
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-red-500/30 bg-card py-3 text-sm font-bold text-red-500 transition-colors hover:bg-red-500/5 disabled:opacity-60"
        >
          <LogOut className="h-4 w-4" />
          {loggingOut ? "Saindo..." : "Sair da conta"}
        </button>

        <p className="text-center text-[11px] text-foreground-tertiary">
          PromptLabz · v0.3 MVP
        </p>

        {/* FEEDBACK */}
        <section>
          <p className="mb-3 text-[11px] font-extrabold uppercase tracking-wider text-foreground-tertiary">
            Feedback
          </p>
          <button
            onClick={() => setShowReviewModal(true)}
            className="flex w-full items-center gap-3 rounded-2xl bg-emerald px-4 py-4 text-left transition-opacity hover:opacity-90 active:opacity-75"
          >
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white/20">
              <Heart className="h-5 w-5 text-red-300" fill="currentColor" strokeWidth={0} />
            </div>
            <span className="flex-1 text-sm font-extrabold uppercase tracking-wide text-white">
              Avalie nosso projeto
            </span>
            <Star className="h-5 w-5 flex-shrink-0 text-luxury" fill="currentColor" strokeWidth={0} />
          </button>
        </section>

        <ReviewModal open={showReviewModal} onOpenChange={setShowReviewModal} />
      </div>

      <AppBottomNav />
    </div>
  );
}
