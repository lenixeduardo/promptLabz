import { useState } from "react"
import { Link } from "react-router-dom"
import { Lightbulb, MessageSquarePlus, Pencil, Plus, Check, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BrandLogo } from "@/components/BrandLogo"
import { CircleTransition } from "@/components/CircleTransition"

export default function Hero() {
  const [transitioning, setTransitioning] = useState(false)

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center gap-6 bg-[#EFF9F4] px-6 overflow-hidden">

      {/* Growing-circle overlay */}
      <CircleTransition to="/login" active={transitioning} />

      {/* Floating icon chips */}
      <div className="absolute top-16 left-8 flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-sm">
        <Lightbulb className="h-6 w-6 text-[#F5A623]" strokeWidth={2} />
      </div>
      <div className="absolute top-10 left-1/2 -translate-x-1/2 flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-sm">
        <MessageSquarePlus className="h-6 w-6 text-[#2B5D3A]" strokeWidth={2} />
      </div>
      <div className="absolute top-16 right-8 flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-sm">
        <Pencil className="h-6 w-6 text-[#2B5D3A]" strokeWidth={2} />
      </div>

      {/* Decorative scattered elements */}
      <div className="absolute top-1/3 left-6 text-[#A8D5B8] opacity-40">
        <Plus className="h-8 w-8" strokeWidth={3} />
      </div>
      <div className="absolute top-1/2 right-5 text-[#A8D5B8] opacity-30">
        <Check className="h-6 w-6" strokeWidth={3} />
      </div>
      <div className="absolute bottom-1/3 left-10 text-[#A8D5B8] opacity-20">
        <Plus className="h-5 w-5" strokeWidth={3} />
      </div>

      {/* Brand logo */}
      <BrandLogo className="text-5xl" />

      {/* Mascot — asset pendente: substituir por mascote com capelo + tablet */}
      <img
        src="/assets/mascot-login-new.png"
        alt="PromptLabz mascot"
        className="h-52 w-auto object-contain drop-shadow-md"
      />

      {/* Headline + subtitle */}
      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-4xl font-extrabold text-[#1F3D2A] leading-tight">
          Aprenda IA<br />brincando
        </h1>
        <p className="text-sm text-[#4A7A5C] max-w-xs leading-relaxed">
          Domine a arte de escrever prompts e transforme suas ideias em resultados incríveis.
        </p>
      </div>

      {/* CTA button */}
      <Button
        size="lg"
        className="w-full max-w-xs flex items-center justify-center gap-2 rounded-full"
        disabled={transitioning}
        onClick={() => setTransitioning(true)}
      >
        Vamos começar!
        <ArrowRight className="h-5 w-5" strokeWidth={2.5} />
      </Button>

      {/* Secondary login link */}
      <p className="text-sm text-[#4A7A5C]">
        Já tem uma conta?{" "}
        <Link to="/login" className="font-bold text-[#2B5D3A] hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  )
}
