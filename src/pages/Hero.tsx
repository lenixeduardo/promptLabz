import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Lightbulb, Pencil, Sparkles, Plus, Type, ArrowRight, MessageSquarePlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BrandLogo } from "@/components/BrandLogo"
import { CircleTransition } from "@/components/CircleTransition"

export default function Hero() {
  const [transitioning, setTransitioning] = useState(false)
  const navigate = useNavigate()

  return (
    <div className="relative min-h-screen flex flex-col items-center bg-gradient-to-b from-[#EAF7F0] to-[#D6EEE3] px-6 pb-10 pt-12 overflow-hidden">
      <CircleTransition to="/signup" active={transitioning} />

      {/* Background sparkles */}
      <Sparkles className="animate-twinkle absolute top-16 right-8 h-4 w-4 text-[#7CC79A]/60" style={{ animationDelay: "0s" }} />
      <Sparkles className="animate-twinkle absolute top-32 left-4 h-3 w-3 text-[#7CC79A]/50" style={{ animationDelay: "1.2s" }} />
      <Sparkles className="animate-twinkle absolute bottom-48 right-6 h-3.5 w-3.5 text-[#5BA877]/50" style={{ animationDelay: "0.6s" }} />
      <Sparkles className="animate-twinkle absolute bottom-32 left-8 h-3 w-3 text-[#7CC79A]/40" style={{ animationDelay: "1.8s" }} />

      {/* Top floating icon circles */}
      <div className="flex items-end justify-center gap-6 mb-6 w-full max-w-xs">
        <div className="mt-4 bg-white rounded-full p-3.5 shadow-md shadow-green-100">
          <Lightbulb className="h-6 w-6 text-[#F5A623]" />
        </div>
        <div className="bg-white rounded-full p-3.5 shadow-md shadow-green-100">
          <MessageSquarePlus className="h-6 w-6 text-[#2F6B45]" />
        </div>
        <div className="mt-3 bg-white rounded-full p-3.5 shadow-md shadow-green-100">
          <Pencil className="h-6 w-6 text-[#2F6B45]" />
        </div>
      </div>

      {/* A1 badge + brand name */}
      <div className="flex flex-col items-center gap-2 mb-2">
        <div className="bg-[#2F6B45] text-white rounded-2xl px-4 py-1.5 text-sm font-bold tracking-wide">
          A1
        </div>
        <BrandLogo className="text-5xl" />
      </div>

      {/* Mascot area with floating decorations */}
      <div className="relative flex items-center justify-center w-full max-w-xs my-2">
        <div className="absolute left-2 top-1/2 -translate-y-1/2 bg-[#2F6B45] text-white rounded-2xl p-2.5 shadow-lg">
          <Plus className="h-5 w-5" />
        </div>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#2F6B45] text-white rounded-2xl p-2.5 shadow-lg">
          <Type className="h-5 w-5" />
        </div>
        <Sparkles className="animate-twinkle absolute top-2 left-16 h-4 w-4 text-[#5BA877]" style={{ animationDelay: "0.3s" }} />
        <Sparkles className="animate-twinkle absolute top-2 right-14 h-3.5 w-3.5 text-[#7CC79A]" style={{ animationDelay: "1.0s" }} />
        <Sparkles className="animate-twinkle absolute bottom-4 left-20 h-3 w-3 text-[#5BA877]" style={{ animationDelay: "1.6s" }} />
        <img
          src="/assets/mascot-login-new.png"
          alt="PromptLabz mascot"
          className="h-56 w-auto object-contain drop-shadow-md"
        />
      </div>

      {/* Headline */}
      <div className="flex flex-col items-center gap-3 mt-2 mb-6">
        <h1 className="text-4xl font-extrabold text-[#1E4D2F] text-center leading-tight">
          Aprenda IA<br />brincando
        </h1>
        <p className="text-base text-[#4A7A5C] text-center max-w-xs leading-relaxed">
          Domine a arte de escrever prompts e transforme suas ideias em resultados incríveis.
        </p>
      </div>

      {/* CTA */}
      <div className="flex flex-col items-center gap-4 w-full max-w-xs mt-auto">
        <Button
          size="lg"
          className="w-full flex items-center justify-between px-6"
          disabled={transitioning}
          onClick={() => setTransitioning(true)}
        >
          <span>Vamos começar!</span>
          <ArrowRight className="h-5 w-5" />
        </Button>

        <p className="text-sm text-[#4A7A5C]">
          Já tem uma conta?{" "}
          <button
            className="font-bold text-[#2F6B45] underline-offset-2 hover:underline"
            onClick={() => navigate("/login")}
          >
            Entrar
          </button>
        </p>
      </div>
    </div>
  )
}
