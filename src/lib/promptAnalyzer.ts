/**
 * promptAnalyzer.ts
 *
 * Local, deterministic prompt analysis engine for the MVP.
 * Evaluates prompts based on criteria reused from the Lab:
 * extension, persona, clear action, context, format, constraints,
 * audience, examples, tone, negative directives, guided reasoning, delimiters.
 *
 * No network calls. No AI. Pure heuristics.
 */

export type Classification = "muito_vago" | "bom_mas_melhora" | "excelente";

export interface PromptFeedback {
  /** Position in conversation */
  position: number;
  /** The original prompt text */
  text: string;
  /** Timestamp if present */
  timestamp?: string;
  /** Score from 0.0 to 10.0 */
  score: number;
  /** Classification label */
  classification: Classification;
  /** CSS color class based on classification */
  colorClass: "text-red-400" | "text-luxury" | "text-emerald";
  /** Up to 3 strengths */
  strengths: string[];
  /** Up to 3 weaknesses */
  weaknesses: string[];
  /** Short explanation */
  explanation: string;
  /** Rewritten suggestion */
  suggestion: string;
}

export interface AnalysisSummary {
  totalAnalyzed: number;
  excellentCount: number;
  improvementCount: number;
  needsWorkCount: number;
  recurringStrengths: string[];
  recurringWeaknesses: string[];
  finalMessage: { title: string; message: string };
}

export interface AnalysisResult {
  /** Average score across all prompts */
  averageScore: number;
  /** Individual prompt feedbacks */
  feedbacks: PromptFeedback[];
  /** Consolidated summary */
  summary: AnalysisSummary;
}

// ── Classification helpers ───────────────────────────────────────────────

function getClassification(score: number): {
  classification: Classification;
  colorClass: "text-red-400" | "text-luxury" | "text-emerald";
  label: string;
} {
  if (score < 5) {
    return {
      classification: "muito_vago",
      colorClass: "text-red-400",
      label: "Prompt muito vago",
    };
  }
  if (score < 8) {
    return {
      classification: "bom_mas_melhora",
      colorClass: "text-luxury",
      label: "Bom prompt, mas pode melhorar",
    };
  }
  return {
    classification: "excelente",
    colorClass: "text-emerald",
    label: "Excelente prompt!",
  };
}

function getFinalMessage(average: number): { title: string; message: string } {
  if (average < 5) {
    return {
      title: "Vamos fortalecer seus prompts",
      message:
        "Seus pedidos ainda precisam de mais contexto, objetivo e formato. Use as sugestões abaixo como ponto de partida.",
    };
  }
  if (average < 8) {
    return {
      title: "Bom caminho!",
      message:
        "Seus prompts têm uma base útil. Detalhes mais específicos podem tornar as respostas muito melhores.",
    };
  }
  return {
    title: "Muito bom! 🎉",
    message:
      "Seus prompts estão acima da média. Continue refinando contexto e critérios para chegar ainda mais longe.",
  };
}

// ── Individual evaluation ────────────────────────────────────────────────

function evaluateSinglePrompt(text: string, position: number): PromptFeedback {
  const raw = text.trim();
  const t = raw.toLowerCase();
  const words = raw.split(/\s+/).filter(Boolean);
  const wc = words.length;
  const sentences = raw.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;

  let score = 2.0; // base score (0-10 scale)
  const strengths: string[] = [];
  const weaknesses: string[] = [];

  // --- Persona ---
  if (
    /\b(aja como|atue como|você é um|você é uma|assuma o papel|persona|especialista em|seja um|seja uma)\b/.test(t)
  ) {
    score += 1.2;
    strengths.push("Persona definida");
  } else {
    weaknesses.push("Definir uma persona pode dar mais direção à IA");
  }

  // --- Clear action ---
  if (
    /\b(crie|escreva|gere|liste|explique|resuma|traduza|analise|compare|sugira|descreva|reescreva|classifique|extraia|recomende|elabore|desenvolva|produza)\b/.test(t)
  ) {
    score += 1.0;
    strengths.push("Ação clara");
  } else {
    weaknesses.push("Incluir um verbo de ação claro (crie, analise, explique…)");
  }

  // --- Context ---
  if (
    /\b(contexto|cenário|background|situação|estou|tenho|preciso|meu objetivo|nosso produto|a empresa)\b/.test(t)
  ) {
    score += 1.0;
    strengths.push("Contexto incluído");
  } else {
    weaknesses.push("Adicionar mais contexto sobre a situação ou objetivo");
  }

  // --- Format ---
  if (
    /\b(formato|estrutura|em formato|responda em|saída em|lista|tabela|markdown|json|tópicos|bullet|seções|parágrafos)\b/.test(t)
  ) {
    score += 1.2;
    strengths.push("Formato especificado");
  } else {
    weaknesses.push("Especificar o formato de saída desejado");
  }

  // --- Constraints ---
  if (/\b(máximo|mínimo|no máximo|no mínimo|até \d+|limite|palavras|caracteres|tokens|frases|parágrafos)\b/.test(t)) {
    score += 1.0;
    strengths.push("Restrições definidas");
  } else {
    weaknesses.push("Definir limites ou restrições refina a resposta");
  }

  // --- Audience ---
  if (
    /\b(público[- ]alvo|destinado a|voltado para|para iniciantes|para leigos|para crianças|para desenvolvedores|para gerentes|audiência|leitor)\b/.test(t)
  ) {
    score += 0.8;
    strengths.push("Público-alvo definido");
  }

  // --- Examples ---
  if (/\b(exemplo|exemplos|por exemplo|ex:|few[- ]?shot|como no exemplo|veja:)\b/.test(t)) {
    score += 1.0;
    strengths.push("Inclui exemplos (few-shot)");
  }

  // --- Tone ---
  if (
    /\b(tom|estilo|formal|informal|amigável|profissional|divertido|técnico|didático|conciso|persuasivo)\b/.test(t)
  ) {
    score += 0.6;
    strengths.push("Tom definido");
  }

  // --- Negative directives ---
  if (/\b(não use|evite|sem usar|não inclua|nunca|jamais|exceto|não mencione)\b/.test(t)) {
    score += 0.5;
    strengths.push("Diretrizes negativas");
  }

  // --- Guided reasoning ---
  if (
    /\b(passo a passo|step by step|pense em etapas|raciocine|justifique|explique seu raciocínio|chain of thought)\b/.test(t)
  ) {
    score += 0.6;
    strengths.push("Raciocínio guiado");
  }

  // --- Delimiters ---
  if (/(```|---|###|<(\w+)>|"""|\[\[)/.test(raw)) {
    score += 0.4;
    strengths.push("Delimitadores visuais");
  }

  // --- Length penalties ---
  if (wc < 5) {
    score -= 1.5;
    weaknesses.push("Prompt muito curto — tente detalhar mais");
  }
  if (sentences === 1 && wc < 12) {
    score -= 0.5;
  }

  // --- Very generic prompts ---
  if (/^(faça|faz|me ajuda|me ajude|preciso de ajuda|help|oi|olá)\s*[.!?]?$/i.test(raw)) {
    score -= 2.0;
    weaknesses.push("Muito genérico — descreva o que você precisa exatamente");
  }

  // Clamp score
  score = Math.max(0, Math.min(10, Math.round(score * 10) / 10));

  // Generate explanation
  let explanation = "";
  if (score >= 8) {
    explanation = "O prompt tem estrutura sólida, contexto claro e especificações boas. Pequenos refinamentos podem elevar ainda mais a qualidade.";
  } else if (score >= 5) {
    explanation = "O prompt tem uma base, mas detalhes adicionais de contexto, formato ou restrições podem melhorar o resultado.";
  } else {
    explanation = "O prompt está muito genérico. Adicionar contexto, ação clara e formato de saída vai trazer respostas muito mais úteis.";
  }

  // Generate suggestion
  const suggestion = generateSuggestion(raw, t, strengths, weaknesses);

  const { classification, colorClass } = getClassification(score);

  return {
    position,
    text,
    score,
    classification,
    colorClass,
    strengths: strengths.length > 0 ? strengths : ["Ainda não identificamos um ponto forte consistente."],
    weaknesses: weaknesses.length > 0 ? weaknesses : ["Nenhuma falha crítica detectada."],
    explanation,
    suggestion,
  };
}

// ── Suggestion generator ─────────────────────────────────────────────────

function generateSuggestion(
  raw: string,
  lower: string,
  strengths: string[],
  weaknesses: string[],
): string {
  let suggestion = raw;

  // Add persona if missing
  if (!/\b(aja como|atue como|você é um|persona|especialista em)\b/.test(lower)) {
    suggestion = `Atue como [especialista/papel desejado]. ${suggestion}`;
  }

  // Add context if missing  
  if (!/\b(contexto|estou|tenho|preciso|meu objetivo)\b/.test(lower)) {
    suggestion = `${suggestion}\n\nContexto: [descreva a situação ou objetivo aqui]`;
  }

  // Add format if missing
  if (!/\b(formato|lista|tabela|markdown|json|bullet|seções|parágrafos)\b/.test(lower)) {
    suggestion = `${suggestion}\n\nFormato de saída: [especifique como a IA deve responder]`;
  }

  // Add audience if missing
  if (!/\b(público[- ]alvo|para iniciantes|audiência)\b/.test(lower)) {
    suggestion = `${suggestion}\n\nPúblico-alvo: [para quem é este conteúdo]`;
  }

  // Add tone if missing
  if (!/\b(tom|estilo|formal|informal|profissional|didático)\b/.test(lower)) {
    suggestion = `${suggestion}\n\nTom: [formal, informal, técnico, didático…]`;
  }

  // Add constraints if missing
  if (!/\b(máximo|mínimo|limite|até \d+)\b/.test(lower)) {
    suggestion = `${suggestion}\n\nRestrições: [limite de palavras, tópicos a evitar, etc.]`;
  }

  return suggestion;
}

// ── Main analysis function ───────────────────────────────────────────────

export function analyzePrompts(messages: { position: number; text: string; timestamp?: string }[]): AnalysisResult {
  const feedbacks: PromptFeedback[] = messages.map((msg) =>
    evaluateSinglePrompt(msg.text, msg.position),
  );

  // Average score
  const totalScore = feedbacks.reduce((sum, f) => sum + f.score, 0);
  const averageScore = feedbacks.length > 0 
    ? Math.round((totalScore / feedbacks.length) * 10) / 10 
    : 0;

  // Count classifications
  const excellentCount = feedbacks.filter((f) => f.classification === "excelente").length;
  const improvementCount = feedbacks.filter((f) => f.classification === "bom_mas_melhora").length;
  const needsWorkCount = feedbacks.filter((f) => f.classification === "muito_vago").length;

  // Recurring strengths & weaknesses
  const strengthCounts = new Map<string, number>();
  const weaknessCounts = new Map<string, number>();

  for (const f of feedbacks) {
    for (const s of f.strengths) {
      if (s !== "Ainda não identificamos um ponto forte consistente.") {
        strengthCounts.set(s, (strengthCounts.get(s) || 0) + 1);
      }
    }
    for (const w of f.weaknesses) {
      if (w !== "Nenhuma falha crítica detectada.") {
        weaknessCounts.set(w, (weaknessCounts.get(w) || 0) + 1);
      }
    }
  }

  const recurringStrengths = [...strengthCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name]) => name);

  const recurringWeaknesses = [...weaknessCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name]) => name);

  const summary: AnalysisSummary = {
    totalAnalyzed: feedbacks.length,
    excellentCount,
    improvementCount,
    needsWorkCount,
    recurringStrengths,
    recurringWeaknesses,
    finalMessage: getFinalMessage(averageScore),
  };

  return { averageScore, feedbacks, summary };
}
