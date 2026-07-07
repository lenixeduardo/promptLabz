import { Link } from "react-router-dom";
import { Check, Lock, Sparkles, Trophy } from "lucide-react";

export interface TrailPathModule {
  label: string;
  status: "completed" | "current" | "locked";
}

interface TrailPathProps {
  trail: TrailPathModule[];
  trackLabel: string;
  completedCount: number;
  totalCount: number;
  missionsDone: number;
  missionsTotal: number;
  missionsPct: number;
}

export function TrailPath({
  trail,
  trackLabel,
  completedCount,
  totalCount,
  missionsDone,
  missionsTotal,
  missionsPct,
}: TrailPathProps) {
  const spineFillPct =
    trail.length > 1
      ? (Math.min(completedCount, trail.length - 1) / (trail.length - 1)) * 100
      : 0;

  return (
    <div className="rounded-2xl border-2 border-stroke-light bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-foreground-dark">Sua trilha</h2>
          <p className="text-[11px] text-foreground-tertiary">Trilha {trackLabel} em andamento</p>
        </div>
        <span className="text-xs font-semibold text-emerald">
          {completedCount} / {totalCount} módulos
        </span>
      </div>

      <div className="relative pl-2">
        {/* Dotted spine behind the nodes */}
        <div className="absolute left-[23px] top-6 bottom-6 w-0 border-l-2 border-dashed border-stroke-light" />
        <div
          className="absolute left-[23px] top-6 w-0 border-l-2 border-dashed border-duo-green transition-all duration-500"
          style={{ height: `${spineFillPct}%` }}
        />

        <ol className="relative space-y-4">
          {trail.map((m, i) => (
            <li key={i}>
              {m.status === "current" && (
                <div className="flex items-center gap-2 mb-2 pl-1">
                  <img
                    src="/assets/mascot-trail-guide.png"
                    alt=""
                    className="h-10 w-10 shrink-0 rounded-full object-cover object-top animate-mascot-float"
                  />
                  <span className="rounded-full bg-duo-green/15 px-2 py-1 text-[10px] font-bold text-forest">
                    Você está aqui!
                  </span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <div
                  className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
                    m.status === "completed"
                      ? "bg-duo-green text-white shadow-[0_4px_0_0_var(--duo-green-press)]"
                      : m.status === "current"
                        ? "bg-card text-duo-green shadow-[0_4px_0_0_var(--stroke-light)] ring-2 ring-duo-green"
                        : "bg-surface-soft text-neutral shadow-[0_4px_0_0_var(--stroke-muted)]"
                  }`}
                >
                  {m.status === "current" && (
                    <span className="absolute inset-0 rounded-full bg-duo-green/30 animate-ping-slow" />
                  )}
                  {m.status === "completed" ? (
                    <Check className="h-5 w-5" strokeWidth={3} />
                  ) : m.status === "current" ? (
                    <Sparkles className="h-5 w-5" strokeWidth={2.5} />
                  ) : (
                    <Lock className="h-4 w-4" />
                  )}
                </div>
                <span
                  className={`text-sm font-semibold ${
                    m.status === "locked" ? "text-neutral" : "text-foreground-dark"
                  }`}
                >
                  {m.label}
                </span>
              </div>
            </li>
          ))}

          <li className="pt-1">
            <Link
              to="/missions"
              className="flex items-center gap-3 rounded-xl border-2 border-luxury/40 bg-gradient-to-br from-luxury/15 to-luxury/5 p-2.5 transition-transform active:scale-[0.99]"
            >
              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-luxury to-amber-500 text-luxury-foreground shadow-[0_4px_0_0_theme(colors.amber.600)]">
                <span className="absolute inset-0 -z-10 rounded-full bg-luxury/50 blur-md" />
                <Trophy className="h-5 w-5" strokeWidth={2.4} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-extrabold text-foreground-dark">Baú de Missões</p>
                  <span className="text-[10px] font-bold text-luxury">
                    {Math.min(missionsDone, missionsTotal)}/{missionsTotal}
                  </span>
                </div>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-stroke-muted/40">
                  <div
                    className="h-full rounded-full bg-luxury transition-all"
                    style={{ width: `${missionsPct}%` }}
                  />
                </div>
                <p className="mt-1 text-[10px] text-foreground-tertiary">
                  Complete {missionsTotal} missões diárias para abrir
                </p>
              </div>
            </Link>
          </li>
        </ol>
      </div>
    </div>
  );
}
