import { useState } from "react"
import { PenLine, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { PromptApplicationActivity } from "@/lib/lessonContent"

interface PromptApplicationCardProps {
  activity: PromptApplicationActivity
  answered: boolean
  onAnswer: (text: string) => void
}

export function PromptApplicationCard({ activity, answered, onAnswer }: PromptApplicationCardProps) {
  const [text, setText] = useState("")

  return (
    <div className="flex flex-col gap-4">
      <textarea
        rows={6}
        disabled={answered}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={activity.placeholder ?? "Escreva seu prompt aqui..."}
        className={cn(
          "w-full resize-none rounded-2xl border-2 bg-card px-4 py-3 font-mono text-sm text-foreground-dark transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400",
          answered
            ? "border-stroke-muted opacity-70"
            : "border-stroke-light hover:border-purple-300",
        )}
      />

      {!answered && (
        <button
          onClick={() => onAnswer(text.trim())}
          disabled={text.trim().length < 10}
          className={cn(
            "w-full rounded-2xl py-3 text-sm font-extrabold uppercase tracking-wide transition-colors",
            text.trim().length >= 10
              ? "bg-purple-600 text-white hover:bg-purple-700"
              : "cursor-not-allowed bg-stroke-light text-neutral",
          )}
        >
          Enviar meu prompt
        </button>
      )}

      {answered && (
        <div className="rounded-2xl border-2 border-purple-300 bg-purple-50 p-4">
          <div className="mb-2 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-purple-600" />
            <p className="text-xs font-extrabold uppercase tracking-wider text-purple-700">
              Prompt de referência
            </p>
          </div>
          <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-foreground-dark">
            {activity.examplePrompt}
          </pre>
          <p className="mt-3 text-[11px] text-foreground-tertiary">
            Compare seu prompt com o exemplo. Não existe uma única forma certa — o que importa é ter aplicado os conceitos!
          </p>
        </div>
      )}
    </div>
  )
}

export function PromptApplicationBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-purple-700">
      <PenLine className="h-3 w-3" />
      Escreva um prompt
    </span>
  )
}
