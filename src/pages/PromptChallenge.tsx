import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { X, CheckCircle2, Diamond } from "@/lib/icons"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CHALLENGES, getChallengeByStep } from "@/data/challengeData"

const MIN_CHARS = 30
const MAX_CHARS = 500

type FeedbackScore = {
  contexto: boolean
  clareza: boolean
  detalhamento: boolean
  publicoAlvo: boolean
}

function scorePrompt(text: string): FeedbackScore {
  const t = text.toLowerCase()
  const len = text.length
  return {
    contexto: len >= 50,
    clareza: /\b(escreva|crie|liste|gere|fa[çc]a|elabore|descreva|explique|analise|sugira|produza|redija)\b/.test(t),
    detalhamento:
      len >= 120 ||
      /\b(formato|estilo|tom|exemplos?|espec[íi]fico|detalhes?|estrutura|bullet|t[óo]picos?|\d+\s*(palavras?|itens?|passos?|etapas?|dicas?))\b/.test(t),
    publicoAlvo:
      len >= 40 &&
      /\b(para|sobre|voltado|destina|direcionado|p[úu]blico|iniciantes?|especialistas?|crian[çc]as?|adultos?|profissionais?|estudantes?|empreendedores?)\b/.test(
        t
      ),
  }
}

function getIntroText(score: FeedbackScore): string {
  const passing = Object.values(score).filter(Boolean).length
  if (passing === 4) return "Excelente! Seu prompt está muito bem estruturado."
  if (passing >= 3) return "Ótimo começo! Vamos aprimorar:"
  return "Aqui está como você pode melhorar:"
}

const CRITERIA: { key: keyof FeedbackScore; label: string }[] = [
  { key: "contexto", label: "Contexto" },
  { key: "clareza", label: "Clareza" },
  { key: "detalhamento", label: "Detalhamento" },
  { key: "publicoAlvo", label: "Público-alvo" },
]

export default function PromptChallenge() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const stepParam = parseInt(searchParams.get("step") ?? "0", 10)
  const challenge = getChallengeByStep(isNaN(stepParam) ? 0 : stepParam)

  const [promptText, setPromptText] = useState("")
  const [showExample, setShowExample] = useState(false)

  const score = scorePrompt(promptText)
  const showFeedback = promptText.length >= MIN_CHARS
  const progressPct = ((challenge.step + 1) / challenge.totalSteps) * 100

  function handleSkip() {
    const nextStep = challenge.step + 1
    if (nextStep < CHALLENGES.length) {
      navigate(`/challenge?step=${nextStep}`)
    } else {
      navigate("/home")
    }
  }

  function handleShowExample() {
    setShowExample(true)
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#EAF7EF] via-[#E0F3E7] to-[#D2EEDD]">
      <div className="mx-auto flex w-full max-w-[420px] flex-col px-5 pb-10 pt-6">
        {/* Header */}
        <div className="mb-3 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#CDEAD8] bg-white shadow-sm transition-all hover:bg-[#F0FAF3]"
            aria-label="Fechar"
          >
            <X className="h-5 w-5 text-[#2B5D3A]" />
          </button>
          <p className="text-base font-bold text-[#2B5D3A]">{challenge.module}</p>
          <span className="text-sm font-semibold text-[#8A998F]">
            {challenge.step + 1}/{challenge.totalSteps}
          </span>
        </div>

        {/* Progress bar */}
        <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-[#CDEAD8]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#3E8E5E] to-[#2E7048] transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Challenge title */}
        <h1 className="mb-1 text-xl font-extrabold text-[#1F2A24]">{challenge.title}</h1>
        <p className="mb-5 text-sm text-[#6B7A70]">{challenge.subtitle}</p>

        {/* Task card */}
        <div className="mb-5 rounded-2xl border border-[#BFE3CC] bg-[#EAF7EF] px-4 py-4">
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-[#3E8E5E]">
            Sua tarefa
          </p>
          <p className="text-sm leading-relaxed text-[#3A4B40]">{challenge.task}</p>
        </div>

        {/* Prompt textarea */}
        <p className="mb-2 text-base font-bold text-[#1F2A24]">Seu prompt</p>
        <div className="relative mb-4">
          <textarea
            value={promptText}
            onChange={(e) => {
              if (e.target.value.length <= MAX_CHARS) setPromptText(e.target.value)
            }}
            placeholder="Digite aqui seu prompt..."
            rows={6}
            className="w-full resize-none rounded-2xl border border-[#CDEAD8] bg-white px-4 py-3 pb-7 text-sm leading-relaxed text-[#1F2A24] placeholder:text-[#B0C0B5] focus:border-[#3E8E5E] focus:outline-none focus:ring-2 focus:ring-[#3E8E5E]/20"
          />
          <span className="absolute bottom-3 right-4 text-xs text-[#8A998F]">
            {promptText.length}/{MAX_CHARS}
          </span>
        </div>

        {/* AI Feedback panel */}
        {showFeedback ? (
          <div className="mb-5 rounded-2xl border border-[#BFE3CC] bg-[#EAF7EF] p-4">
            <div className="mb-3 flex items-start gap-3">
              <img
                src="/assets/mascot-teacher.png"
                alt="Mascote"
                className="h-16 w-auto shrink-0 object-contain"
              />
              <div className="flex-1">
                <p className="font-bold text-[#1F2A24]">Feedback da IA</p>
                <p className="mt-0.5 text-xs text-[#6B9E7E]">{getIntroText(score)}</p>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              {CRITERIA.map(({ key, label }) => (
                <div key={key} className="flex items-center gap-2">
                  {score[key] ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[#3E8E5E]" />
                  ) : (
                    <Diamond className="h-4 w-4 shrink-0 text-[#F5A623]" />
                  )}
                  <span className="text-sm text-[#1F2A24]">
                    {label}:{" "}
                    <span
                      className={cn(
                        "font-medium",
                        score[key] ? "text-[#3E8E5E]" : "text-[#F5A623]"
                      )}
                    >
                      {score[key] ? "bom" : "pode melhorar"}
                    </span>
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-[#6B9E7E]">{challenge.tip}</p>
          </div>
        ) : (
          <div className="mb-5 rounded-2xl border border-[#CDEAD8] bg-white px-4 py-3 text-center">
            <p className="text-xs text-[#8A998F]">
              Digite pelo menos {MIN_CHARS} caracteres para receber feedback ao vivo.
            </p>
          </div>
        )}

        {/* Example panel (revealed on CTA click) */}
        {showExample && (
          <div className="mb-5 rounded-2xl border border-[#BFE3CC] bg-white p-4">
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#3E8E5E]">
              Exemplo aprimorado ✨
            </p>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#3A4B40]">
              {challenge.examplePrompt}
            </p>
          </div>
        )}

        {/* CTA button */}
        <Button
          size="lg"
          className="w-full"
          onClick={showExample ? handleSkip : handleShowExample}
          disabled={!showExample && promptText.length < MIN_CHARS}
        >
          {showExample
            ? challenge.step + 1 < CHALLENGES.length
              ? "Próximo desafio →"
              : "Concluir módulo"
            : "Ver exemplo aprimorado ✨"}
        </Button>

        {/* Skip link */}
        <button
          onClick={handleSkip}
          className="mt-3 w-full text-center text-sm text-[#6B9E7E] transition-colors hover:text-[#2B5D3A]"
        >
          Pular por agora
        </button>
      </div>
    </div>
  )
}
