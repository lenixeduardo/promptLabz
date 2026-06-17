import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Lightbulb, Pencil, Sparkles, Plus, Type, ArrowRight, MessageSquarePlus, Star, Users, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BrandLogo } from "@/components/BrandLogo"
import { CircleTransition } from "@/components/CircleTransition"
import { PageSEO } from "@/components/PageSEO"
import { capture } from "@/lib/analytics"

// ─── Social proof data ───────────────────────────────────────────────────────
// Update these numbers as the platform grows.
const SOCIAL_PROOF = {
  students: "5.000+",
  rating: "4.9",
  ratingCount: "312",
}

export default function Hero() {
  const [transitioning, setTransitioning] = useState(false)
  const navigate = useNavigate()

  function handleCTA() {
    capture("hero_cta_clicked", { cta_text: "Começar grátis agora" })
    setTransitioning(true)
  }

  function handleLoginClick() {
    capture("hero_login_clicked")
    navigate("/login")
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center bg-gradient-to-b from-[#EAF7F0] to-[#D6EEE3] px-6 pb-10 pt-12 overflow-hidden">
      <PageSEO
        title="Aprenda Engenharia de Prompts — Curso Gratuito de IA"
        description="Aprenda engenharia de prompts do zero com lições gamificadas. Plataforma 100% gratuita para dominar ChatGPT, Claude e IA generativa. Comece agora sem cartão de crédito!"
        canonicalPath="/"
      />
      <CircleTransition to="/signup" active={transitioning} />

      {/* Background sparkles */}
      <Sparkles className="animate-twinkle absolute top-16 right-8 h-4 w-4 text-[#7CC79A]/60" style={{ animationDelay: "0s" }} />
      <Sparkles className="animate-twinkle absolute top-32 left-4 h-3 w-3 text-[#7CC79A]/50" style={{ animationDelay: "1.2s" }} />
      <Sparkles className="animate-twinkle absolute bottom-48 right-6 h-3.5 w-3.5 text-emerald/50" style={{ animationDelay: "0.6s" }} />
      <Sparkles className="animate-twinkle absolute bottom-32 left-8 h-3 w-3 text-[#7CC79A]/40" style={{ animationDelay: "1.8s" }} />

      {/* Top floating icon circles */}
      <div className="flex items-end justify-center gap-6 mb-6 w-full max-w-xs">
        <div className="mt-4 bg-white rounded-full p-3.5 shadow-md shadow-green-100">
          <Lightbulb className="h-6 w-6 text-accent" />
        </div>
        <div className="bg-white rounded-full p-3.5 shadow-md shadow-green-100">
          <MessageSquarePlus className="h-6 w-6 text-forest" />
        </div>
        <div className="mt-3 bg-white rounded-full p-3.5 shadow-md shadow-green-100">
          <Pencil className="h-6 w-6 text-forest" />
        </div>
      </div>

      {/* A1 badge + brand name */}
      <div className="flex flex-col items-center gap-2 mb-2">
        <div className="bg-forest text-white rounded-2xl px-4 py-1.5 text-sm font-bold tracking-wide">
          A1
        </div>
        <BrandLogo className="text-5xl" />
      </div>

      {/* Mascot area with floating decorations */}
      <div className="relative flex items-center justify-center w-full max-w-xs my-2">
        <div className="absolute left-2 top-1/2 -translate-y-1/2 bg-forest text-white rounded-2xl p-2.5 shadow-lg">
          <Plus className="h-5 w-5" />
        </div>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-forest text-white rounded-2xl p-2.5 shadow-lg">
          <Type className="h-5 w-5" />
        </div>
        <Sparkles className="animate-twinkle absolute top-2 left-16 h-4 w-4 text-emerald" style={{ animationDelay: "0.3s" }} />
        <Sparkles className="animate-twinkle absolute top-2 right-14 h-3.5 w-3.5 text-[#7CC79A]" style={{ animationDelay: "1.0s" }} />
        <Sparkles className="animate-twinkle absolute bottom-4 left-20 h-3 w-3 text-emerald" style={{ animationDelay: "1.6s" }} />
        <img
          src="/assets/mascot-login-new.png"
          alt="Mascote do PromptLabz — aprenda engenharia de prompts"
          width={400}
          height={400}
          fetchPriority="high"
          className="h-56 w-auto object-contain drop-shadow-md"
        />
      </div>

      {/* Headline — keyword-rich, intent-matched for Google Ads */}
      <div className="flex flex-col items-center gap-3 mt-2 mb-4">
        <h1 className="text-4xl font-extrabold text-[#1E4D2F] text-center leading-tight">
          Aprenda Engenharia<br />de Prompts — Grátis
        </h1>
        {/* Subtítulo com prova social e urgência */}
        <p className="text-base text-[#4A7A5C] text-center max-w-xs leading-relaxed">
          Domine ChatGPT, Claude e IA generativa com lições gamificadas. Do zero ao avançado, sem precisar saber programar.
        </p>
      </div>

      {/* Social proof bar */}
      <div className="flex items-center justify-center gap-4 mb-5 w-full max-w-xs">
        {/* Students count */}
        <div className="flex items-center gap-1.5">
          <Users className="h-4 w-4 text-forest flex-shrink-0" />
          <span className="text-xs font-semibold text-[#1E4D2F]">{SOCIAL_PROOF.students} alunos</span>
        </div>
        <span className="text-[#7CC79A] text-xs">•</span>
        {/* Rating */}
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 text-amber-500 fill-amber-500 flex-shrink-0" />
          <span className="text-xs font-semibold text-[#1E4D2F]">{SOCIAL_PROOF.rating}</span>
          <span className="text-xs text-[#4A7A5C]">({SOCIAL_PROOF.ratingCount})</span>
        </div>
        <span className="text-[#7CC79A] text-xs">•</span>
        {/* Free trust signal */}
        <div className="flex items-center gap-1">
          <ShieldCheck className="h-4 w-4 text-forest flex-shrink-0" />
          <span className="text-xs font-semibold text-[#1E4D2F]">100% grátis</span>
        </div>
      </div>

      {/* CTA */}
      <div className="flex flex-col items-center gap-3 w-full max-w-xs mt-auto">
        <Button
          size="lg"
          className="w-full flex items-center justify-between px-6"
          disabled={transitioning}
          onClick={handleCTA}
        >
          <span>Começar grátis agora</span>
          <ArrowRight className="h-5 w-5" />
        </Button>

        {/* Micro-copy — objection reduction */}
        <p className="text-xs text-[#4A7A5C] text-center leading-snug">
          Sem cartão de crédito &nbsp;·&nbsp; Sem compromisso &nbsp;·&nbsp; Cancele quando quiser
        </p>

        <p className="text-sm text-[#4A7A5C]">
          Já tem uma conta?{" "}
          <button
            className="font-bold text-forest underline-offset-2 hover:underline"
            onClick={handleLoginClick}
          >
            Entrar
          </button>
        </p>
      </div>
    </div>
  )
}
