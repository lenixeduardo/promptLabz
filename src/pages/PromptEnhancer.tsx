import { useState, useRef, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Sparkles,
  Wand2,
  Copy,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Clock,
  TrendingUp,
  FileText,
  Lightbulb,
  Zap,
  User,
  FileJson,
  PenLine,
  Users,
  Sliders,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { getLocalGems } from "@/lib/xp";
import { enhancePrompt, type EnhancementResult, type EnhancementFields } from "@/lib/promptEnhancer";
import { AppBottomNav } from "@/components/AppBottomNav";

// ── Types ─────────────────────────────────────────────────────────────────

type PageState = "input" | "enhancing" | "result";

interface HistoryItem {
  id: string;
  snippet: string;
  timestamp: string;
  jump: number;
  result: EnhancementResult;
}

// ── Helpers ───────────────────────────────────────────────────────────────

function formatTime(): string {
  const now = new Date();
  return now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

const MAX_CHARS = 5000;
const MAX_FIELD_CHARS = 200;

// ── Refinement field config ───────────────────────────────────────────────

interface FieldConfig {
  key: keyof EnhancementFields;
  label: string;
  placeholder: string;
  icon: React.ReactNode;
}

const FIELDS: FieldConfig[] = [
  {
    key: "persona",
    label: "Persona / papel",
    placeholder: "ex: especialista em marketing digital",
    icon: <User className="h-4 w-4" />,
  },
  {
    key: "context",
    label: "Contexto / objetivo",
    placeholder: "ex: preciso de um texto para newsletter",
    icon: <Target className="h-4 w-4" />,
  },
  {
    key: "format",
    label: "Formato de saída",
    placeholder: "ex: lista, tabela, markdown, json",
    icon: <FileJson className="h-4 w-4" />,
  },
  {
    key: "tone",
    label: "Tom / estilo",
    placeholder: "ex: formal, divertido, técnico",
    icon: <PenLine className="h-4 w-4" />,
  },
  {
    key: "audience",
    label: "Público-alvo",
    placeholder: "ex: iniciantes, CEOs, devs",
    icon: <Users className="h-4 w-4" />,
  },
  {
    key: "constraints",
    label: "Restrições / limites",
    placeholder: "ex: máx 200 palavras, sem jargão",
    icon: <Sliders className="h-4 w-4" />,
  },
];

// ── Main Page ─────────────────────────────────────────────────────────────

export default function PromptEnhancerPage() {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const [gems, setGems] = useState(0);

  // Page state
  const [pageState, setPageState] = useState<PageState>("input");
  const [promptText, setPromptText] = useState("");
  const [fields, setFields] = useState<EnhancementFields>({});
  const [fieldsOpen, setFieldsOpen] = useState(false);
  const [result, setResult] = useState<EnhancementResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  // Timer cleanup
  const enhanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastsTimerRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // History
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);

  // Load gems
  useEffect(() => {
    if (userId) {
      setGems(getLocalGems(userId));
    }
  }, [userId]);

  // Handle field change
  const handleFieldChange = useCallback(
    (key: keyof EnhancementFields, value: string) => {
      setFields((prev) => ({ ...prev, [key]: value.slice(0, MAX_FIELD_CHARS) }));
    },
    [],
  );

  // Handle enhance
  const handleEnhance = useCallback(() => {
    const trimmed = promptText.trim();
    if (!trimmed || trimmed.length > MAX_CHARS) return;

    setPageState("enhancing");

    enhanceTimerRef.current = setTimeout(() => {
      enhanceTimerRef.current = null;
      const enhanced = enhancePrompt(trimmed, fields);
      setResult(enhanced);
      setPageState("result");

      // Add to history
      const snippet = trimmed.length > 60 ? trimmed.slice(0, 60) + "…" : trimmed;
      const item: HistoryItem = {
        id: Date.now().toString(36),
        snippet,
        timestamp: formatTime(),
        jump: enhanced.jump,
        result: enhanced,
      };
      setHistory((prev) => [item, ...prev]);
    }, 400);
  }, [promptText, fields]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (enhanceTimerRef.current) {
        clearTimeout(enhanceTimerRef.current);
      }
      toastsTimerRef.current.forEach(clearTimeout);
    };
  }, []);

  // Handle copy
  const handleCopy = useCallback(async () => {
    if (!result) return;
    setCopyError(false);
    toastsTimerRef.current.forEach(clearTimeout);
    toastsTimerRef.current = [];

    try {
      await navigator.clipboard.writeText(result.enhanced);
      setCopied(true);
      const t = setTimeout(() => setCopied(false), 2000);
      toastsTimerRef.current.push(t);
    } catch {
      setCopyError(true);
      const t = setTimeout(() => setCopyError(false), 3000);
      toastsTimerRef.current.push(t);
    }
  }, [result]);

  // Reset to input
  const handleNew = useCallback(() => {
    setPageState("input");
    setPromptText("");
    setFields({});
    setResult(null);
    setCopied(false);
    setCopyError(false);
  }, []);

  // Restore from history
  const handleOpenHistory = useCallback((item: HistoryItem) => {
    setResult(item.result);
    setPromptText(item.result.original);
    setPageState("result");
    setHistoryOpen(false);
  }, []);

  const canEnhance = promptText.trim().length > 0 && promptText.trim().length <= MAX_CHARS;

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-page-bg-light to-page-bg">
      {/* ── Header ── */}
      <div className="sticky top-0 z-20 flex items-center gap-3 border-b border-stroke-muted bg-card px-4 py-3">
        <Link
          to="/home"
          className="rounded-full p-1.5 text-forest transition-colors hover:bg-surface-success"
          aria-label="Voltar para a Home"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-extrabold text-primary-dark truncate">
              Prompt Enhancer
            </h1>
            <span className="inline-flex items-center rounded-full bg-emerald/15 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-emerald shrink-0">
              Novo
            </span>
          </div>
          <p className="text-[11px] text-foreground-tertiary truncate">
            Transforme prompts genéricos em instruções poderosas.
          </p>
        </div>
        <div
          className="flex shrink-0 items-center gap-1 rounded-full bg-luxury/15 px-2.5 py-1.5"
          aria-label={`Saldo de gemas: ${gems}`}
        >
          <span className="text-sm">💎</span>
          <span className="text-xs font-extrabold text-luxury">{gems}</span>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-5 space-y-5">
        {/* ── STATE: INPUT ── */}
        {pageState === "input" && (
          <>
            {/* Input card */}
            <div className="rounded-2xl border-2 border-emerald/30 bg-card p-5">
              {/* Mascot */}
              <div className="flex flex-col items-center gap-3 text-center mb-5">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald/10">
                  <div className="relative">
                    <Wand2 className="h-10 w-10 text-emerald" strokeWidth={1.5} />
                  </div>
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-foreground-dark">
                    Melhore seus prompts
                  </h2>
                  <p className="text-xs text-foreground-tertiary mt-0.5">
                    Cole seu prompt e receba uma versão melhorada em segundos.
                  </p>
                </div>
              </div>

              {/* Textarea */}
              <div className="relative">
                <textarea
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value.slice(0, MAX_CHARS))}
                  placeholder="Cole ou digite seu prompt aqui…"
                  className="w-full min-h-[140px] rounded-xl border-2 border-stroke-light bg-surface-soft p-4 text-sm text-foreground-dark placeholder-foreground-placeholder resize-y focus:border-emerald focus:outline-none focus:ring-2 focus:ring-emerald/20 transition-colors"
                  aria-label="Digite ou cole o prompt que deseja melhorar"
                  rows={5}
                />
                <div className="flex items-center justify-between mt-2 px-1">
                  <p className="text-[10px] text-foreground-tertiary">
                    Grátis • Processamento local
                  </p>
                  <p
                    className={cn(
                      "text-[10px] font-semibold",
                      promptText.length > MAX_CHARS * 0.9
                        ? "text-red-400"
                        : "text-foreground-placeholder",
                    )}
                  >
                    {promptText.length}/{MAX_CHARS}
                  </p>
                </div>
              </div>

              {/* Enhancement button */}
              <button
                onClick={handleEnhance}
                disabled={!canEnhance}
                className={cn(
                  "mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white transition-all active:scale-[0.98]",
                  canEnhance
                    ? "bg-emerald hover:bg-emerald-dark"
                    : "bg-stroke-light text-foreground-placeholder cursor-not-allowed",
                )}
              >
                <Zap className="h-4 w-4" />
                Melhorar prompt
              </button>

              {!canEnhance && promptText.trim().length === 0 && (
                <p className="mt-2 text-center text-[10px] text-foreground-placeholder">
                  Digite ou cole um prompt para começar.
                </p>
              )}
              {promptText.trim().length > MAX_CHARS && (
                <p className="mt-2 text-center text-[10px] text-red-400" role="alert">
                  Limite de {MAX_CHARS} caracteres excedido.
                </p>
              )}
            </div>

            {/* Refinement fields (collapsible) */}
            <div className="rounded-2xl border-2 border-stroke-light bg-card overflow-hidden">
              <button
                onClick={() => setFieldsOpen(!fieldsOpen)}
                className="flex w-full items-center justify-between px-5 py-3.5 transition-colors hover:bg-surface-soft"
                aria-expanded={fieldsOpen}
              >
                <div className="flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-emerald" strokeWidth={1.5} />
                  <span className="text-sm font-bold text-foreground-dark">
                    Adicionar detalhes (opcional)
                  </span>
                </div>
                {fieldsOpen ? (
                  <ChevronUp className="h-4 w-4 text-foreground-tertiary" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-foreground-tertiary" />
                )}
              </button>
              <p className="px-5 pb-2 text-[11px] text-foreground-tertiary -mt-1">
                Quanto mais detalhes, melhor o resultado.
              </p>
              {fieldsOpen && (
                <div className="px-5 pb-5 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {FIELDS.map((field) => (
                      <div key={field.key}>
                        <label className="flex items-center gap-1.5 text-[11px] font-bold text-foreground-tertiary mb-1">
                          {field.icon}
                          {field.label}
                        </label>
                        <input
                          type="text"
                          value={fields[field.key] || ""}
                          onChange={(e) => handleFieldChange(field.key, e.target.value)}
                          placeholder={field.placeholder}
                          className="w-full rounded-lg border-2 border-stroke-light bg-surface-soft px-3 py-2 text-xs text-foreground-dark placeholder-foreground-placeholder focus:border-emerald focus:outline-none focus:ring-2 focus:ring-emerald/20 transition-colors"
                          maxLength={MAX_FIELD_CHARS}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* How it works */}
            <div>
              <h2 className="text-base font-extrabold text-foreground-dark mb-3">
                Como funciona
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    step: 1,
                    title: "Cole seu prompt",
                    text: "Insira o texto que você quer melhorar.",
                    icon: <FileText className="h-5 w-5" />,
                  },
                  {
                    step: 2,
                    title: "Adicione detalhes",
                    text: "Preencha campos opcionais para refinar.",
                    icon: <Sliders className="h-5 w-5" />,
                  },
                  {
                    step: 3,
                    title: "Receba o melhorado",
                    text: "Pronto para copiar e usar.",
                    icon: <Sparkles className="h-5 w-5" />,
                  },
                ].map((item) => (
                  <div
                    key={item.step}
                    className="rounded-xl border-2 border-stroke-light bg-card p-4 flex flex-col items-center text-center"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald/10 text-emerald mb-2">
                      {item.icon}
                    </div>
                    <p className="text-sm font-bold text-foreground-dark">{item.title}</p>
                    <p className="text-xs text-foreground-tertiary mt-0.5">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tip */}
            <div className="flex items-start gap-2 rounded-xl bg-surface-soft px-4 py-3 border border-stroke-muted">
              <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-emerald" strokeWidth={2} />
              <p className="text-xs text-foreground-secondary leading-relaxed">
                <span className="font-bold">Dica:</span> Prompts com persona, contexto e formato
                definido geram respostas muito mais precisas. Quanto mais específico, melhor.
              </p>
            </div>

            {/* History button */}
            {history.length > 0 && (
              <button
                onClick={() => setHistoryOpen(true)}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-stroke-light bg-card px-4 py-3 text-sm font-bold text-foreground-secondary transition-colors hover:bg-surface-soft"
              >
                <Clock className="h-4 w-4" />
                Ver melhorias anteriores ({history.length})
              </button>
            )}
          </>
        )}

        {/* ── STATE: ENHANCING ── */}
        {pageState === "enhancing" && (
          <div className="rounded-2xl border-2 border-emerald/30 bg-card p-8 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald/10 animate-bounce-slow">
              <Wand2 className="h-10 w-10 text-emerald" strokeWidth={1.5} />
            </div>
            <h2 className="mt-4 text-lg font-extrabold text-foreground-dark">
              Melhorando seu prompt…
            </h2>
            <p className="mt-1 text-sm text-foreground-tertiary">
              A gatinha engenheira está estruturando seu prompt com as melhores práticas.
            </p>
            <div
              className="mt-6 mx-auto h-2 w-48 overflow-hidden rounded-full bg-surface-soft"
              role="progressbar"
              aria-valuenow={66}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Melhorando o prompt"
            >
              <div
                className="h-full w-2/3 rounded-full bg-emerald animate-pulse"
              />
            </div>
          </div>
        )}

        {/* ── STATE: RESULT ── */}
        {pageState === "result" && result && (
          <div className="space-y-5">
            {/* Result header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold text-foreground-dark">
                  Prompt melhorado! ✨
                </h2>
                <p className="text-xs text-foreground-tertiary">
                  Compare o original com a versão melhorada.
                </p>
              </div>
              <span className="inline-flex items-center rounded-full bg-emerald/10 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider text-emerald border border-emerald/20">
                Processado localmente
              </span>
            </div>

            {/* Score jump */}
            <div className="flex items-center justify-center gap-2 rounded-xl bg-emerald/5 border border-emerald/20 px-4 py-3">
              <TrendingUp className="h-5 w-5 text-emerald" strokeWidth={2} />
              <span className="text-sm font-extrabold text-foreground-dark">
                Salto de qualidade:{" "}
                <span className="text-emerald">+{result.jump.toFixed(1)}</span>
              </span>
            </div>

            {/* Tags */}
            {result.addedFields.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-bold text-foreground-tertiary">
                  Campos adicionados:
                </span>
                {result.addedFields.map((field) => {
                  const label =
                    FIELDS.find((f) => f.key === field)?.label || field;
                  return (
                    <span
                      key={field}
                      className="inline-flex items-center gap-1 rounded-full bg-emerald/10 px-2.5 py-1 text-[10px] font-semibold text-emerald border border-emerald/20"
                    >
                      {label}
                    </span>
                  );
                })}
              </div>
            )}

            {/* Side-by-side comparison */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Original */}
              <div className="rounded-2xl border-2 border-stroke-light bg-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center rounded-full bg-surface-soft px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-foreground-tertiary">
                    Original
                  </span>
                  <span className="text-[10px] text-foreground-placeholder">
                    Nota: {result.originalScore.toFixed(1)}/10
                  </span>
                </div>
                <p className="text-xs text-foreground-dark leading-relaxed whitespace-pre-line">
                  {result.original}
                </p>
              </div>

              {/* Enhanced */}
              <div className="rounded-2xl border-2 border-emerald/30 bg-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center rounded-full bg-emerald/10 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-emerald border border-emerald/20">
                    Melhorado ✨
                  </span>
                  <span className="text-[10px] text-emerald font-semibold">
                    Nota: {result.enhancedScore.toFixed(1)}/10
                  </span>
                </div>
                <p className="text-xs text-foreground-dark leading-relaxed whitespace-pre-line">
                  {result.enhanced}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                onClick={handleCopy}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald px-4 py-3 text-sm font-bold text-white transition-all hover:bg-emerald-dark active:scale-[0.98]"
                aria-label={copied ? "Prompt copiado!" : "Copiar prompt melhorado"}
              >
                {copyError ? (
                  <span className="text-xs">Não foi possível copiar</span>
                ) : copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Prompt copiado!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copiar prompt melhorado
                  </>
                )}
              </button>
              <button
                onClick={() => setHistoryOpen(true)}
                className="flex items-center justify-center gap-2 rounded-xl border-2 border-stroke-light bg-card px-4 py-3 text-sm font-bold text-foreground-secondary transition-colors hover:bg-surface-soft"
              >
                <Clock className="h-4 w-4" />
                Ver anteriores
              </button>
              <button
                onClick={handleNew}
                className="flex items-center justify-center gap-2 rounded-xl border-2 border-stroke-light bg-card px-4 py-3 text-sm font-bold text-foreground-secondary transition-colors hover:bg-surface-soft"
              >
                <Zap className="h-4 w-4" />
                Nova melhoria
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── History Modal ── */}
      {historyOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setHistoryOpen(false)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setHistoryOpen(false);
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Melhorias anteriores"
        >
          <div
            className="relative w-full max-w-lg rounded-t-2xl sm:rounded-2xl bg-card p-5 shadow-xl max-h-[80vh] overflow-y-auto animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-extrabold text-foreground-dark">
                  Melhorias anteriores
                </h2>
                <p className="text-[11px] text-foreground-tertiary">
                  Disponíveis somente nesta sessão.
                </p>
              </div>
              <button
                onClick={() => setHistoryOpen(false)}
                className="rounded-full p-1.5 text-foreground-tertiary hover:bg-surface-soft transition-colors"
                aria-label="Fechar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Empty state */}
            {history.length === 0 && (
              <div className="text-center py-8">
                <Clock className="mx-auto h-10 w-10 text-foreground-placeholder" strokeWidth={1.5} />
                <p className="mt-2 text-sm font-bold text-foreground-dark">
                  Nenhuma melhoria anterior
                </p>
                <p className="mt-1 text-xs text-foreground-tertiary">
                  As melhorias concluídas nesta sessão aparecerão aqui.
                </p>
                <button
                  onClick={() => setHistoryOpen(false)}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl border-2 border-stroke-light bg-card px-6 py-2.5 text-sm font-bold text-foreground-secondary transition-colors hover:bg-surface-soft"
                >
                  Fechar
                </button>
              </div>
            )}

            {/* History list */}
            {history.length > 0 && (
              <div className="space-y-2">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-xl border-2 border-stroke-light bg-card p-3 transition-colors hover:bg-surface-soft cursor-pointer"
                    onClick={() => handleOpenHistory(item)}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald/10 text-emerald">
                      <Wand2 className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-foreground-dark truncate">
                        {item.snippet}
                      </p>
                      <p className="text-[10px] text-foreground-tertiary">
                        Salto +{item.jump.toFixed(1)} • {item.timestamp}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenHistory(item);
                      }}
                      className="rounded-lg bg-emerald/10 px-3 py-1.5 text-[10px] font-extrabold text-emerald hover:bg-emerald/20 transition-colors"
                      aria-label={`Ver resultado`}
                    >
                      Ver resultado
                    </button>
                  </div>
                ))}

                <button
                  onClick={() => setHistoryOpen(false)}
                  className="mt-3 w-full rounded-xl border-2 border-stroke-light bg-card py-2.5 text-sm font-bold text-foreground-secondary transition-colors hover:bg-surface-soft"
                >
                  Fechar
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <AppBottomNav />
    </div>
  );
}
