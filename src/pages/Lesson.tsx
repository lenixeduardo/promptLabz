import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { X, BookOpen, ChevronLeft, CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLives } from "@/contexts/LivesContext"
import { cn } from "@/lib/utils"

// ── Lesson data ─────────────────────────────────────────────────────────────

const LESSON = {
  module: "Módulo 1 · Fundamentos",
  title: "Chain-of-Thought Prompting",
  content: [
    {
      type: "text",
      text: "Chain-of-Thought (CoT) Prompting é uma técnica que instrui o modelo de linguagem a raciocinar passo a passo antes de chegar à resposta final.",
    },
    {
      type: "text",
      text: 'Em vez de pedir uma resposta direta, você guia o modelo a "pensar em voz alta", decompondo o problema em etapas intermediárias.',
    },
    {
      type: "quote",
      text: '"Resolva o problema abaixo. Pense passo a passo antes de dar a resposta final."',
    },
    {
      type: "heading",
      text: "Por que funciona?",
    },
    {
      type: "text",
      text: "Modelos de linguagem cometem menos erros quando decompõem problemas complexos. O raciocínio intermediário serve como rascunho que melhora a acurácia e permite auditar o processo, não só a resposta.",
    },
    {
      type: "text",
      text: "Sem CoT: \"Qual é 17 × 24?\" — o modelo pode errar diretamente.",
    },
    {
      type: "quote",
      text: '"Calcule 17 × 24 explicando cada etapa." → 17×20=340, 17×4=68, 340+68=408',
    },
  ],
  questions: [
    {
      id: 1,
      question: "O que é Chain-of-Thought (CoT) Prompting?",
      options: [
        { letter: "A", text: "Uma técnica que instrui o modelo a raciocinar passo a passo antes de responder" },
        { letter: "B", text: "Um método para reduzir o tamanho do modelo de linguagem" },
        { letter: "C", text: "Uma forma de treinar modelos com menos dados" },
        { letter: "D", text: "Uma técnica para comprimir textos longos" },
      ],
      correct: "A",
    },
    {
      id: 2,
      question: "Qual é o principal benefício do Chain-of-Thought Prompting?",
      options: [
        { letter: "A", text: "Reduz o tempo de resposta do modelo" },
        { letter: "B", text: "Permite auditar o raciocínio e reduz erros em problemas complexos" },
        { letter: "C", text: "Diminui o custo de uso da API" },
        { letter: "D", text: "Aumenta a velocidade de digitação" },
      ],
      correct: "B",
    },
    {
      id: 3,
      question: "Qual destes é um exemplo de prompt Chain-of-Thought?",
      options: [
        { letter: "A", text: '"Quanto é 17 × 24?"' },
        { letter: "B", text: '"Calcule 17 × 24 explicando cada etapa da multiplicação."' },
        { letter: "C", text: '"Responda em uma palavra."' },
        { letter: "D", text: '"Seja direto e objetivo."' },
      ],
      correct: "B",
    },
  ],
}

// ── Sub-components ───────────────────────────────────────────────────────────

function ContentView() {
  return (
    <div className="flex flex-col gap-3.5">
      {LESSON.content.map((block, i) => {
        if (block.type === "heading")
          return (
            <p key={i} className="mt-1 text-base font-bold text-[#1F2A24]">
              {block.text}
            </p>
          )
        if (block.type === "quote")
          return (
            <div
              key={i}
              className="rounded-2xl border border-[#BFE3CC] bg-[#EAF7EF] px-4 py-3"
            >
              <p className="text-sm italic leading-relaxed text-[#2B5D3A]">
                {block.text}
              </p>
            </div>
          )
        return (
          <p key={i} className="text-sm leading-relaxed text-[#3A4B40]">
            {block.text}
          </p>
        )
      })}
    </div>
  )
}

interface QuestionViewProps {
  question: (typeof LESSON.questions)[0]
  questionIndex: number
  total: number
  selected: string | null
  confirmed: boolean
  onSelect: (letter: string) => void
}

function QuestionView({
  question,
  questionIndex,
  total,
  selected,
  confirmed,
  onSelect,
}: QuestionViewProps) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs font-bold uppercase tracking-widest text-[#3E8E5E]">
        Questão {questionIndex + 1} de {total}
      </p>
      <p className="text-base font-bold leading-snug text-[#1F2A24]">
        {question.question}
      </p>

      <div className="mt-1 flex flex-col gap-2.5">
        {question.options.map((opt) => {
          const isSelected = selected === opt.letter
          const isCorrect = opt.letter === question.correct
          const showCorrect = confirmed && isCorrect
          const showWrong = confirmed && isSelected && !isCorrect
          const dimmed = confirmed && !isSelected && !isCorrect

          return (
            <button
              key={opt.letter}
              onClick={() => !confirmed && onSelect(opt.letter)}
              disabled={confirmed}
              className={cn(
                "flex items-center gap-3 rounded-2xl border bg-white px-4 py-3.5 text-left transition-all",
                !confirmed && !isSelected && "border-[#CDEAD8] hover:border-[#3E8E5E] hover:bg-[#F5FAF6]",
                !confirmed && isSelected && "border-[#3E8E5E] bg-[#EAF7EF]",
                showCorrect && "border-[#3E9A63] bg-[#DCF1E4]",
                showWrong && "border-[#E05252] bg-[#FEE2E2]",
                dimmed && "border-[#CDEAD8] opacity-50",
              )}
            >
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold",
                  !confirmed && !isSelected && "border-[#CDEAD8] text-[#6B7A70]",
                  !confirmed && isSelected && "border-[#3E8E5E] bg-[#3E8E5E] text-white",
                  showCorrect && "border-[#3E9A63] bg-[#3E9A63] text-white",
                  showWrong && "border-[#E05252] bg-[#E05252] text-white",
                  dimmed && "border-[#CDEAD8] text-[#A0A8A3]",
                )}
              >
                {opt.letter}
              </span>
              <span
                className={cn(
                  "flex-1 text-sm font-medium leading-snug",
                  !confirmed && !isSelected && "text-[#3A4B40]",
                  !confirmed && isSelected && "font-semibold text-[#2B5D3A]",
                  showCorrect && "font-semibold text-[#1E6B3A]",
                  showWrong && "text-[#991B1B]",
                  dimmed && "text-[#A0A8A3]",
                )}
              >
                {opt.text}
              </span>
            </button>
          )
        })}
      </div>

      {confirmed && (
        <div
          className={cn(
            "mt-1 flex items-start gap-2.5 rounded-2xl p-3.5",
            selected === question.correct ? "bg-[#DCF1E4]" : "bg-[#FEE2E2]",
          )}
        >
          {selected === question.correct ? (
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#1E6B3A]" />
          ) : (
            <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#991B1B]" />
          )}
          <p
            className={cn(
              "text-sm font-semibold leading-snug",
              selected === question.correct ? "text-[#1E6B3A]" : "text-[#991B1B]",
            )}
          >
            {selected === question.correct
              ? "Correto! Muito bem! 🎉"
              : `Incorreto. A resposta certa é: ${
                  question.options.find((o) => o.letter === question.correct)?.text
                }`}
          </p>
        </div>
      )}
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function Lesson() {
  const navigate = useNavigate()
  const { awardPerfectBonus } = useLives()
  const [step, setStep] = useState(0)        // 0 = content, 1-3 = questions
  const [selected, setSelected] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState(false)
  const [score, setScore] = useState(0)

  const totalSteps = 1 + LESSON.questions.length
  const currentQuestion = step > 0 ? LESSON.questions[step - 1] : null

  function goBack() {
    if (step > 0) {
      setStep((s) => s - 1)
      setSelected(null)
      setConfirmed(false)
    } else {
      navigate("/learn")
    }
  }

  function handleConfirm() {
    if (!selected || !currentQuestion) return
    if (selected === currentQuestion.correct) setScore((s) => s + 1)
    setConfirmed(true)
  }

  function handleNext() {
    if (step < totalSteps - 1) {
      setStep((s) => s + 1)
      setSelected(null)
      setConfirmed(false)
    } else {
      const total = LESSON.questions.length
      const perfect = score === total
      const bonusAwarded = perfect ? awardPerfectBonus() : false
      navigate("/mission", { state: { score, total, perfect, bonusAwarded } })
    }
  }

  const isLastStep = step === totalSteps - 1

  return (
    <div className="flex min-h-screen flex-col bg-[#F7FBF8]">

      {/* ── Sticky header ── */}
      <div className="sticky top-0 z-10 bg-[#F7FBF8] px-4 pb-3 pt-4">
        {/* Top row: close + book */}
        <div className="mb-3 flex items-center justify-between">
          <button
            onClick={() => navigate("/learn")}
            className="rounded-full p-1.5 text-[#1F2A24] transition-colors hover:bg-[#DCF1E4]"
          >
            <X className="h-5 w-5" />
          </button>
          <BookOpen className="h-5 w-5 text-[#3E8E5E]" />
        </div>

        {/* Breadcrumb + step counter */}
        <div className="flex items-center justify-between">
          <button
            onClick={goBack}
            className="flex items-center gap-0.5 text-sm font-medium text-[#3E8E5E] transition-colors hover:text-[#2B5D3A]"
          >
            <ChevronLeft className="h-4 w-4" />
            {LESSON.module}
          </button>
          <span className="text-sm font-medium text-[#8A998F]">
            {step + 1}/{totalSteps}
          </span>
        </div>

        {/* Lesson title */}
        <h1 className="mt-2 text-xl font-extrabold text-[#1F2A24]">
          {LESSON.title}
        </h1>
        {/* Green accent underline */}
        <div className="mt-1.5 h-0.5 w-10 rounded-full bg-[#3E8E5E]" />
      </div>

      {/* ── Scrollable content ── */}
      <div className="flex-1 overflow-y-auto px-4 py-2 pb-4">
        {step === 0 ? (
          <ContentView />
        ) : (
          currentQuestion && (
            <QuestionView
              question={currentQuestion}
              questionIndex={step - 1}
              total={LESSON.questions.length}
              selected={selected}
              confirmed={confirmed}
              onSelect={setSelected}
            />
          )
        )}
      </div>

      {/* ── Bottom button ── */}
      <div className="px-4 pb-10 pt-3">
        {step === 0 ? (
          <Button size="lg" className="w-full" onClick={handleNext}>
            Entendi, vamos lá! →
          </Button>
        ) : !confirmed ? (
          <Button
            size="lg"
            className={cn(
              "w-full transition-opacity",
              !selected && "opacity-50",
            )}
            disabled={!selected}
            onClick={handleConfirm}
          >
            Confirmar resposta
          </Button>
        ) : (
          <Button size="lg" className="w-full" onClick={handleNext}>
            {isLastStep ? "Ver resultado 🏆" : "Próxima →"}
          </Button>
        )}
      </div>
    </div>
  )
}
