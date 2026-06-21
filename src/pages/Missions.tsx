import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Circle, Zap, Flame, BookOpen, Target, Heart, Gift, Sparkles } from "lucide-react";
import { AppBottomNav } from "@/components/AppBottomNav";
import { AppPageHeader } from "@/components/AppPageHeader";
import { cn } from "@/lib/utils";
import { scopedKey, USER_SCOPE_EVENT, getUserId } from "@/lib/userScope";
import { getLocalGems, saveLocalGems, GEMS_UPDATE_EVENT, getLocalXP, saveLocalXP, XP_UPDATE_EVENT } from "@/lib/xp";

const MISSIONS = [
  { id: "visit",  title: "Faça login hoje",             desc: "Mantenha sua sequência viva",   xp: 10, icon: Flame,    initial: true  },
  { id: "lesson", title: "Conclua 1 lição",             desc: "Pratique pelo menos 5 minutos", xp: 30, icon: BookOpen, initial: true  },
  { id: "skill",  title: "Favorite uma skill",          desc: "Explore o laboratório",         xp: 20, icon: Zap,      initial: false },
  { id: "quiz",   title: "Acerte 3 perguntas seguidas", desc: "Modo desafio relâmpago",        xp: 25, icon: Target,   initial: false },
  { id: "share",  title: "Favorite um prompt",          desc: "Salve para usar depois",        xp: 15, icon: Heart,    initial: false },
] as const;

const CHEST_THRESHOLD = 5;
const CHEST_REWARD_GEMS = 50;
const CHEST_REWARD_XP = 100;
const STORAGE_BASE = "promptlabz:dailyMissions";

const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};

const defaultState = () =>
  Object.fromEntries(MISSIONS.map((m) => [m.id, m.initial])) as Record<string, boolean>;

const readStored = () => {
  if (typeof window === "undefined") return { completed: defaultState(), chestOpened: false };
  try {
    const raw = window.localStorage.getItem(scopedKey(STORAGE_BASE));
    if (!raw) return { completed: defaultState(), chestOpened: false, day: todayKey() };
    const parsed = JSON.parse(raw) as { day: string; completed: Record<string, boolean>; chestOpened: boolean };
    if (parsed.day !== todayKey()) {
      return { completed: defaultState(), chestOpened: false, day: todayKey() };
    }
    return { completed: { ...defaultState(), ...parsed.completed }, chestOpened: !!parsed.chestOpened, day: parsed.day };
  } catch {
    return { completed: defaultState(), chestOpened: false, day: todayKey() };
  }
};

export default function MissionsPage() {
  const initial = readStored();
  const [completed, setCompleted] = useState<Record<string, boolean>>(initial.completed);
  const [chestOpened, setChestOpened] = useState(initial.chestOpened);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(
      scopedKey(STORAGE_BASE),
      JSON.stringify({ day: todayKey(), completed, chestOpened }),
    );
  }, [completed, chestOpened]);

  useEffect(() => {
    const interval = setInterval(() => {
      const stored = readStored();
      if (stored.day === todayKey()) return;
      setCompleted(defaultState());
      setChestOpened(false);
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onUserScope = () => {
      const stored = readStored();
      setCompleted(stored.completed);
      setChestOpened(stored.chestOpened);
    };
    window.addEventListener(USER_SCOPE_EVENT, onUserScope);
    return () => window.removeEventListener(USER_SCOPE_EVENT, onUserScope);
  }, []);

  const doneCount = MISSIONS.filter((m) => completed[m.id]).length;
  const chestUnlocked = doneCount >= CHEST_THRESHOLD;

  const toggle = (id: string) =>
    setCompleted((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleOpenChest = () => {
    const uid = getUserId();
    if (uid) {
      saveLocalGems(uid, getLocalGems(uid) + CHEST_REWARD_GEMS);
      window.dispatchEvent(new CustomEvent(GEMS_UPDATE_EVENT));
      saveLocalXP(uid, getLocalXP(uid) + CHEST_REWARD_XP);
      window.dispatchEvent(new CustomEvent(XP_UPDATE_EVENT));
    }
    setChestOpened(true);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-page-bg-light to-page-bg pb-24">
      <AppPageHeader
        title="Missões Diárias"
        subtitle={`Complete as ${MISSIONS.length} missões para ganhar +${CHEST_REWARD_XP} XP e +${CHEST_REWARD_GEMS} 💎`}
        back="/home"
      />

      <div className="mx-auto w-full max-w-lg px-4 py-4">
        <div
          className={cn(
            "mb-5 overflow-hidden rounded-2xl border-2 p-4 transition-colors",
            chestUnlocked
              ? "border-luxury bg-gradient-to-br from-luxury/20 to-luxury/5"
              : "border-stroke-light bg-card",
          )}
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
                chestUnlocked ? "bg-luxury text-luxury-foreground animate-pulse" : "bg-page-bg-light text-foreground-tertiary",
              )}
            >
              <Gift className="h-6 w-6" strokeWidth={2.4} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-extrabold text-foreground-dark">
                Baú diário {chestOpened ? "aberto!" : chestUnlocked ? "disponível" : "em progresso"}
              </p>
              <p className="text-[11px] text-foreground-tertiary">
                Conclua {CHEST_THRESHOLD} missões para ganhar +{CHEST_REWARD_XP} XP e +{CHEST_REWARD_GEMS} 💎
              </p>
            </div>
            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-600">
              {Math.min(doneCount, CHEST_THRESHOLD)}/{CHEST_THRESHOLD}
            </span>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-stroke-muted/40">
            <div
              className="h-full rounded-full bg-luxury transition-all"
              style={{ width: `${Math.min(100, (doneCount / CHEST_THRESHOLD) * 100)}%` }}
            />
          </div>
          {chestUnlocked && (
            <button
              onClick={handleOpenChest}
              disabled={chestOpened}
              className={cn(
                "mt-3 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition-colors",
                chestOpened
                  ? "bg-emerald/20 text-emerald-dark cursor-default"
                  : "bg-luxury text-luxury-foreground hover:brightness-105",
              )}
            >
              {chestOpened ? (
                <>
                  <Sparkles className="h-4 w-4" /> +{CHEST_REWARD_XP} XP e +{CHEST_REWARD_GEMS} 💎 coletados
                </>
              ) : (
                <>
                  <Gift className="h-4 w-4" /> Abrir baú
                </>
              )}
            </button>
          )}
        </div>

        <div className="flex flex-col gap-3">
          {MISSIONS.map((m) => {
            const Icon = m.icon;
            const isDone = completed[m.id];
            return (
              <button
                key={m.id}
                onClick={() => toggle(m.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl border-2 p-4 text-left transition-colors",
                  isDone
                    ? "border-emerald/40 bg-surface-success/60"
                    : "border-stroke-light bg-card hover:border-emerald/30",
                )}
              >
                <div
                  className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                    isDone ? "bg-emerald text-white" : "bg-page-bg-light text-forest",
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className={cn("text-sm font-bold", isDone ? "text-emerald-dark line-through decoration-2" : "text-foreground-dark")}>
                    {m.title}
                  </p>
                  <p className="text-[11px] text-foreground-tertiary">{m.desc}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-600">
                    +{m.xp} XP
                  </span>
                  {isDone ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald" />
                  ) : (
                    <Circle className="h-5 w-5 text-stroke-light" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <Link
          to="/home"
          className="mt-6 block text-center text-xs font-semibold text-foreground-tertiary hover:text-emerald"
        >
          Voltar ao início
        </Link>
      </div>

      <AppBottomNav />
    </div>
  );
}
