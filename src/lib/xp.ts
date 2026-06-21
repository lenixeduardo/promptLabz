export const GEMS_UPDATE_EVENT = "promptlabz:gems-updated";
export const XP_UPDATE_EVENT = "promptlabz:xp-updated";

const XP_PER_LEVEL = 500

export const getLevel = (xp: number) => Math.floor(xp / XP_PER_LEVEL) + 1

export const getLevelProgress = (xp: number) => ({
  currentXP: xp % XP_PER_LEVEL,
  targetXP: XP_PER_LEVEL,
  level: getLevel(xp),
})

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
