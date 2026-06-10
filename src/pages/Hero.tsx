import { useNavigate } from "react-router-dom"
import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BrandLogo } from "@/components/BrandLogo"

export default function Hero() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 bg-gradient-to-b from-white via-[#F0FAF5] to-[#E0F3E9] px-6">
      {/* Animated circular frame around the mascot */}
      <div className="relative flex items-center justify-center" style={{ width: 280, height: 280 }}>
        {/* Layer 1: Pulsing radial glow */}
        <div
          className="animate-glow absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(150,225,182,0.85) 0%, rgba(150,225,182,0.35) 45%, transparent 70%)",
            filter: "blur(12px)",
          }}
        />

        {/* Layer 2: Rotating conic shine */}
        <div
          className="animate-shine absolute inset-2 rounded-full"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0deg, rgba(124,199,154,0.65) 60deg, transparent 150deg, transparent 360deg)",
            filter: "blur(8px)",
          }}
        />

        {/* Layer 3: Counter-rotating dashed outer ring */}
        <div className="animate-ring absolute inset-1 rounded-full border-2 border-dashed border-[#7CC79A]/60" />

        {/* Layer 4: Slow-rotating solid inner ring */}
        <div
          className="animate-shine absolute inset-6 rounded-full border border-[#B8E8CA]/80"
          style={{ animationDuration: "12s" }}
        />

        {/* Layer 5: Sparkles at four corners */}
        <Sparkles
          className="animate-twinkle absolute top-4 left-6 h-5 w-5 text-[#5BA877]"
          style={{ animationDelay: "0s" }}
        />
        <Sparkles
          className="animate-twinkle absolute top-4 right-6 h-4 w-4 text-[#7CC79A]"
          style={{ animationDelay: "0.7s" }}
        />
        <Sparkles
          className="animate-twinkle absolute bottom-4 left-6 h-4 w-4 text-[#7CC79A]"
          style={{ animationDelay: "1.4s" }}
        />
        <Sparkles
          className="animate-twinkle absolute bottom-4 right-6 h-3.5 w-3.5 text-[#5BA877]"
          style={{ animationDelay: "2.1s" }}
        />

        {/* Layer 6: Mascot cat image */}
        <img
          src="/assets/mascot-login-new.png"
          alt="PromptLab mascot"
          className="relative z-10 h-52 w-auto object-contain drop-shadow-md"
        />
      </div>

      {/* Title */}
      <div className="flex flex-col items-center gap-3 -mt-2">
        <BrandLogo className="text-5xl" />

        {/* Subtitle */}
        <p className="text-center text-base font-medium text-[#4A7A5C]">
          Seu laboratório de ideias com IA ✏️🧪
        </p>
      </div>

      {/* CTA button */}
      <Button
        size="lg"
        className="px-12"
        onClick={() => navigate("/home")}
      >
        Começar
      </Button>
    </div>
  )
}
