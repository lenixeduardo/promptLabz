import { Navigate, useLocation, useNavigate } from "react-router-dom"
import { Sparkles, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MascotGlow } from "@/components/MascotGlow"
import { useAuth } from "@/hooks/useAuth"
import { getLocalXP, getLevel } from "@/lib/xp"
import { getLevelTitle } from "@/lib/levelTitles"

const CONFETTI = [
  { color: "#7CC79A", x: "10%", delay: "0s",    dur: "3s",   size: 8,  rotate: 20  },
  { color: "#FFD166", x: "20%", delay: "0.3s",  dur: "3.5s", size: 6,  rotate: -30 },
  { color: "#A8EDCA", x: "35%", delay: "0.1s",  dur: "2.8s", size: 10, rotate: 45  },
  { color: "#3E8E5E", x: "55%", delay: "0.5s",  dur: "3.2s", size: 7,  rotate: -15 },
  { color: "#FFD166", x: "70%", delay: "0.2s",  dur: "3.7s", size: 5,  rotate: 60  },
  { color: "#7CC79A", x: "80%", delay: "0.4s",  dur: "2.6s", size: 9,  rotate: -45 },
  { color: "#E8F9EF", x: "90%", delay: "0.6s",  dur: "3.4s", size: 6,  rotate: 30  },
  { color: "#FFD166", x: "45%", delay: "0.15s", dur: "4s",   size: 8,  rotate: -20 },
  { color: "#3E8E5E", x: "62%", delay: "0.7s",  dur: "2.9s", size: 5,  rotate: 55  },
  { color: "#A8EDCA", x: "15%", delay: "0.45s", dur: "3.1s", size: 7,  rotate: -35 },
]

interface LevelUpState {
  newLevel: number
  prevLevel: number
}

const UNLOCK_ITEMS = [
  { icon: CheckCircle2, text: (level: number) => `Novos badges (${level} desbloqueados)` },
  { icon: CheckCircle2, text: () => "Novos exercícios" },
  { icon: CheckCircle2, text: () => "Desafios exclusivos" },
  { icon: CheckCircle2, text: () => "Funcionalidades exclusivas" },
]

export default function LevelUp() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  const state = location.state as LevelUpState | null

  if (!state) {
    const xp = user?.id ? getLocalXP(user.id) : 0
    const level = getLevel(xp)
    return (
      <Navigate
        to="/level-up"
        state={{ newLevel: level, prevLevel: level - 1 }}
        replace
      />
    )
  }

  const { newLevel } = state
  const levelTitle = getLevelTitle(newLevel)

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-between overflow-hidden bg-gradient-to-b from-white via-pageBgLight to-gradient-end px-6 py-10">
      {/* Confetti */}
      {CONFETTI.map((c, i) => (
        <span
          key={i}
          className="pointer-events-none absolute top-0"
          style={{
            left: c.x,
            width: c.size,
            height: c.size * 2.2,
            backgroundColor: c.color,
            borderRadius: 2,
            transform: `rotate(${c.rotate}deg)`,
            animation: `confettiFall ${c.dur} ${c.delay} ease-in infinite`,
            opacity: 0,
          }}
        />
      ))}

      {/* Decorative sparkles */}
      <Sparkles className="absolute left-6 top-24 h-5 w-5 animate-twinkle text-emerald/60" style={{ animationDelay: "0.3s" }} />
      <Sparkles className="absolute right-8 top-32 h-4 w-4 animate-twinkle text-[#7CC79A]"   style={{ animationDelay: "1s" }} />
      <Sparkles className="absolute left-12 top-60 h-3 w-3 animate-twinkle text-[#FFD166]"   style={{ animationDelay: "1.7s" }} />
      <Sparkles className="absolute right-6 top-72 h-5 w-5 animate-twinkle text-emerald/50" style={{ animationDelay: "0.6s" }} />

      <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
        {/* Header */}
        <h1 className="text-4xl font-extrabold leading-tight text-primary-dark">
          Novo Nível!
        </h1>

        {/* Mascot with glow */}
        <MascotGlow size={220}>
          <img
            src="/assets/mascot-promo.png"
            alt="Mascote celebrando novo nível"
            className="h-40 w-auto object-contain drop-shadow-lg"
          />
        </MascotGlow>

        {/* Congratulations label */}
        <p className="text-sm font-semibold text-foregroundMuted">Parabéns!</p>

        {/* Level badge */}
        <div className="flex flex-col items-center gap-2">
          <div
            className="flex h-20 w-20 flex-col items-center justify-center bg-primary-dark text-white"
            style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
          >
            <span className="text-[10px] font-semibold uppercase tracking-wide opacity-80">nível</span>
            <span className="text-3xl font-extrabold leading-none">{newLevel}</span>
          </div>
          <p className="text-xl font-bold text-foregroundDark">{levelTitle}</p>
        </div>

        {/* Unlocked items card */}
        <div className="w-full max-w-sm rounded-2xl border border-stroke-light bg-white px-5 py-4 text-left shadow-sm">
          <p className="mb-3 text-sm font-bold text-foregroundDark">O que foi desbloqueado:</p>
          <div className="flex flex-col gap-2.5">
            {UNLOCK_ITEMS.map(({ icon: Icon, text }, idx) => (
              <div key={idx} className="flex items-center gap-2.5">
                <Icon className="h-5 w-5 shrink-0 text-emerald" />
                <span className="text-sm text-foregroundDark">{text(newLevel)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA button */}
      <div className="w-full max-w-sm pt-4">
        <Button size="lg" className="w-full text-base" onClick={() => navigate("/home")}>
          Explorar novo nível →
        </Button>
      </div>
    </div>
  )
}
