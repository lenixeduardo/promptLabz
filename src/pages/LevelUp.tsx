import React from "react"
import { Navigate, useLocation, useNavigate } from "react-router-dom"
import { CheckCircle2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { getLocalXP, getLevel } from "@/lib/xp"
import { getLevelTitle } from "@/lib/levelTitles"

// ── Confetti rectangles ─────────────────────────────────────────────
// Negative delays start pieces mid-fall so confetti is visible immediately
const CONFETTI = [
  { color: "#4ADE80", x: "5%",  w: 8,  h: 20, rotate: 20,  delay: "-0.8s", dur: "3.2s" },
  { color: "#FCD34D", x: "14%", w: 6,  h: 16, rotate: -30, delay: "-2.1s", dur: "3.8s" },
  { color: "#86EFAC", x: "24%", w: 7,  h: 18, rotate: 45,  delay: "-1.4s", dur: "2.9s" },
  { color: "#FCD34D", x: "38%", w: 6,  h: 14, rotate: 15,  delay: "-0.5s", dur: "3.5s" },
  { color: "#4ADE80", x: "50%", w: 8,  h: 18, rotate: -20, delay: "-2.8s", dur: "4.0s" },
  { color: "#A8EDCA", x: "62%", w: 7,  h: 17, rotate: 55,  delay: "-1.8s", dur: "3.1s" },
  { color: "#FCD34D", x: "73%", w: 6,  h: 15, rotate: -40, delay: "-0.3s", dur: "3.6s" },
  { color: "#4ADE80", x: "83%", w: 9,  h: 21, rotate: 25,  delay: "-1.1s", dur: "2.7s" },
  { color: "#86EFAC", x: "91%", w: 7,  h: 16, rotate: -15, delay: "-2.5s", dur: "3.3s" },
  { color: "#FCD34D", x: "30%", w: 6,  h: 13, rotate: 60,  delay: "-0.7s", dur: "4.1s" },
  { color: "#4ADE80", x: "57%", w: 8,  h: 19, rotate: -50, delay: "-3.2s", dur: "3.0s" },
  { color: "#A8EDCA", x: "78%", w: 6,  h: 14, rotate: 30,  delay: "-1.6s", dur: "3.7s" },
  { color: "#FCD34D", x: "8%",  w: 7,  h: 16, rotate: -10, delay: "-2.3s", dur: "3.4s" },
  { color: "#4ADE80", x: "45%", w: 6,  h: 13, rotate: 35,  delay: "-0.9s", dur: "3.9s" },
  { color: "#86EFAC", x: "68%", w: 8,  h: 17, rotate: -25, delay: "-1.7s", dur: "2.8s" },
  { color: "#FCD34D", x: "88%", w: 5,  h: 12, rotate: 50,  delay: "-3.5s", dur: "4.2s" },
]

// ── Sparkle stars ──────────────────────────────────────────────────
const SPARKLES = [
  { x: "7%",  y: "22%", s: 18, delay: "0.3s",  c: "#FCD34D" },
  { x: "88%", y: "16%", s: 14, delay: "1.1s",  c: "#4ADE80" },
  { x: "16%", y: "42%", s: 20, delay: "0.7s",  c: "#FCD34D" },
  { x: "82%", y: "36%", s: 16, delay: "0.2s",  c: "#86EFAC" },
  { x: "4%",  y: "56%", s: 12, delay: "1.5s",  c: "#FCD34D" },
  { x: "94%", y: "50%", s: 18, delay: "0.9s",  c: "#4ADE80" },
  { x: "26%", y: "28%", s: 14, delay: "1.3s",  c: "#86EFAC" },
  { x: "74%", y: "60%", s: 16, delay: "0.4s",  c: "#FCD34D" },
]

// ── 4-point sparkle star SVG ────────────────────────────────────────
function Star({ x, y, s, delay, c }: typeof SPARKLES[0]) {
  return (
    <svg
      className="pointer-events-none absolute animate-twinkle"
      style={{ left: x, top: y, animationDelay: delay, width: s, height: s }}
      viewBox="0 0 24 24"
      fill={c}
    >
      <path d="M12 2L13.8 9.2L21 12L13.8 14.8L12 22L10.2 14.8L3 12L10.2 9.2L12 2Z" />
    </svg>
  )
}

// ── 3-tier 3D podium ───────────────────────────────────────────────
const TIERS = [
  { w: 104, topH: 10, sideH: 10, topC: "#D5F0E0", sideC: "#B8DCCA" },
  { w: 152, topH: 13, sideH: 13, topC: "#CCEADA", sideC: "#AACFBB" },
  { w: 200, topH: 16, sideH: 16, topC: "#C2E4D4", sideC: "#9EC2AE" },
]

function Podium() {
  return (
    <div className="flex flex-col items-center">
      {TIERS.map((t, i) => (
        <div key={i} className="flex flex-col items-center" style={{ marginTop: i === 0 ? 0 : -1 }}>
          {/* Top face — ellipse */}
          <div style={{
            width: t.w,
            height: t.topH,
            borderRadius: "50%",
            background: `radial-gradient(ellipse at 42% 30%, #EAF8F0, ${t.topC})`,
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          }} />
          {/* Side body */}
          <div style={{
            width: t.w,
            height: t.sideH,
            marginTop: -1,
            background: `linear-gradient(to bottom, ${t.topC}, ${t.sideC})`,
            borderRadius: `0 0 ${t.w / 2}px ${t.w / 2}px`,
          }} />
        </div>
      ))}
    </div>
  )
}

// ── Level hex badge with green border + glow ────────────────────────
function HexBadge({ level }: { level: number }) {
  const hexPath = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)"
  return (
    <div
      style={{
        filter:
          "drop-shadow(0 0 12px rgba(74,222,128,0.9)) drop-shadow(0 0 28px rgba(74,222,128,0.45))",
      }}
    >
      {/* Outer green hex = "border" */}
      <div
        style={{
          width: 100,
          height: 100,
          clipPath: hexPath,
          background: "#22C55E",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Inner dark hex = fill */}
        <div
          style={{
            width: "84%",
            height: "84%",
            clipPath: hexPath,
            background: "linear-gradient(160deg, #1A3D2B 0%, #0D2419 100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontSize: 8,
              fontWeight: 800,
              letterSpacing: "0.12em",
              color: "rgba(74,222,128,0.85)",
              textTransform: "uppercase",
              lineHeight: 1,
            }}
          >
            NÍVEL
          </span>
          <span
            style={{
              fontSize: 34,
              fontWeight: 900,
              color: "#fff",
              lineHeight: 1,
              marginTop: 1,
            }}
          >
            {level}
          </span>
        </div>
      </div>
    </div>
  )
}

// ── Ray burst (conic gradient, slowly spinning) ─────────────────────
const RAY_BG = (() => {
  const stops: string[] = []
  for (let i = 0; i < 18; i++) {
    const a = i * 20
    stops.push(`rgba(167,243,208,0.55) ${a}deg ${a + 8}deg`)
    stops.push(`transparent ${a + 8}deg ${a + 20}deg`)
  }
  return `conic-gradient(${stops.join(", ")})`
})()

// ── Unlock items ────────────────────────────────────────────────────
const UNLOCK_ITEMS = [
  (level: number) => `Novos badges (${level} desbloqueados)`,
  () => "Novos exercícios",
  () => "Desafios exclusivos",
  () => "Funcionalidades exclusivas",
]

interface LevelUpState {
  newLevel: number
  prevLevel: number
}

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
    <div
      className="relative flex min-h-screen flex-col overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #E4F5EC 0%, #EDF8F2 45%, #F3FBF6 100%)",
      }}
    >
      {/* ── Falling confetti ───────────────────────────────────────── */}
      {CONFETTI.map((c, i) => (
        <span
          key={i}
          className="pointer-events-none absolute top-0"
          style={{
            left: c.x,
            width: c.w,
            height: c.h,
            backgroundColor: c.color,
            borderRadius: 2,
            animation: `confettiFall ${c.dur} ${c.delay} ease-in infinite`,
            ['--r' as string]: `${c.rotate}deg`,
          } as React.CSSProperties}
        />
      ))}

      {/* ── Sparkle stars ─────────────────────────────────────────── */}
      {SPARKLES.map((s, i) => (
        <Star key={i} {...s} />
      ))}

      {/* ── Top bar ───────────────────────────────────────────────── */}
      <div
        className="animate-podium-rise flex items-center justify-between px-5 pt-8 pb-1"
        style={{ animationDelay: "0s" }}
      >
        <button
          onClick={() => navigate("/home")}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/60 bg-white/70 text-foregroundMuted shadow-sm backdrop-blur-sm transition-colors hover:bg-white"
          aria-label="Fechar"
        >
          <X className="h-4 w-4" />
        </button>
        <span className="text-xs font-bold text-foregroundMuted tracking-wide">
          Nível {newLevel}
        </span>
        <div className="w-9" />
      </div>

      {/* ── Title ─────────────────────────────────────────────────── */}
      <h1
        className="animate-podium-rise px-6 pt-1 text-center text-[2.6rem] font-extrabold leading-tight text-[#0D2B1A]"
        style={{ animationDelay: "0.06s" }}
      >
        Novo Nível!
      </h1>

      {/* ── Celebration zone ──────────────────────────────────────── */}
      <div className="relative flex flex-col items-center px-4 pt-2 pb-1">
        {/* Ray burst */}
        <div
          className="pointer-events-none absolute"
          style={{
            width: 300,
            height: 300,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -58%)",
            animation: "spin-cw 22s linear infinite",
            background: RAY_BG,
            maskImage:
              "radial-gradient(circle at 50% 50%, black 20%, transparent 70%)",
            WebkitMaskImage:
              "radial-gradient(circle at 50% 50%, black 20%, transparent 70%)",
            borderRadius: "50%",
          }}
        />

        {/* Mascot — floats above podium */}
        <div
          className="animate-mascot-celebrate relative z-10"
          style={{ marginBottom: -12 }}
        >
          <img
            src="/assets/mascot-levelup.jpg"
            alt="Mascote celebrando novo nível"
            className="h-48 w-auto object-contain"
            style={{ mixBlendMode: "multiply", display: "block" }}
          />
        </div>

        {/* Badge + Podium stacked */}
        <div
          className="animate-podium-rise relative z-10 flex flex-col items-center"
          style={{ animationDelay: "0.18s" }}
        >
          {/* Hex badge sits on top of podium */}
          <div
            className="animate-level-badge-pop relative z-10"
            style={{ animationDelay: "0.32s", marginBottom: -6 }}
          >
            <HexBadge level={newLevel} />
          </div>

          <Podium />
        </div>
      </div>

      {/* ── Text + Cards ──────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col gap-4 px-5 pt-3 pb-6">
        {/* Parabéns block */}
        <div
          className="animate-podium-rise text-center"
          style={{ animationDelay: "0.42s" }}
        >
          <p className="text-xl font-extrabold text-[#0D2B1A]">Parabéns!</p>
          <p className="mt-0.5 text-sm font-medium text-foregroundDark">
            Você alcançou o{" "}
            <span className="font-extrabold text-emerald">
              Nível {newLevel}
            </span>
          </p>
          {levelTitle && (
            <p className="text-xs font-semibold text-emerald/80">{levelTitle}</p>
          )}
          <p className="mt-1 text-xs text-foregroundMuted">
            Continue assim e desbloqueie recompensas incríveis!
          </p>
        </div>

        {/* Unlocked items card */}
        <div
          className="animate-podium-rise rounded-2xl border border-stroke-light bg-white px-5 py-4 shadow-sm"
          style={{ animationDelay: "0.52s" }}
        >
          <p className="mb-3 text-sm font-bold text-foregroundDark">
            O que foi desbloqueado:
          </p>
          <div className="flex flex-col gap-2.5">
            {UNLOCK_ITEMS.map((text, idx) => (
              <div
                key={idx}
                className="animate-unlock-slide-in flex items-center gap-2.5"
                style={{ animationDelay: `${0.62 + idx * 0.1}s` }}
              >
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald" />
                <span className="text-sm text-foregroundDark">
                  {text(newLevel)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div
          className="animate-podium-rise mt-auto"
          style={{ animationDelay: "1.05s" }}
        >
          <Button
            size="lg"
            className="w-full text-base font-bold tracking-wide"
            onClick={() => navigate("/home")}
          >
            EXPLORAR NOVO NÍVEL →
          </Button>
        </div>
      </div>
    </div>
  )
}
