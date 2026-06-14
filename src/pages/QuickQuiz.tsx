import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { X, Zap, CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MascotGlow } from "@/components/MascotGlow"
import { QUICK_QUIZ_QUESTIONS } from "@/data/quizData"
import { type Question } from "@/data/lessonsData"
import { cn } from "@/lib/utils"
import { sileo } from "sileo"

interface OptionButtonProps {
  option: { letter: string; text: string }
  selected: string | null
  confirmed: boolean
  correct: string
  onSelect: (letter: string) => void
}

function OptionButton({ option, selected, confirmed, correct, onSelect }: OptionButtonProps) {
  const isSelected = selected === option.letter
  const isCorrect  = option.letter === correct
  const showCorrect = confirmed && isCorrect
  const showWrong   = confirmed && isSelected && !isCorrect
  const dimmed      = confirmed && !isSelected && !isCorrect

  return (
    <button
      onClick={() => !confirmed && onSelect(option.letter)}
      disabled={confirmed}
      className={cn(
        "flex items-center gap-3 rounded-2xl border bg-white px-4 py-3.5 text-left transition-all",
        !confirmed && !isSelected && "border-[#CDEAD8] hover:border-[#3E8E5E] hover:bg-[#F5FAF6]",
        !confirmed && isSelected  && "border-[#3E8E5E] bg-[#EAF7EF]",
        showCorrect && "border-[#3E9A63] bg-[#DCF1E4]",
        showWrong   && "border-[#E05252] bg-[#FEE2E2]",
        dimmed      && "border-[#CDEAD8] opacity-50"
      )}
    >
      <span
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold",
          !confirmed && !isSelected && "border-[#CDEAD8] text-[#6B7A70]",
          !confirmed && isSelected  && "border-[#3E8E5E] bg-[#3E8E5E] text-white",
          showCorrect && "border-[#3E9A63] bg-[#3E9A63] text-white",
          showWrong   && "border-[#E05252] bg-[#E05252] text-white",
          dimmed      && "border-[#CDEAD8] text-[#A0A8A3]"
        )}
      >
        {option.letter}
      </span>
      <span
        className={cn(
          "flex-1 text-sm font-medium leading-snug",
          !confirmed && !isSelected && "text-[#3A4B40]",
          !confirmed && isSelected  && "font-semibold text-[#2B5D3A]",
          showCorrect && "font-semibold text-[#1E6B3A]",
          showWrong   && "text-[#991B1B]",
          dimmed      && "text-[#A0A8A3]"
        )}
      >
        {option.text}
      </span>
    </button>
  )
}

interface QuestionViewProps {
  question: Question
  selected: string | null
  confirmed: boolean
  onSelect: (letter: string) => void
}

function QuestionView({ question, selected, confirmed, onSelect }: QuestionViewProps) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-base font-bold leading-snug text-[#1F2A24]">{question.question}</p>
      <div className="flex flex-col gap-2.5">
        {question.options.map((option) => (
          <OptionButton
            key={option.letter}
            option={option}
            selected={selected}
            confirmed={confirmed}
            correct={question.correct}
            onSelect={onSelect}
          />
        ))}
      </div>

      {confirmed && (
        <div
          className={cn(
            "flex items-start gap-2.5 rounded-2xl p-3.5",
            selected === question.correct ? "bg-[#DCF1E4]" : "bg-[#FEE2E2]"
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
              selected === question.correct ? "text-[#1E6B3A]" : "text-[#991B1B]"
            )}
          >
            {selected === question.correct
              ? "Correto! Muito bem!"
              : `Incorreto. A resposta certa é: ${
                  question.options.find((o) => o.letter === question.correct)?.text
                }`}
          </p>
        </div>
      )}
    </div>
  )
}

export default function QuickQuiz() {
  const navigate = useNavigate()

  const questions = QUICK_QUIZ_QUESTIONS
  const total = questions.length

  const [currentIndex, setCurrentIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState(false)
  const [score, setScore] = useState(0)
  const startTime = useRef(Date.now())

  const currentQuestion = questions[currentIndex]
  const isLast = currentIndex === total - 1
  const progress = ((currentIndex + (confirmed ? 1 : 0)) / total) * 100

  function handleSelect(letter: string) {
    if (confirmed) return
    setSelected(letter)
  }

  function handleConfirm() {
    if (!selected) return
    const isCorrect = selected === currentQuestion.correct
    if (isCorrect) {
      setScore((s) => s + 1)
      sileo.success({ title: "Correto!", description: "Muito bem! 🎉" })
    } else {
      sileo.error({ title: "Incorreto", description: "Verifique a resposta correta abaixo." })
    }
    setConfirmed(true)
  }

  function advance() {
    if (isLast) {
      const finalScore = score + (confirmed && selected === currentQuestion.correct ? 1 : 0)
      const timeElapsed = Math.round((Date.now() - startTime.current) / 1000)
      navigate("/quiz-result", {
        state: { score: finalScore, total, timeElapsed, xpEarned: finalScore * 50 },
      })
      return
    }
    setCurrentIndex((i) => i + 1)
    setSelected(null)
    setConfirmed(false)
  }

  function handleNext() {
    if (!confirmed) return
    advance()
  }

  function handleSkip() {
    if (confirmed) return
    advance()
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F7FBF8]">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-[#EAF2ED] bg-[#F7FBF8] px-4 pb-3 pt-4">
        <div className="mb-3 flex items-center justify-between">
          <button
            onClick={() => navigate("/home")}
            className="rounded-full p-1.5 text-[#1F2A24] transition-colors hover:bg-[#DCF1E4]"
          >
            <X className="h-5 w-5" />
          </button>
          <Zap className="h-5 w-5 text-[#3E8E5E]" />
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-extrabold text-[#1F2A24]">Prova Rápida</h1>
          <span className="text-sm font-semibold text-[#8A998F]">
            {currentIndex + 1} de {total}
          </span>
        </div>
        {/* Progress bar */}
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-[#E0F3E9]">
          <div
            className="h-full rounded-full bg-[#3E8E5E] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Mascot */}
      <div className="flex justify-center py-6">
        <MascotGlow size={160}>
          <img
            src="/assets/mascot-learn-new.png"
            alt="Mascote PromptLabz"
            className="h-28 w-auto object-contain drop-shadow-md"
          />
        </MascotGlow>
      </div>

      {/* Question */}
      <div className="flex-1 overflow-y-auto px-4 pb-6">
        <QuestionView
          question={currentQuestion}
          selected={selected}
          confirmed={confirmed}
          onSelect={handleSelect}
        />
      </div>

      {/* Footer buttons */}
      <div className="border-t border-[#EAF2ED] px-4 pb-8 pt-3">
        <div className="flex gap-3">
          <button
            onClick={handleSkip}
            disabled={confirmed}
            className={cn(
              "flex-1 rounded-2xl border border-[#CDEAD8] py-3.5 text-sm font-semibold text-[#6B7A70] transition-opacity",
              confirmed && "cursor-not-allowed opacity-40"
            )}
          >
            Pular
          </button>
          {!confirmed ? (
            <Button
              size="lg"
              className={cn("flex-1 transition-opacity", !selected && "opacity-50")}
              disabled={!selected}
              onClick={handleConfirm}
            >
              Confirmar
            </Button>
          ) : (
            <Button size="lg" className="flex-1" onClick={handleNext}>
              {isLast ? "Ver resultado" : "Próxima →"}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
