import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Award, BookMarked, Check, FileText, RefreshCw } from "@/lib/icons"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { sileo } from "sileo"

type BillingPeriod = "monthly" | "annual"

const FEATURES = [
  "Acesso a todos os módulos",
  "Desafios ilimitados",
  "Feedbacks avançados",
  "Suporte prioritário",
]

const EXTRA_FEATURES = [
  { Icon: Award, label: "Certificado de conclusão" },
  { Icon: BookMarked, label: "Conteúdos exclusivos" },
  { Icon: FileText, label: "Modelos de prompts PRO" },
  { Icon: RefreshCw, label: "Atualizações semanais" },
]

export default function Subscription() {
  const navigate = useNavigate()
  const [billing, setBilling] = useState<BillingPeriod>("annual")

  function handleSubscribe() {
    sileo.success({
      title: "Em breve!",
      description: `Plano ${billing === "annual" ? "Anual" : "Mensal"} selecionado. Integração de pagamento em construção.`,
    })
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#EAF7EF] via-[#E0F3E7] to-[#D2EEDD]">
      <div className="mx-auto w-full max-w-[420px]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-5">
          <button
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#CDEAD8] bg-white shadow-sm transition-all hover:bg-[#F0FAF3]"
            aria-label="Voltar"
          >
            <ArrowLeft className="h-5 w-5 text-[#2B5D3A]" />
          </button>
          <span className="text-lg font-extrabold text-[#2B5D3A]">PromptLabz</span>
          <span className="rounded-full bg-[#2B5D3A] px-3 py-1 text-xs font-bold text-white">
            PRO
          </span>
        </div>

        {/* Hero section */}
        <div className="flex items-center gap-2 px-5 pb-6 pt-1">
          <div className="flex-1">
            <h1 className="text-2xl font-extrabold leading-snug text-[#1F2A24]">
              Destrave todo o seu potencial com PromptLabz PRO
            </h1>
            <p className="mt-2 text-sm text-[#6B9E7E]">
              Recursos avançados para quem quer sair do básico e dominar de verdade.
            </p>
          </div>
          <img
            src="/assets/mascot-teacher.png"
            alt="PromptLabz PRO"
            className="h-40 w-auto shrink-0 object-contain"
          />
        </div>

        {/* Billing toggle */}
        <div className="mx-5 mb-6 flex rounded-full border border-[#BFE3CC] bg-[#EAF7EF] p-1">
          <button
            onClick={() => setBilling("monthly")}
            className={cn(
              "flex-1 rounded-full py-2.5 text-sm font-semibold transition-all",
              billing === "monthly"
                ? "bg-white text-[#1F2A24] shadow-sm"
                : "text-[#6B9E7E] hover:text-[#2B5D3A]"
            )}
          >
            Mensal
          </button>
          <button
            onClick={() => setBilling("annual")}
            className={cn(
              "flex-1 rounded-full py-2.5 text-sm font-semibold transition-all",
              billing === "annual"
                ? "bg-white text-[#1F2A24] shadow-sm"
                : "text-[#6B9E7E] hover:text-[#2B5D3A]"
            )}
          >
            Anual 🔥 2 meses grátis
          </button>
        </div>

        {/* Pricing cards */}
        <div className="mx-5 mb-6 flex gap-3">
          {/* Mensal card */}
          <button
            onClick={() => setBilling("monthly")}
            className={cn(
              "flex flex-1 flex-col rounded-2xl border-2 bg-white p-4 text-left transition-all",
              billing === "monthly"
                ? "border-[#3E8E5E] shadow-md"
                : "border-[#E5EDEA] shadow-sm hover:border-[#BFE3CC]"
            )}
          >
            <p className="text-sm font-bold text-[#1F2A24]">Mensal</p>
            <p className="mt-2 text-3xl font-extrabold text-[#1F2A24]">R$ 29,90</p>
            <p className="text-xs text-[#6B9E7E]">/mês</p>
            <ul className="mt-3 flex flex-col gap-1.5">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-1.5 text-xs text-[#4A5E52]">
                  <Check className="h-3.5 w-3.5 shrink-0 text-[#3E8E5E]" />
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-center">
              <div
                className={cn(
                  "h-5 w-5 rounded-full border-2 transition-all",
                  billing === "monthly"
                    ? "border-[#3E8E5E] bg-[#3E8E5E]"
                    : "border-[#CDEAD8] bg-white"
                )}
              />
            </div>
          </button>

          {/* Anual card */}
          <button
            onClick={() => setBilling("annual")}
            className={cn(
              "relative flex flex-1 flex-col rounded-2xl border-2 bg-white p-4 pt-7 text-left transition-all",
              billing === "annual"
                ? "border-[#3E8E5E] shadow-md"
                : "border-[#E5EDEA] shadow-sm hover:border-[#BFE3CC]"
            )}
          >
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#3E8E5E] px-3 py-1 text-[10px] font-bold text-white">
              Mais escolhido
            </span>
            <p className="text-sm font-bold text-[#3E8E5E]">Anual</p>
            <p className="mt-2 text-3xl font-extrabold text-[#1F2A24]">R$ 299,00</p>
            <p className="text-xs text-[#6B9E7E]">/ano</p>
            <p className="mt-1 text-xs font-semibold text-[#3E8E5E]">Economize R$ 59,80</p>
            <ul className="mt-3 flex flex-col gap-1.5">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-1.5 text-xs text-[#4A5E52]">
                  <Check className="h-3.5 w-3.5 shrink-0 text-[#3E8E5E]" />
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-center">
              <div
                className={cn(
                  "h-5 w-5 rounded-full border-2 transition-all",
                  billing === "annual"
                    ? "border-[#3E8E5E] bg-[#3E8E5E]"
                    : "border-[#CDEAD8] bg-white"
                )}
              />
            </div>
          </button>
        </div>

        {/* Extra features grid */}
        <div className="mx-5 mb-8 grid grid-cols-2 gap-3">
          {EXTRA_FEATURES.map(({ Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2.5 rounded-2xl border border-[#CDEAD8] bg-white px-3 py-3 shadow-sm"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#EAF7EF]">
                <Icon className="h-4 w-4 text-[#3E8E5E]" />
              </div>
              <span className="text-xs font-semibold leading-tight text-[#1F2A24]">{label}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="px-5 pb-10">
          <Button size="lg" className="w-full text-lg" onClick={handleSubscribe}>
            Começar agora ⚡
          </Button>
          <p className="mt-3 text-center text-xs text-[#8A998F]">
            7 dias grátis. Cancele quando quiser.
          </p>
        </div>
      </div>
    </div>
  )
}
