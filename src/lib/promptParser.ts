/**
 * promptParser.ts
 *
 * Parses exported conversation files (.txt / .md) from ChatGPT, Claude, Gemini
 * and generic text. Extracts only user messages, preserves order, and caps at 50.
 *
 * Privacy guarantee: no content ever leaves the browser or touches persistent storage.
 */

export type SourceFormat = "chatgpt" | "claude" | "gemini" | "generic" | "unknown";

export interface ParsedMessage {
  /** Position in conversation (1-based) */
  position: number;
  /** The raw text content of the user message */
  text: string;
  /** Timestamp if recognized in the export */
  timestamp?: string;
}

export interface ParseResult {
  /** Detected source format */
  source: SourceFormat;
  /** Extracted user messages (capped at 50) */
  messages: ParsedMessage[];
  /** Total user messages found before capping */
  totalFound: number;
  /** Whether the 50-message cap was applied */
  capped: boolean;
  /** Whether fallback mode was used (single prompt from entire content) */
  fallback: boolean;
  /** Warning text to display in the UI */
  warning?: string;
}

// ── Pattern helpers ──────────────────────────────────────────────────────

/** Speaker markers that identify a user message */
const USER_MARKERS = [
  /^\s*(?:User|You|Usuário|Você)\s*:\s*/im,
  /^\s*Human\s*:\s*/im,
];

/** Speaker markers that identify an assistant message (to be ignored) */
const ASSISTANT_MARKERS = [
  /^\s*(?:Assistant|ChatGPT|Claude|Gemini|Model|IA|Assistente)\s*:\s*/im,
];

/** Line that looks like a role label (any known speaker) */
const ANY_SPEAKER = /^\s*(User|You|Usuário|Você|Human|Assistant|ChatGPT|Claude|Gemini|Model|IA|Assistente)\s*:/im;

// ── Detection ─────────────────────────────────────────────────────────────

function detectSource(lines: string[]): SourceFormat {
  const text = lines.join("\n");

  const hasChatGPT = /\bChatGPT\b/i.test(text) || /---\s*ChatGPT\s*---/i.test(text);
  const hasClaude = /\bClaude\b/i.test(text) || /---\s*Claude\s*---/i.test(text);
  const hasGemini = /\bGemini\b/i.test(text) || /---\s*Gemini\s*---/i.test(text);

  if (hasChatGPT) return "chatgpt";
  if (hasClaude) return "claude";
  if (hasGemini) return "gemini";

  // Count speaker lines
  const speakerCount = lines.filter((l) => ANY_SPEAKER.test(l)).length;
  if (speakerCount >= 2) return "generic";

  return "unknown";
}

// ── Parsing ───────────────────────────────────────────────────────────────

function splitByRoles(lines: string[]): { role: "user" | "assistant" | "other"; text: string }[] {
  const blocks: { role: "user" | "assistant" | "other"; text: string }[] = [];
  let currentRole: "user" | "assistant" | "other" = "other";
  let currentLines: string[] = [];

  function flush() {
    if (currentLines.length > 0) {
      const text = currentLines.join("\n").replace(/^\s+|\s+$/g, "");
      if (text) {
        blocks.push({ role: currentRole, text });
      }
    }
  }

  for (const rawLine of lines) {
    const line = rawLine;

    // Check if this line starts a new role block
    let matchedRole: "user" | "assistant" | "other" | null = null;

    for (const marker of USER_MARKERS) {
      if (marker.test(line)) {
        matchedRole = "user";
        break;
      }
    }

    if (!matchedRole) {
      for (const marker of ASSISTANT_MARKERS) {
        if (marker.test(line)) {
          matchedRole = "assistant";
          break;
        }
      }
    }

    if (matchedRole) {
      flush();
      currentRole = matchedRole;
      // Remove the marker prefix from the content
      const cleaned = line.replace(ANY_SPEAKER, "").trim();
      currentLines = cleaned ? [cleaned] : [];
    } else {
      currentLines.push(line);
    }
  }

  flush();
  return blocks;
}

// ── Main parser ───────────────────────────────────────────────────────────

export function parseContent(content: string): ParseResult {
  // Normalize line endings
  const normalized = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const lines = normalized.split("\n");

  // Detect source
  const source = detectSource(lines);

  // Split into role-based blocks
  const blocks = splitByRoles(lines);

  // Extract user messages
  const userMessages = blocks
    .filter((b) => b.role === "user")
    .map((b) => b.text)
    .filter((t) => t.trim().length > 0);

  const totalFound = userMessages.length;

  // Handle cases
  let messages: string[];

  if (totalFound === 0) {
    // Fallback: no user messages recognized — use entire content as one prompt
    const fullText = normalized.replace(/^\s+|\s+$/g, "");
    messages = fullText ? [fullText] : [];
    return {
      source,
      messages: messages.map((text, i) => ({ position: i + 1, text })),
      totalFound: 0,
      capped: false,
      fallback: true,
      warning: "Formato de conversa não reconhecido",
    };
  }

  // Cap at 50
  const capped = totalFound > 50;
  messages = userMessages.slice(0, 50);

  const result: ParseResult = {
    source,
    messages: messages.map((text, i) => ({ position: i + 1, text })),
    totalFound,
    capped,
    fallback: false,
  };

  if (capped) {
    result.warning = `Limite de 50 prompts aplicado`;
  }

  return result;
}
