import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { X, BookOpen, ChevronLeft, CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLives } from "@/contexts/useLives"
import { cn } from "@/lib/utils"
import { sileo } from "sileo"
import { lessonsData, type ContentBlock, type Question } from "@/data/lessonsData"
import { useAuth } from "@/hooks/useAuth"
import { saveProgress as saveProgressDb } from "@/lib/db"

function getProgressStorageKey(userId?: string) {
  return userId ? `promptlabz_progress:${userId}` : "promptlabz_progress"
}

interface ContentViewProps {
  content: ContentBlock[]
}

function ContentView({ content }: ContentViewProps) {
  return (
    <div className="flex flex-col gap-3.5">
      {content.map((block, index) => {
        if (block.type === "heading") {
          return (
            <p key={index} className="mt-1 text-base font-bold text-[#1F2A24]">
              {block.text}
            </p>
          )
        }

        if (block.type === "quote") {
          return (
            <div
              key={index}
              className="rounded-2xl border border-[#BFE3CC] bg-[#EAF7EF] px-4 py-3"
            >
              <p className="text-sm italic leading-relaxed text-[#2B5D3A]">
                {block.text}
              </p>
            </div>
          )
        }

        return (
          <p key={index} className="text-sm leading-relaxed text-[#3A4B40]">
            {block.text}
          </p>
        )
      })}
    </div>
  )
}

interface QuestionViewProps {
  question: Question
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
        {question.options.map((option) => {
          const isSelected = selected === option.letter
          const isCorrect = option.letter === question.correct
          const showCorrect = confirmed && isCorrect
          const showWrong = confirmed && isSelected && !isCorrect
          const dimmed = confirmed && !isSelected && !isCorrect

          return (
            <button
              key={option.letter}
              onClick={() => !confirmed && onSelect(option.letter)}
              disabled={confirmed}
              className={cn(
                "flex items-center gap-3 rounded-2xl border bg-white px-4 py-3.5 text-left transition-all",
                !confirmed && !isSelected && "border-[#CDEAD8] hover:border-[#3E8E5E] hover:bg-[#F5FAF6]",
                !confirmed && isSelected && "border-[#3E8E5E] bg-[#EAF7EF]",
                showCorrect && "border-[#3E9A63] bg-[#DCF1E4]",
                showWrong && "border-[#E05252] bg-[#FEE2E2]",
                dimmed && "border-[#CDEAD8] opacity-50"
              )}
            >
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold",
                  !confirmed && !isSelected && "border-[#CDEAD8] text-[#6B7A70]",
                  !confirmed && isSelected && "border-[#3E8E5E] bg-[#3E8E5E] text-white",
                  showCorrect && "border-[#3E9A63] bg-[#3E9A63] text-white",
                  showWrong && "border-[#E05252] bg-[#E05252] text-white",
                  dimmed && "border-[#CDEAD8] text-[#A0A8A3]"
                )}
              >
                {option.letter}
              </span>
              <span
                className={cn(
                  "flex-1 text-sm font-medium leading-snug",
                  !confirmed && !isSelected && "text-[#3A4B40]",
                  !confirmed && isSelected && "font-semibold text-[#2B5D3A]",
                  showCorrect && "font-semibold text-[#1E6B3A]",
                  showWrong && "text-[#991B1B]",
                  dimmed && "text-[#A0A8A3]"
                )}
              >
                {option.text}
              </span>
            </button>
          )
        })}
      </div>

      {confirmed && (
        <div
          className={cn(
            "mt-1 flex items-start gap-2.5 rounded-2xl p-3.5",
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
                  question.options.find((option) => option.letter === question.correct)?.text
                }`}
          </p>
        </div>
      )}
    </div>
  )
}

export default function Lesson() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user } = useAuth()
  const { awardPerfectBonus } = useLives()

  const categoryId = searchParams.get("category") || "trending-skills"
  const moduleIndex = parseInt(searchParams.get("moduleIndex") || "0", 10)
  const lessonIndex = parseInt(searchParams.get("lessonIndex") || "0", 10)

  const categoryObj = lessonsData[categoryId] || lessonsData["trending-skills"]
  const moduleObj = categoryObj.modules[moduleIndex] || categoryObj.modules[0]
  const lessonObj = moduleObj?.lessons[lessonIndex] || moduleObj?.lessons[0]

  const [step, setStep] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState(false)
  const [answerResults, setAnswerResults] = useState<Record<number, boolean>>({})
  const [isSaving, setIsSaving] = useState(false)

  if (!lessonObj) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7FBF8] p-5 text-center">
        <div>
          <p className="text-lg font-bold text-red-600">Erro: lição não encontrada.</p>
          <Button onClick={() => navigate("/learn")} className="mt-4">
            Voltar ao Lab
          </Button>
        </div>
      </div>
    )
  }

  const totalSteps = 1 + lessonObj.questions.length
  const currentQuestion = step > 0 ? lessonObj.questions[step - 1] : null

  function goBack() {
    if (step > 0) {
      setStep((value) => value - 1)
      setSelected(null)
      setConfirmed(false)
    } else {
      navigate(`/learn?category=${categoryId}`)
    }
  }

  function handleConfirm() {
    if (!selected || !currentQuestion) return

    const isCorrect = selected === currentQuestion.correct
    setAnswerResults((results) => ({
      ...results,
      [currentQuestion.id]: isCorrect,
    }))

    if (isCorrect) {
      sileo.success({ title: "Correto!", description: "Muito bem! 🎉" })
    } else {
      sileo.error({ title: "Incorreto", description: "Verifique a resposta correta abaixo." })
    }
    setConfirmed(true)
  }

  async function saveProgress() {
    try {
      const saved = localStorage.getItem(getProgressStorageKey(user?.id))
      const progress = saved ? JSON.parse(saved) : {}

      const catProgress = progress[categoryId] || {
        currentModuleIndex: 0,
        currentLessonIndex: 0,
        completedLessonIds: [],
      }

      if (!catProgress.completedLessonIds.includes(lessonObj.id)) {
        catProgress.completedLessonIds.push(lessonObj.id)
      }

      if (
        moduleIndex === catProgress.currentModuleIndex &&
        lessonIndex === catProgress.currentLessonIndex
      ) {
        const nextLessonIndex = lessonIndex + 1
        if (nextLessonIndex < moduleObj.lessons.length) {
          catProgress.currentLessonIndex = nextLessonIndex
        } else {
          const nextModuleIndex = moduleIndex + 1
          if (nextModuleIndex < categoryObj.modules.length) {
            catProgress.currentModuleIndex = nextModuleIndex
            catProgress.currentLessonIndex = 0
          }
        }
      }

      const result = await saveProgressDb(user?.id || "", categoryId, catProgress)
      if (result?.error && user?.id) {
        sileo.error({
          title: "Progresso salvo neste dispositivo",
          description: "Não foi possível sincronizar com a nuvem agora.",
        })
      }
    } catch (err) {
      console.error("Error saving progress:", err)
    }
  }

  async function handleNext() {
    if (step < totalSteps - 1) {
      setStep((value) => value + 1)
      setSelected(null)
      setConfirmed(false)
      return
    }

    const total = lessonObj.questions.length
    const score = lessonObj.questions.filter((question) => answerResults[question.id]).length
    const perfect = score === total

    if (!perfect) {
      sileo.error({
        title: "Atividade não concluída",
        description: "Acerte todas as questões para marcar a lição como concluída.",
      })
      setStep(1)
      setSelected(null)
      setConfirmed(false)
      return
    }

    setIsSaving(true)
    await saveProgress()
    setIsSaving(false)

    const bonusAwarded = awardPerfectBonus()
    navigate("/mission", { state: { score, total, perfect, bonusAwarded } })
  }

  const isLastStep = step === totalSteps - 1

  return (
    <div className="flex min-h-screen flex-col bg-[#F7FBF8]">
      <div className="sticky top-0 z-10 border-b border-[#EAF2ED] bg-[#F7FBF8] px-4 pb-3 pt-4">
        <div className="mb-3 flex items-center justify-between">
          <button
            onClick={() => navigate(`/learn?category=${categoryId}`)}
            className="rounded-full p-1.5 text-[#1F2A24] transition-colors hover:bg-[#DCF1E4]"
          >
            <X className="h-5 w-5" />
          </button>
          <BookOpen className="h-5 w-5 text-[#3E8E5E]" />
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={goBack}
            className="flex items-center gap-0.5 text-xs font-bold text-[#3E8E5E] transition-colors hover:text-[#2B5D3A]"
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
            {moduleObj.title}
          </button>
          <span className="text-sm font-semibold text-[#8A998F]">
            {step + 1}/{totalSteps}
          </span>
        </div>

        <h1 className="mt-2 text-lg font-extrabold leading-snug text-[#1F2A24]">
          {lessonObj.title}
        </h1>
        <div className="mt-1.5 h-0.5 w-10 rounded-full bg-[#3E8E5E]" />
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 pb-6">
        {step === 0 ? (
          <ContentView content={lessonObj.content} />
        ) : (
          currentQuestion && (
            <QuestionView
              question={currentQuestion}
              questionIndex={step - 1}
              total={lessonObj.questions.length}
              selected={selected}
              confirmed={confirmed}
              onSelect={setSelected}
            />
          )
        )}
      </div>

      <div className="border-t border-[#EAF2ED] px-4 pb-8 pt-3">
        {step === 0 ? (
          <Button size="lg" className="w-full" onClick={handleNext}>
            Entendi, vamos lá! →
          </Button>
        ) : !confirmed ? (
          <Button
            size="lg"
            className={cn("w-full transition-opacity", !selected && "opacity-50")}
            disabled={!selected}
            onClick={handleConfirm}
          >
            Confirmar resposta
          </Button>
        ) : (
          <Button size="lg" className="w-full" onClick={handleNext} disabled={isSaving}>
            {isSaving ? "Salvando..." : isLastStep ? "Ver resultado" : "Próxima →"}
          </Button>
        )}
      </div>
    </div>
  )
}
