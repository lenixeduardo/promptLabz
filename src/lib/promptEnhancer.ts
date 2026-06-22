/**
 * promptEnhancer.ts
 *
 * Local, deterministic prompt enhancement engine for the MVP.
 * Takes a raw prompt + optional refinement fields and produces a structured,
 * improved version. No network calls. No AI. Pure heuristics + template assembly.
 */

// ── Types ─────────────────────────────────────────────────────────────────

export interface EnhancementFields {
  persona?: string;
  context?: string;
  format?: string;
  tone?: string;
  audience?: string;
  constraints?: string;
}

export interface EnhancementResult {
  /** The original prompt text */
  original: string;
  /** The enhanced/improved prompt */
  enhanced: string;
  /** Score of the original prompt (0–10) */
  originalScore: number;
  /** Score of the enhanced prompt (0–10) */
  enhancedScore: number;
  /** The jump in quality (enhancedScore - originalScore) */
  jump: number;
  /** Which criteria were added by the enhancer */
  addedFields: string[];
  /** All criteria that are present in the enhanced version */
  presentFields: string[];
  /** Which criteria were already present in the original */
  originalFields: string[];
}

// ── Criteria weights ──────────────────────────────────────────────────────

interface Criterion {
  key: string;
  label: string;
  weight: number;
  detect: (text: string) => boolean;
}

const CRITERIA: Criterion[] = [
  {
    key: "persona",
    label: "Persona",
    weight: 1.5,
    detect: (t) =>
      /\b(aja como|atue como|você é um|você é uma|assuma o papel|persona|especialista em|seja um|seja uma|como um|como uma)\b/i.test(t),
  },
  {
    key: "action",
    label: "Ação clara",
    weight: 1.5,
    detect: (t) =>
      /\b(crie|escreva|gere|liste|explique|resuma|traduza|analise|compare|sugira|descreva|reescreva|classifique|extraia|recomende|elabore|desenvolva|produza|faça|crie um|crie uma|gere um)\b/i.test(t),
  },
  {
    key: "context",
    label: "Contexto",
    weight: 1.5,
    detect: (t) =>
      /\b(contexto|cenário|background|situação|estou|estamos|tenho|temos|preciso|precisamos|meu objetivo|nosso|a empresa|o projeto|para isso)\b/i.test(t),
  },
  {
    key: "format",
    label: "Formato",
    weight: 1.0,
    detect: (t) =>
      /\b(formato|estrutura|em formato|responda em|saída em|lista|tabela|markdown|json|tópicos|bullet|seções|parágrafos|enumere|organize como)\b/i.test(t),
  },
  {
    key: "tone",
    label: "Tom",
    weight: 1.0,
    detect: (t) =>
      /\b(tom|estilo|formal|informal|amigável|profissional|divertido|técnico|didático|conciso|persuasivo|casual|sério|acadêmico|criativo)\b/i.test(t),
  },
  {
    key: "audience",
    label: "Público",
    weight: 1.0,
    detect: (t) =>
      /\b(público[- ]alvo|destinado a|voltado para|para iniciantes|para leigos|para crianças|para desenvolvedores|para gerentes|audiência|leitor|para quem|público)\b/i.test(t),
  },
  {
    key: "constraints",
    label: "Restrições",
    weight: 1.0,
    detect: (t) =>
      /\b(máximo|mínimo|no máximo|no mínimo|até \d+|limite|palavras|caracteres|tokens|frases|parágrafos|não use|evite|sem usar|não inclua|excluindo)\b/i.test(t),
  },
  {
    key: "examples",
    label: "Exemplos",
    weight: 0.5,
    detect: (t) =>
      /\b(exemplo|exemplos|por exemplo|ex:|few[- ]?shot|como no exemplo|veja:|tal como|como por exemplo)\b/i.test(t),
  },
];

// ── Detection helpers ─────────────────────────────────────────────────────

function detectCriteria(text: string): string[] {
  const lower = text.toLowerCase();
  return CRITERIA.filter((c) => c.detect(lower)).map((c) => c.key);
}

function calculateScore(text: string): number {
  const lower = text.toLowerCase();
  let score = 1.0; // base

  for (const c of CRITERIA) {
    if (c.detect(lower)) {
      score += c.weight;
    }
  }

  // Length bonus
  const words = text.split(/\s+/).filter(Boolean).length;
  if (words >= 20) score += 0.5;
  if (words >= 50) score += 0.5;

  // Clamp
  return Math.round(Math.max(0, Math.min(10, score)) * 10) / 10;
}

function hasCriterion(key: string, text: string): boolean {
  const found = CRITERIA.find((c) => c.key === key);
  return found ? found.detect(text.toLowerCase()) : false;
}

function assembleEnhanced(
  raw: string,
  fields: EnhancementFields,
): { text: string; added: string[] } {
  const lower = raw.toLowerCase();
  const parts: string[] = [];
  const added: string[] = [];

  // 1. Persona
  const hasPersona = hasCriterion("persona", lower);
  const personaVal = fields.persona?.trim();
  if (!hasPersona && personaVal) {
    parts.push(`Atue como ${personaVal}.`);
    added.push("persona");
  } else if (!hasPersona && !personaVal) {
    parts.push(`Atue como [especialista/papel desejado].`);
  }

  // 2. Context
  const hasContext = hasCriterion("context", lower);
  const contextVal = fields.context?.trim();
  if (!hasContext && contextVal) {
    parts.push(`\n\nContexto: ${contextVal}`);
    added.push("context");
  } else if (!hasContext && !contextVal) {
    parts.push(`\n\nContexto: [descreva a situação ou objetivo aqui]`);
  }

  // 3. Main task (preserve original intent)
  if (hasPersona || hasContext || personaVal || contextVal) {
    parts.push(`\n\n${raw}`);
  } else {
    parts.push(raw);
  }

  // 4. Format
  const hasFormat = hasCriterion("format", lower);
  const formatVal = fields.format?.trim();
  if (!hasFormat && formatVal) {
    parts.push(`\n\nFormato de saída: ${formatVal}.`);
    added.push("format");
  } else if (!hasFormat && !formatVal) {
    parts.push(`\n\nFormato de saída: [especifique como a IA deve responder]`);
  }

  // 5. Tone
  const hasTone = hasCriterion("tone", lower);
  const toneVal = fields.tone?.trim();
  if (!hasTone && toneVal) {
    parts.push(`\n\nTom: ${toneVal}.`);
    added.push("tone");
  } else if (!hasTone && !toneVal) {
    parts.push(`\n\nTom: [formal, informal, técnico, didático…]`);
  }

  // 6. Audience
  const hasAudience = hasCriterion("audience", lower);
  const audienceVal = fields.audience?.trim();
  if (!hasAudience && audienceVal) {
    parts.push(`\n\nPúblico-alvo: ${audienceVal}.`);
    added.push("audience");
  }

  // 7. Constraints
  const hasConstraints = hasCriterion("constraints", lower);
  const constraintsVal = fields.constraints?.trim();
  if (!hasConstraints && constraintsVal) {
    parts.push(`\n\nRestrições: ${constraintsVal}.`);
    added.push("constraints");
  } else if (!hasConstraints && !constraintsVal) {
    parts.push(`\n\nRestrições: [limite de palavras, tópicos a evitar, etc.]`);
  }

  return {
    text: parts.join(""),
    added,
  };
}

// ── Main enhancement function ─────────────────────────────────────────────

export function enhancePrompt(
  prompt: string,
  fields: EnhancementFields = {},
): EnhancementResult {
  const trimmed = prompt.trim();

  if (!trimmed) {
    return {
      original: "",
      enhanced: "",
      originalScore: 0,
      enhancedScore: 0,
      jump: 0,
      addedFields: [],
      presentFields: [],
      originalFields: [],
    };
  }

  // Detect criteria in original
  const originalFields = detectCriteria(trimmed);
  const originalScore = calculateScore(trimmed);

  // Build enhanced version
  const { text: enhanced, added } = assembleEnhanced(trimmed, fields);
  const enhancedScore = calculateScore(enhanced);
  const presentFields = detectCriteria(enhanced);
  const jump = Math.round((enhancedScore - originalScore) * 10) / 10;

  return {
    original: trimmed,
    enhanced,
    originalScore,
    enhancedScore,
    jump: Math.max(0, jump),
    addedFields: added,
    presentFields,
    originalFields,
  };
}

// ── Utility: get all available criteria labels ────────────────────────────

export function getAllCriteriaLabels(): { key: string; label: string; weight: number }[] {
  return CRITERIA.map((c) => ({ key: c.key, label: c.label, weight: c.weight }));
}

export { CRITERIA };
