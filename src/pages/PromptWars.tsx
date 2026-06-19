import { Link } from "react-router-dom";
import { Swords, Flame, Trophy, Users, Clock, Zap, Crown, ArrowRight } from "lucide-react";
import { AppBottomNav } from "@/components/AppBottomNav";
import { cn } from "@/lib/utils";

const LIVE_BATTLES = [
  { theme: "Resumir notícia em 3 linhas", players: 124, prize: 80, ends: "01:42" },
  { theme: "Persona: detetive noir", players: 76, prize: 60, ends: "04:18" },
  { theme: "Few-shot: classificar e-mails", players: 53, prize: 100, ends: "09:55" },
];

const TOP = [
  { name: "Luiza M.", wins: 248, badge: "👑" },
  { name: "Rafa P.", wins: 221, badge: "🥈" },
  { name: "Você", wins: 187, badge: "🥉", you: true },
  { name: "Caio T.", wins: 154 },
  { name: "Nina S.", wins: 142 },
];

export default function PromptWarsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-page-bg-light to-page-bg pb-24">
      <div className="sticky top-0 z-10 border-b border-stroke-muted bg-card px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Swords className="h-5 w-5 text-red-400" strokeWidth={2.4} />
            <div>
              <h1 className="text-base font-bold text-primary-dark">Prompt Wars</h1>
              <p className="text-[11px] text-foreground-tertiary">Duelos de prompts em tempo real</p>
            </div>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-red-500/15 px-3 py-1 text-xs font-bold text-red-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-400" /> AO VIVO
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-md flex-1 px-4 py-5 flex flex-col gap-5">
        <div className="relative overflow-hidden rounded-2xl border-2 border-red-500/40 bg-gradient-to-br from-red-500/20 via-card to-card p-5 shadow-lg shadow-red-500/10">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-red-500/20 blur-2xl" />
          <div className="relative">
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-red-400" />
              <p className="text-[11px] font-bold uppercase tracking-wider text-red-400">
                Duelo da semana
              </p>
            </div>
            <h2 className="mt-2 text-xl font-extrabold leading-tight text-foreground-dark">
              Crie o melhor prompt para gerar um logo minimalista
            </h2>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="rounded-lg bg-card/60 backdrop-blur px-2 py-2 text-center">
                <Users className="mx-auto h-4 w-4 text-emerald" />
                <p className="mt-1 text-sm font-extrabold text-foreground-dark">312</p>
                <p className="text-[9px] text-foreground-tertiary">guerreiros</p>
              </div>
              <div className="rounded-lg bg-card/60 backdrop-blur px-2 py-2 text-center">
                <Clock className="mx-auto h-4 w-4 text-luxury" />
                <p className="mt-1 text-sm font-extrabold text-foreground-dark">12:48</p>
                <p className="text-[9px] text-foreground-tertiary">restantes</p>
              </div>
              <div className="rounded-lg bg-card/60 backdrop-blur px-2 py-2 text-center">
                <Trophy className="mx-auto h-4 w-4 text-luxury fill-luxury/30" />
                <p className="mt-1 text-sm font-extrabold text-foreground-dark">250</p>
                <p className="text-[9px] text-foreground-tertiary">XP + 💎</p>
              </div>
            </div>
            <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 py-3 text-sm font-bold text-white hover:bg-red-600 transition-colors">
              Entrar no duelo
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground-dark">Batalhas ao vivo</h2>
            <span className="text-xs font-semibold text-emerald">{LIVE_BATTLES.length} abertas</span>
          </div>
          <div className="flex flex-col gap-2.5">
            {LIVE_BATTLES.map((b, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-2xl border-2 border-stroke-light bg-card p-4"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-500/15 text-red-400">
                  <Zap className="h-5 w-5" strokeWidth={2.4} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-foreground-dark">{b.theme}</p>
                  <div className="mt-0.5 flex items-center gap-3 text-[11px] text-foreground-tertiary">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" /> {b.players}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {b.ends}
                    </span>
                    <span className="flex items-center gap-1 text-luxury">
                      <Trophy className="h-3 w-3" /> {b.prize} XP
                    </span>
                  </div>
                </div>
                <button className="rounded-lg bg-emerald px-3 py-2 text-xs font-bold text-white hover:bg-emerald-dark">
                  Entrar
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border-2 border-stroke-light bg-card p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className="h-4 w-4 text-luxury" />
              <h2 className="text-base font-bold text-foreground-dark">Top duelistas</h2>
            </div>
            <Link to="/ranking" className="text-xs font-semibold text-emerald">
              Ver tudo
            </Link>
          </div>
          <ol className="flex flex-col gap-2">
            {TOP.map((p, i) => (
              <li
                key={i}
                className={cn(
                  "flex items-center justify-between rounded-xl border px-3 py-2.5",
                  p.you
                    ? "border-emerald bg-emerald/10"
                    : "border-stroke-muted bg-surface-soft",
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 text-center text-sm font-extrabold text-foreground-tertiary">
                    #{i + 1}
                  </span>
                  <span className="text-lg">{p.badge ?? "🎯"}</span>
                  <span
                    className={cn(
                      "text-sm font-bold",
                      p.you ? "text-emerald" : "text-foreground-dark",
                    )}
                  >
                    {p.name}
                  </span>
                </div>
                <span className="text-xs font-semibold text-foreground-tertiary">
                  {p.wins} vitórias
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <AppBottomNav />
    </div>
  );
}
