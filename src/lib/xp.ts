export const GEMS_UPDATE_EVENT = "promptlabz:gems-updated";
export const XP_UPDATE_EVENT = "promptlabz:xp-updated";

// Cumulative XP required to reach each level (index = level - 1).
// Early levels are intentionally easy; from level 6 onward each level costs 500 XP.
const LEVEL_THRESHOLDS = [0, 100, 300, 600, 1000, 1500] as const

function xpForLevel(level: number): number {
  if (level <= LEVEL_THRESHOLDS.length) return LEVEL_THRESHOLDS[level - 1]
  return LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1] + (level - LEVEL_THRESHOLDS.length) * 500
}

export const getLevel = (xp: number): number => {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      const base = i + 1
      if (i < LEVEL_THRESHOLDS.length - 1) return base
      const extra = xp - LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1]
      return LEVEL_THRESHOLDS.length + Math.floor(extra / 500)
    }
  }
  return 1
}

export const getLevelProgress = (xp: number) => {
  const level = getLevel(xp)
  const currentXP = xp - xpForLevel(level)
  const targetXP = xpForLevel(level + 1) - xpForLevel(level)
  return { currentXP, targetXP, level }
}

export const getLocalXP = (userId: string): number => {
  try {
    const raw = localStorage.getItem(`pl:xp:${userId}`)
    return raw ? parseInt(raw, 10) : 0
  } catch {
    return 0
  }
}

export const getLocalGems = (userId: string): number => {
  try {
    const raw = localStorage.getItem(`pl:gems:${userId}`)
    return raw ? parseInt(raw, 10) : 0
  } catch {
    return 0
  }
}

export const saveLocalXP = (userId: string, xp: number): void => {
  try {
    localStorage.setItem(`pl:xp:${userId}`, String(xp))
  } catch {
    // ignore write errors (storage quota, private mode)
  }
}

export const saveLocalGems = (userId: string, gems: number): void => {
  try {
    localStorage.setItem(`pl:gems:${userId}`, String(gems))
  } catch {
    // ignore write errors
  }
}
