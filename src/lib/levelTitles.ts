export const LEVEL_TITLES: Record<number, string> = {
  1: "Curioso",
  2: "Iniciante",
  3: "Aprendiz",
  4: "Explorador",
  5: "Praticante",
  6: "Intermediário",
  7: "Especialista",
  8: "Engenheiro de Prompts",
  9: "Mestre",
  10: "Grande Mestre",
}

export function getLevelTitle(level: number): string {
  return LEVEL_TITLES[level] ?? `Nível ${level}`
}
