import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ChevronDown, ChevronUp, Copy, ArrowRight } from "lucide-react"
import { BottomNav } from "@/components/BottomNav"
import { cn } from "@/lib/utils"

const PROMPT_DATA = {
  id: "1",
  title: "Prompt para Landing Pages SaaS",
  category: "Marketing Digital",
  text: `Você é um especialista em marketing digital e copywriting para produtos SaaS. Crie uma landing page completa e persuasiva para [NOME DO PRODUTO], uma ferramenta de [CATEGORIA] voltada para [PÚBLICO-ALVO].

A landing page deve incluir:
- Headline principal impactante que destaque o principal benefício
- Subheadline que reforce a proposta de valor
- Seção "Como funciona" com 3 passos simples
- 3-5 benefícios principais com ícones descritivos
- Prova social (depoimentos e métricas de resultado)
- FAQ com as 5 dúvidas mais comuns
- CTA principal e secundário bem posicionados

Tom: profissional mas acessível. Foco em conversão.`,
  tags: ["Processos", "Otimizado", "Teste", "Qualidade"],
  howItWorks: [
    {
      id: "1",
      title: "Defina seu contexto",
      description:
        "Preencha os campos entre colchetes com as informações do seu produto: nome, categoria e público-alvo.",
    },
    {
      id: "2",
      title: "Escolha o tom certo",
      description:
        "Ajuste o tom conforme sua marca: formal para B2B enterprise, casual para startups e early adopters.",
    },
    {
      id: "3",
      title: "Itere e refine",
      description:
        "Use a resposta gerada como base e peça refinamentos específicos: 'torne o headline mais urgente' ou 'adicione mais prova social'.",
    },
    {
      id: "4",
      title: "Valide com dados",
      description:
        "Teste duas versões do headline com A/B test e meça qual converte melhor antes de publicar definitivamente.",
    },
  ],
  steps: [
    { label: "Input", description: "Preencha o contexto" },
    { label: "Análise", description: "IA processa" },
    { label: "Output", description: "Copy pronto" },
  ],
}

function AccordionItem({
  item,
  isOpen,
  onToggle,
}: {
  item: (typeof PROMPT_DATA.howItWorks)[0]
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div className="border-b border-[#E8F5EE] last:border-0">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between py-3 text-left"
      >
        <span className="text-sm font-semibold text-[#1F2A24]">{item.title}</span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 shrink-0 text-[#6B9E7E]" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-[#6B9E7E]" />
        )}
      </button>
      {isOpen && (
        <p className="pb-3 text-xs leading-relaxed text-[#4A5E52]">{item.description}</p>
      )}
    </div>
  )
}

export default function PromptDetail() {
  const navigate = useNavigate()
  const [openItem, setOpenItem] = useState<string | null>("1")
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(PROMPT_DATA.text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="min-h-screen bg-[#F0FAF3] pb-32">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#C8EDD8] via-[#D5F0E2] to-[#EAF7EF] px-5 pb-6 pt-12">
        <div className="mb-3 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#CDEAD8] bg-white shadow-sm transition-all active:scale-95"
            aria-label="Voltar"
          >
            <ArrowRight className="h-4 w-4 rotate-180 text-[#2B5D3A]" />
          </button>
          <span className="text-xs font-semibold text-[#3E6B50]">{PROMPT_DATA.category}</span>
        </div>
        <div className="flex items-start justify-between">
          <div className="flex-1 pr-2">
            <h1 className="text-xl font-extrabold leading-tight text-[#1F2A24]">
              {PROMPT_DATA.title}
            </h1>
          </div>
          <img
            src="/assets/mascot-login-new.png"
            alt="Mascote"
            className="h-24 w-auto shrink-0 object-contain"
          />
        </div>
      </div>

      <div className="px-4 pt-5 space-y-4">
        {/* Prompt completo */}
        <div className="rounded-2xl border border-[#CDEAD8] bg-white p-4 shadow-sm">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#6B9E7E]">
            Prompt completo:
          </p>
          <div className="max-h-40 overflow-y-auto rounded-xl bg-[#F5FBF7] p-3">
            <p className="whitespace-pre-wrap text-xs leading-relaxed text-[#3A4B40]">
              {PROMPT_DATA.text}
            </p>
          </div>
        </div>

        {/* Como funciona */}
        <div className="rounded-2xl border border-[#CDEAD8] bg-white p-4 shadow-sm">
          <p className="mb-1 text-sm font-bold text-[#1F2A24]">Como funciona?</p>
          {PROMPT_DATA.howItWorks.map((item) => (
            <AccordionItem
              key={item.id}
              item={item}
              isOpen={openItem === item.id}
              onToggle={() => setOpenItem(openItem === item.id ? null : item.id)}
            />
          ))}
        </div>

        {/* Processo de resultado */}
        <div className="rounded-2xl border border-[#CDEAD8] bg-white p-4 shadow-sm">
          <p className="mb-4 text-sm font-bold text-[#1F2A24]">Processo de resultado:</p>
          <div className="flex items-center justify-between">
            {PROMPT_DATA.steps.map((step, i) => (
              <div key={step.label} className="flex flex-1 items-center">
                <div className="flex flex-col items-center gap-1">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2B5D3A] text-sm font-bold text-white shadow-md">
                    {i + 1}
                  </div>
                  <span className="text-[11px] font-semibold text-[#1F2A24]">{step.label}</span>
                  <span className="text-[9px] text-center text-[#6B9E7E]">{step.description}</span>
                </div>
                {i < PROMPT_DATA.steps.length - 1 && (
                  <div className="mx-1 mb-6 h-0.5 flex-1 bg-gradient-to-r from-[#2B5D3A] to-[#BFE3CC]" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {PROMPT_DATA.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[#BFE3CC] bg-[#EAF7EF] px-3 py-1 text-xs font-semibold text-[#2B5D3A]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Fixed bottom actions */}
      <div className="fixed bottom-[72px] left-0 right-0 z-30 border-t border-[#E5F5EB] bg-white px-4 py-3">
        <div className="mx-auto flex max-w-[460px] gap-3">
          <button
            onClick={handleCopy}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold transition-all active:scale-95",
              copied
                ? "border-[#3E8E5E] bg-[#EAF7EF] text-[#3E8E5E]"
                : "border-[#2B5D3A] text-[#2B5D3A] hover:bg-[#EAF7EF]"
            )}
          >
            <Copy className="h-4 w-4" />
            {copied ? "Copiado!" : "Copiar Prompt"}
          </button>
          <button
            onClick={() => navigate("/lab-result")}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#2B5D3A] py-3 text-sm font-semibold text-white transition-all active:scale-95 hover:bg-[#3E8E5E]"
          >
            Usar no calculador
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <BottomNav active="lab" />
    </div>
  )
}
