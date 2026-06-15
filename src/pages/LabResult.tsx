import { useNavigate, useLocation } from "react-router-dom"
import { ArrowRight, CheckCircle2, BookmarkPlus } from "lucide-react"
import { BottomNav } from "@/components/BottomNav"

const DEFAULT_RESULT = {
  score: 92,
  label: "Excelente!",
  stars: 4.5,
  originalPrompt: `Você é um especialista em marketing digital e copywriting para produtos SaaS. Crie uma landing page completa e persuasiva para [NOME DO PRODUTO], uma ferramenta de [CATEGORIA] voltada para [PÚBLICO-ALVO], com headline, benefícios claros, prova social e CTA persuasivo.`,
  analysis: `O prompt apresenta estrutura sólida com contexto claro, objetivo bem definido e elementos de output especificados. A definição de papel ("especialista em marketing") ativa o modo de especialista da IA, elevando a qualidade do resultado. Os elementos solicitados (headline, benefícios, prova social, CTA) são os corretos para uma landing page de alto desempenho.

Pontos fortes: contexto profissional, estrutura de saída clara, tom orientado a conversão. Leve oportunidade: especificar o estágio do produto (early-stage vs. growth) poderia refinar ainda mais o output.`,
  feedback: [
    "Contexto bem definido com papel de especialista",
    "Estrutura de saída clara e orientada a resultados",
    "Tom persuasivo alinhado com conversão",
    "Público-alvo parametrizável (boa flexibilidade)",
  ],
  aiCompatibility: [
    { name: "GPT-4", ok: true },
    { name: "Claude", ok: true },
    { name: "Gemini", ok: true },
  ],
}

function StarRating({ stars }: { stars: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = stars >= i
        const half = !filled && stars >= i - 0.5
        return (
          <span
            key={i}
            className={
              filled ? "text-[#F5A623]" : half ? "text-[#F5A623] opacity-60" : "text-[#D1D5DB]"
            }
            style={{ fontSize: 16 }}
          >
            ★
          </span>
        )
      })}
      <span className="ml-1 text-xs text-[#6B9E7E]">{stars}/5</span>
    </div>
  )
}

export default function LabResult() {
  const navigate = useNavigate()
  const location = useLocation()
  const result = (location.state as typeof DEFAULT_RESULT) ?? DEFAULT_RESULT

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
        </div>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-xl font-extrabold leading-tight text-[#1F2A24]">
              Resultado do<br />Laboratório
            </h1>
            <p className="mt-1 text-xs text-[#3E6B50]">
              Análise completa do seu prompt pela IA
            </p>
          </div>
          <img
            src="/assets/mascot-login-new.png"
            alt="Mascote"
            className="h-24 w-auto shrink-0 object-contain"
          />
        </div>
      </div>

      <div className="px-4 pt-5 space-y-4">
        {/* Pontuação geral */}
        <div className="rounded-2xl border border-[#CDEAD8] bg-white p-5 shadow-sm text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[#6B9E7E]">
            Pontuação geral
          </p>
          <div className="relative mx-auto mb-3 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#3E8E5E] to-[#2B5D3A] shadow-lg">
            <span className="text-4xl font-extrabold text-white">{result.score}</span>
          </div>
          <span className="inline-block rounded-full bg-[#EAF7EF] px-4 py-1 text-sm font-bold text-[#2B5D3A]">
            {result.label}
          </span>
          <div className="mt-3 flex justify-center">
            <StarRating stars={result.stars} />
          </div>
        </div>

        {/* Prompt original */}
        <div className="rounded-2xl border border-[#CDEAD8] bg-white p-4 shadow-sm">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#6B9E7E]">
            Seu prompt original:
          </p>
          <div className="rounded-xl bg-[#F5FBF7] p-3">
            <p className="text-xs leading-relaxed text-[#3A4B40]">{result.originalPrompt}</p>
          </div>
        </div>

        {/* Análise da IA */}
        <div className="rounded-2xl border border-[#CDEAD8] bg-white p-4 shadow-sm">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#6B9E7E]">
            Análise da IA:
          </p>
          <p className="text-xs leading-relaxed text-[#3A4B40]">{result.analysis}</p>
        </div>

        {/* Feedback da IA */}
        <div className="rounded-2xl border border-[#CDEAD8] bg-white p-4 shadow-sm">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[#6B9E7E]">
            Feedback da IA:
          </p>
          <div className="flex flex-col gap-2">
            {result.feedback.map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#3E8E5E]" />
                <span className="text-xs leading-relaxed text-[#1F2A24]">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Compatibilidade */}
        <div className="rounded-2xl border border-[#CDEAD8] bg-white p-4 shadow-sm">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[#6B9E7E]">
            Compatibilidade com IAs:
          </p>
          <div className="flex gap-2">
            {result.aiCompatibility.map(({ name, ok }) => (
              <span
                key={name}
                className="flex items-center gap-1 rounded-full border border-[#BFE3CC] bg-[#EAF7EF] px-3 py-1 text-xs font-semibold text-[#2B5D3A]"
              >
                {ok && <CheckCircle2 className="h-3 w-3 text-[#3E8E5E]" />}
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed bottom action */}
      <div className="fixed bottom-[72px] left-0 right-0 z-30 border-t border-[#E5F5EB] bg-white px-4 py-3">
        <div className="mx-auto max-w-[460px]">
          <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2B5D3A] py-3 text-sm font-semibold text-white transition-all active:scale-95 hover:bg-[#3E8E5E]">
            <BookmarkPlus className="h-4 w-4" />
            Salvar Resultado
          </button>
        </div>
      </div>

      <BottomNav active="lab" />
    </div>
  )
}
