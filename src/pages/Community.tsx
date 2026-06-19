import { useState } from "react";
import { Heart, MessageCircle, Share2, Users, Flame, Trophy } from "lucide-react";
import { AppBottomNav } from "@/components/AppBottomNav";
import { AppPageHeader } from "@/components/AppPageHeader";

type Tab = "feed" | "desafios" | "grupos";

const POSTS = [
  {
    user: "Massomtimz",
    avatar: "🐱",
    badge: "Lendário",
    time: "2h",
    text: "Descobri que pedir para o modelo 'pensar passo a passo antes de responder' aumenta MUITO a qualidade em problemas de lógica.",
    likes: 124,
    comments: 18,
    tag: "#dica",
  },
  {
    user: "Allertia182",
    avatar: "🦊",
    badge: "Prata",
    time: "5h",
    text: "Meu template favorito para reescrever e-mails ficou top — quem quer? Compartilho lá no Lab.",
    likes: 87,
    comments: 32,
    tag: "#template",
  },
  {
    user: "Promptla33",
    avatar: "🐉",
    badge: "Ouro",
    time: "1d",
    text: "Sequência de 30 dias 🔥 quem aceita o desafio comigo?",
    likes: 201,
    comments: 44,
    tag: "#streak",
  },
];

const CHALLENGES = [
  { title: "Prompt do Dia: persona de chef", reward: 50, deadline: "8h restantes" },
  { title: "Semana de Streak coletivo", reward: 200, deadline: "3 dias" },
];

const GROUPS = [
  { name: "Iniciantes BR", members: 1240, icon: "🌱" },
  { name: "Marketing com IA", members: 890, icon: "📈" },
  { name: "Devs & Code Prompts", members: 612, icon: "💻" },
];

export default function CommunityPage() {
  const [tab, setTab] = useState<Tab>("feed");

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-page-bg-light to-page-bg pb-24">
      <AppPageHeader
        title="Comunidade"
        subtitle="Conecte-se com outros exploradores"
        back="/home"
      />

      <div className="mx-auto w-full max-w-lg px-4 py-4 space-y-4">
        <div className="flex gap-2 rounded-2xl border border-stroke-light bg-card p-1">
          {(["feed", "desafios", "grupos"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 rounded-xl px-3 py-2 text-xs font-bold capitalize transition-colors ${
                tab === t
                  ? "bg-emerald text-white"
                  : "text-foreground-tertiary hover:text-forest"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "feed" && (
          <div className="space-y-3">
            {POSTS.map((p) => (
              <article
                key={p.user + p.time}
                className="rounded-2xl border-2 border-stroke-light bg-card p-4"
              >
                <header className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-success text-xl">
                    {p.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-foreground-dark">{p.user}</p>
                      <span className="rounded-full bg-luxury/20 px-2 py-0.5 text-[9px] font-extrabold uppercase text-luxury">
                        {p.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-foreground-tertiary">{p.time} · {p.tag}</p>
                  </div>
                </header>
                <p className="mt-3 text-sm text-foreground-secondary leading-relaxed">
                  {p.text}
                </p>
                <footer className="mt-3 flex items-center gap-4 text-xs text-foreground-tertiary">
                  <button className="inline-flex items-center gap-1 hover:text-red-500">
                    <Heart className="h-4 w-4" /> {p.likes}
                  </button>
                  <button className="inline-flex items-center gap-1 hover:text-emerald">
                    <MessageCircle className="h-4 w-4" /> {p.comments}
                  </button>
                  <button className="inline-flex items-center gap-1 hover:text-forest">
                    <Share2 className="h-4 w-4" />
                  </button>
                </footer>
              </article>
            ))}
          </div>
        )}

        {tab === "desafios" && (
          <div className="space-y-3">
            {CHALLENGES.map((c) => (
              <div
                key={c.title}
                className="flex items-center gap-3 rounded-2xl border-2 border-stroke-light bg-card p-4"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-luxury/20 text-luxury">
                  <Flame className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-foreground-dark">{c.title}</p>
                  <p className="text-[11px] text-foreground-tertiary">{c.deadline}</p>
                </div>
                <span className="rounded-full bg-surface-success px-3 py-1 text-xs font-bold text-emerald">
                  +{c.reward} XP
                </span>
              </div>
            ))}
          </div>
        )}

        {tab === "grupos" && (
          <div className="space-y-3">
            {GROUPS.map((g) => (
              <div
                key={g.name}
                className="flex items-center gap-3 rounded-2xl border-2 border-stroke-light bg-card p-4"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-success text-2xl">
                  {g.icon}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-foreground-dark">{g.name}</p>
                  <p className="inline-flex items-center gap-1 text-[11px] text-foreground-tertiary">
                    <Users className="h-3 w-3" /> {g.members.toLocaleString("pt-BR")} membros
                  </p>
                </div>
                <button className="rounded-xl bg-emerald px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-dark">
                  Entrar
                </button>
              </div>
            ))}
            <div className="flex items-center gap-2 rounded-2xl border-2 border-dashed border-stroke-light bg-card/50 p-4 text-xs text-foreground-tertiary">
              <Trophy className="h-4 w-4 text-luxury" />
              Em breve: ranking semanal por grupo.
            </div>
          </div>
        )}
      </div>

      <AppBottomNav />
    </div>
  );
}
