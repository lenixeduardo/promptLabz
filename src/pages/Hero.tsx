import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BrandLogo } from "@/components/BrandLogo"
import { CircleTransition } from "@/components/CircleTransition"
import { PageSEO } from "@/components/PageSEO"
import { capture } from "@/lib/analytics"

const HAS_ACCOUNT_KEY = "promptlabz:hasAccount"

function FireIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <ellipse cx="32" cy="52" rx="22" ry="10" fill="#FF4500" opacity="0.15" />
      <path
        d="M32 6C32 6 20 20 20 34C20 41.2 25.6 47 32 47C38.4 47 44 41.2 44 34C44 20 32 6 32 6Z"
        fill="#FF4500"
        stroke="#CC2200"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M32 14C32 14 24 24 24 34C24 38.4 27.6 42 32 42C36.4 42 40 38.4 40 34C40 24 32 14 32 14Z"
        fill="#FF6B00"
      />
      <path
        d="M32 22C32 22 27 29 27 35C27 37.8 29.2 40 32 40C34.8 40 37 37.8 37 35C37 29 32 22 32 22Z"
        fill="#FFB300"
      />
      <path
        d="M32 28C32 28 29 32 29 36C29 37.7 30.3 39 32 39C33.7 39 35 37.7 35 36C35 32 32 28 32 28Z"
        fill="#FFF0A0"
      />
    </svg>
  )
}

function TrophyIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="26" y="48" width="12" height="5" rx="2" fill="#E8A000" stroke="#C67E00" strokeWidth="1.5" />
      <rect x="20" y="52" width="24" height="5" rx="2.5" fill="#F0AE00" stroke="#C67E00" strokeWidth="1.5" />
      <path
        d="M14 12H50V32C50 41 41.8 48 32 48C22.2 48 14 41 14 32V12Z"
        fill="#FFD000"
        stroke="#C67E00"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M14 14H8C8 14 6 26 14 30"
        stroke="#C67E00"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="#FFD000"
      />
      <path
        d="M50 14H56C56 14 58 26 50 30"
        stroke="#C67E00"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="#FFD000"
      />
      <path
        d="M14 12H50V32C50 41 41.8 48 32 48C22.2 48 14 41 14 32V12Z"
        fill="url(#trophyGrad)"
        stroke="#C67E00"
        strokeWidth="2"
      />
      <path
        d="M8 14C8 14 6.5 24 13 29.5"
        fill="#FFD000"
        stroke="#C67E00"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M56 14C56 14 57.5 24 51 29.5"
        fill="#FFD000"
        stroke="#C67E00"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <polygon
        points="32,20 34,27 41,27 35.5,31.5 37.5,38.5 32,34 26.5,38.5 28.5,31.5 23,27 30,27"
        fill="#E8A000"
        opacity="0.9"
      />
      <ellipse cx="23" cy="18" rx="3" ry="5" fill="white" opacity="0.25" transform="rotate(-20 23 18)" />
      <defs>
        <linearGradient id="trophyGrad" x1="14" y1="12" x2="50" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFE040" />
          <stop offset="100%" stopColor="#FFB300" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default function Hero() {
  const [transitioning, setTransitioning] = useState(false)
  const navigate = useNavigate()
  const hasAccount =
    typeof window !== "undefined" && localStorage.getItem(HAS_ACCOUNT_KEY) === "true"

  function handleCTA() {
    if (hasAccount) {
      capture("hero_cta_clicked", { cta_text: "Continuar aprendendo" })
      navigate("/login")
    } else {
      capture("hero_cta_clicked", { cta_text: "Começar grátis agora" })
      setTransitioning(true)
    }
  }

  function handleLoginClick() {
    capture("hero_login_clicked")
    navigate("/login")
  }

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-white">
      <PageSEO
        title="Aprenda Engenharia de Prompts — Curso Gratuito de IA"
        description="Aprenda engenharia de prompts do zero com lições gamificadas. Plataforma 100% gratuita para dominar ChatGPT, Claude e IA generativa. Comece agora sem cartão de crédito!"
        canonicalPath="/"
      />
      <CircleTransition to="/signup" active={transitioning} />

      {/* Top bar */}
      <div className="flex items-center justify-between px-6 pt-10 pb-2 z-10">
        <BrandLogo className="text-3xl" />
        <button
          className="text-sm font-semibold text-forest underline-offset-2 hover:underline"
          onClick={handleLoginClick}
        >
          Entrar
        </button>
      </div>

      {/* Main content */}
      <div className="flex flex-col px-6 pt-6 pb-4 z-10 flex-1">
        {/* Headline */}
        <h1 className="text-4xl font-extrabold text-[#1A3B24] leading-[1.15] mb-3">
          Aprenda IA de<br />
          forma <span className="text-[#4CAF50]">divertida</span>
        </h1>

        <p className="text-[#4A7A5C] text-base leading-relaxed mb-6 max-w-[280px]">
          Domine prompts para ChatGPT e Claude com lições curtas e gamificadas. Do zero ao avançado, 100% grátis.
        </p>

        {/* Feature badges */}
        <div className="flex gap-3 mb-8">
          <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-2xl px-3 py-2">
            <FireIcon className="w-7 h-7 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-orange-700 leading-none">Sequência</p>
              <p className="text-[10px] text-orange-500 mt-0.5">diária</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-2xl px-3 py-2">
            <TrophyIcon className="w-7 h-7 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-yellow-700 leading-none">Conquistas</p>
              <p className="text-[10px] text-yellow-600 mt-0.5">& ranking</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-2xl px-3 py-2">
            <Sparkles className="w-5 h-5 text-emerald-500 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-green-700 leading-none">68+ lições</p>
              <p className="text-[10px] text-green-500 mt-0.5">gratuitas</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <Button
          size="lg"
          className="w-full flex items-center justify-between px-6 text-base font-bold"
          disabled={transitioning}
          onClick={handleCTA}
        >
          <span>{hasAccount ? "Continuar aprendendo" : "Começar grátis agora"}</span>
          <ArrowRight className="h-5 w-5" />
        </Button>

        <p className="text-xs text-[#4A7A5C] text-center mt-3 leading-snug">
          Sem cartão de crédito &nbsp;·&nbsp; Cancele quando quiser
        </p>
      </div>

      {/* Hero mascot image — anchored to bottom, full width */}
      <div className="relative mt-auto w-full">
        {/* Floating sparkles near mascot */}
        <Sparkles
          className="animate-twinkle absolute top-8 left-8 h-4 w-4 text-[#7CC79A]/70 z-10"
          style={{ animationDelay: "0s" }}
        />
        <Sparkles
          className="animate-twinkle absolute top-4 left-1/3 h-3 w-3 text-emerald-400/60 z-10"
          style={{ animationDelay: "0.8s" }}
        />
        <Sparkles
          className="animate-twinkle absolute top-12 right-12 h-3.5 w-3.5 text-[#7CC79A]/50 z-10"
          style={{ animationDelay: "1.5s" }}
        />

        <img
          src="/assets/mascot-hero.png"
          alt="Mascote do PromptLabz — aprenda engenharia de prompts"
          fetchPriority="high"
          className="w-full max-w-sm mx-auto object-contain object-bottom block"
          style={{ marginBottom: "-2px" }}
        />
      </div>
    </div>
  )
}
