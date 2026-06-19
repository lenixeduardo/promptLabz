import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Send,
  Lightbulb,
  Heart,
  ArrowRight,
  CheckCircle2,
  Camera,
  Upload,
  ImageIcon,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { advanceModule, type TrackId } from "@/lib/moduleProgress";
import { getQuestions, getProofTask, TRACK_TOTALS } from "@/lib/lessonContent";
import { scopedKey } from "@/lib/userScope";

const proofKey = (track: TrackId, module: number) =>
  scopedKey(`promptlabz:proof:${track}:${module}`);

function readProof(track: TrackId, module: number): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(proofKey(track, module));
  } catch {
    return null;
  }
}

export default function LessonPage() {
  const [searchParams] = useSearchParams();
  const track = (searchParams.get("track") as TrackId) || "a1";
  const module = parseInt(searchParams.get("module") || "0", 10);

  const QUESTIONS = useMemo(() => getQuestions(track, module), [track, module]);
  const proofTask = useMemo(() => getProofTask(track, module), [track, module]);
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [proofDataUrl, setProofDataUrl] = useState<string | null>(() => readProof(track, module));
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setProofDataUrl(readProof(track, module));
  }, [track, module]);

  const finished = step >= QUESTIONS.length;
  const q = QUESTIONS[step];
  const answered = selected !== null;
  const isRight = !finished && selected === q?.correct;
  const isLast = step === QUESTIONS.length - 1;
  const score = Object.entries(answers).filter(
    ([qId, ans]) => QUESTIONS.find((qq) => qq.id === qId)?.correct === ans,
  ).length;

  function pick(id: string) {
    if (answered || !q) return;
    setSelected(id);
    setAnswers((prev) => ({ ...prev, [q.id]: id }));
  }

  function next() {
    setSelected(null);
    setStep((s) => s + 1);
  }

  function handleFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result ?? "");
      if (!dataUrl) return;
      try {
        localStorage.setItem(proofKey(track, module), dataUrl);
      } catch {
        // quota full: keep in memory only
      }
      setProofDataUrl(dataUrl);
    };
    reader.readAsDataURL(file);
  }

  function clearProof() {
    try {
      localStorage.removeItem(proofKey(track, module));
    } catch {
      // ignore
    }
    setProofDataUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const progress = Math.round(((step + (answered ? 1 : 0)) / QUESTIONS.length) * 100);

  const perfect = finished && score === QUESTIONS.length;
  const needsProof = !!proofTask;
  const proofDone = !!proofDataUrl;
  const lessonComplete = perfect && (!needsProof || proofDone);

  useEffect(() => {
    if (lessonComplete) advanceModule(TRACK_TOTALS[track], track);
  }, [lessonComplete, track]);

  if (finished && needsProof && !proofDone) {
    return (
      <div className="flex min-h-screen flex-col bg-gradient-to-b from-page-bg-light to-page-bg">
        <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-stroke-muted bg-card px-4 py-3">
          <Link to="/learn" className="rounded-full p-1.5 text-forest hover:bg-surface-success">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-base font-bold text-primary-dark">Tarefa prática</h1>
        </div>

        <div className="flex flex-1 flex-col px-5 py-6">
          <div className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-luxury/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-luxury">
            <Camera className="h-3.5 w-3.5" /> Enviar comprovação
          </div>

          <h2 className="text-xl font-extrabold text-foreground-dark">{proofTask!.title}</h2>
          <p className="mt-2 text-sm text-foreground-secondary">{proofTask!.description}</p>

          <div className="mt-4 rounded-2xl border border-stroke-muted bg-surface-soft p-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-foreground-tertiary">
              Exemplos válidos
            </p>
            <ul className="mt-1.5 space-y-1 text-xs text-foreground-secondary">
              {proofTask!.examples.map((ex) => (
                <li key={ex} className="flex items-start gap-1.5">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald" />
                  <span>{ex}</span>
                </li>
              ))}
            </ul>
          </div>

          <label
            htmlFor="proof-file"
            className="mt-6 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-stroke-light bg-card px-4 py-10 text-center transition-colors hover:border-emerald hover:bg-surface-success/40"
          >
            <Upload className="h-8 w-8 text-emerald" />
            <p className="text-sm font-bold text-foreground-dark">Toque para enviar um print</p>
            <p className="text-[11px] text-foreground-tertiary">PNG ou JPG · da galeria ou câmera</p>
          </label>
          <input
            id="proof-file"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />

          <div className="mt-4 flex items-start gap-2 rounded-xl bg-amber-50 px-3 py-2 text-[11px] text-amber-800">
            <ImageIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>
              O print fica salvo só no seu dispositivo. Ele serve para você validar sua prática —
              o módulo só é concluído após o envio.
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="flex min-h-screen flex-col bg-gradient-to-b from-page-bg-light to-page-bg">
        <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-stroke-muted bg-card px-4 py-3">
          <Link to="/learn" className="rounded-full p-1.5 text-forest hover:bg-surface-success">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-base font-bold text-primary-dark">Lição concluída</h1>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center px-6 py-8 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald/15">
            <CheckCircle2 className="h-10 w-10 text-emerald" strokeWidth={2.5} />
          </div>
          <h2 className="mt-4 text-2xl font-extrabold text-foreground-dark">
            {perfect ? "Perfeito!" : "Boa tentativa!"}
          </h2>
          <p className="mt-1 text-sm text-foreground-tertiary">
            Você acertou {score} de {QUESTIONS.length} perguntas
          </p>
          {perfect && (
            <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald/15 px-3 py-1 text-xs font-bold text-emerald">
              <CheckCircle2 className="h-3.5 w-3.5" /> Próximo módulo desbloqueado!
            </p>
          )}

          {needsProof && proofDataUrl && (
            <div className="mt-5 w-full max-w-xs">
              <p className="mb-2 inline-flex items-center gap-1 rounded-full bg-emerald/15 px-3 py-1 text-[11px] font-bold text-emerald">
                <Camera className="h-3 w-3" /> Comprovação enviada
              </p>
              <img
                src={proofDataUrl}
                alt="Print enviado"
                className="w-full rounded-xl border border-stroke-muted object-cover"
              />
              <button
                type="button"
                onClick={clearProof}
                className="mt-2 text-[11px] font-bold text-foreground-tertiary underline"
              >
                Enviar outro print
              </button>
            </div>
          )}

          <div className="mt-5 grid w-full max-w-xs grid-cols-2 gap-3">
            <div className="rounded-xl border border-stroke-muted bg-surface-soft py-3 text-center">
              <p className="text-[10px] font-semibold text-foreground-tertiary">XP</p>
              <p className="text-base font-extrabold text-emerald">+{score * 25}</p>
            </div>
            <div className="rounded-xl border border-stroke-muted bg-surface-soft py-3 text-center">
              <p className="text-[10px] font-semibold text-foreground-tertiary">Gemas</p>
              <p className="text-base font-extrabold text-luxury">+{score * 3}</p>
            </div>
          </div>

          <div className="mt-6 flex w-full max-w-xs flex-col gap-3">
            <Link
              to="/module-exam"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-luxury py-4 text-sm font-extrabold uppercase tracking-wide text-luxury-foreground shadow-lg shadow-luxury/30 transition-transform active:scale-[0.98]"
            >
              Fazer prova final do módulo
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/learn"
              className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-emerald bg-card py-3 text-sm font-bold text-emerald hover:bg-surface-success"
            >
              Voltar à trilha
            </Link>
            <button
              onClick={() => {
                setStep(0);
                setSelected(null);
                setAnswers({});
              }}
              className="rounded-2xl border-2 border-stroke-light bg-card py-3 text-sm font-bold text-foreground-dark transition-colors hover:bg-surface-soft"
            >
              Refazer lição
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-page-bg-light to-page-bg">
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-stroke-muted bg-card px-4 py-3">
        <Link to="/learn" className="rounded-full p-1.5 text-forest hover:bg-surface-success">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-stroke-muted/40">
          <div
            className="h-full rounded-full bg-emerald transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-sm font-bold text-red-500">
          <Heart className="h-3.5 w-3.5 fill-red-500" /> <span>5</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-5 py-6">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-foreground-tertiary">
          Pergunta {step + 1} de {QUESTIONS.length}
        </p>

        <div className="mb-6 flex items-start gap-3">
          <img src="/assets/mascot-teacher.png" alt="" className="h-16 w-16 shrink-0 object-contain" />
          <div className="relative rounded-2xl rounded-tl-none border-2 border-stroke-light bg-card px-4 py-3 shadow-sm">
            <p className="text-sm font-bold text-foreground-dark">{q.prompt}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {q.options.map((opt) => {
            const isSelected = selected === opt.id;
            const isOptCorrect = opt.id === q.correct;
            return (
              <button
                key={opt.id}
                disabled={answered}
                onClick={() => pick(opt.id)}
                className={cn(
                  "rounded-2xl border-2 px-4 py-3 text-left text-sm font-medium transition-all active:scale-[0.99]",
                  !answered && "border-stroke-light bg-card hover:border-emerald",
                  answered && isOptCorrect && "border-emerald bg-surface-success text-emerald-dark",
                  answered && isSelected && !isOptCorrect && "border-red-300 bg-red-50 text-red-700",
                  answered && !isSelected && !isOptCorrect && "border-stroke-light bg-card opacity-60",
                )}
              >
                <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-page-bg-light text-xs font-extrabold text-forest">
                  {opt.id.toUpperCase()}
                </span>
                {opt.text}
              </button>
            );
          })}
        </div>

        {answered && (
          <div
            className={cn(
              "mt-6 rounded-2xl border-2 p-4",
              isRight ? "border-emerald bg-surface-success" : "border-red-300 bg-red-50",
            )}
          >
            <div className="flex items-start gap-2">
              <Lightbulb className={cn("h-5 w-5 shrink-0", isRight ? "text-emerald-dark" : "text-red-500")} />
              <div>
                <p className={cn("text-sm font-bold", isRight ? "text-emerald-dark" : "text-red-700")}>
                  {isRight ? "Mandou bem!" : "Quase lá!"}
                </p>
                <p className="mt-1 text-xs text-foreground-secondary">{q.explanation}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-auto pt-6">
          {answered ? (
            <button
              onClick={next}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald py-4 text-sm font-extrabold uppercase tracking-wide text-white transition-colors hover:bg-emerald-dark"
            >
              {isLast ? "Ver resultado" : "Próxima pergunta"}
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <div className="flex w-full items-center justify-center gap-2 rounded-2xl bg-stroke-light py-4 text-sm font-extrabold uppercase tracking-wide text-neutral pointer-events-none">
              Selecione uma opção
              <Send className="h-4 w-4" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
