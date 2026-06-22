import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, Zap, AlertCircle } from "lucide-react"
import { AppBottomNav } from "@/components/AppBottomNav"
import { AppPageHeader } from "@/components/AppPageHeader"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

type AnalysisResult = {
  clarity: number
  specificity: number
  context: number
  suggestions: string[]
}

function analyzePrompt(prompt: string): AnalysisResult {
  const trimmed = prompt.trim()
  const wordCount = trimmed.split(/\s+/).filter(Boolean).length
  const hasContext = /contexto|context|você é|you are|atue como|act as/i.test(trimmed)
  const hasExamples = /exemplo|example|por exemplo|e\.g\.|such as/i.test(trimmed)
  const hasGoal = /quero|preciso|gere|crie|escreva|want|need|generate|create|write/i.test(trimmed)

  const clarity = Math.min(100, Math.round((wordCount / 30) * 50 + (hasGoal ? 50 : 0)))
  const specificity = Math.min(100, Math.round((wordCount / 50) * 60 + (hasExamples ? 40 : 0)))
  const context = Math.min(100, Math.round((hasContext ? 70 : 0) + (wordCount > 20 ? 30 : 0)))

  const suggestions: string[] = []
  if (!hasGoal) suggestions.push("Descreva claramente o que você quer que a IA faça.")
  if (!hasContext) suggestions.push("Adicione contexto: 'Você é um especialista em...'")
  if (!hasExamples) suggestions.push("Inclua exemplos do resultado esperado.")
  if (wordCount < 10) suggestions.push("Expanda o prompt — seja mais detalhado.")
  if (suggestions.length === 0) suggestions.push("Ótimo prompt! Considere adicionar restrições de formato.")

  return { clarity, specificity, context, suggestions }
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  const color = value >= 70 ? "bg-emerald" : value >= 40 ? "bg-amber-400" : "bg-red-400"
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs font-semibold text-foreground-dark">{label}</span>
        <span className="text-xs font-bold text-foreground-tertiary">{value}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-stroke-muted/40">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}

export default function PromptAnalyzerPage() {
  const [prompt, setPrompt] = useState("")
  const [result, setResult] = useState<AnalysisResult | null>(null)

  function handleAnalyze() {
    if (!prompt.trim()) return
    setResult(analyzePrompt(prompt))
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-page-bg-light to-page-bg pb-24">
      <AppPageHeader title="Analisador de Prompts" back="/home" />

      <div className="mx-auto w-full max-w-lg space-y-5 px-4 py-5">
        <section className="rounded-2xl border-2 border-stroke-light bg-card p-4">
          <div className="mb-3 flex items-center gap-2">
            <Zap className="h-5 w-5 text-emerald" />
            <h2 className="text-sm font-bold text-foreground-dark">Analise seu prompt</h2>
          </div>
          <Textarea
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value)
              setResult(null)
            }}
            placeholder="Cole ou escreva seu prompt aqui..."
            className="min-h-[120px] resize-none text-sm"
          />
          <Button
            className="mt-3 w-full"
            onClick={handleAnalyze}
            disabled={!prompt.trim()}
          >
            Analisar prompt
          </Button>
        </section>

        {result && (
          <section className="rounded-2xl border-2 border-stroke-light bg-card p-4 space-y-4">
            <h2 className="text-sm font-bold text-foreground-dark">Resultado da análise</h2>
            <div className="space-y-3">
              <ScoreBar label="Clareza" value={result.clarity} />
              <ScoreBar label="Especificidade" value={result.specificity} />
              <ScoreBar label="Contexto" value={result.context} />
            </div>
            <div>
              <p className="mb-2 text-[11px] font-extrabold uppercase tracking-wider text-foreground-tertiary">
                Sugestões
              </p>
              <ul className="space-y-2">
                {result.suggestions.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-foreground-secondary">
                    <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </div>

      <AppBottomNav />
    </div>
  )
}
