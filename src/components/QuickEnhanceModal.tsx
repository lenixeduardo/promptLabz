import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Wand2, Copy, Check, ExternalLink, Sparkles, RotateCcw } from 'lucide-react'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from '@/components/ui/drawer'
import { enhancePrompt, type EnhancementResult } from '@/lib/promptEnhancer'
import { useQuickEnhanceParam } from '@/hooks/useQuickEnhanceParam'
import { cn } from '@/lib/utils'

export function QuickEnhanceModal() {
  const { isOpen, onClose } = useQuickEnhanceParam()
  const navigate = useNavigate()

  const [promptText, setPromptText] = useState('')
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [result, setResult] = useState<EnhancementResult | null>(null)
  const [copied, setCopied] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (isOpen) {
      setPromptText('')
      setResult(null)
      setCopied(false)
      // slight delay so the drawer animation finishes before focusing
      timerRef.current = setTimeout(() => textareaRef.current?.focus(), 350)
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [isOpen])

  function handleEnhance() {
    if (!promptText.trim() || isEnhancing) return
    setIsEnhancing(true)
    timerRef.current = setTimeout(() => {
      setResult(enhancePrompt(promptText, 'general'))
      setIsEnhancing(false)
    }, 500)
  }

  async function handleCopy() {
    if (!result) return
    try {
      await navigator.clipboard.writeText(result.enhanced)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard unavailable — silent
    }
  }

  function handleViewFull() {
    onClose()
    navigate('/prompt-enhancer', { state: { initialPrompt: promptText } })
  }

  function handleClose() {
    onClose()
    setPromptText('')
    setResult(null)
  }

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DrawerContent className="max-h-[92dvh] overflow-y-auto pb-safe">
        <DrawerHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-primary" />
            <DrawerTitle>Aprimorar Prompt</DrawerTitle>
          </div>
          <DrawerDescription>
            Cole seu prompt e deixe a IA melhorá-lo instantaneamente
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4 space-y-3">
          {!result ? (
            <>
              <textarea
                ref={textareaRef}
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleEnhance()
                }}
                placeholder="Cole ou escreva seu prompt aqui..."
                maxLength={1000}
                rows={6}
                className="w-full resize-none rounded-xl border border-input bg-muted/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
              />
              <p className="text-right text-xs text-muted-foreground">
                {promptText.length}/1000
              </p>
            </>
          ) : (
            <div className="space-y-3">
              {/* Score comparison */}
              <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/30 px-4 py-3">
                <div className="text-center min-w-[40px]">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Antes</p>
                  <p className="text-2xl font-extrabold text-foreground">{Math.round(result.originalScore)}</p>
                </div>
                <div className="flex flex-1 items-center gap-1">
                  <div className="h-px flex-1 bg-border" />
                  <Sparkles className="h-4 w-4 text-emerald-500 shrink-0" />
                  <div className="h-px flex-1 bg-border" />
                </div>
                <div className="text-center min-w-[40px]">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Depois</p>
                  <p className="text-2xl font-extrabold text-emerald-600">{Math.round(result.enhancedScore)}</p>
                </div>
              </div>

              {/* Enhanced text */}
              <div className="rounded-xl border bg-muted/30 px-4 py-3 max-h-52 overflow-y-auto">
                <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                  {result.enhanced}
                </p>
              </div>
            </div>
          )}
        </div>

        <DrawerFooter className="pt-2">
          {!result ? (
            <button
              onClick={handleEnhance}
              disabled={!promptText.trim() || isEnhancing}
              className={cn(
                'flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold transition-all',
                'bg-primary text-primary-foreground hover:bg-primary/90',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              {isEnhancing ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Aprimorando...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4" />
                  Aprimorar
                </>
              )}
            </button>
          ) : (
            <>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className={cn(
                    'flex flex-1 items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold transition-all',
                    copied
                      ? 'bg-emerald-500 text-white'
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  )}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? 'Copiado!' : 'Copiar'}
                </button>
                <button
                  onClick={handleViewFull}
                  className="flex items-center justify-center gap-2 rounded-xl border-2 border-stroke-light bg-card px-4 py-3.5 text-sm font-bold transition-all hover:bg-surface-soft"
                >
                  <ExternalLink className="h-4 w-4" />
                  Completo
                </button>
              </div>
              <button
                onClick={() => setResult(null)}
                className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Tentar novamente
              </button>
            </>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
