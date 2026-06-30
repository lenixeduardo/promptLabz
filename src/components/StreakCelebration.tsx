import { useEffect, useState } from "react";
import { Flame, X, PartyPopper } from "lucide-react";

interface StreakCelebrationProps {
  active: boolean;
  streak: number;
  avatarSrc: string;
  avatarName: string;
  onClose: () => void;
}

export function StreakCelebration({ active, streak, avatarSrc, avatarName, onClose }: StreakCelebrationProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (active) {
      setShow(true);
      const t = setTimeout(() => {
        setShow(false);
        onClose();
      }, 3500);
      return () => clearTimeout(t);
    }
  }, [active, onClose]);

  if (!active && !show) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in"
      onClick={() => { setShow(false); onClose(); }}
    >
      <div
        className="relative mx-4 flex flex-col items-center gap-3 rounded-3xl border-2 border-luxury/50 bg-gradient-to-br from-card to-surface-soft px-8 py-7 shadow-2xl animate-scale-in will-change-transform"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => { setShow(false); onClose(); }}
          className="absolute right-3 top-3 text-foreground-tertiary hover:text-foreground-dark"
          aria-label="Fechar"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative">
          <div className="absolute inset-0 -m-3 rounded-full bg-luxury/30 blur-xl animate-pulse" />
          <img
            src={avatarSrc}
            alt={avatarName}
            className="relative h-28 w-28 rounded-full border-4 border-luxury object-cover bg-card"
            style={{ animation: "bounce 0.9s ease-in-out infinite" }}
          />
          <div className="absolute -bottom-1 -right-1 flex h-10 w-10 items-center justify-center rounded-full border-2 border-card bg-gradient-to-br from-luxury to-brand-orange shadow-lg">
            <Flame className="h-5 w-5 text-white" fill="white" />
          </div>
        </div>

        <div className="text-center">
          <p className="text-xs font-extrabold uppercase tracking-wider text-luxury">Streak em chamas!</p>
          <p className="mt-1 text-3xl font-extrabold text-foreground-dark">{streak} dias</p>
          <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-foreground-tertiary">Continue assim, você está arrasando! <PartyPopper className="h-4 w-4 text-luxury" /></p>
        </div>
      </div>
    </div>
  );
}
