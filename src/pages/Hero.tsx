import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowRight, Sparkles, Heart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BrandLogo } from "@/components/BrandLogo"
import { CircleTransition } from "@/components/CircleTransition"
import { PageSEO } from "@/components/PageSEO"
import { capture } from "@/lib/analytics"

const HAS_ACCOUNT_KEY = "promptlabz:hasAccount"

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
      capture("hero_cta_clicked", { cta_text: "Começar agora" })
      setTransitioning(true)
    }
  }

  function handleLoginClick() {
    capture("hero_login_clicked")
    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <PageSEO
        title="Aprenda Engenharia de Prompts — Curso Gratuito de IA"
        description="Aprenda engenharia de prompts do zero com lições gamificadas. Plataforma 100% gratuita para dominar ChatGPT, Claude e IA generativa. Comece agora sem cartão de crédito!"
        canonicalPath="/"
      />
      <CircleTransition to="/signup" active={transitioning} />

      {/* ── Seção 1: Hero ── */}
      <section className="relative bg-[#EEF9F4] overflow-hidden" style={{ minHeight: "520px" }}>
        {/* Mascote posicionado à direita como background */}
        <img
          src="/assets/mascot-hero.png"
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          className="absolute right-0 top-0 h-[108%] w-auto pointer-events-none select-none"
        />

        {/* Sparkles decorativos */}
        <Sparkles
          className="animate-twinkle absolute top-24 right-[40%] h-3.5 w-3.5 text-emerald-400/70"
          style={{ animationDelay: "0.4s" }}
        />
        <Sparkles
          className="animate-twinkle absolute top-12 right-[32%] h-3 w-3 text-[#7CC79A]/60"
          style={{ animationDelay: "1.2s" }}
        />

        {/* Conteúdo — coluna esquerda */}
        <div className="relative z-10 flex flex-col px-5 pt-10 pb-10 max-w-[58%]">
          <BrandLogo className="text-2xl mb-10" />

          <h1 className="font-extrabold text-[#1A3B24] leading-[1.1] mb-4">
            <span className="text-[2.5rem]">Aprenda IA</span>
            <br />
            <span className="text-[2rem]">do zero ao</span>
            <br />
            <span className="text-[2rem]">avançado</span>
          </h1>

          <p className="text-sm text-[#4A6741] leading-snug mb-1">
            Domine ChatGPT, Claude e IA generativa com lições gamificadas.
          </p>
          <p className="text-sm text-[#4A6741] leading-snug mb-7">
            Do zero ao avançado, sem precisar saber programar.
          </p>

          <Button
            size="default"
            className="flex items-center justify-between px-5 w-full"
            disabled={transitioning}
            onClick={handleCTA}
          >
            <span className="text-[13px]">
              {hasAccount ? "CONTINUAR" : "COMEÇAR AGORA"}
            </span>
            <ArrowRight className="h-4 w-4 flex-shrink-0" />
          </Button>
        </div>
      </section>

      {/* Onda de transição hero → features */}
      <div className="relative -mt-px">
        <svg
          viewBox="0 0 390 48"
          preserveAspectRatio="none"
          className="w-full block"
          style={{ height: "48px" }}
        >
          <path d="M0,0 Q195,48 390,0 L390,48 L0,48 Z" fill="white" />
        </svg>
        <div className="absolute inset-0 top-auto h-px bg-white" />
      </div>

      {/* ── Seção 2: Features ── */}
      <section className="bg-white px-4 pt-2 pb-8">
        {/* Heading */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="h-4 w-4 text-[#4CAF50] flex-shrink-0" />
          <h2 className="text-[15px] font-bold text-[#1A3B24] text-center leading-tight">
            Aprenda brincando. Evolua de verdade.
          </h2>
          <Sparkles className="h-4 w-4 text-[#4CAF50] flex-shrink-0" />
        </div>
        <p className="text-sm text-[#4A6741] text-center leading-relaxed mb-6">
          Lições curtas, desafios e recompensas para
          <br />
          você aprender mais e melhor todos os dias.
        </p>

        {/* 3 cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 flex flex-col items-center text-center">
            <img
              src="/assets/mascot-hero-laptop.png"
              alt="Lições práticas"
              className="w-14 h-14 object-contain mb-2"
            />
            <p className="text-[11px] font-bold text-[#1A3B24] mb-1 leading-tight">
              Lições práticas
            </p>
            <p className="text-[10px] text-[#4A6741] leading-tight">
              Conteúdo direto ao ponto com exemplos reais.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 flex flex-col items-center text-center">
            <img
              src="/assets/icon-trophy.png"
              alt="Gamificado"
              className="w-14 h-14 object-contain mb-2"
            />
            <p className="text-[11px] font-bold text-[#1A3B24] mb-1 leading-tight">
              Gamificado
            </p>
            <p className="text-[10px] text-[#4A6741] leading-tight">
              Ganhe XP, conquistas e suba de nível.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 flex flex-col items-center text-center">
            <img
              src="/assets/icon-fire.png"
              alt="Progresso real"
              className="w-14 h-14 object-contain mb-2"
            />
            <p className="text-[11px] font-bold text-[#1A3B24] mb-1 leading-tight">
              Progresso real
            </p>
            <p className="text-[10px] text-[#4A6741] leading-tight">
              Acompanhe seu progresso e veja sua evolução.
            </p>
          </div>
        </div>
      </section>

      {/* ── Seção 3: Prova social ── */}
      <section className="px-4 pb-10">
        <div className="bg-[#EAF7F0] rounded-2xl p-4 flex items-center gap-3">
          {/* Coração */}
          <div className="bg-[#C5EDD6] rounded-xl p-2.5 flex-shrink-0">
            <Heart className="h-5 w-5 text-[#2A7A4B] fill-[#2A7A4B]" />
          </div>

          {/* Texto + avatares */}
          <div className="flex-1 min-w-0">
            <p className="text-xs text-[#1A3B24] leading-snug mb-2">
              Junte-se aos alunos
              <br />
              que já estão evoluindo
              <br />
              com o{" "}
              <span className="text-[#2A7A4B] font-bold">PromptLabz</span>
            </p>
            <div className="flex -space-x-2">
              {["avatar-cat", "avatar-punk", "avatar-rocker"].map((name) => (
                <img
                  key={name}
                  src={`/assets/${name}.png`}
                  alt=""
                  className="w-8 h-8 rounded-full border-2 border-white object-cover"
                />
              ))}
            </div>
          </div>

          {/* Rating */}
          <div className="flex-shrink-0 text-right">
            <div className="flex gap-0.5 justify-end mb-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
              ))}
            </div>
            <p className="text-lg font-extrabold text-[#1A3B24] leading-none">4.9/5</p>
            <p className="text-[10px] text-[#4A6741] mt-0.5">de alunos</p>
          </div>
        </div>

        {/* Link "Já tem conta?" discreto */}
        <p className="text-sm text-[#4A6741] text-center mt-6">
          Já tem uma conta?{" "}
          <button
            className="font-bold text-[#2A7A4B] underline-offset-2 hover:underline"
            onClick={handleLoginClick}
          >
            Entrar
          </button>
        </p>
      </section>
    </div>
  )
}
