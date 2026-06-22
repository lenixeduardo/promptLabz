import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Shield,
  Lightbulb,
  Upload,
  FileText,
  Lock,
  CheckCircle2,
  AlertCircle,
  Clock,
  Copy,
  Check,
  X,
  Sparkles,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { getLocalGems } from "@/lib/xp";
import { parseContent, type ParseResult } from "@/lib/promptParser";
import { analyzePrompts, type AnalysisResult, type PromptFeedback } from "@/lib/promptAnalyzer";
import { AppBottomNav } from "@/components/AppBottomNav";

// ── Types ─────────────────────────────────────────────────────────────────

type PageState =
  | "upload"
  | "file_selected"
  | "analyzing"
  | "error_type"
  | "error_size"
  | "error_empty"
  | "error_read"
  | "result";

interface HistoryItem {
  id: string;
  fileName: string;
  timestamp: string;
  promptCount: number;
  averageScore: number;
  result: AnalysisResult;
  parseWarning?: string;
  parseCapped?: boolean;
  parseTotalFound?: number;
}

interface FileInfo {
  name: string;
  size: number;
  content: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────

const MAX_FILE_SIZE = 2_097_152; // 2 MB
const ALLOWED_EXTENSIONS = [".txt", ".md"];

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

function formatTime(): string {
  const now = new Date();
  return now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function getExtension(filename: string): string {
  const idx = filename.lastIndexOf(".");
  return idx >= 0 ? filename.slice(idx).toLowerCase() : "";
}

// ── Static example data ──────────────────────────────────────────────────

const EXAMPLE_PROMPTS: { prompt: string; title: string; text: string; sugestao: string; label: string; color: string; bgColor: string; borderColor: string }[] = [
  {
    prompt: "Crie um texto sobre marketing.",
    title: "Prompt muito vago",
    text: "Faltam contexto, objetivo, público, tom e formato de entrega.",
    sugestao: "Crie um texto persuasivo sobre marketing digital para pequenas empresas, com tom profissional e formato de artigo para blog.",
    label: "Solução sugerida",
    color: "text-red-400",
    bgColor: "bg-red-50 dark:bg-red-950/20",
    borderColor: "border-red-200 dark:border-red-900/40",
  },
  {
    prompt: "Explique como funciona o marketing de conteúdo para iniciantes.",
    title: "Bom prompt, mas pode melhorar",
    text: "Inclua o formato desejado e o nível de profundidade.",
    sugestao: "Explique como funciona o marketing de conteúdo para iniciantes, com exemplos práticos e passos acionáveis.",
    label: "Sugestão",
    color: "text-luxury",
    bgColor: "bg-amber-50 dark:bg-amber-950/20",
    borderColor: "border-amber-200 dark:border-amber-900/40",
  },
  {
    prompt: "Quais são as melhores estratégias de SEO para um site novo e como aplicá-las?",
    title: "Excelente prompt!",
    text: "Pedido claro, específico e com contexto suficiente para gerar uma resposta útil.",
    sugestao: "",
    label: "",
    color: "text-emerald",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
    borderColor: "border-emerald-200 dark:border-emerald-900/40",
  },
];

// ── Components ────────────────────────────────────────────────────────────

function ProgressStep({
  label,
  active,
  done,
}: {
  label: string;
  active: boolean;
  done: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all",
          done && "bg-emerald text-white",
          active && !done && "bg-emerald/20 text-emerald animate-pulse",
          !active && !done && "bg-surface-soft text-foreground-tertiary",
        )}
      >
        {done ? <Check className="h-4 w-4" /> : active ? <Sparkles className="h-4 w-4" /> : <div className="h-2 w-2 rounded-full bg-foreground-tertiary/40" />}
      </div>
      <span
        className={cn(
          "text-sm font-semibold transition-colors",
          done && "text-emerald",
          active && !done && "text-foreground-dark",
          !active && !done && "text-foreground-tertiary",
        )}
      >
        {label}
      </span>
    </div>
  );
}

function FeedbackCard({ feedback }: { feedback: PromptFeedback }) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  const handleCopy = useCallback(async () => {
    setCopyError(false);
    try {
      await navigator.clipboard.writeText(feedback.suggestion);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopyError(true);
      setTimeout(() => setCopyError(false), 3000);
    }
  }, [feedback.suggestion]);

  const scoreColor =
    feedback.score >= 8
      ? "bg-emerald/10 text-emerald border-emerald/30"
      : feedback.score >= 5
        ? "bg-luxury/10 text-luxury border-luxury/30"
        : "bg-red-50 dark:bg-red-950/20 text-red-400 border-red-200 dark:border-red-900/40";

  return (
    <div className="rounded-2xl border-2 border-stroke-light bg-card p-4 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-bold text-foreground-tertiary">
            Prompt {feedback.position}
          </p>
          <p className="text-[11px] text-foreground-placeholder">Você</p>
        </div>
        <div className={cn("flex items-center gap-1 rounded-lg border px-2.5 py-1", scoreColor)}>
          <span className="text-sm font-extrabold">{feedback.score.toFixed(1)}</span>
          <span className="text-[10px] font-bold opacity-70">/10</span>
        </div>
      </div>

      {/* Prompt text */}
      <div className="rounded-xl bg-surface-soft p-3">
        <p className="text-xs leading-relaxed text-foreground-dark line-clamp-4">
          {feedback.text}
        </p>
      </div>

      {/* Strengths */}
      <div>
        <p className="text-[11px] font-bold text-foreground-tertiary mb-1.5">
          Pontos fortes
        </p>
        <div className="flex flex-wrap gap-1.5">
          {feedback.strengths.map((s, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 rounded-full bg-emerald/10 px-2.5 py-1 text-[10px] font-semibold text-emerald"
            >
              <CheckCircle2 className="h-3 w-3" />
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Weaknesses */}
      <div>
        <p className="text-[11px] font-bold text-foreground-tertiary mb-1.5">
          O que pode melhorar
        </p>
        <div className="flex flex-wrap gap-1.5">
          {feedback.weaknesses.map((w, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 rounded-full bg-red-50 dark:bg-red-950/20 px-2.5 py-1 text-[10px] font-semibold text-red-400"
            >
              <AlertCircle className="h-3 w-3" />
              {w}
            </span>
          ))}
        </div>
      </div>

      {/* Explanation */}
      <div className="rounded-lg border border-stroke-muted bg-surface-soft/50 p-3">
        <p className="text-[10px] font-bold text-foreground-tertiary mb-0.5">
          Por que recebeu esta nota
        </p>
        <p className="text-xs text-foreground-secondary leading-relaxed">
          {feedback.explanation}
        </p>
      </div>

      {/* Suggestion */}
      <div className="rounded-lg border border-luxury/30 bg-luxury/5 p-3">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[10px] font-bold text-luxury">Sugestão reescrita</p>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-bold text-forest hover:bg-surface-success transition-colors"
            aria-label={copied ? "Sugestão copiada!" : "Copiar sugestão"}
          >
            {copyError ? (
              <span className="text-red-400">Não foi possível copiar</span>
            ) : copied ? (
              <>
                <Check className="h-3 w-3" />
                Sugestão copiada!
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                Copiar sugestão
              </>
            )}
          </button>
        </div>
        <p className="text-xs text-foreground-dark leading-relaxed whitespace-pre-line">
          {feedback.suggestion}
        </p>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────

export default function PromptAnalyzerPage() {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const [gems, setGems] = useState(0);

  // Page state
  const [pageState, setPageState] = useState<PageState>("upload");
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  // Analyzing progress
  const [progressStep, setProgressStep] = useState(0);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // History
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load gems
  useEffect(() => {
    if (userId) {
      setGems(getLocalGems(userId));
    }
  }, [userId]);

  // Handle file selection
  const handleFileSelect = useCallback(async (file: File) => {
    // Validate extension
    const ext = getExtension(file.name);
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      setPageState("error_type");
      return;
    }

    // Validate size
    if (file.size > MAX_FILE_SIZE) {
      setPageState("error_size");
      return;
    }

    // Validate empty
    if (file.size === 0) {
      setPageState("error_empty");
      return;
    }

    // Read file
    try {
      const text = await file.text();

      if (!text.trim()) {
        setPageState("error_empty");
        return;
      }

      setFileInfo({ name: file.name, size: file.size, content: text });
      setPageState("file_selected");
    } catch {
      setPageState("error_read");
    }
  }, []);

  // Handle file input change
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      handleFileSelect(file);
      // Reset input so same file can be re-selected
      e.target.value = "";
    },
    [handleFileSelect],
  );

  // Start analysis
  const handleAnalyze = useCallback(() => {
    if (!fileInfo) return;

    // Clear any previous timers
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    setPageState("analyzing");
    setProgressStep(0);

    // Simulate progress steps
    const steps = [
      { label: "Lendo o arquivo", delay: 400 },
      { label: "Identificando suas mensagens", delay: 900 },
      { label: "Avaliando até 50 prompts", delay: 1500 },
      { label: "Preparando seu relatório", delay: 2200 },
    ];

    steps.forEach((step, i) => {
      const t = setTimeout(() => setProgressStep(i + 1), step.delay);
      timersRef.current.push(t);
    });

    // Run analysis
    const t = setTimeout(() => {
      timersRef.current = [];
      const parsed = parseContent(fileInfo.content);
      setParseResult(parsed);

      if (parsed.messages.length === 0) {
        setPageState("error_empty");
        return;
      }

      const analyzed = analyzePrompts(parsed.messages);
      setAnalysisResult(analyzed);

      // Add to history
      const item: HistoryItem = {
        id: Date.now().toString(36),
        fileName: fileInfo.name,
        timestamp: formatTime(),
        promptCount: analyzed.feedbacks.length,
        averageScore: analyzed.averageScore,
        result: analyzed,
        parseWarning: parsed.warning,
        parseCapped: parsed.capped,
        parseTotalFound: parsed.totalFound,
      };
      setHistory((prev) => [...prev, item]);

      setPageState("result");
    }, 2600);
    timersRef.current.push(t);
  }, [fileInfo]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, []);

  // Reset to upload
  const handleNewAnalysis = useCallback(() => {
    setPageState("upload");
    setFileInfo(null);
    setParseResult(null);
    setAnalysisResult(null);
    setProgressStep(0);
  }, []);

  // Remove file
  const handleRemoveFile = useCallback(() => {
    setFileInfo(null);
    setPageState("upload");
  }, []);

  // Restore result from history
  const handleOpenHistory = useCallback(
    (item: HistoryItem) => {
      setAnalysisResult(item.result);
      // Restore parse warning info so the result section shows correct alerts
      if (item.parseWarning) {
        setParseResult({
          source: "generic",
          messages: [],
          totalFound: item.parseTotalFound ?? 0,
          capped: item.parseCapped ?? false,
          fallback: !item.parseCapped,
          warning: item.parseWarning,
        });
      }
      setHistoryOpen(false);
      setPageState("result");
    },
    [],
  );

  // Progress steps display
  const PROGRESS_STEPS = [
    "Lendo o arquivo",
    "Identificando suas mensagens",
    "Avaliando até 50 prompts",
    "Preparando seu relatório",
  ];

  // Get classification details for result
  const scoreClass =
    analysisResult && analysisResult.averageScore >= 8
      ? "bg-emerald/10 text-emerald border-emerald/30"
      : analysisResult && analysisResult.averageScore >= 5
        ? "bg-luxury/10 text-luxury border-luxury/30"
        : "bg-red-50 dark:bg-red-950/20 text-red-400 border-red-200 dark:border-red-900/40";

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
              Analisador de Prompts
            </h1>
            <span className="inline-flex items-center rounded-full bg-emerald/15 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-emerald shrink-0">
              Novo
            </span>
          </div>
          <p className="text-[11px] text-foreground-tertiary truncate">
            Envie seu histórico de conversa com IA e receba uma análise completa.
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

      {/* ── Main Content Area ── */}
      <div className="mx-auto w-full max-w-lg flex-1 px-4 py-5 space-y-5">
        {/* ── STATE: UPLOAD ── */}
        {(pageState === "upload" || pageState === "file_selected") && (
          <>
            {/* Upload Card */}
            <div className="rounded-2xl border-2 border-emerald/30 bg-card p-5">
              {pageState === "upload" && (
                <div className="flex flex-col items-center gap-4 text-center">
                  {/* Cat mascot with magnifying glass */}
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald/10">
                    <div className="relative">
                      <Search className="h-10 w-10 text-emerald" strokeWidth={1.5} />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-foreground-dark">
                      Anexe seu histórico de conversa
                    </h2>
                    <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5">
                      <span className="inline-flex items-center rounded-full bg-emerald/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald border border-emerald/20">
                        .txt
                      </span>
                      <span className="inline-flex items-center rounded-full bg-emerald/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald border border-emerald/20">
                        .md
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-surface-soft px-2.5 py-0.5 text-[10px] font-bold text-foreground-tertiary border border-stroke-light">
                        <Lock className="h-3 w-3" />
                        .pdf — Em breve
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-surface-soft px-2.5 py-0.5 text-[10px] font-bold text-foreground-tertiary border border-stroke-light">
                        <Lock className="h-3 w-3" />
                        .docx — Em breve
                      </span>
                    </div>
                    <p className="mt-1.5 text-[11px] text-foreground-placeholder">
                      Tamanho máximo: 2 MB • Análise gratuita
                    </p>
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center gap-2 rounded-xl bg-emerald px-6 py-3 text-sm font-bold text-white transition-all hover:bg-emerald-dark active:scale-[0.98]"
                  >
                    <Upload className="h-4 w-4" />
                    Escolher arquivo
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".txt,.md"
                    onChange={handleInputChange}
                    className="hidden"
                    aria-label="Selecionar histórico de conversa em formato TXT ou Markdown"
                  />
                </div>
              )}

              {pageState === "file_selected" && fileInfo && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald/10 text-emerald">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-foreground-dark truncate">
                        {fileInfo.name}
                      </p>
                      <p className="text-[11px] text-foreground-tertiary">
                        {formatFileSize(fileInfo.size)} • Processamento local
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-foreground-tertiary">
                    Vamos analisar até 50 mensagens enviadas por você.
                  </p>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <button
                      onClick={handleAnalyze}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald py-3 text-sm font-bold text-white transition-all hover:bg-emerald-dark active:scale-[0.98]"
                    >
                      <Zap className="h-4 w-4" />
                      Analisar prompts
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center justify-center gap-2 rounded-xl border-2 border-stroke-light bg-card px-4 py-3 text-sm font-bold text-foreground-secondary transition-colors hover:bg-surface-soft"
                    >
                      Trocar arquivo
                    </button>
                    <button
                      onClick={handleRemoveFile}
                      className="flex items-center justify-center gap-2 rounded-xl border-2 border-red-200 dark:border-red-900/40 bg-card px-4 py-3 text-sm font-bold text-red-400 transition-colors hover:bg-red-50 dark:hover:bg-red-950/20"
                      aria-label={`Remover ${fileInfo.name}`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Privacy Message */}
            <div className="flex items-start gap-3 rounded-xl bg-emerald/5 border border-emerald/20 px-4 py-3">
              <Shield className="mt-0.5 h-5 w-5 shrink-0 text-emerald" strokeWidth={1.5} />
              <div>
                <p className="text-xs font-bold text-foreground-dark">
                  Seu arquivo fica no seu dispositivo
                </p>
                <p className="text-[11px] text-foreground-tertiary leading-relaxed mt-0.5">
                  O conteúdo é processado localmente no navegador. Ele nunca é enviado, salvo ou
                  compartilhado.
                </p>
              </div>
            </div>

            {/* Tip */}
            <div className="flex items-start gap-2 rounded-xl bg-surface-soft px-4 py-3 border border-stroke-muted">
              <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-emerald" strokeWidth={2} />
              <p className="text-xs text-foreground-secondary leading-relaxed">
                <span className="font-bold">Dica:</span> Exporte suas conversas do ChatGPT, Gemini,
                Claude ou outras IAs em formato .txt ou .md para facilitar a análise.
              </p>
            </div>

            {/* How it works */}
            <div>
              <h2 className="text-base font-extrabold text-foreground-dark mb-3">
                Como funciona
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  {
                    step: 1,
                    title: "Envie seu arquivo",
                    text: "Anexe o histórico da sua conversa com a IA.",
                  },
                  {
                    step: 2,
                    title: "Analisamos seus prompts",
                    text: "Avaliamos somente as mensagens que você enviou.",
                  },
                  {
                    step: 3,
                    title: "Você recebe o feedback",
                    text: "Identificamos pontos fortes, falhas e melhorias.",
                  },
                  {
                    step: 4,
                    title: "Confira sua nota final",
                    text: "Veja sua média e os padrões da conversa.",
                  },
                ].map((item) => (
                  <div
                    key={item.step}
                    className="rounded-xl border-2 border-stroke-light bg-card p-4"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald/10 text-emerald text-sm font-extrabold mb-2">
                      {item.step}
                    </div>
                    <p className="text-sm font-bold text-foreground-dark">{item.title}</p>
                    <p className="text-xs text-foreground-tertiary mt-0.5">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Examples */}
            <div>
              <h2 className="text-base font-extrabold text-foreground-dark mb-3">
                Exemplo de análise
              </h2>
              <div className="space-y-3">
                {EXAMPLE_PROMPTS.map((ex, i) => (
                  <div
                    key={i}
                    className={cn("rounded-xl border-2 p-4", ex.borderColor, ex.bgColor)}
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4">
                      <div className="flex-1">
                        <p className="text-[10px] font-bold text-foreground-tertiary uppercase tracking-wider mb-0.5">
                          Prompt
                        </p>
                        <p className="text-xs text-foreground-dark leading-relaxed bg-card/50 rounded-lg px-2.5 py-2 border border-stroke-muted">
                          "{ex.prompt}"
                        </p>
                      </div>
                      <div className="flex-1">
                        <p className={cn("text-xs font-extrabold", ex.color)}>{ex.title}</p>
                        <p className="text-[11px] text-foreground-tertiary mt-0.5">{ex.text}</p>
                        {ex.sugestao && (
                          <div className="mt-2 rounded-lg bg-luxury/5 border border-luxury/20 px-2.5 py-1.5">
                            <p className="text-[9px] font-bold text-luxury uppercase tracking-wider">
                              {ex.label}
                            </p>
                            <p className="text-[11px] text-foreground-secondary mt-0.5">
                              {ex.sugestao}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── STATE: ERROR TYPE ── */}
        {pageState === "error_type" && (
          <div className="rounded-2xl border-2 border-red-200 dark:border-red-900/40 bg-card p-6 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-400" strokeWidth={1.5} />
            <h2 className="mt-3 text-lg font-extrabold text-foreground-dark">Formato não aceito</h2>
            <p className="mt-1 text-sm text-foreground-tertiary">
              Escolha um arquivo .txt ou .md. PDF e DOCX estarão disponíveis em breve.
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald px-6 py-3 text-sm font-bold text-white transition-all hover:bg-emerald-dark active:scale-[0.98]"
            >
              Escolher outro arquivo
            </button>
          </div>
        )}

        {/* ── STATE: ERROR SIZE ── */}
        {pageState === "error_size" && (
          <div className="rounded-2xl border-2 border-red-200 dark:border-red-900/40 bg-card p-6 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-400" strokeWidth={1.5} />
            <h2 className="mt-3 text-lg font-extrabold text-foreground-dark">Arquivo muito grande</h2>
            <p className="mt-1 text-sm text-foreground-tertiary">
              O tamanho máximo é 2 MB. Escolha um arquivo menor e tente novamente.
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald px-6 py-3 text-sm font-bold text-white transition-all hover:bg-emerald-dark active:scale-[0.98]"
            >
              Escolher outro arquivo
            </button>
          </div>
        )}

        {/* ── STATE: ERROR EMPTY ── */}
        {pageState === "error_empty" && (
          <div className="rounded-2xl border-2 border-red-200 dark:border-red-900/40 bg-card p-6 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-400" strokeWidth={1.5} />
            <h2 className="mt-3 text-lg font-extrabold text-foreground-dark">
              Não encontramos conteúdo
            </h2>
            <p className="mt-1 text-sm text-foreground-tertiary">
              O arquivo está vazio ou contém apenas espaços. Escolha outro histórico para analisar.
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald px-6 py-3 text-sm font-bold text-white transition-all hover:bg-emerald-dark active:scale-[0.98]"
            >
              Escolher outro arquivo
            </button>
          </div>
        )}

        {/* ── STATE: ERROR READ ── */}
        {pageState === "error_read" && (
          <div className="rounded-2xl border-2 border-red-200 dark:border-red-900/40 bg-card p-6 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-400" strokeWidth={1.5} />
            <h2 className="mt-3 text-lg font-extrabold text-foreground-dark">
              Não foi possível ler o arquivo
            </h2>
            <p className="mt-1 text-sm text-foreground-tertiary">
              O arquivo pode estar corrompido ou com uma codificação incompatível. Salve-o novamente
              como UTF-8 e tente outra vez.
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald px-6 py-3 text-sm font-bold text-white transition-all hover:bg-emerald-dark active:scale-[0.98]"
            >
              Tentar com outro arquivo
            </button>
          </div>
        )}

        {/* ── STATE: ANALYZING ── */}
        {pageState === "analyzing" && (
          <div className="rounded-2xl border-2 border-emerald/30 bg-card p-6">
            <div className="text-center mb-6">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald/10 animate-bounce-slow">
                <Search className="h-10 w-10 text-emerald" strokeWidth={1.5} />
              </div>
              <h2 className="mt-3 text-lg font-extrabold text-foreground-dark">
                Analisando seus prompts…
              </h2>
              <p className="mt-1 text-sm text-foreground-tertiary">
                A gatinha investigadora está procurando padrões, pontos fortes e oportunidades de
                melhoria.
              </p>
            </div>
            <div className="space-y-4" role="progressbar" aria-label="Análise em andamento">
              {PROGRESS_STEPS.map((label, i) => (
                <ProgressStep
                  key={i}
                  label={label}
                  active={progressStep === i + 1}
                  done={progressStep > i + 1}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── STATE: RESULT ── */}
        {pageState === "result" && analysisResult && (
          <div className="space-y-5">
            {/* Warnings */}
            {parseResult?.warning && (
              <div
                className={cn(
                  "flex items-start gap-2 rounded-xl border px-4 py-3",
                  parseResult.capped
                    ? "border-luxury/30 bg-luxury/5"
                    : "border-blue-200 dark:border-blue-900/40 bg-blue-50 dark:bg-blue-950/20",
                )}
                role="alert"
              >
                <AlertCircle
                  className={cn(
                    "mt-0.5 h-4 w-4 shrink-0",
                    parseResult.capped ? "text-luxury" : "text-blue-400",
                  )}
                />
                <div>
                  <p className="text-xs font-bold text-foreground-dark">
                    {parseResult.capped
                      ? "Limite de 50 prompts aplicado"
                      : "Formato de conversa não reconhecido"}
                  </p>
                  <p className="text-[11px] text-foreground-tertiary mt-0.5">
                    {parseResult.capped
                      ? `Encontramos ${parseResult.totalFound} mensagens suas. Para manter a análise rápida, avaliamos as 50 primeiras.`
                      : "Não identificamos mensagens separadas no arquivo. Por isso, analisamos todo o texto como um único prompt."}
                  </p>
                </div>
              </div>
            )}

            {/* Result header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold text-foreground-dark">
                  Sua análise está pronta!
                </h2>
                <p className="text-xs text-foreground-tertiary">
                  {analysisResult.feedbacks.length === 1
                    ? "Analisamos 1 prompt do seu histórico."
                    : `Analisamos ${analysisResult.feedbacks.length} prompts do seu histórico.`}
                </p>
              </div>
              <span className="inline-flex items-center rounded-full bg-emerald/10 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider text-emerald border border-emerald/20">
                Processado localmente
              </span>
            </div>

            {/* Feedback list */}
            <div className="space-y-3">
              {analysisResult.feedbacks.map((fb) => (
                <FeedbackCard key={fb.position} feedback={fb} />
              ))}
            </div>

            {/* Final Score */}
            <div className="rounded-2xl border-2 border-stroke-light bg-card p-5 text-center">
              <p className="text-xs font-bold text-foreground-tertiary uppercase tracking-wider mb-3">
                Nota final da conversa
              </p>
              <div className={cn("mx-auto inline-flex items-center gap-2 rounded-2xl border px-5 py-3", scoreClass)}>
                <span className="text-4xl font-extrabold">
                  {analysisResult.averageScore.toFixed(1)}
                </span>
                <span className="text-sm font-bold opacity-70">/10</span>
              </div>
              <div className="mt-3 space-y-1">
                <p className="text-sm font-extrabold text-foreground-dark">
                  {analysisResult.summary.finalMessage.title}
                </p>
                <p className="text-xs text-foreground-tertiary max-w-sm mx-auto">
                  {analysisResult.summary.finalMessage.message}
                </p>
              </div>
            </div>

            {/* Summary */}
            <div className="rounded-2xl border-2 border-stroke-light bg-card p-5">
              <h3 className="text-sm font-extrabold text-foreground-dark mb-3">
                Resumo da análise
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                <div className="rounded-xl bg-emerald/5 border border-emerald/20 px-3 py-2.5 text-center">
                  <p className="text-lg font-extrabold text-emerald">
                    {analysisResult.summary.totalAnalyzed}
                  </p>
                  <p className="text-[10px] font-bold text-foreground-tertiary">
                    {analysisResult.summary.totalAnalyzed === 1
                      ? "1 prompt analisado"
                      : `${analysisResult.summary.totalAnalyzed} prompts analisados`}
                  </p>
                </div>
                <div className="rounded-xl bg-emerald/10 border border-emerald/30 px-3 py-2.5 text-center">
                  <p className="text-lg font-extrabold text-emerald">
                    {analysisResult.summary.excellentCount}
                  </p>
                  <p className="text-[10px] font-bold text-foreground-tertiary">
                    {analysisResult.summary.excellentCount === 1
                      ? "1 excelente"
                      : `${analysisResult.summary.excellentCount} excelentes`}
                  </p>
                </div>
                <div className="rounded-xl bg-luxury/10 border border-luxury/20 px-3 py-2.5 text-center">
                  <p className="text-lg font-extrabold text-luxury">
                    {analysisResult.summary.needsWorkCount}
                  </p>
                  <p className="text-[10px] font-bold text-foreground-tertiary">
                    {analysisResult.summary.needsWorkCount === 1
                      ? "1 necessita ajustes"
                      : `${analysisResult.summary.needsWorkCount} necessitam ajustes`}
                  </p>
                </div>
              </div>

              {/* Recurring strengths */}
              {analysisResult.summary.recurringStrengths.length > 0 && (
                <div className="mb-3">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <TrendingUp className="h-4 w-4 text-emerald" strokeWidth={2} />
                    <p className="text-[11px] font-bold text-foreground-tertiary">
                      Seus pontos fortes mais frequentes
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {analysisResult.summary.recurringStrengths.map((s, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 rounded-full bg-emerald/10 px-2.5 py-1 text-[10px] font-semibold text-emerald"
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Recurring weaknesses */}
              {analysisResult.summary.recurringWeaknesses.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <TrendingDown className="h-4 w-4 text-red-400" strokeWidth={2} />
                    <p className="text-[11px] font-bold text-foreground-tertiary">
                      O que mais pode elevar suas notas
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {analysisResult.summary.recurringWeaknesses.map((w, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 rounded-full bg-red-50 dark:bg-red-950/20 px-2.5 py-1 text-[10px] font-semibold text-red-400"
                      >
                        <AlertCircle className="h-3 w-3" />
                        {w}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                onClick={() => setHistoryOpen(true)}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-stroke-light bg-card px-4 py-3 text-sm font-bold text-foreground-secondary transition-colors hover:bg-surface-soft"
              >
                <Clock className="h-4 w-4" />
                Ver análises anteriores
              </button>
              <button
                onClick={handleNewAnalysis}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald px-4 py-3 text-sm font-bold text-white transition-all hover:bg-emerald-dark active:scale-[0.98]"
              >
                <BarChart3 className="h-4 w-4" />
                Nova análise
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
          onKeyDown={(e) => { if (e.key === "Escape") setHistoryOpen(false); }}
          role="dialog"
          aria-modal="true"
          aria-label="Análises anteriores"
        >
          <div
            className="relative w-full max-w-lg rounded-t-2xl sm:rounded-2xl bg-card p-5 shadow-xl max-h-[80vh] overflow-y-auto animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-extrabold text-foreground-dark">
                  Análises anteriores
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
                  Nenhuma análise anterior
                </p>
                <p className="mt-1 text-xs text-foreground-tertiary">
                  As análises concluídas nesta sessão aparecerão aqui.
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
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-foreground-dark truncate">
                        {item.fileName}
                      </p>
                      <p className="text-[10px] text-foreground-tertiary">
                        {item.promptCount} prompts • Nota {item.averageScore.toFixed(1)}/10 •{" "}
                        {item.timestamp}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenHistory(item);
                      }}
                      className="rounded-lg bg-emerald/10 px-3 py-1.5 text-[10px] font-extrabold text-emerald hover:bg-emerald/20 transition-colors"
                      aria-label={`Abrir análise de ${item.fileName}`}
                    >
                      Abrir análise
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
